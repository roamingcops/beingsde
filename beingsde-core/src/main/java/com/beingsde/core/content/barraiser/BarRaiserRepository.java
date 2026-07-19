package com.beingsde.core.content.barraiser;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BarRaiserRepository extends MongoRepository<BarRaiserQuestion, String> {
}
