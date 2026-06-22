package com.beingsde.core.interviews;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "interviews")
public class Interview {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String matchedUserId;

    private String status;

    private List<String> preferredTopics;

    private String experienceLevel;

    private String calendlyLink;

    private String notes;

    private String meetingLink;

    private Instant scheduledAt;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Interview() {
    }

    public Interview(String id, String userId, String matchedUserId, String status,
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
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getMatchedUserId() { return matchedUserId; }
    public void setMatchedUserId(String matchedUserId) { this.matchedUserId = matchedUserId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<String> getPreferredTopics() { return preferredTopics; }
    public void setPreferredTopics(List<String> preferredTopics) { this.preferredTopics = preferredTopics; }
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public String getCalendlyLink() { return calendlyLink; }
    public void setCalendlyLink(String calendlyLink) { this.calendlyLink = calendlyLink; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public static InterviewBuilder builder() {
        return new InterviewBuilder();
    }

    public static class InterviewBuilder {
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

        InterviewBuilder() {}

        public InterviewBuilder id(String id) { this.id = id; return this; }
        public InterviewBuilder userId(String userId) { this.userId = userId; return this; }
        public InterviewBuilder matchedUserId(String matchedUserId) { this.matchedUserId = matchedUserId; return this; }
        public InterviewBuilder status(String status) { this.status = status; return this; }
        public InterviewBuilder preferredTopics(List<String> preferredTopics) { this.preferredTopics = preferredTopics; return this; }
        public InterviewBuilder experienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; return this; }
        public InterviewBuilder calendlyLink(String calendlyLink) { this.calendlyLink = calendlyLink; return this; }
        public InterviewBuilder notes(String notes) { this.notes = notes; return this; }
        public InterviewBuilder meetingLink(String meetingLink) { this.meetingLink = meetingLink; return this; }
        public InterviewBuilder scheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; return this; }
        public InterviewBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public InterviewBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Interview build() {
            return new Interview(id, userId, matchedUserId, status, preferredTopics,
                    experienceLevel, calendlyLink, notes, meetingLink,
                    scheduledAt, createdAt, updatedAt);
        }
    }
}
