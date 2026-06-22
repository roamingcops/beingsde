# Project Context — beingsde.com

This document provides a comprehensive overview of the custom features built for the `beingsde.com` system architecture learning platform. It serves as a context provider for LLMs (Claude, GPT, etc.) to understand the custom features, technical stacks, directory layouts, and testing flows.

---

## 1. Project Overview & Architecture

The application is split into three main modules:
1. **Frontend (`beingsde-ui`)**: Next.js app styled with Tailwind CSS v4.
2. **Backend (`beingsde-core`)**: Java Spring Boot API using MongoDB for persistence and Redis for session caching/security check operations.
3. **E2E Tester (`beingsde-tester`)**: Playwright automation suite verifying core user journeys.

---

## 2. Key Custom Features Built

### A. Single Session Enforcer (Anti-Account Sharing)
- **Goal**: Prevent users from using the same credentials simultaneously on different devices/browsers.
- **Backend Flow**:
  - Validates authentication tokens against a Redis-backed fingerprint lookup.
  - If a new login occurs, the old session fingerprint is invalidated.
- **Frontend Flow**:
  - Automatically signs out the user if the backend returns a session fingerprint mismatch error (e.g. `401 Unauthorized` / session revoked).

### B. Premium Mock Interviews & Directory
- **Goal**: Enable premium system architects to conduct practice mock sessions, schedule them, and log performance feedback.
- **Database Schema (MongoDB)**:
  - **`interviewer_profiles`**: Stores profile settings including:
    - `userId` (Indexed, unique)
    - `name`, `bio`, `experienceLevel` (`ENTRY_LEVEL`, `MID_LEVEL`, `SENIOR`, `STAFF`)
    - `topics` (list of strings)
    - `calendlyLink` (Scheduling URL, could be Calendly, Cal.com, Jitsi, etc.)
    - `isAvailable` (boolean)
    - `availabilitySlots` (list of strings: `WEEKDAYS_MORNING`, `WEEKDAYS_EVENING`, `WEEKENDS`)
    - `availabilityText` (custom hours description)
  - **`interviews`**: Tracks booked sessions:
    - `interviewerId` / `candidateId`
    - `topic`, `scheduledAt`, `meetingLink`
    - `status` (`SCHEDULED`, `COMPLETED`, `CANCELLED`)
    - `feedbackScore` (1-5 scale) / `feedbackNotes` (text)
- **Endpoints (`/api/v1/interviews`)**:
  - `POST /profile` — Upsert interviewer settings.
  - `GET /profile/me` — Retrieve logged-in interviewer profile.
  - `DELETE /profile` — Disable availability.
  - `GET /directory` — Search directory with topic, level, and slot filtering.
  - `GET /` — List user's interviews (as interviewer or candidate).
  - `POST /{id}/feedback` — Submit rating and constructive feedback.
  - `POST /book` — Schedule/Simulate an interview slot.
  - `POST /{id}/cancel` — Cancel an upcoming session.
- **User Interface**:
  - **Interviewer Console (Left Pane)**: Allows interviewers to configure profiles. Includes an inline **`+ Jitsi Link`** button inside the Booking Link input box to easily auto-generate meet links, plus dashed setup helper buttons for **Get Calendly ↗** and **Get Cal.com ↗**.
  - **Search & Booking Directory (Right Pane)**: Shows active interviewers. Action buttons resolve dynamically:
    - Calendly URLs -> **Book via Calendly**
    - Cal.com URLs -> **Book via Cal.com**
    - Jitsi URLs -> **Join Jitsi Room**
    - Standard URLs -> **Book Session**
  - **Simulation Dialog**: Allows booking a mock slot directly to play through custom scenarios inside the platform.
  - **My Interviews**: Split into Upcoming and History rows, with inline feedback expansion.

### C. Manual Light/Dark Theme Toggle
- **Tailwind CSS v4 Strategy**: Custom class selector configured inside [globals.css](file:///Users/arnavagarwal/beingsde/beingsde-ui/src/app/globals.css) via `@custom-variant dark (&:where(.dark, .dark *));`.
- **ThemeToggle Component**: A premium, glassmorphic button in the navigation header ([ThemeToggle.tsx](file:///Users/arnavagarwal/beingsde/beingsde-ui/src/components/ThemeToggle.tsx)) utilizing Lucide icons (`Sun` / `Moon`) and scale animation states.
- **FOUC (Flash of Unstyled Content) Prevention**: A synchronous script inside the layout's `<head>` evaluates `localStorage` and system defaults before Next.js mounts elements, applying the `.dark` class instantly.

### D. Isolated Test Suite execution
- **Database Reset Endpoint**: A public-facing (test-profile only) endpoint `DELETE /api/v1/interviews/test/cleanup` purges test profile entries between E2E assertions.
- **Playwright Setup**: Tests utilize `request.delete()` inside `beforeEach` to reset databases, guaranteeing test isolation and 100% deterministic runs.

### E. Razorpay Payment & Subscription Integration
- **Goal**: Allow users to upgrade their accounts from `FREE_USER` to `PREMIUM_USER` using Razorpay subscriptions.
- **Backend Flow**:
  - `POST /api/v1/payments/razorpay/order` generates a payment order ID. For local development, it defaults to a sandbox mode (when API key is `rzp_test_placeholder`).
  - `POST /api/v1/payments/razorpay/verify` validates the Razorpay checkout signatures. Bypasses check in sandbox simulation.
  - `POST /api/v1/payments/razorpay/webhook` processes payment captured notifications, auto-matching/upgrading users by email for direct payments made via the hosted checkout page.
- **Frontend Flow**:
  - The subscriptions view ([subscriptions/page.tsx](file:///Users/arnavagarwal/beingsde/beingsde-ui/src/app/subscriptions/page.tsx)) triggers the inline Razorpay checkout modal or shows an interactive local sandbox simulation popup if local test credentials are used.
  - Provides a direct hosted payment page backup link pointing to `https://razorpay.me/@beingsde`.
- **E2E Tester**:
  - [payment-flow.spec.ts](file:///Users/arnavagarwal/beingsde/beingsde-tester/tests/payment-flow.spec.ts) runs a full E2E flow testing the signup, navigating to subscriptions, launching the sandbox payment modal, simulating success, and checking role updates.

---

## 3. Important Files Map

- **Backend Logic**:
  - [SecurityConfig.java](file:///Users/arnavagarwal/beingsde/beingsde-core/src/main/java/com/beingsde/core/config/SecurityConfig.java) — Enforces JWT filters & test-endpoint public paths.
  - [InterviewController.java](file:///Users/arnavagarwal/beingsde/beingsde-core/src/main/java/com/beingsde/core/interviews/InterviewController.java) — Core interviews API entry.
  - [InterviewService.java](file:///Users/arnavagarwal/beingsde/beingsde-core/src/main/java/com/beingsde/core/interviews/InterviewService.java) — Profile management & Webhook/Booking logic.
  - [BillingController.java](file:///Users/arnavagarwal/beingsde/beingsde-core/src/main/java/com/beingsde/core/billing/BillingController.java) — Entrypoint for payment order creation, verification, and webhooks.
- **Frontend Pages & Components**:
  - [page.tsx](file:///Users/arnavagarwal/beingsde/beingsde-ui/src/app/interviews/page.tsx) — Main Interviews dashboard UI.
  - [page.tsx](file:///Users/arnavagarwal/beingsde/beingsde-ui/src/app/subscriptions/page.tsx) — Subscription page with standard checkout triggers & sandbox payment modal.
  - [layout.tsx](file:///Users/arnavagarwal/beingsde/beingsde-ui/src/app/layout.tsx) — Navigation header, dynamic theme script, and Razorpay script integration.
  - [ThemeToggle.tsx](file:///Users/arnavagarwal/beingsde/beingsde-ui/src/components/ThemeToggle.tsx) — Floating Moon/Sun theme-toggle button component.
  - [globals.css](file:///Users/arnavagarwal/beingsde/beingsde-ui/src/app/globals.css) — Custom variant configuration & HSL theme color definitions.
- **Automation tests**:
  - [interviewer-directory.spec.ts](file:///Users/arnavagarwal/beingsde/beingsde-tester/tests/interviewer-directory.spec.ts) — Playwright test covering directory profile upserts, empty states, and mock scheduling.
  - [payment-flow.spec.ts](file:///Users/arnavagarwal/beingsde/beingsde-tester/tests/payment-flow.spec.ts) — Playwright test covering subscription payment simulation and account upgrade.

---

## 4. Local Commands Cheatsheet

### Run Spring Boot API
```bash
cd beingsde-core && mvn spring-boot:run
```

### Run Next.js UI
```bash
cd beingsde-ui && npm run dev
```

### Build Frontend
```bash
cd beingsde-ui && npm run build
```

### Run Playwright Integration Tests
```bash
cd beingsde-tester && npm test
```

### Clean database manually
```bash
curl -X DELETE http://localhost:8081/api/v1/interviews/test/cleanup
```
