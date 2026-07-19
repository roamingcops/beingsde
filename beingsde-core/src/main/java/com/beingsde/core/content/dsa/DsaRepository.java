package com.beingsde.core.content.dsa;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface DsaRepository extends MongoRepository<DsaQuestion, String> {
}
