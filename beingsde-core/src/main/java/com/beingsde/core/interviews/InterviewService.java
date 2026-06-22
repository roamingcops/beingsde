package com.beingsde.core.interviews;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepo;

    public InterviewService(InterviewRepository interviewRepo) {
        this.interviewRepo = interviewRepo;
    }

    @Transactional
    public Interview matchRequest(String userId, String calendlyLink, List<String> preferredTopics,
                                   String experienceLevel, String notes) {
        Optional<Interview> existingActive = interviewRepo.findTopByUserIdAndStatus(userId, "LOOKING");
        if (existingActive.isPresent()) {
            Interview existing = existingActive.get();
            existing.setCalendlyLink(calendlyLink);
            existing.setPreferredTopics(preferredTopics);
            existing.setExperienceLevel(experienceLevel);
            existing.setNotes(notes);
            return interviewRepo.save(existing);
        }

        Interview newRequest = Interview.builder()
                .userId(userId)
                .status("LOOKING")
                .calendlyLink(calendlyLink)
                .preferredTopics(preferredTopics)
                .experienceLevel(experienceLevel)
                .notes(notes)
                .createdAt(Instant.now())
                .build();

        Interview saved = interviewRepo.save(newRequest);

        tryMatch(saved);

        return interviewRepo.findById(saved.getId()).orElse(saved);
    }

    private void tryMatch(Interview request) {
        Optional<Interview> matchCandidate = interviewRepo
                .findTopByStatusAndUserIdNotOrderByCreatedAtAsc("LOOKING", request.getUserId());

        if (matchCandidate.isPresent()) {
            Interview candidate = matchCandidate.get();

            candidate.setStatus("MATCHED");
            candidate.setMatchedUserId(request.getUserId());
            interviewRepo.save(candidate);

            request.setStatus("MATCHED");
            request.setMatchedUserId(candidate.getUserId());
            interviewRepo.save(request);
        }
    }

    public List<Interview> getUserInterviews(String userId) {
        return interviewRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Interview getInterview(String id, String userId) {
        Interview interview = interviewRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found with id: " + id));
        if (!interview.getUserId().equals(userId) &&
                (interview.getMatchedUserId() == null || !interview.getMatchedUserId().equals(userId))) {
            throw new RuntimeException("Access denied");
        }
        return interview;
    }

    @Transactional
    public Interview cancelMatch(String id, String userId) {
        Interview interview = getInterview(id, userId);
        if (!"MATCHED".equals(interview.getStatus()) && !"LOOKING".equals(interview.getStatus())) {
            throw new RuntimeException("Cannot cancel interview in status: " + interview.getStatus());
        }

        if (interview.getMatchedUserId() != null) {
            Optional<Interview> partnerInterview = interviewRepo
                    .findTopByUserIdAndStatus(interview.getMatchedUserId(), "MATCHED");
            partnerInterview.ifPresent(partner -> {
                partner.setStatus("LOOKING");
                partner.setMatchedUserId(null);
                interviewRepo.save(partner);
            });
        }

        interview.setStatus("CANCELLED");
        interview.setMatchedUserId(null);
        return interviewRepo.save(interview);
    }

    @Transactional
    public Interview handleCalendlyWebhook(String eventType, String userId, String matchedUserId,
                                            Instant scheduledTime, String meetingLink) {
        Optional<Interview> userInterview = interviewRepo.findTopByUserIdAndStatus(userId, "MATCHED");
        if (userInterview.isEmpty()) {
            throw new RuntimeException("No matched interview found for user: " + userId);
        }

        Interview interview = userInterview.get();
        interview.setStatus("SCHEDULED");
        interview.setScheduledAt(scheduledTime);
        if (meetingLink != null && !meetingLink.isBlank()) {
            interview.setMeetingLink(meetingLink);
        }
        return interviewRepo.save(interview);
    }
}
