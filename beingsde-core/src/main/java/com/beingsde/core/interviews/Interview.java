package com.beingsde.core.interviews;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "interviews")
public class Interview {

    @Id
    private String id;

    @Indexed
    private String interviewerId;

    private String candidateId;

    private String topic;

    private InterviewStatus status;

    private Instant scheduledAt;

    private String meetingLink;

    private Integer feedbackScore;

    private String feedbackNotes;

    private Boolean candidateReviewDidHappen;
    private Integer candidateReviewDsa;
    private Integer candidateReviewSystemDesign;
    private Integer candidateReviewCommunication;
    private String candidateReviewNotes;

    @CreatedDate
    private Instant createdAt;

    public Interview() {
    }

    public Interview(String id, String interviewerId, String candidateId, String topic,
                     Integer feedbackScore, String feedbackNotes,
                     Boolean candidateReviewDidHappen, Integer candidateReviewDsa,
                     Integer candidateReviewSystemDesign, Integer candidateReviewCommunication,
                     String candidateReviewNotes, Instant createdAt) {
        this.id = id;
        this.interviewerId = interviewerId;
        this.candidateId = candidateId;
        this.topic = topic;
        this.status = status;
        this.scheduledAt = scheduledAt;
        this.meetingLink = meetingLink;
        this.feedbackScore = feedbackScore;
        this.feedbackNotes = feedbackNotes;
        this.candidateReviewDidHappen = candidateReviewDidHappen;
        this.candidateReviewDsa = candidateReviewDsa;
        this.candidateReviewSystemDesign = candidateReviewSystemDesign;
        this.candidateReviewCommunication = candidateReviewCommunication;
        this.candidateReviewNotes = candidateReviewNotes;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getInterviewerId() { return interviewerId; }
    public void setInterviewerId(String interviewerId) { this.interviewerId = interviewerId; }
    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String candidateId) { this.candidateId = candidateId; }
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
    
    public Boolean getCandidateReviewDidHappen() { return candidateReviewDidHappen; }
    public void setCandidateReviewDidHappen(Boolean candidateReviewDidHappen) { this.candidateReviewDidHappen = candidateReviewDidHappen; }
    
    public Integer getCandidateReviewDsa() { return candidateReviewDsa; }
    public void setCandidateReviewDsa(Integer candidateReviewDsa) { this.candidateReviewDsa = candidateReviewDsa; }
    
    public Integer getCandidateReviewSystemDesign() { return candidateReviewSystemDesign; }
    public void setCandidateReviewSystemDesign(Integer candidateReviewSystemDesign) { this.candidateReviewSystemDesign = candidateReviewSystemDesign; }
    
    public Integer getCandidateReviewCommunication() { return candidateReviewCommunication; }
    public void setCandidateReviewCommunication(Integer candidateReviewCommunication) { this.candidateReviewCommunication = candidateReviewCommunication; }
    
    public String getCandidateReviewNotes() { return candidateReviewNotes; }
    public void setCandidateReviewNotes(String candidateReviewNotes) { this.candidateReviewNotes = candidateReviewNotes; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static InterviewBuilder builder() {
        return new InterviewBuilder();
    }

    public static class InterviewBuilder {
        private String id;
        private String interviewerId;
        private String candidateId;
        private String topic;
        private InterviewStatus status;
        private Instant scheduledAt;
        private String meetingLink;
        private Integer feedbackScore;
        private String feedbackNotes;
        
        private Boolean candidateReviewDidHappen;
        private Integer candidateReviewDsa;
        private Integer candidateReviewSystemDesign;
        private Integer candidateReviewCommunication;
        private String candidateReviewNotes;
        
        private Instant createdAt;

        InterviewBuilder() {}

        public InterviewBuilder id(String id) { this.id = id; return this; }
        public InterviewBuilder interviewerId(String interviewerId) { this.interviewerId = interviewerId; return this; }
        public InterviewBuilder candidateId(String candidateId) { this.candidateId = candidateId; return this; }
        public InterviewBuilder topic(String topic) { this.topic = topic; return this; }
        public InterviewBuilder status(InterviewStatus status) { this.status = status; return this; }
        public InterviewBuilder scheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; return this; }
        public InterviewBuilder meetingLink(String meetingLink) { this.meetingLink = meetingLink; return this; }
        public InterviewBuilder feedbackScore(Integer feedbackScore) { this.feedbackScore = feedbackScore; return this; }
        public InterviewBuilder feedbackNotes(String feedbackNotes) { this.feedbackNotes = feedbackNotes; return this; }
        
        public InterviewBuilder candidateReviewDidHappen(Boolean candidateReviewDidHappen) { this.candidateReviewDidHappen = candidateReviewDidHappen; return this; }
        public InterviewBuilder candidateReviewDsa(Integer candidateReviewDsa) { this.candidateReviewDsa = candidateReviewDsa; return this; }
        public InterviewBuilder candidateReviewSystemDesign(Integer candidateReviewSystemDesign) { this.candidateReviewSystemDesign = candidateReviewSystemDesign; return this; }
        public InterviewBuilder candidateReviewCommunication(Integer candidateReviewCommunication) { this.candidateReviewCommunication = candidateReviewCommunication; return this; }
        public InterviewBuilder candidateReviewNotes(String candidateReviewNotes) { this.candidateReviewNotes = candidateReviewNotes; return this; }
        
        public InterviewBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Interview build() {
            return new Interview(id, interviewerId, candidateId, topic, status, scheduledAt, meetingLink,
                    feedbackScore, feedbackNotes, candidateReviewDidHappen, candidateReviewDsa, 
                    candidateReviewSystemDesign, candidateReviewCommunication, candidateReviewNotes, createdAt);
        }
    }
}
