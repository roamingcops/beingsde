package com.beingsde.core.interviews;

import com.beingsde.core.interviews.annotations.RequiresPremium;
import com.beingsde.core.interviews.dto.ProfileRequest;
import com.beingsde.core.interviews.dto.ProfileResponse;
import org.springframework.beans.factory.annotation.Value;
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

    private final InterviewService interviewService;
    
    @Value("${calendly.webhook.secret:secret_token_123}")
    private String webhookSecret;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return (String) auth.getPrincipal();
        }
        return "anonymous";
    }

    @PostMapping("/profile")
    @RequiresPremium
    public ResponseEntity<ProfileResponse> upsertProfile(@RequestBody ProfileRequest request) {
        String email = getCurrentUserEmail();
        ProfileResponse profile = interviewService.upsertProfile(email, request);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profile/me")
    @RequiresPremium
    public ResponseEntity<?> getMyProfile() {
        String email = getCurrentUserEmail();
        try {
            ProfileResponse profile = interviewService.getMyProfile(email);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Profile not found"));
        }
    }

    @DeleteMapping("/profile")
    @RequiresPremium
    public ResponseEntity<?> disableProfile() {
        String email = getCurrentUserEmail();
        interviewService.disableProfile(email);
        return ResponseEntity.ok(Map.of("message", "Profile disabled"));
    }

    @GetMapping("/directory")
    @RequiresPremium
    public ResponseEntity<List<ProfileResponse>> getDirectory(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) String slot) {
        String email = getCurrentUserEmail();
        List<ProfileResponse> directory = interviewService.getDirectory(topic, experienceLevel, slot);
        return ResponseEntity.ok(directory);
    }

    @GetMapping
    @RequiresPremium
    public ResponseEntity<List<com.beingsde.core.interviews.dto.InterviewResponse>> getMyInterviews() {
        String email = getCurrentUserEmail();
        List<com.beingsde.core.interviews.dto.InterviewResponse> interviews = interviewService.getUserInterviews(email);
        return ResponseEntity.ok(interviews);
    }

    @PostMapping("/book")
    @RequiresPremium
    public ResponseEntity<?> bookInterview(@RequestBody Map<String, Object> body) {
        String email = getCurrentUserEmail();

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
    @RequiresPremium
    public ResponseEntity<?> cancelInterview(@PathVariable String id) {
        String email = getCurrentUserEmail();
        try {
            Interview interview = interviewService.cancelInterview(id, email);
            return ResponseEntity.ok(interview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/feedback")
    @RequiresPremium
    public ResponseEntity<?> submitFeedback(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        String email = getCurrentUserEmail();
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
    public ResponseEntity<?> calendlyWebhook(@RequestHeader(value = "Calendly-Webhook-Signature", required = false) String signature,
                                             @RequestBody Map<String, Object> body) {
        
        // Basic signature check to prevent spoofing
        if (signature == null || !signature.equals(webhookSecret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or missing webhook signature"));
        }

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
