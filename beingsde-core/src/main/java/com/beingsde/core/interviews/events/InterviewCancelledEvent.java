package com.beingsde.core.interviews.events;

import org.springframework.context.ApplicationEvent;

import java.time.Instant;

public class InterviewCancelledEvent extends ApplicationEvent {
    
    private final String targetEmail;
    private final String otherPartyName;
    private final String topic;
    private final Instant scheduledAt;
    private final String roleOfOtherParty;

    public InterviewCancelledEvent(Object source, String targetEmail, String otherPartyName,
                                   String topic, Instant scheduledAt, String roleOfOtherParty) {
        super(source);
        this.targetEmail = targetEmail;
        this.otherPartyName = otherPartyName;
        this.topic = topic;
        this.scheduledAt = scheduledAt;
        this.roleOfOtherParty = roleOfOtherParty;
    }

    public String getTargetEmail() { return targetEmail; }
    public String getOtherPartyName() { return otherPartyName; }
    public String getTopic() { return topic; }
    public Instant getScheduledAt() { return scheduledAt; }
    public String getRoleOfOtherParty() { return roleOfOtherParty; }
}
