package com.beingsde.core.interviews.dto;

import java.time.Instant;
import java.util.List;

public class InterviewResponse {
    private String id;
    private String userId;
    private String matchedUserId;
    private String status;
    private List<String> preferredTopics;
    private String experienceLevel;
    private String calendlyLink;
    private String notes;
    private String meetingLink;
    private Instant scheduledAt;
    private Instant createdAt;
    private Instant updatedAt;

    public InterviewResponse() {}

    public InterviewResponse(String id, String userId, String matchedUserId, String status,
                              List<String> preferredTopics, String experienceLevel,
                              String calendlyLink, String notes, String meetingLink,
                              Instant scheduledAt, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.userId = userId;
        this.matchedUserId = matchedUserId;
        this.status = status;
        this.preferredTopics = preferredTopics;
        this.experienceLevel = experienceLevel;
        this.calendlyLink = calendlyLink;
        this.notes = notes;
        this.meetingLink = meetingLink;
        this.scheduledAt = scheduledAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getMatchedUserId() { return matchedUserId; }
    public String getStatus() { return status; }
    public List<String> getPreferredTopics() { return preferredTopics; }
    public String getExperienceLevel() { return experienceLevel; }
    public String getCalendlyLink() { return calendlyLink; }
    public String getNotes() { return notes; }
    public String getMeetingLink() { return meetingLink; }
    public Instant getScheduledAt() { return scheduledAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
