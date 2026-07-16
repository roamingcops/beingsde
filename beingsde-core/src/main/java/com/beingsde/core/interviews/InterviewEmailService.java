package com.beingsde.core.interviews;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class InterviewEmailService {

    private static final Logger log = LoggerFactory.getLogger(InterviewEmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.resend.api-key}")
    private String resendApiKey;

    @Value("${app.resend.from-address:onboarding@resend.dev}")
    private String fromAddress;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    private void sendEmail(String toEmail, String subject, String htmlBody) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            log.warn("Resend API key is not configured. Email to {} was skipped.", toEmail);
            return;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey);

        Map<String, Object> body = Map.of(
                "from", "beingsde <" + fromAddress + ">",
                "to", List.of(toEmail),
                "subject", subject,
                "html", htmlBody
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(RESEND_API_URL, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Mock interview email sent to {} with subject: {}", toEmail, subject);
            } else {
                log.error("Failed to send mock interview email to {}. Resend API status: {}", toEmail, response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error sending mock interview email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String formatDateTime(Instant instant) {
        if (instant == null) return "N/A";
        return DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm 'UTC'")
                .withZone(ZoneId.of("UTC"))
                .format(instant);
    }

    public void sendBookingEmailToCandidate(String candidateEmail, String candidateName, String interviewerName, String topic, Instant scheduledAt, String meetingLink) {
        String subject = "Confirmed: Mock Interview with " + interviewerName;
        String html = """
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 6px;">
                <h2 style="color: #09090b; margin-top: 0;">Your Mock Interview is Scheduled!</h2>
                <p>Hello %s,</p>
                <p>Your system design mock interview has been scheduled successfully. Here are the details:</p>
                <table style="width: 100%%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-weight: bold; width: 120px;">Interviewer:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Topic:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Time:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Video Link:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;"><a href="%s" style="color: #2563eb; text-decoration: underline;">Join Jitsi Call</a></td>
                    </tr>
                </table>
                <p>Make sure to prepare notes on the topic beforehand. Good luck!</p>
                <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
                <p style="font-size: 12px; color: #71717a; margin-bottom: 0;">&copy; beingsde.in &mdash; Built for System Architects.</p>
            </div>
            """.formatted(candidateName, interviewerName, topic, formatDateTime(scheduledAt), meetingLink);

        sendEmail(candidateEmail, subject, html);
    }

    public void sendBookingEmailToInterviewer(String interviewerEmail, String interviewerName, String candidateName, String topic, Instant scheduledAt, String meetingLink) {
        String subject = "New Booking: Mock Interview with " + candidateName;
        String html = """
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 6px;">
                <h2 style="color: #09090b; margin-top: 0;">New Mock Session Booked</h2>
                <p>Hello %s,</p>
                <p>A new system design mock session has been booked with you. Here are the details:</p>
                <table style="width: 100%%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-weight: bold; width: 120px;">Candidate:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Topic:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Time:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Video Link:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;"><a href="%s" style="color: #2563eb; text-decoration: underline;">Join Jitsi Call</a></td>
                    </tr>
                </table>
                <p>Please log in to the dashboard after the session to submit star feedback for the candidate.</p>
                <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
                <p style="font-size: 12px; color: #71717a; margin-bottom: 0;">&copy; beingsde.in &mdash; Built for System Architects.</p>
            </div>
            """.formatted(interviewerName, candidateName, topic, formatDateTime(scheduledAt), meetingLink);

        sendEmail(interviewerEmail, subject, html);
    }

    public void sendCancellationEmail(String toEmail, String partnerName, String topic, Instant scheduledAt, String role) {
        String subject = "Cancelled: Mock Interview Session (" + topic + ")";
        String html = """
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 6px;">
                <h2 style="color: #dc2626; margin-top: 0;">Mock Interview Cancelled</h2>
                <p>Hello,</p>
                <p>We are writing to confirm that the mock interview scheduled for <strong>%s</strong> on topic <strong>%s</strong> with <strong>%s</strong> (as %s) has been cancelled.</p>
                <p>If you'd like to reschedule, please visit the mock interview directory on our dashboard.</p>
                <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
                <p style="font-size: 12px; color: #71717a; margin-bottom: 0;">&copy; beingsde.in &mdash; Built for System Architects.</p>
            </div>
            """.formatted(formatDateTime(scheduledAt), topic, partnerName, role);

        sendEmail(toEmail, subject, html);
    }

    public void sendFeedbackEmail(String candidateEmail, String candidateName, String interviewerName, String topic, int score, String notes) {
        String subject = "Feedback Available for Mock Session on " + topic;
        String html = """
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 6px;">
                <h2 style="color: #09090b; margin-top: 0;">Interviewer Feedback Received!</h2>
                <p>Hello %s,</p>
                <p>%s has submitted feedback and evaluation for your recent mock system design interview. Here is the summary:</p>
                <table style="width: 100%%; border-collapse: collapse; margin-bottom: 20px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 4px;">
                    <tr>
                        <td style="padding: 12px; font-weight: bold; width: 120px;">Score:</td>
                        <td style="padding: 12px; color: #eab308; font-size: 16px; font-weight: bold;">%s / 5 ★</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; font-weight: bold; vertical-align: top;">Notes:</td>
                        <td style="padding: 12px; line-height: 1.5; color: #374151;">&ldquo;%s&rdquo;</td>
                    </tr>
                </table>
                <p>Visit your beingsde dashboard to schedule another session and review more design challenges!</p>
                <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
                <p style="font-size: 12px; color: #71717a; margin-bottom: 0;">&copy; beingsde.in &mdash; Built for System Architects.</p>
            </div>
            """.formatted(candidateName, interviewerName, score, notes);

        sendEmail(candidateEmail, subject, html);
    }
}
