package com.beingsde.core.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Sends transactional emails via the Resend REST API.
 * No SMTP configuration required — only the RESEND_API_KEY env var.
 *
 * Resend docs: https://resend.com/docs/api-reference/emails/send-email
 */
@Service
public class PasswordResetEmailService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetEmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.resend.api-key}")
    private String resendApiKey;

    @Value("${app.resend.from-address:onboarding@resend.dev}")
    private String fromAddress;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    /**
     * Sends a password reset email with a styled HTML body.
     * The one-time reset link embeds the token and points to the frontend /reset-password page.
     */
    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = baseUrl + "/reset-password?token=" + token;
        String html = buildResetEmailHtml(resetLink);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey);

        Map<String, Object> body = Map.of(
                "from",    "beingsde <" + fromAddress + ">",
                "to",      List.of(toEmail),
                "subject", "Reset your beingsde password",
                "html",    html
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(RESEND_API_URL, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Password reset email sent to {} via Resend (id={})",
                        toEmail, response.getBody() != null ? response.getBody().get("id") : "unknown");
            } else {
                throw new RuntimeException("Resend API returned status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Failed to send password reset email to {} via Resend: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send reset email. Please try again later.", e);
        }
    }

    private String buildResetEmailHtml(String resetLink) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset your beingsde password</title>
            </head>
            <body style="margin:0;padding:0;background-color:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafafa;padding:40px 0;">
                <tr>
                  <td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" border="0"
                           style="background:#ffffff;border:1px solid #e4e4e7;border-radius:4px;overflow:hidden;">

                      <!-- Header -->
                      <tr>
                        <td style="padding:28px 40px;border-bottom:1px solid #e4e4e7;">
                          <span style="font-family:monospace;font-size:18px;font-weight:800;
                                       border:1.5px solid #09090b;padding:4px 8px;border-radius:3px;
                                       color:#09090b;letter-spacing:-0.5px;">
                            beingsde
                          </span>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding:40px 40px 32px;">
                          <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;
                                     color:#09090b;letter-spacing:-0.5px;line-height:1.2;">
                            Reset your password
                          </h1>
                          <p style="margin:0 0 24px;font-size:14px;color:#71717a;line-height:1.6;">
                            We received a request to reset the password for your beingsde account.
                            Click the button below to choose a new password.
                            This link is valid for <strong style="color:#09090b;">1 hour</strong>.
                          </p>

                          <!-- CTA Button -->
                          <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                            <tr>
                              <td style="background:#09090b;border-radius:3px;">
                                <a href="%s"
                                   style="display:inline-block;padding:14px 28px;
                                          font-size:13px;font-weight:700;letter-spacing:0.08em;
                                          text-transform:uppercase;color:#fafafa;
                                          text-decoration:none;">
                                  Set New Password
                                </a>
                              </td>
                            </tr>
                          </table>

                          <!-- Fallback link -->
                          <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;">
                            Button not working? Copy and paste this link into your browser:
                          </p>
                          <p style="margin:0 0 32px;font-size:12px;word-break:break-all;">
                            <a href="%s" style="color:#09090b;">%s</a>
                          </p>

                          <!-- Warning -->
                          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:3px;
                                      padding:12px 16px;margin-bottom:8px;">
                            <p style="margin:0;font-size:12px;color:#dc2626;line-height:1.5;">
                              <strong>Didn&apos;t request this?</strong>
                              You can safely ignore this email. Your password will not change unless
                              you click the link above.
                            </p>
                          </div>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding:20px 40px;border-top:1px solid #e4e4e7;
                                   background:#fafafa;">
                          <p style="margin:0;font-size:11px;color:#a1a1aa;line-height:1.5;">
                            &copy; 2026 beingsde.in &mdash; Built for System Architects.<br>
                            Questions? Email us at
                            <a href="mailto:support@beingsde.in"
                               style="color:#71717a;text-decoration:underline;">
                              support@beingsde.in
                            </a>
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(resetLink, resetLink, resetLink);
    }
}
