package com.beingsde.core.interviews;

import com.beingsde.core.featureflags.FeatureFlagService;
import com.beingsde.core.interviews.dto.InterviewResponse;
import com.beingsde.core.interviews.dto.MatchRequest;
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
    private final FeatureFlagService featureFlagService;

    public InterviewController(InterviewService interviewService,
                               FeatureFlagService featureFlagService) {
        this.interviewService = interviewService;
        this.featureFlagService = featureFlagService;
    }

    @PostMapping("/match")
    public ResponseEntity<?> requestMatch(@RequestBody MatchRequest request) {
        String userId = getCurrentUserId();

        if (!featureFlagService.evaluate(userId, "feature_premium_mock_interviews")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "type", "https://api.beingsde.com/errors/insufficient-permissions",
                            "title", "Feature Locked",
                            "status", 403,
                            "detail", "Mock interviews are a premium feature. Please upgrade your subscription to access."
                    ));
        }

        try {
            Interview interview = interviewService.matchRequest(
                    userId,
                    request.getCalendlyLink(),
                    request.getPreferredTopics(),
                    request.getExperienceLevel(),
                    request.getNotes()
            );
            return ResponseEntity.ok(toResponse(interview));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserInterviews() {
        try {
            String userId = getCurrentUserId();
            List<Interview> interviews = interviewService.getUserInterviews(userId);
            List<InterviewResponse> responses = interviews.stream()
                    .map(this::toResponse)
                    .toList();
            return ResponseEntity.ok(Map.of("interviews", responses));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInterview(@PathVariable String id) {
        try {
            String userId = getCurrentUserId();
            Interview interview = interviewService.getInterview(id, userId);
            return ResponseEntity.ok(toResponse(interview));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelMatch(@PathVariable String id) {
        try {
            String userId = getCurrentUserId();
            Interview interview = interviewService.cancelMatch(id, userId);
            return ResponseEntity.ok(toResponse(interview));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/calendly-webhook")
    public ResponseEntity<?> handleCalendlyWebhook(@RequestBody Map<String, Object> payload) {
        try {
            String event = (String) payload.get("event");
            if (event == null || !event.contains("invitee.created")) {
                return ResponseEntity.ok(Map.of("status", "ignored"));
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> payloadObj = (Map<String, Object>) payload.get("payload");
            if (payloadObj == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid payload"));
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> invitee = (Map<String, Object>) payloadObj.get("invitee");
            if (invitee == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Missing invitee"));
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> questionsAndAnswers = (Map<String, Object>) invitee.get("questions_and_answers");
            String userId = null;
            String matchedUserId = null;
            if (questionsAndAnswers != null) {
                userId = (String) questionsAndAnswers.get("userId");
                matchedUserId = (String) questionsAndAnswers.get("matchedUserId");
            }

            if (userId == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Missing userId in invitee questions"));
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> scheduledEvent = (Map<String, Object>) payloadObj.get("scheduled_event");
            String meetingLink = null;
            Instant scheduledTime = null;
            if (scheduledEvent != null) {
                meetingLink = (String) scheduledEvent.get("location");
                String startTimeStr = (String) scheduledEvent.get("start_time");
                if (startTimeStr != null) {
                    scheduledTime = Instant.parse(startTimeStr);
                }
            }

            Interview interview = interviewService.handleCalendlyWebhook(
                    event, userId, matchedUserId, scheduledTime, meetingLink);

            return ResponseEntity.ok(Map.of("status", "success", "interview", toResponse(interview)));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error processing Calendly webhook: " + e.getMessage()));
        }
    }

    private InterviewResponse toResponse(Interview interview) {
        return new InterviewResponse(
                interview.getId(),
                interview.getUserId(),
                interview.getMatchedUserId(),
                interview.getStatus(),
                interview.getPreferredTopics(),
                interview.getExperienceLevel(),
                interview.getCalendlyLink(),
                interview.getNotes(),
                interview.getMeetingLink(),
                interview.getScheduledAt(),
                interview.getCreatedAt(),
                interview.getUpdatedAt()
        );
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RuntimeException("Authentication required");
        }
        return (String) auth.getPrincipal();
    }
}
