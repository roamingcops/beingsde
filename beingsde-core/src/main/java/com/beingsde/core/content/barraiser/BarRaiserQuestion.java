package com.beingsde.core.content.barraiser;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "bar_raiser_questions")
public class BarRaiserQuestion {

    @Id
    private String id;

    private String title;

    private String category;

    private String principle;

    private String why;

    private List<String> redFlags;

    private List<String> greenFlags;

    private List<LevelAnswer> levels;

    private boolean isArchived;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    // Nested class
    public static class LevelAnswer {
        private String level; // SDE1, SDE2, SDE3, Principal
        private String focus;
        private String situation;
        private String task;
        private String action;
        private String result;
        private String keyTakeaway;

        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public String getFocus() { return focus; }
        public void setFocus(String focus) { this.focus = focus; }
        public String getSituation() { return situation; }
        public void setSituation(String situation) { this.situation = situation; }
        public String getTask() { return task; }
        public void setTask(String task) { this.task = task; }
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public String getResult() { return result; }
        public void setResult(String result) { this.result = result; }
        public String getKeyTakeaway() { return keyTakeaway; }
        public void setKeyTakeaway(String keyTakeaway) { this.keyTakeaway = keyTakeaway; }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getPrinciple() { return principle; }
    public void setPrinciple(String principle) { this.principle = principle; }
    public String getWhy() { return why; }
    public void setWhy(String why) { this.why = why; }
    public List<String> getRedFlags() { return redFlags; }
    public void setRedFlags(List<String> redFlags) { this.redFlags = redFlags; }
    public List<String> getGreenFlags() { return greenFlags; }
    public void setGreenFlags(List<String> greenFlags) { this.greenFlags = greenFlags; }
    public List<LevelAnswer> getLevels() { return levels; }
    public void setLevels(List<LevelAnswer> levels) { this.levels = levels; }
    public boolean isArchived() { return isArchived; }
    public void setArchived(boolean archived) { isArchived = archived; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
