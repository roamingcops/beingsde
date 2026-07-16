package com.beingsde.core.interviews.events;

import com.beingsde.core.interviews.InterviewEmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class InterviewEventListener {

    private static final Logger log = LoggerFactory.getLogger(InterviewEventListener.class);
    private final InterviewEmailService emailService;

    public InterviewEventListener(InterviewEmailService emailService) {
        this.emailService = emailService;
    }

    @Async
    @EventListener
    public void handleInterviewBooked(InterviewBookedEvent event) {
        try {
            emailService.sendBookingEmailToCandidate(
                    event.getCandidateEmail(), event.getCandidateName(),
                    event.getInterviewerName(), event.getTopic(),
                    event.getScheduledAt(), event.getMeetingLink()
            );
            emailService.sendBookingEmailToInterviewer(
                    event.getInterviewerEmail(), event.getInterviewerName(),
                    event.getCandidateName(), event.getTopic(),
                    event.getScheduledAt(), event.getMeetingLink()
            );
        } catch (Exception e) {
            log.error("Failed to process booking email asynchronously", e);
        }
    }

    @Async
    @EventListener
    public void handleInterviewCancelled(InterviewCancelledEvent event) {
        try {
            emailService.sendCancellationEmail(
                    event.getTargetEmail(), event.getOtherPartyName(),
                    event.getTopic(), event.getScheduledAt(),
                    event.getRoleOfOtherParty()
            );
        } catch (Exception e) {
            log.error("Failed to process cancellation email asynchronously", e);
        }
    }

    @Async
    @EventListener
    public void handleInterviewFeedback(InterviewFeedbackEvent event) {
        try {
            emailService.sendFeedbackEmail(
                    event.getCandidateEmail(), event.getCandidateName(),
                    event.getInterviewerName(), event.getTopic(),
                    event.getScore(), event.getNotes()
                );
        } catch (Exception e) {
            log.error("Failed to process feedback email asynchronously", e);
        }
    }
}
