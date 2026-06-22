package com.beingsde.core.interviews;

import com.beingsde.core.auth.User;
import com.beingsde.core.auth.UserRepository;
import com.beingsde.core.interviews.dto.ProfileRequest;
import com.beingsde.core.interviews.dto.ProfileResponse;
import com.beingsde.core.interviews.dto.InterviewResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

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

    private ProfileResponse mapProfileToResponse(InterviewerProfile profile) {
        List<Interview> conducted = interviewRepo.findByInterviewerIdAndStatus(profile.getUserId(), InterviewStatus.COMPLETED);
        int count = conducted.size();
        double avg = 0.0;
        if (count > 0) {
            double sum = 0;
            int ratedCount = 0;
            for (Interview i : conducted) {
                if (i.getFeedbackScore() != null) {
                    sum += i.getFeedbackScore();
                    ratedCount++;
                }
            }
            avg = ratedCount > 0 ? sum / ratedCount : 0.0;
        }
        // Round to 1 decimal place
        avg = Math.round(avg * 10.0) / 10.0;
        return ProfileResponse.fromProfile(profile, avg, count);
    }

    private InterviewResponse mapInterviewToResponse(Interview interview) {
        String interviewerName = "Unknown Interviewer";
        String interviewerEmail = "";
        String candidateName = "Unknown Candidate";
        String candidateEmail = "";

        if (interview.getInterviewerId() != null) {
            var opt = userRepo.findById(interview.getInterviewerId());
            if (opt.isPresent()) {
                interviewerName = opt.get().getName();
                interviewerEmail = opt.get().getEmail();
            }
        }

        if (interview.getCandidateId() != null) {
            var opt = userRepo.findById(interview.getCandidateId());
            if (opt.isPresent()) {
                candidateName = opt.get().getName();
                candidateEmail = opt.get().getEmail();
            }
        }

        return new InterviewResponse(
                interview.getId(),
                interview.getInterviewerId(),
                interviewerName,
                interviewerEmail,
                interview.getCandidateId(),
                candidateName,
                candidateEmail,
                interview.getTopic(),
                interview.getStatus(),
                interview.getScheduledAt(),
                interview.getMeetingLink(),
                interview.getFeedbackScore(),
                interview.getFeedbackNotes(),
                interview.getCreatedAt()
        );
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
        return mapProfileToResponse(saved);
    }

    public ProfileResponse getMyProfile(String email) {
        User user = resolveUser(email);
        InterviewerProfile profile = profileRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return mapProfileToResponse(profile);
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
                .map(this::mapProfileToResponse)
                .toList();
    }

    public List<InterviewResponse> getUserInterviews(String email) {
        User user = resolveUser(email);
        String userId = user.getId();
        List<Interview> interviews = interviewRepo.findByInterviewerIdOrCandidateIdOrderByCreatedAtDesc(userId, userId);
        return interviews.stream()
                .map(this::mapInterviewToResponse)
                .toList();
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
                .createdAt(Instant.now())
                .build();

        return interviewRepo.save(interview);
    }

    public Interview bookInterview(String email, String profileId, String topic, Instant scheduledAt, String meetingLink) {
        User candidate = resolveUser(email);
        InterviewerProfile profile = profileRepo.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Interviewer profile not found"));

        if (profile.getUserId().equals(candidate.getId())) {
            throw new RuntimeException("You cannot book a mock interview with yourself");
        }

        String meetLink = meetingLink != null && !meetingLink.isBlank() ? meetingLink : 
                "https://meet.google.com/mock-" + UUID.randomUUID().toString().substring(0, 8);

        Interview interview = Interview.builder()
                .interviewerId(profile.getUserId())
                .candidateId(candidate.getId())
                .topic(topic)
                .status(InterviewStatus.SCHEDULED)
                .scheduledAt(scheduledAt)
                .meetingLink(meetLink)
                .createdAt(Instant.now())
                .build();

        return interviewRepo.save(interview);
    }

    public Interview cancelInterview(String interviewId, String email) {
        User user = resolveUser(email);
        Interview interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found: " + interviewId));

        if (!interview.getInterviewerId().equals(user.getId()) && !interview.getCandidateId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to cancel this interview");
        }

        interview.setStatus(InterviewStatus.CANCELLED);
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
