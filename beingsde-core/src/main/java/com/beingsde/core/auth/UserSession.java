package com.beingsde.core.auth;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "user_sessions")
public class UserSession {

    @Id
    private String email;

    private String sessionId;

    private Instant expiresAt;

    public UserSession() {}

    public UserSession(String email, String sessionId, Instant expiresAt) {
        this.email = email;
        this.sessionId = sessionId;
        this.expiresAt = expiresAt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}
