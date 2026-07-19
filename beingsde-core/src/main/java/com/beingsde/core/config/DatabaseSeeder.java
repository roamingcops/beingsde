package com.beingsde.core.config;

import com.beingsde.core.auth.User;
import com.beingsde.core.auth.UserRepository;
import com.beingsde.core.auth.UserRole;
import com.beingsde.core.content.Topic;
import com.beingsde.core.content.TopicRepository;
import com.beingsde.core.content.lld.LldItem;
import com.beingsde.core.content.lld.LldRepository;
import com.beingsde.core.content.dsa.DsaQuestion;
import com.beingsde.core.content.dsa.DsaRepository;
import com.beingsde.core.content.hld.HldQuestion;
import com.beingsde.core.content.hld.HldQuestionRepository;
import com.beingsde.core.content.barraiser.BarRaiserQuestion;
import com.beingsde.core.content.barraiser.BarRaiserRepository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.time.Instant;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TopicRepository topicRepository;
    private final LldRepository lldRepository;
    private final DsaRepository dsaRepository;
    private final HldQuestionRepository hldQuestionRepository;
    private final BarRaiserRepository barRaiserRepository;
    private final ObjectMapper objectMapper;

    public DatabaseSeeder(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          TopicRepository topicRepository,
                          LldRepository lldRepository,
                          DsaRepository dsaRepository,
                          HldQuestionRepository hldQuestionRepository,
                          BarRaiserRepository barRaiserRepository,
                          ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.topicRepository = topicRepository;
        this.lldRepository = lldRepository;
        this.dsaRepository = dsaRepository;
        this.hldQuestionRepository = hldQuestionRepository;
        this.barRaiserRepository = barRaiserRepository;
        this.objectMapper = objectMapper;
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

        // 3. Seed HLD Topics
        if (topicRepository.count() == 0) {
            try {
                File file = new File("/Users/arnavagarwal/beingsde/beingsde-ui/src/data/topics.json");
                if (file.exists()) {
                    List<Topic> topics = objectMapper.readValue(file, new TypeReference<List<Topic>>() {});
                    topics.forEach(t -> {
                        t.setArchived(false);
                        if (t.getCreatedAt() == null) t.setCreatedAt(Instant.now());
                    });
                    topicRepository.saveAll(topics);
                    System.out.println(">>> Seeded " + topics.size() + " HLD Topics");
                }
            } catch (Exception e) {
                System.err.println("Failed to seed HLD Topics: " + e.getMessage());
            }
        }

        // 4. Seed LLD Items
        if (lldRepository.count() == 0) {
            try {
                File file = new File("/Users/arnavagarwal/beingsde/beingsde-ui/src/data/lld.json");
                if (file.exists()) {
                    List<LldItem> items = objectMapper.readValue(file, new TypeReference<List<LldItem>>() {});
                    items.forEach(t -> {
                        t.setArchived(false);
                        if (t.getCreatedAt() == null) t.setCreatedAt(Instant.now());
                    });
                    lldRepository.saveAll(items);
                    System.out.println(">>> Seeded " + items.size() + " LLD Questions");
                }
            } catch (Exception e) {
                System.err.println("Failed to seed LLD items: " + e.getMessage());
            }
        }

        // 5. Seed DSA Questions
        if (dsaRepository.count() == 0) {
            try {
                File file = new File("/Users/arnavagarwal/beingsde/beingsde-ui/src/data/dsa.json");
                if (file.exists()) {
                    List<DsaQuestion> questions = objectMapper.readValue(file, new TypeReference<List<DsaQuestion>>() {});
                    questions.forEach(t -> {
                        t.setArchived(false);
                        if (t.getCreatedAt() == null) t.setCreatedAt(Instant.now());
                    });
                    dsaRepository.saveAll(questions);
                    System.out.println(">>> Seeded " + questions.size() + " DSA Questions");
                }
            } catch (Exception e) {
                System.err.println("Failed to seed DSA questions: " + e.getMessage());
            }
        }

        // 6. Seed HLD (System Design) Questions
        if (hldQuestionRepository.count() == 0) {
            try {
                File file = new File("/Users/arnavagarwal/beingsde/beingsde-ui/src/data/hld-questions.json");
                if (file.exists()) {
                    List<HldQuestion> questions = objectMapper.readValue(file, new TypeReference<List<HldQuestion>>() {});
                    questions.forEach(t -> {
                        t.setArchived(false);
                        if (t.getCreatedAt() == null) t.setCreatedAt(Instant.now());
                    });
                    hldQuestionRepository.saveAll(questions);
                    System.out.println(">>> Seeded " + questions.size() + " HLD Questions");
                }
            } catch (Exception e) {
                System.err.println("Failed to seed HLD questions: " + e.getMessage());
            }
        }

        // 7. Seed Bar Raiser Questions
        if (barRaiserRepository.count() == 0) {
            try {
                File file = new File("/Users/arnavagarwal/beingsde/beingsde-ui/src/data/bar-raiser.json");
                if (file.exists()) {
                    List<BarRaiserQuestion> questions = objectMapper.readValue(file, new TypeReference<List<BarRaiserQuestion>>() {});
                    questions.forEach(t -> {
                        t.setArchived(false);
                        if (t.getCreatedAt() == null) t.setCreatedAt(Instant.now());
                    });
                    barRaiserRepository.saveAll(questions);
                    System.out.println(">>> Seeded " + questions.size() + " Bar Raiser Questions");
                }
            } catch (Exception e) {
                System.err.println("Failed to seed Bar Raiser questions: " + e.getMessage());
            }
        }
    }
}
