package com.beingsde.core.interviews;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends MongoRepository<Interview, String> {
    List<Interview> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Interview> findTopByUserIdAndStatus(String userId, String status);
    List<Interview> findByStatusAndUserIdNot(String status, String excludeUserId);
    Optional<Interview> findTopByStatusAndUserIdNotOrderByCreatedAtAsc(String status, String excludeUserId);
}
