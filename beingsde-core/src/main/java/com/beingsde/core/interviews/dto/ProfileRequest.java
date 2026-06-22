package com.beingsde.core.interviews.dto;

import com.beingsde.core.interviews.ExperienceLevel;

import java.util.List;

public class ProfileRequest {
    private String name;
    private List<String> topics;
    private ExperienceLevel experienceLevel;
    private String bio;
    private String calendlyLink;
    private boolean isAvailable;

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
}
