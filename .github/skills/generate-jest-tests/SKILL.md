---
name: generate-jest-tests
description: Generates a Jest test suite for backend API endpoints and controllers.
  Use when asked to generate unit tests, integration tests, API tests, or a Jest
  test suite for backend code.
---

# Skill — Generate Jest Tests

## Before You Write Anything

Read these files first:
1. `.github/copilot-instructions.md` — test credentials, coding standards
2. The [BACKEND] GitHub Issue — what endpoints were built
3. `src/backend/routes/` — actual implemented routes
4. `src/backend/controllers/` — actual implemented business logic
5. `docs/design/design-doc.md` — API contracts and response shapes

Derive all test content from the actual code — do not invent endpoints
or response shapes. Test what was built, not what you assume exists.

---

## Steps
1. Read actual route and controller files — identify every endpoint
2. For each endpoint write tests covering: happy path, auth, validation
3. Generate Prisma mock file
4. **Raise a PR — handle re-runs correctly:**
   - Check whether any files already exist in `src/backend/__tests__/` on the `main` branch.
   - If they do **not** exist: create a new branch named `test/jest`, push all test files,
     and open a PR titled `test: Jest unit tests`.
   - If they **already exist** (a previous Jest PR was merged): create a new branch named
     `test/jest-v{N}` (increment N until the branch name is free), push the updated files,
     and open a new PR titled `test: update Jest unit tests`.
     Do **not** attempt to reopen or update the already-merged PR — create a fresh one.
   - If an **open** PR for this branch already exists (not yet merged): push the updated
     files to that same branch to update the existing PR — do not open a duplicate.

---

## Test File Structure

```typescript
// Feature: {feature name — from the [BACKEND] Issue}
// Source: GitHub Issue #{number}

import request from 'supertest'
import app from '../index'

describe('{Feature} API', () => {

  let authToken: string

  beforeAll(async () => {
    // Credentials from copilot-instructions.md
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.TEST_USER_EMAIL || 'test@example.com',
        password: process.env.TEST_USER_PASSWORD || 'password123'
      })
    authToken = res.body.token
  })

  describe('{METHOD} /api/{path}', () => {
    it('should return {status} on success', async () => {
      // arrange — set up test data
      // act — make the request
      // assert — verify response shape and status
    })

    it('should return 401 without auth token', async () => {})
    it('should return 400 if required fields missing', async () => {})
  })

})
```

---

## Coverage Requirements

Every endpoint must have at minimum:

| Test Type | What It Verifies |
|-----------|-----------------|
| Happy path | Correct input returns correct status and response shape |
| Auth test | No token returns 401 |
| Validation | Missing required fields returns 400 |
| Edge case | At least one edge case specific to the endpoint's logic |

---

## Prisma Mock Setup

Always generate this mock file:
```typescript
// src/backend/__tests__/__mocks__/prisma.ts
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

export const prismaMock = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(prismaMock)
})
```

---

## Testing Patterns

### Always use Arrange / Act / Assert
```typescript
it('should {description}', async () => {
  // arrange
  const payload = { /* derived from Issue and actual controller */ }

  // act
  const res = await request(app)
    .{method}('/api/{path}')
    .set('Authorization', `Bearer ${authToken}`)
    .send(payload)

  // assert
  expect(res.status).toBe({expectedStatus})
  expect(res.body).toHaveProperty('{expectedField}')
})
```

### Validate response shape — not just status
```typescript
// CORRECT — validates shape matches what Issue specifies
expect(res.body).toHaveProperty('id')
expect(res.body).toHaveProperty('createdAt')
expect(Array.isArray(res.body.items)).toBe(true)

// WRONG — only checking status is insufficient
expect(res.status).toBe(200)
```

### Auth tests — always three variants
```typescript
it('should return 401 without token', async () => {
  const res = await request(app).get('/api/{path}')
  expect(res.status).toBe(401)
})

it('should return 401 with malformed token', async () => {
  const res = await request(app)
    .get('/api/{path}')
    .set('Authorization', 'Bearer not-a-valid-token')
  expect(res.status).toBe(401)
})
```

---

## Edge Cases to Always Consider

For any create/write operation:
- Duplicate entry — what does the endpoint return?
- Missing required field — should return 400
- Invalid data type — should return 400

For any read operation:
- Empty result — should return empty array not 404
- Resource not found — should return 404 with `{ error: string }`

For any delete/update:
- Resource belongs to different user — should return 403 or 404
- Resource does not exist — should return 404

---

## Quality Checklist

```
✅ Tests read actual code — no invented endpoints
✅ Every endpoint has happy path, auth, and validation test
✅ Arrange / Act / Assert pattern used throughout
✅ Response shape validated — not just status codes
✅ Test credentials come from copilot-instructions.md
✅ Prisma mock file generated
✅ No production code modified — test files only
```
