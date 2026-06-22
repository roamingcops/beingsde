package com.beingsde.core.billing;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "idempotency_keys")
public class IdempotencyKey {

    @Id
    private String id;

    @Indexed(unique = true)
    private String eventId;

    private Instant processedAt;

    private String status;

    public IdempotencyKey() {
    }

    public IdempotencyKey(String id, String eventId, Instant processedAt, String status) {
        this.id = id;
        this.eventId = eventId;
        this.processedAt = processedAt;
        this.status = status;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public Instant getProcessedAt() { return processedAt; }
    public void setProcessedAt(Instant processedAt) { this.processedAt = processedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static IdempotencyKeyBuilder builder() {
        return new IdempotencyKeyBuilder();
    }

    public static class IdempotencyKeyBuilder {
        private String id;
        private String eventId;
        private Instant processedAt;
        private String status;

        IdempotencyKeyBuilder() {}

        public IdempotencyKeyBuilder id(String id) { this.id = id; return this; }
        public IdempotencyKeyBuilder eventId(String eventId) { this.eventId = eventId; return this; }
        public IdempotencyKeyBuilder processedAt(Instant processedAt) { this.processedAt = processedAt; return this; }
        public IdempotencyKeyBuilder status(String status) { this.status = status; return this; }

        public IdempotencyKey build() {
            return new IdempotencyKey(id, eventId, processedAt, status);
        }
    }
}
