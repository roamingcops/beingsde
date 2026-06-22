# Skill: Project Context & Postman Contract Synchronization

This skill defines the requirements for maintaining context of the **beingsde** platform and enforcing API contract synchronization with Postman.

---

## 1. Project Context Maintenance
For every task in the execution list, the developer (agent or human) must ensure:
* All database references target the 10 defined MongoDB collections.
* The API conforms to the standard prefixes (`/api/v1/...`).
* The JWT security and role-based policies are consistently applied.
* Feature flag checks are integrated into content endpoints using the hashing rollout rule.

---

## 2. Postman Collection Update Requirement
Whenever an API contract changes, the Postman collection file MUST be updated.

### Triggers for Update
1. **Endpoint Addition**: A new `@RestController` method is added (e.g., adding `/api/v1/progress/streak`).
2. **Endpoint Deletion**: An endpoint is deprecated, archived, or removed.
3. **Request DTO Modification**: Adding, removing, or renaming fields in request payload objects (e.g., changing `userId` to `email`).
4. **Response Schema Change**: Adjustments to returned JSON shapes or HTTP status codes (e.g., switching standard errors to RFC 7807).
5. **Security Policy Change**: Addition of new authorization headers, query parameter keys, or cookie requirements.

### Target File
* Postman Collection File: [/Users/arnavagarwal/beingsde/beingsde_postman_collection.json](file:///Users/arnavagarwal/beingsde/beingsde_postman_collection.json)

---

## 3. Postman Validation Process
1. Inspect the JSON schema of the Postman file to ensure it aligns with the Postman Collection v2.1.0 format.
2. Validate that paths match Spring `@RequestMapping` endpoints.
3. Keep sample request bodies filled with valid, non-placeholder test data (e.g. using `jane.doe@example.com` instead of `test@test.com`).
