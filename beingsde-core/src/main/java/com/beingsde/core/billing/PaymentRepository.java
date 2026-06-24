package com.beingsde.core.billing;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByRazorpayPaymentId(String paymentId);
    Optional<Payment> findByRazorpayOrderId(String orderId);
    List<Payment> findAllByUserIdOrderByCreatedAtDesc(String userId);
}
