package com.beingsde.core.content;

import com.beingsde.core.featureflags.FeatureFlagService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/topics")
public class TopicController {

    private final TopicRepository topicRepository;
    private final FeatureFlagService featureFlagService;

    public TopicController(TopicRepository topicRepository,
                           FeatureFlagService featureFlagService) {
        this.topicRepository = topicRepository;
        this.featureFlagService = featureFlagService;
    }

    @GetMapping
    public ResponseEntity<Page<Topic>> getAllTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "title,asc") String sort,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) List<String> tags) {

        String[] sortParts = sort.split(",");
        Sort sorting = Sort.by(Sort.Direction.fromString(sortParts[1]), sortParts[0]);
        Pageable pageable = PageRequest.of(page, size, sorting);

        Page<Topic> topics;

        if (difficulty != null && tags != null && !tags.isEmpty()) {
            topics = topicRepository.findByDifficultyAndTagsIn(difficulty, tags, pageable);
        } else if (difficulty != null) {
            topics = topicRepository.findByDifficulty(difficulty, pageable);
        } else if (tags != null && !tags.isEmpty()) {
            topics = topicRepository.findByTagsIn(tags, pageable);
        } else {
            topics = topicRepository.findAll(pageable);
        }

        // Project summaries (hide sensitive markdown content, pdfs, and videos from listings)
        Page<Topic> summaries = topics.map(t -> Topic.builder()
                .id(t.getId())
                .title(t.getTitle())
                .slug(t.getSlug())
                .description(t.getDescription())
                .difficulty(t.getDifficulty())
                .tags(t.getTags())
                .category(t.getCategory())
                .estimatedTimeMinutes(t.getEstimatedTimeMinutes())
                .isArchived(t.isArchived())
                .createdAt(t.getCreatedAt())
                .build());

        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getTopicBySlug(@PathVariable String slug) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Topic not found with slug: " + slug));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = "anonymous";
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            userId = (String) auth.getPrincipal();
        }

        // Evaluate feature flag: topic_{slug}
        String flagKey = "topic_" + slug.replace("-", "_");
        boolean isAccessible = featureFlagService.evaluate(userId, flagKey);

        if (!isAccessible) {
            // Return locked preview of the topic (RFC 7807 like detail payload)
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "type", "https://api.beingsde.com/errors/insufficient-permissions",
                            "title", "Content Locked",
                            "status", 403,
                            "detail", "The topic is premium content. Please upgrade your subscription tier to access this module.",
                            "instance", "/api/v1/topics/" + slug,
                            "preview", Map.of(
                                    "title", topic.getTitle(),
                                    "slug", topic.getSlug(),
                                    "description", topic.getDescription(),
                                    "difficulty", topic.getDifficulty()
                            )
                    ));
        }

        return ResponseEntity.ok(topic);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Topic> createTopic(@RequestBody Topic topic) {
        topic.setArchived(false);
        Topic saved = topicRepository.save(topic);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTopic(@PathVariable String id, @RequestBody Topic topic) {
        if (!topicRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        topic.setId(id);
        return ResponseEntity.ok(topicRepository.save(topic));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> archiveTopic(@PathVariable String id) {
        Topic topic = topicRepository.findById(id).orElse(null);
        if (topic == null) return ResponseEntity.notFound().build();
        topic.setArchived(true);
        topicRepository.save(topic);
        return ResponseEntity.ok(Map.of("message", "Topic archived"));
    }
}
