package com.beingsde.core.interviews;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "interviewer_profiles")
public class InterviewerProfile {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String name;

    private List<String> topics;

    private ExperienceLevel experienceLevel;

    private String bio;

    private String calendlyLink;

    private boolean isAvailable;

    @CreatedDate
    private Instant createdAt;

    public InterviewerProfile() {
    }

    public InterviewerProfile(String id, String userId, String name, List<String> topics,
                              ExperienceLevel experienceLevel, String bio, String calendlyLink,
                              boolean isAvailable, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.topics = topics;
        this.experienceLevel = experienceLevel;
        this.bio = bio;
        this.calendlyLink = calendlyLink;
        this.isAvailable = isAvailable;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }
    public ExperienceLevel getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(ExperienceLevel experienceLevel) { this.experienceLevel = experienceLevel; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getCalendlyLink() { return calendlyLink; }
    public void setCalendlyLink(String calendlyLink) { this.calendlyLink = calendlyLink; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static InterviewerProfileBuilder builder() {
        return new InterviewerProfileBuilder();
    }

    public static class InterviewerProfileBuilder {
        private String id;
        private String userId;
        private String name;
        private List<String> topics;
        private ExperienceLevel experienceLevel;
        private String bio;
        private String calendlyLink;
        private boolean isAvailable;
        private Instant createdAt;

        InterviewerProfileBuilder() {}

        public InterviewerProfileBuilder id(String id) { this.id = id; return this; }
        public InterviewerProfileBuilder userId(String userId) { this.userId = userId; return this; }
        public InterviewerProfileBuilder name(String name) { this.name = name; return this; }
        public InterviewerProfileBuilder topics(List<String> topics) { this.topics = topics; return this; }
        public InterviewerProfileBuilder experienceLevel(ExperienceLevel experienceLevel) { this.experienceLevel = experienceLevel; return this; }
        public InterviewerProfileBuilder bio(String bio) { this.bio = bio; return this; }
        public InterviewerProfileBuilder calendlyLink(String calendlyLink) { this.calendlyLink = calendlyLink; return this; }
        public InterviewerProfileBuilder isAvailable(boolean isAvailable) { this.isAvailable = isAvailable; return this; }
        public InterviewerProfileBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public InterviewerProfile build() {
            return new InterviewerProfile(id, userId, name, topics, experienceLevel, bio, calendlyLink, isAvailable, createdAt);
        }
    }
}
