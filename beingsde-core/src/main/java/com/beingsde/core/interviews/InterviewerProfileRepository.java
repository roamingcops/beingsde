package com.beingsde.core.interviews;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewerProfileRepository extends MongoRepository<InterviewerProfile, String> {
    Optional<InterviewerProfile> findByUserId(String userId);
    List<InterviewerProfile> findByIsAvailableTrue();
    List<InterviewerProfile> findByIsAvailableTrueAndTopicsIn(List<String> topics);
    List<InterviewerProfile> findByIsAvailableTrueAndExperienceLevel(ExperienceLevel experienceLevel);
    List<InterviewerProfile> findByIsAvailableTrueAndTopicsInAndExperienceLevel(List<String> topics, ExperienceLevel experienceLevel);
}
