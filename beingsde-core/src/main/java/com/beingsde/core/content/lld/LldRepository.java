package com.beingsde.core.content.lld;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface LldRepository extends MongoRepository<LldItem, String> {
    Optional<LldItem> findBySlug(String slug);
}
