package com.beingsde.core.billing;

import com.beingsde.core.auth.User;
import com.beingsde.core.auth.UserRepository;
import com.beingsde.core.auth.UserRole;
import com.beingsde.core.auth.JwtTokenProvider;
import com.beingsde.core.auth.SessionStore;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class BillingController {

    private final UserRepository userRepo;
    private final SubscriptionRepository subscriptionRepo;
    private final PaymentRepository paymentRepo;
    private final IdempotencyKeyRepository idempotencyRepo;
    private final JwtTokenProvider tokenProvider;
    private final SessionStore sessionStore;

    @Value("${app.razorpay.key-id}")
    private String keyId;

    @Value("${app.razorpay.key-secret}")
    private String keySecret;

    @Value("${app.razorpay.webhook-secret}")
    private String webhookSecret;

    public BillingController(UserRepository userRepo,
                             SubscriptionRepository subscriptionRepo,
                             PaymentRepository paymentRepo,
                             IdempotencyKeyRepository idempotencyRepo,
                             JwtTokenProvider tokenProvider,
                             SessionStore sessionStore) {
        this.userRepo = userRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.paymentRepo = paymentRepo;
        this.idempotencyRepo = idempotencyRepo;
        this.tokenProvider = tokenProvider;
        this.sessionStore = sessionStore;
    }

    @PostMapping("/razorpay/order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        String planId = (String) request.getOrDefault("planId", "PREMIUM_1M");
        long amountInPaise = "PREMIUM_1M".equals(planId) ? 99900L : 999900L; // 999 INR vs 9999 INR

        String currentUserEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepo.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user context not found"));

        try {
            String razorpayOrderId;

            if ("rzp_test_placeholder".equals(keyId)) {
                // Simulation Mode for local dev without credentials
                razorpayOrderId = "order_sim_" + UUID.randomUUID().toString().substring(0, 12);
            } else {
                // Real Razorpay API Client invocation
                RazorpayClient client = new RazorpayClient(keyId, keySecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amountInPaise);
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", "rcpt_" + UUID.randomUUID().toString().substring(0, 8));
                
                Order order = client.Orders.create(orderRequest);
                razorpayOrderId = order.get("id");
            }

            // Deduplicate: remove any existing subscriptions for this user
            subscriptionRepo.findAll().stream()
                    .filter(s -> user.getId().equals(s.getUserId()))
                    .forEach(subscriptionRepo::delete);

            Payment payment = Payment.builder()
                    .userId(user.getId())
                    .razorpayOrderId(razorpayOrderId)
                    .amountInPaise(amountInPaise)
                    .currency("INR")
                    .status("PENDING")
                    .createdAt(Instant.now())
                    .build();

            paymentRepo.save(payment);

            return ResponseEntity.ok(Map.of(
                    "orderId", razorpayOrderId,
                    "amount", amountInPaise,
                    "currency", "INR",
                    "keyId", keyId
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create payment order: " + e.getMessage()));
        }
    }

    @PostMapping("/razorpay/subscription")
    public ResponseEntity<?> createSubscription(@RequestBody Map<String, Object> request) {
        String planId = (String) request.getOrDefault("planId", "PREMIUM_1M");
        String currentUserEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepo.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user context not found"));

        try {
            String razorpaySubscriptionId;

            if ("rzp_test_placeholder".equals(keyId)) {
                razorpaySubscriptionId = "sub_sim_" + UUID.randomUUID().toString().substring(0, 12);
            } else {
                RazorpayClient client = new RazorpayClient(keyId, keySecret);
                JSONObject subRequest = new JSONObject();
                subRequest.put("plan_id", "PREMIUM_1M".equals(planId) ? "plan_prm_999" : "plan_prm_9999");
                subRequest.put("total_count", 12); // charge 12 times (yearly)
                subRequest.put("quantity", 1);
                
                com.razorpay.Subscription subscription = client.Subscriptions.create(subRequest);
                razorpaySubscriptionId = subscription.get("id");
            }

            // Deduplicate: remove any existing subscriptions for this user
            subscriptionRepo.findAll().stream()
                    .filter(s -> user.getId().equals(s.getUserId()))
                    .forEach(subscriptionRepo::delete);

            // Create a pending subscription in MongoDB
            Subscription subscription = Subscription.builder()
                    .userId(user.getId())
                    .tier("PREMIUM")
                    .status("PENDING")
                    .razorpaySubscriptionId(razorpaySubscriptionId)
                    .startedAt(Instant.now())
                    .expiresAt(Instant.now().plus(30, ChronoUnit.DAYS))
                    .autoRenew(true)
                    .createdAt(Instant.now())
                    .build();
            subscriptionRepo.save(subscription);

            return ResponseEntity.ok(Map.of(
                    "subscriptionId", razorpaySubscriptionId,
                    "amount", 99900L,
                    "currency", "INR",
                    "keyId", keyId
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create subscription: " + e.getMessage()));
        }
    }

    @GetMapping("/subscription")
    public ResponseEntity<?> getActiveSubscription() {
        String currentUserEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepo.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user context not found"));

        Optional<Subscription> subOpt = subscriptionRepo.findByUserId(user.getId());
        if (subOpt.isPresent()) {
            Subscription sub = subOpt.get();
            return ResponseEntity.ok(Map.of(
                    "status", sub.getStatus(),
                    "tier", sub.getTier(),
                    "autoRenew", sub.isAutoRenew(),
                    "expiresAt", sub.getExpiresAt() != null ? sub.getExpiresAt().toString() : ""
            ));
        } else {
            return ResponseEntity.ok(Map.of("status", "NONE", "tier", "FREE", "autoRenew", false, "expiresAt", ""));
        }
    }

    @PostMapping("/subscription/cancel")
    @Transactional
    public ResponseEntity<?> cancelSubscription() {
        String currentUserEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepo.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user context not found"));

        Subscription sub = subscriptionRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Active subscription not found for user"));

        if (!"ACTIVE".equals(sub.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Subscription is not active."));
        }

        String razorpayId = sub.getRazorpaySubscriptionId();
        if (razorpayId != null && !razorpayId.isEmpty() && !razorpayId.startsWith("sub_sim_") && !"rzp_test_placeholder".equals(keyId)) {
            try {
                RazorpayClient client = new RazorpayClient(keyId, keySecret);
                client.Subscriptions.cancel(razorpayId);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Razorpay subscription cancellation failed: " + e.getMessage()));
            }
        }

        sub.setAutoRenew(false);
        sub.setStatus("CANCELLED");
        subscriptionRepo.save(sub);

        return ResponseEntity.ok(Map.of("message", "Subscription auto-renewal has been cancelled. Premium access remains active until the end of your billing cycle."));
    }

    @PostMapping("/razorpay/webhook")
    @Transactional
    public ResponseEntity<?> handleWebhook(@RequestBody String rawPayload,
                                           @RequestHeader("x-razorpay-signature") String signature) {
        try {
            // Verify Webhook Signature (bypass if keys are placeholder for local integration tests)
            if (!"rzp_test_placeholder".equals(keyId)) {
                boolean isValid = Utils.verifyWebhookSignature(rawPayload, signature, webhookSecret);
                if (!isValid) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("message", "Signature verification failed"));
                }
            }

            JSONObject jsonPayload = new JSONObject(rawPayload);
            String event = jsonPayload.optString("event");
            String eventId = jsonPayload.optString("id");

            // Idempotency check: process each webhook event exactly once
            Optional<IdempotencyKey> existingEvent = idempotencyRepo.findByEventId(eventId);
            if (existingEvent.isPresent()) {
                return ResponseEntity.ok(Map.of("message", "Event already processed (Duplicate webhook)"));
            }

            idempotencyRepo.save(IdempotencyKey.builder()
                    .eventId(eventId)
                    .processedAt(Instant.now())
                    .status("PROCESSED")
                    .build());

            if ("subscription.cancelled".equals(event)) {
                JSONObject entityObj = jsonPayload.getJSONObject("payload")
                        .getJSONObject("subscription")
                        .getJSONObject("entity");
                String subId = entityObj.optString("id");
                Optional<Subscription> subOpt = subscriptionRepo.findByRazorpaySubscriptionId(subId);
                if (subOpt.isPresent()) {
                    Subscription sub = subOpt.get();
                    sub.setStatus("CANCELLED");
                    sub.setAutoRenew(false);
                    subscriptionRepo.save(sub);
                }
            } else if ("subscription.charged".equals(event) || "order.paid".equals(event) || "payment.captured".equals(event)) {
                JSONObject entityObj = jsonPayload.getJSONObject("payload")
                        .getJSONObject("payment")
                        .getJSONObject("entity");

                String orderId = entityObj.optString("order_id");
                String paymentId = entityObj.optString("id");
                String method = entityObj.optString("method");

                Optional<Payment> paymentOpt = Optional.empty();
                if (orderId != null && !orderId.isEmpty()) {
                    paymentOpt = paymentRepo.findByRazorpayOrderId(orderId);
                }

                if (paymentOpt.isPresent()) {
                    Payment payment = paymentOpt.get();
                    payment.setRazorpayPaymentId(paymentId);
                    payment.setRazorpaySignature(signature);
                    payment.setPaymentMethod(method);
                    payment.setStatus("CAPTURED");
                    paymentRepo.save(payment);

                    upgradeUserRole(payment.getUserId(), null);
                } else {
                    // Fallback: Hosted Payment Pages (no pre-created Order ID)
                    String customerEmail = entityObj.optString("email");
                    if (customerEmail != null && !customerEmail.isEmpty()) {
                        Optional<User> userOpt = userRepo.findByEmail(customerEmail);
                        if (userOpt.isPresent()) {
                            User user = userOpt.get();
                            Payment payment = Payment.builder()
                                    .userId(user.getId())
                                    .razorpayOrderId(orderId != null ? orderId : "")
                                    .razorpayPaymentId(paymentId)
                                    .razorpaySignature(signature)
                                    .amountInPaise(99900L)
                                    .currency(entityObj.optString("currency", "INR"))
                                    .status("CAPTURED")
                                    .paymentMethod(method)
                                    .createdAt(Instant.now())
                                    .build();
                            paymentRepo.save(payment);

                            upgradeUserRole(user.getId(), null);
                        }
                    }
                }
            }

            return ResponseEntity.ok(Map.of("status", "success"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error processing webhook: " + e.getMessage()));
        }
    }

    @PostMapping("/razorpay/verify")
    @Transactional
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        String orderId = request.get("orderId");
        String subscriptionId = request.get("subscriptionId");
        String paymentId = request.get("paymentId");
        String signature = request.get("signature");

        if ((orderId == null && subscriptionId == null) || paymentId == null || signature == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Missing required parameters: orderId/subscriptionId, paymentId, or signature"));
        }

        String currentUserEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepo.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user context not found"));

        try {
            boolean isValid = false;

            if ("rzp_test_placeholder".equals(keyId)) {
                // Simulation Mode
                isValid = true;
            } else {
                // Real Razorpay Signature Verification
                JSONObject attributes = new JSONObject();
                if (orderId != null) {
                    attributes.put("razorpay_order_id", orderId);
                }
                if (subscriptionId != null) {
                    attributes.put("razorpay_subscription_id", subscriptionId);
                }
                attributes.put("razorpay_payment_id", paymentId);
                attributes.put("razorpay_signature", signature);
                isValid = Utils.verifyPaymentSignature(attributes, keySecret);
            }

            if (!isValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Invalid payment signature"));
            }

            if (orderId != null) {
                // Find payment record, or create if missing (e.g. simulated payment)
                Payment payment = paymentRepo.findByRazorpayOrderId(orderId)
                        .orElseGet(() -> Payment.builder()
                                .userId(user.getId())
                                .razorpayOrderId(orderId)
                                .amountInPaise(99900L)
                                .currency("INR")
                                .createdAt(Instant.now())
                                .build());

                payment.setRazorpayPaymentId(paymentId);
                payment.setRazorpaySignature(signature);
                payment.setStatus("CAPTURED");
                paymentRepo.save(payment);

                upgradeUserRole(user.getId(), null);
            } else {
                // Find subscription record, or create if missing
                Subscription sub = subscriptionRepo.findByRazorpaySubscriptionId(subscriptionId)
                        .orElseGet(() -> Subscription.builder()
                                .userId(user.getId())
                                .razorpaySubscriptionId(subscriptionId)
                                .tier("PREMIUM")
                                .status("PENDING")
                                .startedAt(Instant.now())
                                .expiresAt(Instant.now().plus(30, ChronoUnit.DAYS))
                                .autoRenew(true)
                                .createdAt(Instant.now())
                                .build());

                sub.setStatus("ACTIVE");
                sub.setAutoRenew(true);
                subscriptionRepo.save(sub);

                // Create a payment record as well
                Payment payment = Payment.builder()
                        .userId(user.getId())
                        .razorpayOrderId("")
                        .razorpayPaymentId(paymentId)
                        .razorpaySignature(signature)
                        .amountInPaise(99900L)
                        .currency("INR")
                        .status("CAPTURED")
                        .createdAt(Instant.now())
                        .build();
                paymentRepo.save(payment);

                upgradeUserRole(user.getId(), subscriptionId);
            }

            // Regenerate session fingerprint and return a fresh token to sync frontend immediately
            String newSessionId = UUID.randomUUID().toString();
            sessionStore.save(user.getEmail(), newSessionId);
            String newAccessToken = tokenProvider.generateAccessToken(user.getEmail(), UserRole.PREMIUM_USER.name(), newSessionId);

            return ResponseEntity.ok(Map.of(
                    "status", "success", 
                    "message", "Payment verified and subscription activated",
                    "accessToken", newAccessToken,
                    "role", UserRole.PREMIUM_USER.name()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error verifying payment signature: " + e.getMessage()));
        }
    }

    private void upgradeUserRole(String userId, String subId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setRole(UserRole.PREMIUM_USER);
            userRepo.save(user);

            // Deduplicate: remove any existing subscriptions for this user
            subscriptionRepo.findAll().stream()
                    .filter(s -> userId.equals(s.getUserId()))
                    .forEach(subscriptionRepo::delete);

            // Save Subscription record
            Subscription subscription = Subscription.builder()
                    .userId(userId)
                    .tier("PREMIUM")
                    .status("ACTIVE")
                    .startedAt(Instant.now())
                    .expiresAt(Instant.now().plus(30, ChronoUnit.DAYS))
                    .autoRenew(true)
                    .createdAt(Instant.now())
                    .build();

            if (subId != null) {
                subscription.setRazorpaySubscriptionId(subId);
            } else {
                subscription.setRazorpaySubscriptionId("sub_sim_" + UUID.randomUUID().toString().substring(0, 12));
            }
            subscriptionRepo.save(subscription);
        }
    }
}
