package com.beingsde.core.auth;

import com.beingsde.core.auth.dto.AuthResponse;
import com.beingsde.core.auth.dto.ForgotPasswordRequest;
import com.beingsde.core.auth.dto.LoginRequest;
import com.beingsde.core.auth.dto.RegisterRequest;
import com.beingsde.core.auth.dto.ResetPasswordRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final PasswordResetEmailService emailService;
    private final SessionStore sessionStore;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider tokenProvider,
                          PasswordResetEmailService emailService,
                          SessionStore sessionStore) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
        this.sessionStore = sessionStore;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email address already in use"));
        }

        // Assign a random default avatar
        int randomAvatarNum = new java.util.Random().nextInt(10) + 1;
        User.Profile defaultProfile = new User.Profile();
        defaultProfile.setAvatarUrl("/avatars/avatar-" + randomAvatarNum + ".png");

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.FREE_USER)
                .emailVerified(false)
                .verificationToken(UUID.randomUUID().toString())
                .profile(defaultProfile)
                .isDeleted(false)
                .build();

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "userId", user.getId(),
                        "email", user.getEmail(),
                        "status", "PENDING_VERIFICATION",
                        "verificationToken", user.getVerificationToken() // returned for easy simulation/testing in dev
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        // Generate a unique session fingerprint and store it in Redis.
        // This overwrites any existing session, kicking out other active devices.
        String sessionId = UUID.randomUUID().toString();
        sessionStore.save(user.getEmail(), sessionId);

        String accessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getRole().name(), sessionId);
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, user.getRole().name()));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    /**
     * Logs out the currently authenticated user by removing their session from Redis.
     * Their JWT will be rejected on the next request.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal String email) {
        if (email != null) {
            sessionStore.invalidate(email);
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    /**
     * Step 1 of the reset flow: accepts an email address, generates a short-lived
     * reset token (1 hour TTL) and emails it to the user.
     *
     * Always returns 200 OK regardless of whether the email exists, to prevent
     * user enumeration attacks.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetPasswordToken(token);
            user.setResetPasswordExpires(Instant.now().plusSeconds(3600)); // 1 hour
            userRepository.save(user);

            try {
                emailService.sendPasswordResetEmail(user.getEmail(), token);
            } catch (Exception e) {
                // Log the failure but keep the token stored — user can retry
            }
        });

        return ResponseEntity.ok(Map.of(
                "message", "If an account with that email exists, a password reset link has been sent."
        ));
    }

    /**
     * Step 2 of the reset flow: validates the reset token and updates the password.
     * The token is consumed (cleared) after a single successful use.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (user.getResetPasswordExpires() == null
                || Instant.now().isAfter(user.getResetPasswordExpires())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Reset token has expired. Please request a new one."));
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpires(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully. You can now sign in."));
    }
}
