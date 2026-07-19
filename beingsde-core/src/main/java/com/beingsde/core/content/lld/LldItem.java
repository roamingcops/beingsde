package com.beingsde.core.content.lld;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Document(collection = "lld_questions")
public class LldItem {

    @Id
    private String id;

    private int questionId;

    private String title;

    @Indexed(unique = true)
    private String slug;

    private String difficulty;

    private String tag;

    private List<String> patterns;

    private String summary;

    private List<String> requirements;

    private String erDiagram;

    private List<String> classes;

    private Map<String, String> languages;  // { java, cpp, python }

    private String approach;

    private boolean isArchived;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public int getQuestionId() { return questionId; }
    public void setQuestionId(int questionId) { this.questionId = questionId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }
    public List<String> getPatterns() { return patterns; }
    public void setPatterns(List<String> patterns) { this.patterns = patterns; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public List<String> getRequirements() { return requirements; }
    public void setRequirements(List<String> requirements) { this.requirements = requirements; }
    public String getErDiagram() { return erDiagram; }
    public void setErDiagram(String erDiagram) { this.erDiagram = erDiagram; }
    public List<String> getClasses() { return classes; }
    public void setClasses(List<String> classes) { this.classes = classes; }
    public Map<String, String> getLanguages() { return languages; }
    public void setLanguages(Map<String, String> languages) { this.languages = languages; }
    public String getApproach() { return approach; }
    public void setApproach(String approach) { this.approach = approach; }
    public boolean isArchived() { return isArchived; }
    public void setArchived(boolean archived) { isArchived = archived; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
