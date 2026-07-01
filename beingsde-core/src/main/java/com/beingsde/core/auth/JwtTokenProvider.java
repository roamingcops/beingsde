package com.beingsde.core.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey localKey;
    private final SecretKey supabaseKey;
    private final long expirationMs;
    private final long refreshExpirationMs;

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs,
            @Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationMs,
            @Value("${supabase.jwt-secret}") String supabaseSecret) {
        this.localKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMs = expirationMs;
        this.refreshExpirationMs = refreshExpirationMs;

        if (supabaseSecret != null && !supabaseSecret.isEmpty() && !"placeholder".equals(supabaseSecret)) {
            SecretKey key = null;
            try {
                key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(supabaseSecret));
            } catch (Exception e) {
                key = Keys.hmacShaKeyFor(supabaseSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            }
            this.supabaseKey = key;
        } else {
            this.supabaseKey = null;
        }
    }

    /**
     * Generates an access token that includes the sessionId claim.
     * The sessionId is validated on every request to enforce single-session login.
     */
    public String generateAccessToken(String email, String role, String sessionId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .claim("sid", sessionId)   // session fingerprint
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(localKey)
                .compact();
    }

    public String generateRefreshToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpirationMs);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(localKey)
                .compact();
    }

    private Claims getClaims(String token) {
        if (supabaseKey != null) {
            try {
                return Jwts.parser()
                        .verifyWith(supabaseKey)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();
            } catch (Exception e) {
                // fall back
            }
        }
        return Jwts.parser()
                .verifyWith(localKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getEmailFromToken(String token) {
        Claims claims = getClaims(token);
        String email = claims.get("email", String.class);
        if (email != null) {
            return email; // Supabase token
        }
        return claims.getSubject(); // Local token
    }

    public String getSubjectFromToken(String token) {
        return getClaims(token).getSubject(); // Returns sub UUID for Supabase, email for Local
    }

    public String getRoleFromToken(String token) {
        Claims claims = getClaims(token);
        
        // Supabase app_metadata
        java.util.Map<String, Object> appMetadata = claims.get("app_metadata", java.util.Map.class);
        if (appMetadata != null && appMetadata.containsKey("role")) {
            return (String) appMetadata.get("role");
        }
        
        String role = claims.get("role", String.class);
        if (role != null) {
            return role;
        }
        
        return "FREE_USER";
    }

    /**
     * Extracts the session ID embedded in the JWT at login time.
     * Returns null if claim is absent (e.g. old tokens issued before this feature).
     */
    public String getSessionIdFromToken(String token) {
        Claims claims = getClaims(token);
        
        // Supabase uses 'session_id' claim
        String sid = claims.get("sid", String.class);
        if (sid != null) {
            return sid;
        }
        return claims.get("session_id", String.class);
    }

    public boolean isSupabaseToken(String token) {
        if (supabaseKey == null) {
            return false;
        }
        try {
            Jwts.parser().verifyWith(supabaseKey).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateToken(String token) {
        try {
            if (supabaseKey != null) {
                try {
                    Jwts.parser().verifyWith(supabaseKey).build().parseSignedClaims(token);
                    return true;
                } catch (Exception e) {
                    // fall back
                }
            }
            Jwts.parser().verifyWith(localKey).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
