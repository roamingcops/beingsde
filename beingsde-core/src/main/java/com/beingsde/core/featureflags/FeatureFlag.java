package com.beingsde.core.featureflags;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "feature_flags")
public class FeatureFlag {

    @Id
    private String id;

    @Indexed(unique = true)
    private String key;

    private String description;

    private boolean globallyEnabled;

    private boolean globallyDisabled;

    private int rolloutPercentage;

    private List<String> allowedSubscriptionTiers;

    private List<String> allowedRoles;

    private Instant launchDate;

    public FeatureFlag() {
    }

    public FeatureFlag(String id, String key, String description, boolean globallyEnabled, boolean globallyDisabled,
                       int rolloutPercentage, List<String> allowedSubscriptionTiers, List<String> allowedRoles,
                       Instant launchDate) {
        this.id = id;
        this.key = key;
        this.description = description;
        this.globallyEnabled = globallyEnabled;
        this.globallyDisabled = globallyDisabled;
        this.rolloutPercentage = rolloutPercentage;
        this.allowedSubscriptionTiers = allowedSubscriptionTiers;
        this.allowedRoles = allowedRoles;
        this.launchDate = launchDate;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isGloballyEnabled() { return globallyEnabled; }
    public void setGloballyEnabled(boolean globallyEnabled) { this.globallyEnabled = globallyEnabled; }
    public boolean isGloballyDisabled() { return globallyDisabled; }
    public void setGloballyDisabled(boolean globallyDisabled) { this.globallyDisabled = globallyDisabled; }
    public int getRolloutPercentage() { return rolloutPercentage; }
    public void setRolloutPercentage(int rolloutPercentage) { this.rolloutPercentage = rolloutPercentage; }
    public List<String> getAllowedSubscriptionTiers() { return allowedSubscriptionTiers; }
    public void setAllowedSubscriptionTiers(List<String> allowedSubscriptionTiers) { this.allowedSubscriptionTiers = allowedSubscriptionTiers; }
    public List<String> getAllowedRoles() { return allowedRoles; }
    public void setAllowedRoles(List<String> allowedRoles) { this.allowedRoles = allowedRoles; }
    public Instant getLaunchDate() { return launchDate; }
    public void setLaunchDate(Instant launchDate) { this.launchDate = launchDate; }

    public static FeatureFlagBuilder builder() {
        return new FeatureFlagBuilder();
    }

    public static class FeatureFlagBuilder {
        private String id;
        private String key;
        private String description;
        private boolean globallyEnabled;
        private boolean globallyDisabled;
        private int rolloutPercentage;
        private List<String> allowedSubscriptionTiers;
        private List<String> allowedRoles;
        private Instant launchDate;

        FeatureFlagBuilder() {}

        public FeatureFlagBuilder id(String id) { this.id = id; return this; }
        public FeatureFlagBuilder key(String key) { this.key = key; return this; }
        public FeatureFlagBuilder description(String description) { this.description = description; return this; }
        public FeatureFlagBuilder globallyEnabled(boolean globallyEnabled) { this.globallyEnabled = globallyEnabled; return this; }
        public FeatureFlagBuilder globallyDisabled(boolean globallyDisabled) { this.globallyDisabled = globallyDisabled; return this; }
        public FeatureFlagBuilder rolloutPercentage(int rolloutPercentage) { this.rolloutPercentage = rolloutPercentage; return this; }
        public FeatureFlagBuilder allowedSubscriptionTiers(List<String> allowedSubscriptionTiers) { this.allowedSubscriptionTiers = allowedSubscriptionTiers; return this; }
        public FeatureFlagBuilder allowedRoles(List<String> allowedRoles) { this.allowedRoles = allowedRoles; return this; }
        public FeatureFlagBuilder launchDate(Instant launchDate) { this.launchDate = launchDate; return this; }

        public FeatureFlag build() {
            return new FeatureFlag(id, key, description, globallyEnabled, globallyDisabled, rolloutPercentage,
                    allowedSubscriptionTiers, allowedRoles, launchDate);
        }
    }
}
