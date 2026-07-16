package com.beingsde.core.interviews.events;

import org.springframework.context.ApplicationEvent;

public class InterviewFeedbackEvent extends ApplicationEvent {
    
    private final String candidateEmail;
    private final String candidateName;
    private final String interviewerName;
    private final String topic;
    private final Integer score;
    private final String notes;

    public InterviewFeedbackEvent(Object source, String candidateEmail, String candidateName,
                                  String interviewerName, String topic, Integer score, String notes) {
        super(source);
        this.candidateEmail = candidateEmail;
        this.candidateName = candidateName;
        this.interviewerName = interviewerName;
        this.topic = topic;
        this.score = score;
        this.notes = notes;
    }

    public String getCandidateEmail() { return candidateEmail; }
    public String getCandidateName() { return candidateName; }
    public String getInterviewerName() { return interviewerName; }
    public String getTopic() { return topic; }
    public Integer getScore() { return score; }
    public String getNotes() { return notes; }
}
