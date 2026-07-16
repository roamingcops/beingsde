package com.beingsde.core.interviews;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface InterviewRepository extends MongoRepository<Interview, String> {
    List<Interview> findByInterviewerIdOrCandidateIdOrderByCreatedAtDesc(String interviewerId, String candidateId);
    List<Interview> findByInterviewerIdAndStatus(String interviewerId, InterviewStatus status);
    List<Interview> findByInterviewerIdOrderByCreatedAtDesc(String interviewerId);
}
