package com.beingsde.core.billing;

import java.time.Instant;

public class Subscription {

    private String id;
    private String userId;
    private String tier;
    private String status;
    private String razorpaySubscriptionId;
    private Instant startedAt;
    private Instant expiresAt;
    private boolean autoRenew;
    private Instant createdAt;

    public Subscription() {
    }

    public Subscription(String id, String userId, String tier, String status, String razorpaySubscriptionId,
                        Instant startedAt, Instant expiresAt, boolean autoRenew, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.tier = tier;
        this.status = status;
        this.razorpaySubscriptionId = razorpaySubscriptionId;
        this.startedAt = startedAt;
        this.expiresAt = expiresAt;
        this.autoRenew = autoRenew;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRazorpaySubscriptionId() { return razorpaySubscriptionId; }
    public void setRazorpaySubscriptionId(String razorpaySubscriptionId) { this.razorpaySubscriptionId = razorpaySubscriptionId; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public boolean isAutoRenew() { return autoRenew; }
    public void setAutoRenew(boolean autoRenew) { this.autoRenew = autoRenew; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static SubscriptionBuilder builder() {
        return new SubscriptionBuilder();
    }

    public static class SubscriptionBuilder {
        private String id;
        private String userId;
        private String tier;
        private String status;
        private String razorpaySubscriptionId;
        private Instant startedAt;
        private Instant expiresAt;
        private boolean autoRenew;
        private Instant createdAt;

        SubscriptionBuilder() {}

        public SubscriptionBuilder id(String id) { this.id = id; return this; }
        public SubscriptionBuilder userId(String userId) { this.userId = userId; return this; }
        public SubscriptionBuilder tier(String tier) { this.tier = tier; return this; }
        public SubscriptionBuilder status(String status) { this.status = status; return this; }
        public SubscriptionBuilder razorpaySubscriptionId(String razorpaySubscriptionId) { this.razorpaySubscriptionId = razorpaySubscriptionId; return this; }
        public SubscriptionBuilder startedAt(Instant startedAt) { this.startedAt = startedAt; return this; }
        public SubscriptionBuilder expiresAt(Instant expiresAt) { this.expiresAt = expiresAt; return this; }
        public SubscriptionBuilder autoRenew(boolean autoRenew) { this.autoRenew = autoRenew; return this; }
        public SubscriptionBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Subscription build() {
            return new Subscription(id, userId, tier, status, razorpaySubscriptionId, startedAt, expiresAt, autoRenew, createdAt);
        }
    }
}
