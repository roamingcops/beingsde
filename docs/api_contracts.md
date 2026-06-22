# API Design & OpenAPI Contracts - beingsde

This document describes the REST API architecture, request/response contracts, pagination schemas, error formats, and provides the formal OpenAPI 3.0 specification.

---

## 1. REST Endpoints Summary

All APIs are prefixed with `/api/v1`.

| Module | Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/auth/register` | `POST` | Guest | Registers a new user. |
| **Auth** | `/auth/login` | `POST` | Guest | Authenticates user, returns JWT & Refresh tokens. |
| **Auth** | `/auth/verify-email` | `POST` | Guest | Verifies email using token. |
| **Topics** | `/topics` | `GET` | All | Lists all topics (paginated, filtered, sorted). |
| **Topics** | `/topics/{slug}` | `GET` | All | Fetches a topic by slug (subject to feature flags). |
| **Topics** | `/topics` | `POST` | Admin | Creates a new topic (CMS). |
| **Progress** | `/progress/dashboard` | `GET` | Users | Fetches user streak, stats, and learning heatmap. |
| **Progress** | `/progress/{topicId}/complete` | `POST`| Users | Marks a topic as completed and increments streak. |
| **Interviews**| `/interviews/book` | `POST` | Premium | Schedules a mock interview slot. |
| **Interviews**| `/interviews/{id}/feedback` | `POST`| Interviewer| Submits candidate feedback & scores. |
| **Payments** | `/payments/razorpay/order` | `POST` | Users | Initiates a subscription order for Razorpay checkout. |
| **Payments** | `/payments/razorpay/webhook`| `POST` | Razorpay | Receives payment capture and subscription updates. |
| **Flags** | `/admin/feature-flags` | `POST` | Admin | Creates/Updates feature flag configurations. |

---

## 2. API Request/Response Standards

### Pagination, Filtering, and Sorting
* **Query Parameters**:
  * `page`: 0-indexed page number (default: `0`)
  * `size`: Number of records per page (default: `20`, max: `100`)
  * `sort`: Format: `propertyName,asc` or `propertyName,desc`
  * `difficulty`: Filter by difficulty (e.g., `EASY`, `MEDIUM`, `HARD`)
  * `tags`: Filter by tags (comma-separated, e.g., `Redis,Caching`)

* **Paginated Response Wrapper**:
```json
{
  "content": [],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    }
  },
  "totalPages": 5,
  "totalElements": 98,
  "last": false,
  "size": 20,
  "number": 0,
  "numberOfElements": 20,
  "first": true,
  "empty": false
}
```

### Error Handling Standard (RFC 7807 Problem Details)
All error responses use the `application/problem+json` format.

```json
{
  "type": "https://api.beingsde.com/errors/insufficient-permissions",
  "title": "Access Denied",
  "status": 403,
  "detail": "The feature flag 'premium_notes_distributed_cache' is disabled for your subscription tier. Upgrade to PREMIUM to unlock.",
  "instance": "/api/v1/topics/design-distributed-caching-redis",
  "timestamp": "2026-06-22T17:00:00Z"
}
```

---

## 3. OpenAPI 3.0 Specification (YAML)

Below is the OpenAPI specification defining user registration, login, and topic retrieval.

```yaml
openapi: 3.0.3
info:
  title: beingsde API Engine
  description: Backend APIs for the beingsde System Design Learning Platform.
  version: 1.0.0
servers:
  - url: https://api.beingsde.com/api/v1
    description: Production Sandbox
paths:
  /auth/register:
    post:
      summary: Register a new user account
      tags:
        - Authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - email
                - password
              properties:
                name:
                  type: string
                  example: John Doe
                email:
                  type: string
                  format: email
                  example: john.doe@example.com
                password:
                  type: string
                  format: password
                  example: P@ssw0rd123!
      responses:
        '201':
          description: User registered successfully. Activation email sent.
          content:
            application/json:
              schema:
                type: object
                properties:
                  userId:
                    type: string
                    example: 60c72b2f9b1d8a234a9e1e20
                  email:
                    type: string
                    example: john.doe@example.com
                  status:
                    type: string
                    example: PENDING_VERIFICATION
        '400':
          description: Validation error or email already in use.

  /auth/login:
    post:
      summary: Authenticate user credentials
      tags:
        - Authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                  example: john.doe@example.com
                password:
                  type: string
                  format: password
      responses:
        '200':
          description: Successful authentication
          content:
            application/json:
              schema:
                type: object
                properties:
                  accessToken:
                    type: string
                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  refreshToken:
                    type: string
                    example: d3b07384-d113-4c92-a9b0-9988ff44...
                  role:
                    type: string
                    example: FREE_USER
        '401':
          description: Invalid email or password.

  /topics:
    get:
      summary: Retrieve topics list with pagination and filters
      tags:
        - Topics Module
      security:
        - BearerAuth: []
      parameters:
        - name: page
          in: query
          required: false
          schema:
            type: integer
            default: 0
        - name: size
          in: query
          required: false
          schema:
            type: integer
            default: 20
        - name: difficulty
          in: query
          required: false
          schema:
            type: string
            enum: [EASY, MEDIUM, HARD]
        - name: tags
          in: query
          required: false
          schema:
            type: string
            description: Comma separated tags (e.g. Redis,Kafka)
      responses:
        '200':
          description: Paginated topic list matching criteria.
          content:
            application/json:
              schema:
                type: object
                properties:
                  content:
                    type: array
                    items:
                      $ref: '#/components/schemas/TopicSummary'
                  totalPages:
                    type: integer
                  totalElements:
                    type: integer

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    TopicSummary:
      type: object
      properties:
        id:
          type: string
          example: 60c72b2f9b1d8a234a9e1e21
        title:
          type: string
          example: Design a Distributed Caching System
        slug:
          type: string
          example: design-distributed-caching-redis
        difficulty:
          type: string
          example: HARD
        tags:
          type: array
          items:
            type: string
          example: ["Redis", "Caching"]
        estimatedTimeMinutes:
          type: integer
          example: 45
```
