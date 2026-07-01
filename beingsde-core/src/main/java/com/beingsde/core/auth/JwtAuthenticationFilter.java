package com.beingsde.core.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final SessionStore sessionStore;
    private final UserRepository userRepo;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, SessionStore sessionStore, UserRepository userRepo) {
        this.tokenProvider = tokenProvider;
        this.sessionStore = sessionStore;
        this.userRepo = userRepo;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String email = tokenProvider.getEmailFromToken(jwt);
                String role = tokenProvider.getRoleFromToken(jwt);
                boolean isSupabase = tokenProvider.isSupabaseToken(jwt);

                if (isSupabase) {
                    String sub = tokenProvider.getSubjectFromToken(jwt);
                    // Sync user with MongoDB
                    User user = userRepo.findByEmail(email).orElseGet(() -> {
                        User newUser = User.builder()
                                .id(sub) // Map MongoDB ID to Supabase sub UUID
                                .email(email)
                                .name(email.split("@")[0])
                                .role(UserRole.FREE_USER)
                                .emailVerified(true)
                                .isDeleted(false)
                                .build();
                        return userRepo.save(newUser);
                    });
                    
                    // Always use role from MongoDB to ensure payment upgrades apply in real-time
                    role = user.getRole().name();
                } else {
                    // ── Single-session enforcement ──────────────────────────────────────
                    // If the sessionId in the JWT doesn't match what's stored in Redis,
                    // the user has logged in from another device. Reject this request.
                    String sessionId = tokenProvider.getSessionIdFromToken(jwt);
                    if (!sessionStore.isValid(email, sessionId)) {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setHeader("X-Session-Invalidated", "true");
                        response.setContentType("application/json");
                        response.getWriter().write(
                                "{\"message\":\"Session expired. Your account was signed in from another device.\",\"code\":\"SESSION_INVALIDATED\"}"
                        );
                        return; // stop filter chain — do NOT let this request through
                    }
                    // ───────────────────────────────────────────────────────────────────
                }

                List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + role)
                );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            // Malformed or expired token — let Spring Security handle the 401
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
