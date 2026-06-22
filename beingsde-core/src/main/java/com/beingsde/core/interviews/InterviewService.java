package com.beingsde.core.interviews;

import com.beingsde.core.auth.User;
import com.beingsde.core.auth.UserRepository;
import com.beingsde.core.interviews.dto.ProfileRequest;
import com.beingsde.core.interviews.dto.ProfileResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class InterviewService {

    private final InterviewerProfileRepository profileRepo;
    private final InterviewRepository interviewRepo;
    private final UserRepository userRepo;

    public InterviewService(InterviewerProfileRepository profileRepo,
                            InterviewRepository interviewRepo,
                            UserRepository userRepo) {
        this.profileRepo = profileRepo;
        this.interviewRepo = interviewRepo;
        this.userRepo = userRepo;
    }

    private User resolveUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    public ProfileResponse upsertProfile(String email, ProfileRequest request) {
        User user = resolveUser(email);
        String userId = user.getId();

        InterviewerProfile profile = profileRepo.findByUserId(userId).orElseGet(() ->
                InterviewerProfile.builder()
                        .userId(userId)
                        .build()
        );

        profile.setName(request.getName() != null ? request.getName() : user.getName());
        profile.setTopics(request.getTopics());
        profile.setExperienceLevel(request.getExperienceLevel());
        profile.setBio(request.getBio());
        profile.setCalendlyLink(request.getCalendlyLink());
        profile.setAvailable(request.isAvailable());

        InterviewerProfile saved = profileRepo.save(profile);
        return ProfileResponse.fromProfile(saved);
    }

    public ProfileResponse getMyProfile(String email) {
        User user = resolveUser(email);
        InterviewerProfile profile = profileRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return ProfileResponse.fromProfile(profile);
    }

    public void disableProfile(String email) {
        User user = resolveUser(email);
        InterviewerProfile profile = profileRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setAvailable(false);
        profileRepo.save(profile);
    }

    public List<ProfileResponse> getDirectory(String topic, String experienceLevel) {
        List<InterviewerProfile> profiles;

        boolean hasTopic = topic != null && !topic.isBlank();
        boolean hasLevel = experienceLevel != null && !experienceLevel.isBlank();

        if (hasTopic && hasLevel) {
            ExperienceLevel level = ExperienceLevel.valueOf(experienceLevel.toUpperCase());
            profiles = profileRepo.findByIsAvailableTrueAndTopicsInAndExperienceLevel(
                    List.of(topic), level);
        } else if (hasTopic) {
            profiles = profileRepo.findByIsAvailableTrueAndTopicsIn(List.of(topic));
        } else if (hasLevel) {
            ExperienceLevel level = ExperienceLevel.valueOf(experienceLevel.toUpperCase());
            profiles = profileRepo.findByIsAvailableTrueAndExperienceLevel(level);
        } else {
            profiles = profileRepo.findByIsAvailableTrue();
        }

        return profiles.stream()
                .map(ProfileResponse::fromProfile)
                .toList();
    }

    public List<Interview> getUserInterviews(String email) {
        User user = resolveUser(email);
        String userId = user.getId();
        return interviewRepo.findByInterviewerIdOrCandidateIdOrderByCreatedAtDesc(userId, userId);
    }

    public Interview handleCalendlyWebhook(String interviewerEmail, String candidateId,
                                           String topic, Instant scheduledTime, String meetingLink) {
        User interviewer = resolveUser(interviewerEmail);

        Interview interview = Interview.builder()
                .interviewerId(interviewer.getId())
                .candidateId(candidateId)
                .topic(topic)
                .status(InterviewStatus.SCHEDULED)
                .scheduledAt(scheduledTime)
                .meetingLink(meetingLink)
                .build();

        return interviewRepo.save(interview);
    }

    public Interview submitFeedback(String interviewId, String email, Integer score, String notes) {
        User user = resolveUser(email);
        Interview interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found: " + interviewId));

        if (!interview.getInterviewerId().equals(user.getId())) {
            throw new RuntimeException("Only the interviewer can submit feedback");
        }

        interview.setFeedbackScore(score);
        interview.setFeedbackNotes(notes);
        interview.setStatus(InterviewStatus.COMPLETED);
        return interviewRepo.save(interview);
    }
}
