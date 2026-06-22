# Security Design & Payment Integration Flow - beingsde

This document covers the **Security Architecture** (JWTs, RBAC, Rate Limiting, OWASP compliance) and the **Razorpay Payment Integration Engine** for subscription lifecycle management.

---

## 1. Security Architecture

### JWT Lifecycle & Secret Management
* **Signing Algorithm**: `RS256` (Asymmetric Private/Public key pair). The backend signs the JWT using the private key, and microservices/gateways can verify the token using the public key fetched from the JWKS endpoint (`/.well-known/jwks.json`).
* **Storage Strategy**:
  * **Web (Next.js)**: Access token stored in memory. Refresh token stored in a secure, `HttpOnly`, `SameSite=Strict`, `Secure` (HTTPS only) cookie to protect against Cross-Site Scripting (XSS) and limit Cross-Site Request Forgery (CSRF).
* **Token Expiration**:
  * Access Token: `15 Minutes`
  * Refresh Token: `7 Days` (stored in MongoDB with sliding window updates).

### Role-Based Access Control (RBAC) mapping in Spring Security

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Stateless APIs with HttpOnly cookie tokens
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/.well-known/jwks.json").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/interviews/feedback").hasAnyRole("INTERVIEWER", "ADMIN")
                .requestMatchers("/api/v1/interviews/book").hasAnyRole("PREMIUM_USER", "ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### Distributed Rate Limiting (Redis Window Limit)
We prevent API abuse and brute-force attempts using a sliding-window rate limiter powered by Redis.

* **Rate Limit Tiers**:
  * `GUESTS` (IP-based): 60 requests / minute for Auth & General info.
  * `FREE_USERS` (User ID-based): 200 requests / minute for learning endpoints.
  * `PREMIUM_USERS` (User ID-based): 1000 requests / minute.

* **Redis Script Implementation**:
  Uses a Redis Sorted Set (`ZSET`) where keys are user IDs and scores/members are timestamps.
  1. Remove members with timestamps older than `now - 60s`.
  2. Get cardinality of the ZSET.
  3. If card < limit, add the current timestamp and return `Allow`. Else return `Deny`.

---

## 2. Payment Flow (Razorpay Integration)

### Subscription Lifecycle Flow

The interaction sequence for upgrading a user from `FREE` to `PREMIUM` using the Razorpay API and webhook synchronization is shown below:

```mermaid
sequenceDiagram
    autonumber
    actor User as Student UI (Next.js)
    participant Core as Spring Boot API
    participant RP as Razorpay Server
    database DB as MongoDB
    database Redis as Redis Cache

    User->>Core: POST /api/v1/payments/razorpay/order {planId: "PREMIUM_1M"}
    Note over Core: Verify plan and generate unique idempotency key
    Core->>RP: Create Subscription Request
    RP-->>Core: Return Subscription ID (sub_123) & Order ID
    Core->>DB: Persist Payment Log (Status: PENDING)
    Core-->>User: Return Order details & Razorpay Configuration
    
    User->>User: Launch Razorpay Checkout Overlay
    User->>RP: Submit card/UPI payment
    RP->>User: Payment Authorized
    
    Note over User, RP: Razorpay processes payment asynchronously
    
    RP->>Core: Webhook Event: subscription.charged {sub_123, eventId: evt_999}
    
    alt Signature Verification Failed
        Core-->>RP: Return 400 Bad Request
    else Signature Valid & Event Processed (Idempotency Check)
        Core->>DB: Check if eventId 'evt_999' exists in idempotency_keys
        DB-->>Core: Event already processed!
        Core-->>RP: Return 200 OK (Skip reprocessing)
    else Signature Valid & First Time Event
        Core->>DB: Insert eventId 'evt_999' into idempotency_keys
        Core->>DB: Update 'subscriptions' set status=ACTIVE, tier=PREMIUM
        Core->>DB: Update 'payments' set status=CAPTURED for sub_123
        Core->>Redis: Evict cached feature flags for userId
        Core-->>RP: Return 200 OK
        Core->>User: Redirect to dashboard (Toast: Payment Success)
    end
```

---

## 3. Webhook Signature Verification & Idempotency

### Webhook Verification in Java
Razorpay sends a hash signature in the header (`x-razorpay-signature`) which we verify using our API webhook secret and the raw request body.

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Hex;

public class RazorpayWebhookVerifier {

    public static boolean verifySignature(String payload, String signature, String secret) {
        try {
            Mac sha256HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            sha256HMAC.init(secretKey);
            
            byte[] rawHmac = sha256HMAC.doFinal(payload.getBytes());
            String expectedSignature = Hex.encodeHexString(rawHmac);
            
            return expectedSignature.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }
}
```

### Idempotency Schema
To prevent duplicate processing of Razorpay webhooks (e.g., if Razorpay retries due to network failure), we log the incoming event ID to MongoDB using a unique index.

```json
{
  "_id": {"$oid": "60c72b2f9b1d8a234a9e1e80"},
  "eventId": "evt_999",
  "processedAt": {"$date": "2026-06-22T17:05:00Z"},
  "status": "SUCCESS"
}
```
* **Index**: `{ "eventId": 1 }` (Unique)
* **Logic**: Wrap the processing logic in a Spring `@Transactional` block. If the insert into `idempotency_keys` fails due to a duplicate key error, catch the exception, return `200 OK` to Razorpay, and abort the transaction.
