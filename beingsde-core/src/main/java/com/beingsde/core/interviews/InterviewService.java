package com.beingsde.core.interviews;

import com.beingsde.core.auth.User;
import com.beingsde.core.auth.UserRepository;
import com.beingsde.core.interviews.dto.ProfileRequest;
import com.beingsde.core.interviews.dto.ProfileResponse;
import com.beingsde.core.interviews.dto.InterviewResponse;
import com.beingsde.core.interviews.events.InterviewBookedEvent;
import com.beingsde.core.interviews.events.InterviewCancelledEvent;
import com.beingsde.core.interviews.events.InterviewFeedbackEvent;
import com.beingsde.core.billing.SubscriptionRepository;
import com.beingsde.core.billing.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class InterviewService {

    private static final Logger log = LoggerFactory.getLogger(InterviewService.class);

    private final InterviewerProfileRepository profileRepo;
    private final InterviewRepository interviewRepo;
    private final UserRepository userRepo;
    private final SubscriptionRepository subscriptionRepo;
    private final PaymentRepository paymentRepo;
    private final ApplicationEventPublisher eventPublisher;
 
    public InterviewService(InterviewerProfileRepository profileRepo,
                            InterviewRepository interviewRepo,
                            UserRepository userRepo,
                            SubscriptionRepository subscriptionRepo,
                            PaymentRepository paymentRepo,
                            ApplicationEventPublisher eventPublisher) {
        this.profileRepo = profileRepo;
        this.interviewRepo = interviewRepo;
        this.userRepo = userRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.paymentRepo = paymentRepo;
        this.eventPublisher = eventPublisher;
    }

    private User resolveUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    private ProfileResponse mapProfileToResponse(InterviewerProfile profile) {
        return ProfileResponse.fromProfile(profile, profile.getAverageRatingOverall(), profile.getTotalReviews());
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
                interview.getCandidateReviewDidHappen(),
                interview.getCandidateReviewDsa(),
                interview.getCandidateReviewSystemDesign(),
                interview.getCandidateReviewCommunication(),
                interview.getCandidateReviewNotes(),
                interview.getCreatedAt()
        );
    }

    @Transactional
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

    @Transactional
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

    @Transactional
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

        eventPublisher.publishEvent(new InterviewBookedEvent(
                this, candidate.getEmail(), candidate.getName(),
                interviewer.getEmail(), interviewer.getName(),
                topic, scheduledTime, meetLink
        ));

        return saved;
    }

    @Transactional
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

        eventPublisher.publishEvent(new InterviewBookedEvent(
                this, candidate.getEmail(), candidate.getName(),
                interviewer.getEmail(), interviewer.getName(),
                topic, scheduledAt, meetLink
        ));

        return saved;
    }

    @Transactional
    public Interview cancelInterview(String interviewId, String email) {
        User user = resolveUser(email);
        Interview interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found: " + interviewId));

        if (!interview.getInterviewerId().equals(user.getId()) && !interview.getCandidateId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to cancel this interview");
        }

        if (interview.getStatus() != InterviewStatus.SCHEDULED) {
            throw new IllegalStateException("Only scheduled interviews can be cancelled");
        }

        interview.setStatus(InterviewStatus.CANCELLED);
        Interview saved = interviewRepo.save(interview);

        User interviewer = userRepo.findById(interview.getInterviewerId()).orElse(null);
        User candidate = userRepo.findById(interview.getCandidateId()).orElse(null);

        if (interviewer != null && candidate != null) {
            if (user.getId().equals(candidate.getId())) {
                eventPublisher.publishEvent(new InterviewCancelledEvent(
                        this, interviewer.getEmail(), candidate.getName(),
                        interview.getTopic(), interview.getScheduledAt(), "Candidate"
                ));
            } else {
                eventPublisher.publishEvent(new InterviewCancelledEvent(
                        this, candidate.getEmail(), interviewer.getName(),
                        interview.getTopic(), interview.getScheduledAt(), "Interviewer"
                ));
            }
        }

        return saved;
    }

    @Transactional
    public Interview submitFeedback(String interviewId, String email, Integer score, String notes) {
        User user = resolveUser(email);
        Interview interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found: " + interviewId));

        if (!interview.getInterviewerId().equals(user.getId())) {
            throw new RuntimeException("Only the interviewer can submit feedback");
        }

        if (interview.getStatus() == InterviewStatus.CANCELLED) {
            throw new IllegalStateException("Cannot submit feedback for a cancelled interview");
        }

        interview.setFeedbackScore(score);
        interview.setFeedbackNotes(notes);
        interview.setStatus(InterviewStatus.COMPLETED);
        Interview saved = interviewRepo.save(interview);

        User candidate = userRepo.findById(interview.getCandidateId()).orElse(null);
        if (candidate != null) {
            eventPublisher.publishEvent(new InterviewFeedbackEvent(
                    this, candidate.getEmail(), candidate.getName(),
                    user.getName(), interview.getTopic(), score, notes
            ));
        }

        return saved;
    }

    @Transactional
    public Interview submitCandidateReview(String interviewId, String email, Boolean didHappen,
                                           Integer dsa, Integer systemDesign, Integer communication, String notes) {
        User user = resolveUser(email);
        Interview interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found: " + interviewId));

        if (!interview.getCandidateId().equals(user.getId())) {
            throw new RuntimeException("Only the candidate can submit a review for the interviewer");
        }

        if (interview.getCandidateReviewDidHappen() != null) {
            throw new RuntimeException("You have already submitted a review for this interview");
        }

        if (interview.getScheduledAt().isAfter(Instant.now()) && interview.getStatus() != InterviewStatus.COMPLETED) {
            throw new RuntimeException("You cannot submit a review before the interview has occurred");
        }

        interview.setCandidateReviewDidHappen(didHappen);
        interview.setCandidateReviewDsa(dsa);
        interview.setCandidateReviewSystemDesign(systemDesign);
        interview.setCandidateReviewCommunication(communication);
        interview.setCandidateReviewNotes(notes);
        
        Interview saved = interviewRepo.save(interview);

        InterviewerProfile profile = profileRepo.findByUserId(interview.getInterviewerId()).orElse(null);
        if (profile != null) {
            List<Interview> allInterviews = interviewRepo.findByInterviewerIdOrderByCreatedAtDesc(interview.getInterviewerId());
            int totalReviews = 0;
            double sumRatings = 0;
            
            for (Interview i : allInterviews) {
                if (i.getCandidateReviewDidHappen() != null && i.getCandidateReviewDidHappen()) {
                    double avgScore = 0.0;
                    int subCount = 0;
                    if (i.getCandidateReviewDsa() != null) { avgScore += i.getCandidateReviewDsa(); subCount++; }
                    if (i.getCandidateReviewSystemDesign() != null) { avgScore += i.getCandidateReviewSystemDesign(); subCount++; }
                    if (i.getCandidateReviewCommunication() != null) { avgScore += i.getCandidateReviewCommunication(); subCount++; }
                    
                    if (subCount > 0) {
                        sumRatings += (avgScore / subCount);
                        totalReviews++;
                    }
                }
            }
            
            profile.setTotalReviews(totalReviews);
            profile.setAverageRatingOverall(totalReviews > 0 ? Math.round((sumRatings / totalReviews) * 10.0) / 10.0 : 0.0);
            profileRepo.save(profile);
        }

        return saved;
    }

    @Transactional
    public void testCleanup() {
        profileRepo.deleteAll();
        interviewRepo.deleteAll();
        subscriptionRepo.deleteAll();
        paymentRepo.deleteAll();
        // Reset test user role to FREE_USER for checkout tests
        userRepo.findByEmail("testuser@beingsde.com").ifPresent(user -> {
            user.setRole(com.beingsde.core.auth.UserRole.FREE_USER);
            userRepo.save(user);
        });
    }
}
