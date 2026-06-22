package com.beingsde.core.interviews;

import com.beingsde.core.auth.User;
import com.beingsde.core.auth.UserRepository;
import com.beingsde.core.interviews.dto.ProfileRequest;
import com.beingsde.core.interviews.dto.ProfileResponse;
import com.beingsde.core.interviews.dto.InterviewResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class InterviewService {

    private static final Logger log = LoggerFactory.getLogger(InterviewService.class);

    private final InterviewerProfileRepository profileRepo;
    private final InterviewRepository interviewRepo;
    private final UserRepository userRepo;
    private final InterviewEmailService emailService;

    public InterviewService(InterviewerProfileRepository profileRepo,
                            InterviewRepository interviewRepo,
                            UserRepository userRepo,
                            InterviewEmailService emailService) {
        this.profileRepo = profileRepo;
        this.interviewRepo = interviewRepo;
        this.userRepo = userRepo;
        this.emailService = emailService;
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
        profile.setAvailabilitySlots(request.getAvailabilitySlots());
        profile.setAvailabilityText(request.getAvailabilityText());

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

    public List<ProfileResponse> getDirectory(String topic, String experienceLevel, String slot) {
        List<InterviewerProfile> profiles = profileRepo.findByIsAvailableTrue();

        return profiles.stream()
                .filter(p -> {
                    if (topic != null && !topic.isBlank()) {
                        return p.getTopics() != null && p.getTopics().stream()
                                .anyMatch(t -> t.equalsIgnoreCase(topic.trim()));
                    }
                    return true;
                })
                .filter(p -> {
                    if (experienceLevel != null && !experienceLevel.isBlank()) {
                        return p.getExperienceLevel() != null && p.getExperienceLevel().name().equalsIgnoreCase(experienceLevel.trim());
                    }
                    return true;
                })
                .filter(p -> {
                    if (slot != null && !slot.isBlank()) {
                        return p.getAvailabilitySlots() != null && p.getAvailabilitySlots().stream()
                                .anyMatch(s -> s.equalsIgnoreCase(slot.trim()));
                    }
                    return true;
                })
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
        User candidate = userRepo.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + candidateId));

        String meetLink = meetingLink != null && !meetingLink.isBlank() ? meetingLink : 
                "https://meet.jit.si/beingsde-mock-interview-" + UUID.randomUUID().toString().substring(0, 8);

        Interview interview = Interview.builder()
                .interviewerId(interviewer.getId())
                .candidateId(candidateId)
                .topic(topic)
                .status(InterviewStatus.SCHEDULED)
                .scheduledAt(scheduledTime)
                .meetingLink(meetLink)
                .createdAt(Instant.now())
                .build();

        Interview saved = interviewRepo.save(interview);

        try {
            emailService.sendBookingEmailToCandidate(candidate.getEmail(), candidate.getName(), interviewer.getName(), topic, scheduledTime, meetLink);
            emailService.sendBookingEmailToInterviewer(interviewer.getEmail(), interviewer.getName(), candidate.getName(), topic, scheduledTime, meetLink);
        } catch (Exception e) {
            log.error("Failed to send webhook email notifications: {}", e.getMessage());
        }

        return saved;
    }

    public Interview bookInterview(String email, String profileId, String topic, Instant scheduledAt, String meetingLink) {
        User candidate = resolveUser(email);
        InterviewerProfile profile = profileRepo.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Interviewer profile not found"));

        if (profile.getUserId().equals(candidate.getId())) {
            throw new RuntimeException("You cannot book a mock interview with yourself");
        }

        String meetLink = meetingLink != null && !meetingLink.isBlank() ? meetingLink : 
                "https://meet.jit.si/beingsde-mock-interview-" + UUID.randomUUID().toString().substring(0, 8);

        Interview interview = Interview.builder()
                .interviewerId(profile.getUserId())
                .candidateId(candidate.getId())
                .topic(topic)
                .status(InterviewStatus.SCHEDULED)
                .scheduledAt(scheduledAt)
                .meetingLink(meetLink)
                .createdAt(Instant.now())
                .build();

        Interview saved = interviewRepo.save(interview);

        User interviewer = userRepo.findById(profile.getUserId())
                .orElseThrow(() -> new RuntimeException("Interviewer user not found"));

        try {
            emailService.sendBookingEmailToCandidate(candidate.getEmail(), candidate.getName(), interviewer.getName(), topic, scheduledAt, meetLink);
            emailService.sendBookingEmailToInterviewer(interviewer.getEmail(), interviewer.getName(), candidate.getName(), topic, scheduledAt, meetLink);
        } catch (Exception e) {
            log.error("Failed to send booking email notifications: {}", e.getMessage());
        }

        return saved;
    }

    public Interview cancelInterview(String interviewId, String email) {
        User user = resolveUser(email);
        Interview interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found: " + interviewId));

        if (!interview.getInterviewerId().equals(user.getId()) && !interview.getCandidateId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to cancel this interview");
        }

        interview.setStatus(InterviewStatus.CANCELLED);
        Interview saved = interviewRepo.save(interview);

        try {
            User interviewer = userRepo.findById(interview.getInterviewerId()).orElse(null);
            User candidate = userRepo.findById(interview.getCandidateId()).orElse(null);
            if (interviewer != null && candidate != null) {
                if (user.getId().equals(candidate.getId())) {
                    emailService.sendCancellationEmail(interviewer.getEmail(), candidate.getName(), interview.getTopic(), interview.getScheduledAt(), "Candidate");
                } else {
                    emailService.sendCancellationEmail(candidate.getEmail(), interviewer.getName(), interview.getTopic(), interview.getScheduledAt(), "Interviewer");
                }
            }
        } catch (Exception e) {
            log.error("Failed to send cancellation email notifications: {}", e.getMessage());
        }

        return saved;
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
        Interview saved = interviewRepo.save(interview);

        try {
            User candidate = userRepo.findById(interview.getCandidateId()).orElse(null);
            if (candidate != null) {
                emailService.sendFeedbackEmail(candidate.getEmail(), candidate.getName(), user.getName(), interview.getTopic(), score, notes);
            }
        } catch (Exception e) {
            log.error("Failed to send feedback email notification: {}", e.getMessage());
        }

        return saved;
    }

    public void testCleanup() {
        profileRepo.deleteAll();
        interviewRepo.deleteAll();
        // Reset test user role to FREE_USER for checkout tests
        userRepo.findByEmail("testuser@beingsde.com").ifPresent(user -> {
            user.setRole(com.beingsde.core.auth.UserRole.FREE_USER);
            userRepo.save(user);
        });
    }
}
