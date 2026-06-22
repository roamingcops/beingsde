# Interviewer Directory — Implementation Plan

## Branch
`feature/interviewer-directory`

## Branch Setup
```bash
git checkout main
git branch -D feature/mock-interviews 2>/dev/null
git push origin --delete feature/mock-interviews 2>/dev/null
git checkout -b feature/interviewer-directory
```

## Step 1: Clean Up Old Files
```bash
rm -rf beingsde-core/src/main/java/com/beingsde/core/interviews/
rm -rf beingsde-ui/src/app/interviews/
mkdir -p beingsde-core/src/main/java/com/beingsde/core/interviews/dto
mkdir -p beingsde-ui/src/app/interviews
```

## Step 2: Create Backend Files (8 files)

### 2a. InterviewerProfile.java (model)
- Package: `com.beingsde.core.interviews`
- MongoDB collection: `interviewer_profiles`
- Fields: id, userId (@Indexed unique), name, topics (List\<String\>), experienceLevel, bio, calendlyLink, isAvailable, createdAt
- Builder pattern (same as other models)

### 2b. InterviewerProfileRepository.java
- Package: `com.beingsde.core.interviews`
- findByUserId(String) -> Optional
- findByIsAvailableTrue() -> List
- findByIsAvailableTrueAndTopicsIn(List<String>) -> List
- findByIsAvailableTrueAndExperienceLevel(String) -> List
- findByIsAvailableTrueAndTopicsInAndExperienceLevel(List<String>, String) -> List

### 2c. Interview.java (simplified model)
- MongoDB collection: `interviews`
- Fields: id, interviewerId (@Indexed), candidateId, topic, status (SCHEDULED/COMPLETED/CANCELLED), scheduledAt, meetingLink, feedbackScore (Integer), feedbackNotes, createdAt
- Builder pattern

### 2d. InterviewRepository.java
- findByInterviewerIdOrCandidateIdOrderByCreatedAtDesc(String, String) -> List
- findByInterviewerIdAndStatus(String, String) -> List

### 2e. InterviewService.java
- `upsertProfile(userId, ProfileRequest)` — upsert by userId, set fields from request (name defaults to User.name)
- `getMyProfile(userId)` — lookup by user email -> user.getId()
- `disableProfile(userId)` — set isAvailable=false
- `getDirectory(topic, experienceLevel)` — filter by topic/level/both/none
- `getUserInterviews(userId)` — find by interviewerId OR candidateId
- `handleCalendlyWebhook(interviewerEmail, candidateId, topic, scheduledTime, meetingLink)` — create SCHEDULED Interview
- `submitFeedback(interviewId, userId, score, notes)` — verify caller is interviewer, set score+notes, status=COMPLETED

### 2f. InterviewController.java (7 endpoints)

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/profile` | Premium | upsert profile |
| GET | `/profile/me` | Premium | get my profile |
| DELETE | `/profile` | Premium | disable |
| GET | `/directory` | Premium | `?topic=&experienceLevel=` |
| GET | `/` | Premium | list my interviews |
| POST | `/{id}/feedback` | Premium | body: {score, notes} |
| POST | `/calendly-webhook` | Public | parse Calendly payload |

All Premium endpoints check feature flag `feature_premium_mock_interviews`.

### 2g. dto/ProfileRequest.java
- Fields: name, topics, experienceLevel, bio, calendlyLink, isAvailable

### 2h. dto/ProfileResponse.java
- Fields: id, name, topics, experienceLevel, bio, calendlyLink, isAvailable, createdAt (no userId exposed)

## Step 3: SecurityConfig — Already Done
Line 61 already has `.requestMatchers("/api/v1/interviews/calendly-webhook").permitAll()` from previous branch.

## Step 4: Create Frontend — /interviews/page.tsx

Three sections:

### 4a. "My Interviewer Profile" card
- Toggle switch: "Offer mock interviews" (isAvailable)
- Name input
- Topics input (comma-separated, shown as tags)
- Experience level dropdown (ENTRY_LEVEL, MID_LEVEL, SENIOR, STAFF)
- Bio textarea
- Calendly link input
- Save button
- "Stop offering" button (if isAvailable=true)

### 4b. "Find an Interviewer" card
- Search input (filters by topic keyword — client-side)
- Experience level dropdown filter
- Grid of cards showing: name, experience level badge, topics (tags), bio (2-line), "Book via Calendly" button (opens their calendlyLink in new tab)
- Empty state: "No interviewers available right now."

### 4c. "My Interviews" section
- Two sub-sections: Upcoming (SCHEDULED) and Past (COMPLETED/CANCELLED)
- Each row shows: role tag ("As Interviewer" / "As Candidate"), topic, date, meeting link (if SCHEDULED)
- For SCHEDULED interviews where caller is interviewer: "Submit Feedback" expandable form (score 1-5 stars + notes textarea)

## Step 5: API Calls (sessionAwareFetch pattern)

```typescript
API calls:
  GET  /api/v1/interviews/profile/me
  POST /api/v1/interviews/profile       (body: ProfileRequest)
  DELETE /api/v1/interviews/profile
  GET  /api/v1/interviews/directory?topic=&experienceLevel=
  GET  /api/v1/interviews
  POST /api/v1/interviews/{id}/feedback (body: {score, notes})
```

## Step 6: Compile & Lint
```bash
cd beingsde-ui && npx tsc --noEmit && npx eslint .
cd beingsde-core && mvn compile -q
```

## Step 7: Push, Merge, Deploy
```bash
git add -A && git commit -m "feat: interviewer directory for premium mock interviews"
git push origin feature/interviewer-directory

# Merge to main:
git checkout main && git merge feature/interviewer-directory && git push origin main
# Vercel + Render auto-deploy
```

## Data Flow Summary

```
User A (interviewer):
  POST /profile {name, topics:["Redis"], experienceLevel:"SENIOR", ...}
  -> appears in directory

User B (candidate):
  GET /directory?topic=Redis
  -> sees User A's profile
  -> clicks User A's Calendly link, books a slot

Calendly webhook:
  POST /calendly-webhook {interviewerEmail, candidateId, topic, scheduled_time}
  -> creates Interview{SCHEDULED}

User A (after interview):
  POST /interviews/{id}/feedback {score: 4, notes: "Good on consistency trade-offs"}
  -> Interview status = COMPLETED

User B:
  GET /interviews
  -> sees their interview with feedback score
```
