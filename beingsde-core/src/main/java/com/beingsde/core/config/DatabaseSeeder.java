package com.beingsde.core.config;

import com.beingsde.core.auth.User;
import com.beingsde.core.auth.UserRepository;
import com.beingsde.core.auth.UserRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Admin User
        String adminEmail = "admin@beingsde.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .name("SDE Admin")
                    .email(adminEmail)
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(UserRole.ADMIN)
                    .emailVerified(true)
                    .isDeleted(false)
                    .createdAt(Instant.now())
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Seeded Admin User: " + adminEmail + " / admin123");
        }

        // 2. Seed Test User
        String testEmail = "testuser@beingsde.com";
        if (userRepository.findByEmail(testEmail).isEmpty()) {
            User testUser = User.builder()
                    .name("Test User")
                    .email(testEmail)
                    .passwordHash(passwordEncoder.encode("testuser123"))
                    .role(UserRole.PREMIUM_USER) // Seed as premium so they can test locked designs
                    .emailVerified(true)
                    .isDeleted(false)
                    .createdAt(Instant.now())
                    .build();
            userRepository.save(testUser);
            System.out.println(">>> Seeded Premium Test User: " + testEmail + " / testuser123");
        }
    }
}
