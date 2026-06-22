# Database Schema Design - beingsde

This document defines the MongoDB collections, models, indexing strategies, and common aggregation queries for the **beingsde** platform.

---

## 1. MongoDB Collections & Indexing Strategies

### 1. `users`
Stores user profile information, roles, credentials, and configuration.
* **Indexes**:
  * `{ "email": 1 }` (Unique, ascending)
  * `{ "role": 1 }` (Ascending)
  * `{ "createdAt": 1 }` (Ascending)

```json
{
  "_id": {"$oid": "60c72b2f9b1d8a234a9e1e20"},
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "passwordHash": "$2a$12$K1r...",
  "role": "FREE_USER",
  "emailVerified": true,
  "verificationToken": "abc-123-xyz",
  "resetPasswordToken": null,
  "resetPasswordExpires": null,
  "profile": {
    "avatarUrl": "https://cdn.beingsde.com/avatars/jane.png",
    "headline": "Software Engineer II at TechCorp",
    "githubUrl": "https://github.com/janedoe",
    "linkedinUrl": "https://linkedin.com/in/janedoe"
  },
  "createdAt": {"$date": "2026-06-20T10:00:00Z"},
  "updatedAt": {"$date": "2026-06-22T12:00:00Z"},
  "isDeleted": false
}
```

### 2. `topics`
Core educational content representing High-Level Design, Low-Level Design, or other modules.
* **Indexes**:
  * `{ "slug": 1 }` (Unique, ascending)
  * `{ "difficulty": 1 }` (Ascending)
  * `{ "tags": 1 }` (Multikey index, ascending)
  * `{ "difficulty": 1, "tags": 1 }` (Compound index)

```json
{
  "_id": {"$oid": "60c72b2f9b1d8a234a9e1e21"},
  "title": "Design a Distributed Caching System (Redis)",
  "slug": "design-distributed-caching-redis",
  "description": "Learn how to architect a fault-tolerant, horizontally scalable caching cluster.",
  "contentMarkdown": "# Introduction...",
  "difficulty": "HARD",
  "tags": ["Redis", "Caching", "Distributed Systems"],
  "category": "High-Level Design",
  "estimatedTimeMinutes": 45,
  "prerequisites": ["Consistent Hashing Basic"],
  "relatedTopics": [{"$oid": "60c72b2f9b1d8a234a9e1e28"}],
  "videoUrl": "https://cdn.beingsde.com/videos/redis_hld_720p.mp4",
  "pdfUrl": "https://cdn.beingsde.com/pdfs/redis_hld_notes.pdf",
  "version": 1.2,
  "isArchived": false,
  "createdAt": {"$date": "2026-06-21T08:00:00Z"}
}
```

### 3. `tags`
Categorization labels for tagging system design challenges.
* **Indexes**:
  * `{ "name": 1 }` (Unique, ascending)

```json
{
  "_id": {"$oid": "60c72b2f9b1d8a234a9e1e22"},
  "name": "Redis",
  "description": "In-memory database used for caching, pub/sub, and lock management."
}
```

### 4. `progress`
Records individual completion tracking and view states of topics.
* **Indexes**:
  * `{ "userId": 1, "topicId": 1 }` (Unique compound index)
  * `{ "userId": 1, "completedAt": 1 }` (Compound index for learning analytics)

```json
{
  "_id": {"$oid": "60c72b2f9b1d8a234a9e1e23"},
  "userId": {"$oid": "60c72b2f9b1d8a234a9e1e20"},
  "topicId": {"$oid": "60c72b2f9b1d8a234a9e1e21"},
  "isCompleted": true,
  "viewCount": 5,
  "totalTimeSpentSeconds": 1800,
  "lastViewedAt": {"$date": "2026-06-22T14:30:00Z"},
  "completedAt": {"$date": "2026-06-22T14:30:00Z"}
}
```

### 5. `subscriptions`
Maintains user billing packages, access rules, and expiration boundaries.
* **Indexes**:
  * `{ "userId": 1 }` (Ascending)
  * `{ "status": 1 }` (Ascending)
  * `{ "expiresAt": 1 }` (Ascending)

```json
{
  "_id": {"$oid": "60c72b2f9b1d8a234a9e1e24"},
  "userId": {"$oid": "60c72b2f9b1d8a234a9e1e20"},
  "tier": "PREMIUM",
  "status": "ACTIVE",
  "razorpaySubscriptionId": "sub_HlD278Jdskj",
  "startedAt": {"$date": "2026-06-21T00:00:00Z"},
  "expiresAt": {"$date": "2026-07-21T00:00:00Z"},
  "autoRenew": true,
  "createdAt": {"$date": "2026-06-21T00:00:00Z"}
}
```

### 6. `payments`
Tracks financial transactional state, invoices, and webhooks processing.
* **Indexes**:
  * `{ "razorpayPaymentId": 1 }` (Unique, ascending)
  * `{ "razorpayOrderId": 1 }` (Unique, ascending)
  * `{ "userId": 1 }` (Ascending)

```json
{
  "_id": {"$oid": "60c72b2f9b1d8a234a9e1e25"},
  "userId": {"$oid": "60c72b2f9b1d8a234a9e1e20"},
  "razorpayPaymentId": "pay_HlD23kds902",
  "razorpayOrderId": "order_HlD23kds901",
  "razorpaySignature": "e45ba...",
  "amountInPaise": 299900,
  "currency": "INR",
  "status": "CAPTURED",
  "paymentMethod": "UPI",
  "invoicePdfUrl": "https://cdn.beingsde.com/invoices/INV-2026-001.pdf",
  "createdAt": {"$date": "2026-06-21T00:05:00Z"}
}
```

### 7. `feature_flags`
Controls content/code gating details.
* **Indexes**:
  * `{ "key": 1 }` (Unique, ascending)

```json
{
  "_id": {"$oid": "60c72b2f9b1d8a234a9e1e26"},
  "key": "topic_redis_basic",
  "description": "Access gating for basic Redis caching challenge.",
  "globallyEnabled": false,
  "globallyDisabled": false,
  "rolloutPercentage": 50,
  "allowedSubscriptionTiers": ["FREE", "PREMIUM"],
  "allowedRoles": ["PREMIUM_USER", "ADMIN", "INTERVIEWER"],
  "launchDate": {"$date": "2026-06-01T00:00:00Z"},
  "createdAt": {"$date": "2026-05-20T12:00:00Z"}
}
```

### 8. `interviews`
Schedule records for mock interviews matching candidates to interviewers.
* **Indexes**:
  * `{ "userId": 1 }` (Ascending)
  * `{ "interviewerId": 1 }` (Ascending)
  * `{ "startTime": 1 }` (Ascending)

```json
{
  "_id": {"$oid": "60c72b2f9b1d8a234a9e1e27"},
  "userId": {"$oid": "60c72b2f9b1d8a234a9e1e20"},
  "interviewerId": {"$oid": "60c72b2f9b1d8a234a9e1e30"},
  "type": "HLD",
  "experienceLevel": "MID_LEVEL",
  "status": "SCHEDULED",
  "startTime": {"$date": "2026-06-25T15:00:00Z"},
  "endTime": {"$date": "2026-06-25T16:00:00Z"},
  "zoomLink": "https://zoom.us/j/9876543210",
  "calendarEventId": "cal_abc123",
  "notes": "Focused on scalability, database selection, and database replication.",
  "createdAt": {"$date": "2026-06-22T09:00:00Z"}
}
```

### 9. `interview_feedback`
Premium evaluation reports created by the interviewer for a mock candidate.
* **Indexes**:
  * `{ "interviewId": 1 }` (Unique, ascending)

```json
{
  "_id": {"$oid": "60c72b2f9b1d8a234a9e1e28"},
  "interviewId": {"$oid": "60c72b2f9b1d8a234a9e1e27"},
  "candidateId": {"$oid": "60c72b2f9b1d8a234a9e1e20"},
  "interviewerId": {"$oid": "60c72b2f9b1d8a234a9e1e30"},
  "scores": {
    "systemRequirements": 4,
    "apiDesign": 3,
    "databaseSelection": 4,
    "scaleAndBottlenecks": 5,
    "communication": 4
  },
  "overallScore": 4.0,
  "strengths": "Strong command of consistency trade-offs (CAP theorem) and multi-region read replicas.",
  "improvementAreas": "Need to define API schemas more clearly before jumping into system architecture diagrams.",
  "detailedReportMarkdown": "# Mock Interview Feedback Report...",
  "createdAt": {"$date": "2026-06-25T17:00:00Z"}
}
```

### 10. `analytics_events`
Clickstream telemetry log for analytics conversion funnel metrics.
* **Indexes**:
  * `{ "eventType": 1 }` (Ascending)
  * `{ "userId": 1, "timestamp": 1 }` (Compound index)
  * `{ "timestamp": 1 }` (TTL Index to expire documents after 90 days: `expireAfterSeconds: 7776000`)

```json
{
  "_id": {"$oid": "60c72b2f9b1d8a234a9e1e29"},
  "userId": {"$oid": "60c72b2f9b1d8a234a9e1e20"},
  "eventType": "TOPIC_VIEWED",
  "metadata": {
    "topicId": "60c72b2f9b1d8a234a9e1e21",
    "device": "desktop",
    "referrer": "dashboard"
  },
  "timestamp": {"$date": "2026-06-22T14:00:00Z"}
}
```

---

## 2. Advanced Aggregation Queries

### Aggregation A: Daily Learning Heatmap
Groups the number of topics completed by a specific user on each calendar day.

```javascript
db.progress.aggregate([
  { 
    $match: { 
      userId: ObjectId("60c72b2f9b1d8a234a9e1e20"), 
      isCompleted: true 
    } 
  },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$completedAt", timezone: "UTC" }
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } }
]);
```

### Aggregation B: Compute Learning Streak
Finds the active consecutive daily learning streak for a specific user.

```javascript
db.progress.aggregate([
  // 1. Filter completed topics for the user
  { $match: { userId: ObjectId("60c72b2f9b1d8a234a9e1e20"), isCompleted: true } },
  // 2. Project completed date formatted as YYYY-MM-DD
  {
    $project: {
      dateStr: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt", timezone: "UTC" } }
    }
  },
  // 3. Remove duplicate completions on the same day
  { $group: { _id: "$dateStr" } },
  // 4. Sort dates in descending order (newest first)
  { $sort: { _id: -1 } },
  // 5. Accumulate dates into a list to calculate streak in memory/app logic or grouping block
  {
    $group: {
      _id: null,
      dates: { $push: "$_id" }
    }
  }
  // (Spring Boot code parses this array to determine the count of consecutive days starting from today/yesterday)
]);
```

### Aggregation C: Topics Recommendation Engine
Recommends incomplete topics that match the tags of the user's completed topics, sorting by frequency.

```javascript
db.progress.aggregate([
  // 1. Get all completed topics for the user
  { $match: { userId: ObjectId("60c72b2f9b1d8a234a9e1e20"), isCompleted: true } },
  // 2. Fetch the corresponding topic objects to read tags
  {
    $lookup: {
      from: "topics",
      localField: "topicId",
      foreignField: "_id",
      as: "topicDetails"
    }
  },
  { $unwind: "$topicDetails" },
  // 3. Deconstruct tags array
  { $unwind: "$topicDetails.tags" },
  // 4. Group by tag name to find the user's favorite/most studied concepts
  {
    $group: {
      _id: "$topicDetails.tags",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 3 }, // Fetch top 3 target tags
  { $group: { _id: null, favoriteTags: { $push: "$_id" } } },
  
  // 5. Lookup topics matching favorite tags that the user HAS NOT completed
  {
    $lookup: {
      from: "topics",
      let: { favs: "$favoriteTags" },
      pipeline: [
        { $match: { $expr: { $gt: [{ $size: { $setIntersection: ["$tags", "$$favs"] } }, 0] } } },
        // Filter out completed topics
        {
          $lookup: {
            from: "progress",
            let: { tId: "$_id" },
            pipeline: [
              { $match: { $expr: { $and: [
                { $eq: ["$userId", ObjectId("60c72b2f9b1d8a234a9e1e20")] },
                { $eq: ["$topicId", "$$tId"] },
                { $eq: ["$isCompleted", true] }
              ] } } }
            ],
            as: "userCompletion"
          }
        },
        { $match: { userCompletion: { $size: 0 } } },
        { $limit: 5 }
      ],
      as: "recommendations"
    }
  },
  { $project: { recommendations: 1 } }
]);
```
