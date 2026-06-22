package com.beingsde.core.content;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TopicRepository extends MongoRepository<Topic, String> {
    Optional<Topic> findBySlug(String slug);
    Page<Topic> findByDifficulty(Difficulty difficulty, Pageable pageable);
    Page<Topic> findByTagsIn(List<String> tags, Pageable pageable);
    Page<Topic> findByDifficultyAndTagsIn(Difficulty difficulty, List<String> tags, Pageable pageable);
}
