package com.beingsde.core.billing;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface IdempotencyKeyRepository extends MongoRepository<IdempotencyKey, String> {
    Optional<IdempotencyKey> findByEventId(String eventId);
}
