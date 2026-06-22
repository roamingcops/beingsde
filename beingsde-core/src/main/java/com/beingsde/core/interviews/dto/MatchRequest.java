package com.beingsde.core.interviews.dto;

import java.util.List;

public class MatchRequest {
    private String calendlyLink;
    private List<String> preferredTopics;
    private String experienceLevel;
    private String notes;

    public MatchRequest() {}

    public MatchRequest(String calendlyLink, List<String> preferredTopics,
                        String experienceLevel, String notes) {
        this.calendlyLink = calendlyLink;
        this.preferredTopics = preferredTopics;
        this.experienceLevel = experienceLevel;
        this.notes = notes;
    }

    public String getCalendlyLink() { return calendlyLink; }
    public void setCalendlyLink(String calendlyLink) { this.calendlyLink = calendlyLink; }
    public List<String> getPreferredTopics() { return preferredTopics; }
    public void setPreferredTopics(List<String> preferredTopics) { this.preferredTopics = preferredTopics; }
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
