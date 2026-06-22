package com.beingsde.core.content;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "topics")
public class Topic {

    @Id
    private String id;

    private String title;

    @Indexed(unique = true)
    private String slug;

    private String description;

    private String contentMarkdown;

    private Difficulty difficulty;

    private List<String> tags;

    private String category;

    private int estimatedTimeMinutes;

    private List<String> prerequisites;

    private List<String> relatedTopics;

    private String videoUrl;

    private String pdfUrl;

    private double version;

    private boolean isArchived;

    @CreatedDate
    private Instant createdAt;

    public Topic() {
    }

    public Topic(String id, String title, String slug, String description, String contentMarkdown,
                 Difficulty difficulty, List<String> tags, String category, int estimatedTimeMinutes,
                 List<String> prerequisites, List<String> relatedTopics, String videoUrl, String pdfUrl,
                 double version, boolean isArchived, Instant createdAt) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.contentMarkdown = contentMarkdown;
        this.difficulty = difficulty;
        this.tags = tags;
        this.category = category;
        this.estimatedTimeMinutes = estimatedTimeMinutes;
        this.prerequisites = prerequisites;
        this.relatedTopics = relatedTopics;
        this.videoUrl = videoUrl;
        this.pdfUrl = pdfUrl;
        this.version = version;
        this.isArchived = isArchived;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getContentMarkdown() { return contentMarkdown; }
    public void setContentMarkdown(String contentMarkdown) { this.contentMarkdown = contentMarkdown; }
    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getEstimatedTimeMinutes() { return estimatedTimeMinutes; }
    public void setEstimatedTimeMinutes(int estimatedTimeMinutes) { this.estimatedTimeMinutes = estimatedTimeMinutes; }
    public List<String> getPrerequisites() { return prerequisites; }
    public void setPrerequisites(List<String> prerequisites) { this.prerequisites = prerequisites; }
    public List<String> getRelatedTopics() { return relatedTopics; }
    public void setRelatedTopics(List<String> relatedTopics) { this.relatedTopics = relatedTopics; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    public double getVersion() { return version; }
    public void setVersion(double version) { this.version = version; }
    public boolean isArchived() { return isArchived; }
    public void setArchived(boolean archived) { isArchived = archived; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static TopicBuilder builder() {
        return new TopicBuilder();
    }

    public static class TopicBuilder {
        private String id;
        private String title;
        private String slug;
        private String description;
        private String contentMarkdown;
        private Difficulty difficulty;
        private List<String> tags;
        private String category;
        private int estimatedTimeMinutes;
        private List<String> prerequisites;
        private List<String> relatedTopics;
        private String videoUrl;
        private String pdfUrl;
        private double version;
        private boolean isArchived;
        private Instant createdAt;

        TopicBuilder() {}

        public TopicBuilder id(String id) { this.id = id; return this; }
        public TopicBuilder title(String title) { this.title = title; return this; }
        public TopicBuilder slug(String slug) { this.slug = slug; return this; }
        public TopicBuilder description(String description) { this.description = description; return this; }
        public TopicBuilder contentMarkdown(String contentMarkdown) { this.contentMarkdown = contentMarkdown; return this; }
        public TopicBuilder difficulty(Difficulty difficulty) { this.difficulty = difficulty; return this; }
        public TopicBuilder tags(List<String> tags) { this.tags = tags; return this; }
        public TopicBuilder category(String category) { this.category = category; return this; }
        public TopicBuilder estimatedTimeMinutes(int estimatedTimeMinutes) { this.estimatedTimeMinutes = estimatedTimeMinutes; return this; }
        public TopicBuilder prerequisites(List<String> prerequisites) { this.prerequisites = prerequisites; return this; }
        public TopicBuilder relatedTopics(List<String> relatedTopics) { this.relatedTopics = relatedTopics; return this; }
        public TopicBuilder videoUrl(String videoUrl) { this.videoUrl = videoUrl; return this; }
        public TopicBuilder pdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; return this; }
        public TopicBuilder version(double version) { this.version = version; return this; }
        public TopicBuilder isArchived(boolean isArchived) { this.isArchived = isArchived; return this; }
        public TopicBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Topic build() {
            return new Topic(id, title, slug, description, contentMarkdown, difficulty, tags, category,
                    estimatedTimeMinutes, prerequisites, relatedTopics, videoUrl, pdfUrl, version, isArchived, createdAt);
        }
    }
}
