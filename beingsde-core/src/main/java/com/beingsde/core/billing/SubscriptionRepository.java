package com.beingsde.core.billing;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface SubscriptionRepository extends MongoRepository<Subscription, String> {
    Optional<Subscription> findByUserId(String userId);
    Optional<Subscription> findByRazorpaySubscriptionId(String subId);
    List<Subscription> findAllByUserIdOrderByCreatedAtDesc(String userId);
}
