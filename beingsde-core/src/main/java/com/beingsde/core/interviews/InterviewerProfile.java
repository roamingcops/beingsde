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

    private List<String> availabilitySlots;

    private String availabilityText;

    private Integer totalReviews = 0;
    private Double averageRatingOverall = 0.0;

    @CreatedDate
    private Instant createdAt;

    public InterviewerProfile() {
    }

    public InterviewerProfile(String id, String userId, String name, List<String> topics,
                              ExperienceLevel experienceLevel, String bio, String calendlyLink,
                              boolean isAvailable, List<String> availabilitySlots, String availabilityText,
                              Integer totalReviews, Double averageRatingOverall, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.topics = topics;
        this.experienceLevel = experienceLevel;
        this.bio = bio;
        this.calendlyLink = calendlyLink;
        this.isAvailable = isAvailable;
        this.availabilitySlots = availabilitySlots;
        this.availabilityText = availabilityText;
        this.totalReviews = totalReviews != null ? totalReviews : 0;
        this.averageRatingOverall = averageRatingOverall != null ? averageRatingOverall : 0.0;
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
    public List<String> getAvailabilitySlots() { return availabilitySlots; }
    public void setAvailabilitySlots(List<String> availabilitySlots) { this.availabilitySlots = availabilitySlots; }
    public String getAvailabilityText() { return availabilityText; }
    public void setAvailabilityText(String availabilityText) { this.availabilityText = availabilityText; }
    
    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }
    
    public Double getAverageRatingOverall() { return averageRatingOverall; }
    public void setAverageRatingOverall(Double averageRatingOverall) { this.averageRatingOverall = averageRatingOverall; }
    
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
        private List<String> availabilitySlots;
        private String availabilityText;
        private Integer totalReviews;
        private Double averageRatingOverall;
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
        public InterviewerProfileBuilder availabilitySlots(List<String> availabilitySlots) { this.availabilitySlots = availabilitySlots; return this; }
        public InterviewerProfileBuilder availabilityText(String availabilityText) { this.availabilityText = availabilityText; return this; }
        public InterviewerProfileBuilder totalReviews(Integer totalReviews) { this.totalReviews = totalReviews; return this; }
        public InterviewerProfileBuilder averageRatingOverall(Double averageRatingOverall) { this.averageRatingOverall = averageRatingOverall; return this; }
        public InterviewerProfileBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public InterviewerProfile build() {
            return new InterviewerProfile(id, userId, name, topics, experienceLevel, bio, calendlyLink, isAvailable, availabilitySlots, availabilityText, totalReviews, averageRatingOverall, createdAt);
        }
    }
}
