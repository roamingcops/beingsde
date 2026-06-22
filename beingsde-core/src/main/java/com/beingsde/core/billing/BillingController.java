package com.beingsde.core.billing;

import com.beingsde.core.auth.User;
import com.beingsde.core.auth.UserRepository;
import com.beingsde.core.auth.UserRole;
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

    @Value("${app.razorpay.key-id}")
    private String keyId;

    @Value("${app.razorpay.key-secret}")
    private String keySecret;

    @Value("${app.razorpay.webhook-secret}")
    private String webhookSecret;

    public BillingController(UserRepository userRepo,
                             SubscriptionRepository subscriptionRepo,
                             PaymentRepository paymentRepo,
                             IdempotencyKeyRepository idempotencyRepo) {
        this.userRepo = userRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.paymentRepo = paymentRepo;
        this.idempotencyRepo = idempotencyRepo;
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

            if ("subscription.charged".equals(event) || "order.paid".equals(event) || "payment.captured".equals(event)) {
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

                    upgradeUserRole(payment.getUserId());
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
                                    .amountInPaise(entityObj.optLong("amount", 99900L))
                                    .currency(entityObj.optString("currency", "INR"))
                                    .status("CAPTURED")
                                    .paymentMethod(method)
                                    .createdAt(Instant.now())
                                    .build();
                            paymentRepo.save(payment);

                            upgradeUserRole(user.getId());
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
        String paymentId = request.get("paymentId");
        String signature = request.get("signature");

        if (orderId == null || paymentId == null || signature == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Missing required parameters: orderId, paymentId, or signature"));
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
                attributes.put("razorpay_order_id", orderId);
                attributes.put("razorpay_payment_id", paymentId);
                attributes.put("razorpay_signature", signature);
                isValid = Utils.verifyPaymentSignature(attributes, keySecret);
            }

            if (!isValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Invalid payment signature"));
            }

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

            upgradeUserRole(user.getId());

            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified and tier upgraded"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error verifying payment signature: " + e.getMessage()));
        }
    }

    private void upgradeUserRole(String userId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setRole(UserRole.PREMIUM_USER);
            userRepo.save(user);

            // Save Subscription record
            Subscription subscription = Subscription.builder()
                    .userId(user.getId())
                    .tier("PREMIUM")
                    .status("ACTIVE")
                    .startedAt(Instant.now())
                    .expiresAt(Instant.now().plus(30, ChronoUnit.DAYS))
                    .autoRenew(true)
                    .createdAt(Instant.now())
                    .build();
            subscriptionRepo.save(subscription);
        }
    }
}
