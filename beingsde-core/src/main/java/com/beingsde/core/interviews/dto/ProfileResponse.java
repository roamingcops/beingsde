package com.beingsde.core.interviews.dto;

import com.beingsde.core.interviews.ExperienceLevel;

import java.time.Instant;
import java.util.List;

public class ProfileResponse {
    private String id;
    private String name;
    private List<String> topics;
    private ExperienceLevel experienceLevel;
    private String bio;
    private String calendlyLink;
    private boolean isAvailable;
    private Instant createdAt;
    private Double averageRating;
    private Integer interviewsConducted;

    public ProfileResponse() {}

    public ProfileResponse(String id, String name, List<String> topics, ExperienceLevel experienceLevel,
                           String bio, String calendlyLink, boolean isAvailable, Instant createdAt,
                           Double averageRating, Integer interviewsConducted) {
        this.id = id;
        this.name = name;
        this.topics = topics;
        this.experienceLevel = experienceLevel;
        this.bio = bio;
        this.calendlyLink = calendlyLink;
        this.isAvailable = isAvailable;
        this.createdAt = createdAt;
        this.averageRating = averageRating;
        this.interviewsConducted = interviewsConducted;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    public Integer getInterviewsConducted() { return interviewsConducted; }
    public void setInterviewsConducted(Integer interviewsConducted) { this.interviewsConducted = interviewsConducted; }

    public static ProfileResponse fromProfile(com.beingsde.core.interviews.InterviewerProfile profile, Double averageRating, Integer interviewsConducted) {
        return new ProfileResponse(
                profile.getId(),
                profile.getName(),
                profile.getTopics(),
                profile.getExperienceLevel(),
                profile.getBio(),
                profile.getCalendlyLink(),
                profile.isAvailable(),
                profile.getCreatedAt(),
                averageRating,
                interviewsConducted
        );
    }
}
