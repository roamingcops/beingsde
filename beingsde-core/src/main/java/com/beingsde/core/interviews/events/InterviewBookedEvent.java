package com.beingsde.core.interviews.events;

import org.springframework.context.ApplicationEvent;

import java.time.Instant;

public class InterviewBookedEvent extends ApplicationEvent {
    
    private final String candidateEmail;
    private final String candidateName;
    private final String interviewerEmail;
    private final String interviewerName;
    private final String topic;
    private final Instant scheduledAt;
    private final String meetingLink;

    public InterviewBookedEvent(Object source, String candidateEmail, String candidateName,
                                String interviewerEmail, String interviewerName,
                                String topic, Instant scheduledAt, String meetingLink) {
        super(source);
        this.candidateEmail = candidateEmail;
        this.candidateName = candidateName;
        this.interviewerEmail = interviewerEmail;
        this.interviewerName = interviewerName;
        this.topic = topic;
        this.scheduledAt = scheduledAt;
        this.meetingLink = meetingLink;
    }

    public String getCandidateEmail() { return candidateEmail; }
    public String getCandidateName() { return candidateName; }
    public String getInterviewerEmail() { return interviewerEmail; }
    public String getInterviewerName() { return interviewerName; }
    public String getTopic() { return topic; }
    public Instant getScheduledAt() { return scheduledAt; }
    public String getMeetingLink() { return meetingLink; }
}
