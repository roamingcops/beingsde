package com.beingsde.core.interviews.dto;

import com.beingsde.core.interviews.InterviewStatus;
import java.time.Instant;

public class InterviewResponse {
    private String id;
    private String interviewerId;
    private String interviewerName;
    private String interviewerEmail;
    private String candidateId;
    private String candidateName;
    private String candidateEmail;
    private String topic;
    private InterviewStatus status;
    private Instant scheduledAt;
    private String meetingLink;
    private Integer feedbackScore;
    private String feedbackNotes;
    private Instant createdAt;

    public InterviewResponse() {}

    public InterviewResponse(String id, String interviewerId, String interviewerName, String interviewerEmail,
                             String candidateId, String candidateName, String candidateEmail, String topic,
                             InterviewStatus status, Instant scheduledAt, String meetingLink,
                             Integer feedbackScore, String feedbackNotes, Instant createdAt) {
        this.id = id;
        this.interviewerId = interviewerId;
        this.interviewerName = interviewerName;
        this.interviewerEmail = interviewerEmail;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.topic = topic;
        this.status = status;
        this.scheduledAt = scheduledAt;
        this.meetingLink = meetingLink;
        this.feedbackScore = feedbackScore;
        this.feedbackNotes = feedbackNotes;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getInterviewerId() { return interviewerId; }
    public void setInterviewerId(String interviewerId) { this.interviewerId = interviewerId; }

    public String getInterviewerName() { return interviewerName; }
    public void setInterviewerName(String interviewerName) { this.interviewerName = interviewerName; }

    public String getInterviewerEmail() { return interviewerEmail; }
    public void setInterviewerEmail(String interviewerEmail) { this.interviewerEmail = interviewerEmail; }

    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String candidateId) { this.candidateId = candidateId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public InterviewStatus getStatus() { return status; }
    public void setStatus(InterviewStatus status) { this.status = status; }

    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public Integer getFeedbackScore() { return feedbackScore; }
    public void setFeedbackScore(Integer feedbackScore) { this.feedbackScore = feedbackScore; }

    public String getFeedbackNotes() { return feedbackNotes; }
    public void setFeedbackNotes(String feedbackNotes) { this.feedbackNotes = feedbackNotes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
