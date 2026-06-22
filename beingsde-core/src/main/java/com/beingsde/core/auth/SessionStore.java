package com.beingsde.core.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Manages the single-session fingerprint for each user in Redis.
 *
 * Key format : session:{email}
 * Value      : sessionId (UUID string)
 * TTL        : 7 days (matches refresh token lifetime)
 *
 * When a user logs in a new device the key is overwritten, making every
 * previously issued JWT immediately invalid on the next request.
 */
@Service
public class SessionStore {

    private static final Logger log = LoggerFactory.getLogger(SessionStore.class);
    private static final String PREFIX = "session:";
    private static final long SESSION_TTL_DAYS = 7;

    private final StringRedisTemplate redis;

    public SessionStore(StringRedisTemplate redis) {
        this.redis = redis;
    }

    /**
     * Saves the active sessionId for the user, overwriting any previous session.
     * Called at login — this is what invalidates all other active sessions.
     */
    public void save(String email, String sessionId) {
        try {
            redis.opsForValue().set(key(email), sessionId, SESSION_TTL_DAYS, TimeUnit.DAYS);
            log.debug("Session saved for {}: {}", email, sessionId);
        } catch (Exception e) {
            // If Redis is down we fail open (log but don't block login)
            log.error("Redis unavailable — could not save session for {}: {}", email, e.getMessage());
        }
    }

    /**
     * Returns true if the given sessionId matches the currently active session
     * stored in Redis for this email. Returns true on Redis errors (fail open)
     * to avoid locking users out due to infrastructure issues.
     */
    public boolean isValid(String email, String sessionId) {
        if (sessionId == null) {
            // Tokens without a sid claim (issued before this feature) are allowed through
            return true;
        }
        try {
            String stored = redis.opsForValue().get(key(email));
            return sessionId.equals(stored);
        } catch (Exception e) {
            log.error("Redis unavailable — failing open for session check on {}: {}", email, e.getMessage());
            return true; // fail open: don't lock out users if Redis is down
        }
    }

    /**
     * Removes the session entry. Called on explicit logout.
     */
    public void invalidate(String email) {
        try {
            redis.delete(key(email));
            log.debug("Session invalidated for {}", email);
        } catch (Exception e) {
            log.error("Redis unavailable — could not invalidate session for {}: {}", email, e.getMessage());
        }
    }

    private String key(String email) {
        return PREFIX + email;
    }
}
