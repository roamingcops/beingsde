package com.beingsde.core.interviews;

import com.beingsde.core.featureflags.FeatureFlagService;
import com.beingsde.core.interviews.dto.ProfileRequest;
import com.beingsde.core.interviews.dto.ProfileResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/interviews")
public class InterviewController {

    private static final String FEATURE_FLAG = "feature_premium_mock_interviews";

    private final InterviewService interviewService;
    private final FeatureFlagService featureFlagService;

    public InterviewController(InterviewService interviewService,
                                FeatureFlagService featureFlagService) {
        this.interviewService = interviewService;
        this.featureFlagService = featureFlagService;
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return (String) auth.getPrincipal();
        }
        return "anonymous";
    }

    private ResponseEntity<?> checkPremiumAccess(String email) {
        if (!featureFlagService.evaluate(email, FEATURE_FLAG)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "type", "https://api.beingsde.com/errors/insufficient-permissions",
                            "title", "Premium Feature",
                            "status", 403,
                            "detail", "Mock interviews are a premium feature. Please upgrade your subscription.",
                            "instance", "/api/v1/interviews"
                    ));
        }
        return null;
    }

    @PostMapping("/profile")
    public ResponseEntity<?> upsertProfile(@RequestBody ProfileRequest request) {
        String email = getCurrentUserEmail();
        ResponseEntity<?> accessError = checkPremiumAccess(email);
        if (accessError != null) return accessError;

        ProfileResponse profile = interviewService.upsertProfile(email, request);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profile/me")
    public ResponseEntity<?> getMyProfile() {
        String email = getCurrentUserEmail();
        ResponseEntity<?> accessError = checkPremiumAccess(email);
        if (accessError != null) return accessError;

        try {
            ProfileResponse profile = interviewService.getMyProfile(email);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Profile not found"));
        }
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> disableProfile() {
        String email = getCurrentUserEmail();
        ResponseEntity<?> accessError = checkPremiumAccess(email);
        if (accessError != null) return accessError;

        interviewService.disableProfile(email);
        return ResponseEntity.ok(Map.of("message", "Profile disabled"));
    }

    @GetMapping("/directory")
    public ResponseEntity<?> getDirectory(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) String slot) {
        String email = getCurrentUserEmail();
        ResponseEntity<?> accessError = checkPremiumAccess(email);
        if (accessError != null) return accessError;

        List<ProfileResponse> directory = interviewService.getDirectory(topic, experienceLevel, slot);
        return ResponseEntity.ok(directory);
    }

    @GetMapping
    public ResponseEntity<?> getMyInterviews() {
        String email = getCurrentUserEmail();
        ResponseEntity<?> accessError = checkPremiumAccess(email);
        if (accessError != null) return accessError;

        List<com.beingsde.core.interviews.dto.InterviewResponse> interviews = interviewService.getUserInterviews(email);
        return ResponseEntity.ok(interviews);
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookInterview(@RequestBody Map<String, Object> body) {
        String email = getCurrentUserEmail();
        ResponseEntity<?> accessError = checkPremiumAccess(email);
        if (accessError != null) return accessError;

        String profileId = (String) body.get("profileId");
        String topic = (String) body.get("topic");
        String scheduledAtStr = (String) body.get("scheduledAt");
        String meetingLink = (String) body.get("meetingLink");

        if (profileId == null || topic == null || scheduledAtStr == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Missing required fields: profileId, topic, scheduledAt"));
        }

        try {
            Instant scheduledAt = Instant.parse(scheduledAtStr);
            Interview interview = interviewService.bookInterview(email, profileId, topic, scheduledAt, meetingLink);
            return ResponseEntity.status(HttpStatus.CREATED).body(interview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelInterview(@PathVariable String id) {
        String email = getCurrentUserEmail();
        ResponseEntity<?> accessError = checkPremiumAccess(email);
        if (accessError != null) return accessError;

        try {
            Interview interview = interviewService.cancelInterview(id, email);
            return ResponseEntity.ok(interview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<?> submitFeedback(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        String email = getCurrentUserEmail();
        ResponseEntity<?> accessError = checkPremiumAccess(email);
        if (accessError != null) return accessError;

        Integer score = body.get("score") != null ? ((Number) body.get("score")).intValue() : null;
        String notes = (String) body.get("notes");

        try {
            Interview interview = interviewService.submitFeedback(id, email, score, notes);
            return ResponseEntity.ok(interview);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/calendly-webhook")
    public ResponseEntity<?> calendlyWebhook(@RequestBody Map<String, Object> body) {
        String interviewerEmail = (String) body.get("interviewerEmail");
        String candidateId = (String) body.get("candidateId");
        String topic = (String) body.get("topic");
        String scheduledTimeStr = (String) body.get("scheduled_time");
        String meetingLink = (String) body.get("meetingLink");

        if (interviewerEmail == null || candidateId == null || topic == null || scheduledTimeStr == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Missing required fields: interviewerEmail, candidateId, topic, scheduled_time"));
        }

        try {
            Instant scheduledTime = Instant.parse(scheduledTimeStr);
            Interview interview = interviewService.handleCalendlyWebhook(
                    interviewerEmail, candidateId, topic, scheduledTime, meetingLink);
            return ResponseEntity.status(HttpStatus.CREATED).body(interview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to process webhook: " + e.getMessage()));
        }
    }

    @DeleteMapping("/test/cleanup")
    public ResponseEntity<?> testCleanup() {
        interviewService.testCleanup();
        return ResponseEntity.ok(Map.of("message", "Test database cleared"));
    }
}
