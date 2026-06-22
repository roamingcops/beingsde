package com.beingsde.core.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetEmailService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetEmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    @Value("${spring.mail.username:noreply@beingsde.com}")
    private String fromAddress;

    public PasswordResetEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends a password reset email containing a one-time link with the reset token.
     * The link directs the user to the frontend reset-password page.
     */
    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = baseUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Reset your beingsde password");
        message.setText(
                "Hello,\n\n" +
                "You requested a password reset for your beingsde account.\n\n" +
                "Click the link below to set a new password (valid for 1 hour):\n" +
                resetLink + "\n\n" +
                "If you didn't request this, you can safely ignore this email.\n\n" +
                "— The beingsde team"
        );

        try {
            mailSender.send(message);
            log.info("Password reset email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            // Re-throw so the controller can handle gracefully
            throw new RuntimeException("Failed to send reset email. Please try again later.", e);
        }
    }
}
