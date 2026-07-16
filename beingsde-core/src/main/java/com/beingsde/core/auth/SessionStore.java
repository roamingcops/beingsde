package com.beingsde.core.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

/**
 * Manages the single-session fingerprint for each user in MongoDB.
 *
 * When a user logs in a new device the record is overwritten, making every
 * previously issued JWT immediately invalid on the next request.
 */
@Service
public class SessionStore {

    private static final Logger log = LoggerFactory.getLogger(SessionStore.class);
    private static final long SESSION_TTL_DAYS = 7;

    private final UserSessionRepository sessionRepository;

    public SessionStore(UserSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    /**
     * Saves the active sessionId for the user, overwriting any previous session.
     * Called at login — this is what invalidates all other active sessions.
     */
    public void save(String email, String sessionId) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                Instant expiresAt = Instant.now().plus(SESSION_TTL_DAYS, ChronoUnit.DAYS);
                UserSession session = new UserSession(email, sessionId, expiresAt);
                sessionRepository.save(session);
                log.debug("Session saved in MongoDB for {}: {}", email, sessionId);
            } catch (Exception e) {
                log.error("MongoDB unavailable — could not save session for {}: {}", email, e.getMessage());
            }
        });
    }

    /**
     * Returns true if the given sessionId matches the currently active session
     * stored in MongoDB for this email. Returns false on errors (fail closed)
     * to strictly enforce single session.
     */
    public boolean isValid(String email, String sessionId) {
        if (sessionId == null) {
            // Tokens without a sid claim (issued before this feature) are allowed through
            return true;
        }
        try {
            Optional<UserSession> stored = sessionRepository.findById(email);
            if (stored.isPresent()) {
                // Optionally check expiration
                if (stored.get().getExpiresAt().isBefore(Instant.now())) {
                    sessionRepository.deleteById(email);
                    return false;
                }
                return sessionId.equals(stored.get().getSessionId());
            }
            return false;
        } catch (Exception e) {
            log.error("MongoDB unavailable — failing closed for session check on {}: {}", email, e.getMessage());
            return false; // fail closed: strictly enforce single session
        }
    }

    /**
     * Removes the session entry. Called on explicit logout.
     */
    public void invalidate(String email) {
        try {
            sessionRepository.deleteById(email);
            log.debug("Session invalidated for {}", email);
        } catch (Exception e) {
            log.error("MongoDB unavailable — could not invalidate session for {}: {}", email, e.getMessage());
        }
    }
}
