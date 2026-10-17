---
name: review-pull-request
description: Reviews a coding-agent Pull Request against the originating GitHub Issue's
  acceptance criteria. Posts a structured review comment listing passed checks,
  failures, and a merge recommendation. Use when asked to review a PR, check a
  PR against acceptance criteria, or validate agent output before merging.
---

# Skill — Review Agent PR

## What You Do
Read the originating Issue and the PR diff, then post a structured review
comment that tells the human reviewer exactly what passed, what failed, and
whether the PR is safe to merge.

You never modify code. You read and report only.

---

## Steps

1. Read `.github/copilot-instructions.md` — coding standards and pre-built files
2. Read the originating GitHub Issue — extract acceptance criteria and issue type
3. Read the PR diff — check every changed file against the Issue requirements
4. Determine the issue type from the title: [DATABASE], [BACKEND], [FRONTEND], or unit-test
5. Run the checklist for that issue type (see below)
6. Post a review comment on the PR in the format below
7. Set review outcome: **APPROVE** (all pass) or **REQUEST CHANGES** (any fail)

---

## Review Comment Format

Post this as a PR review comment:

```
## Copilot Review — [ISSUE TYPE] {Issue Title}

**Outcome: ✅ APPROVE** — all checks passed, safe to merge.
<!-- OR -->
**Outcome: ❌ REQUEST CHANGES** — {N} check(s) failed (listed below).

---

### Acceptance Criteria

| # | Criterion (from Issue) | Result |
|---|------------------------|--------|
| 1 | {AC text from Issue}   | ✅ Pass / ❌ Fail — {reason} |
| 2 | {AC text from Issue}   | ✅ Pass / ❌ Fail — {reason} |

---

### Standards Checklist

| Check | Result |
|-------|--------|
| {check description} | ✅ Pass / ❌ Fail — {reason} |

---

### Files Changed
- `{file path}` — {one-line description of what changed}

{If REQUEST CHANGES}
### Required Fixes
1. {Specific actionable fix — reference file and line if possible}
2. ...
```

---

## Checklists by Issue Type

### [DATABASE] Issues

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Issue is satisfied by the diff

JPA ENTITIES
✅/❌  Every entity named in the Issue exists as a @Entity class in model/
✅/❌  All categorical fields use Java enum with @Enumerated(EnumType.STRING) — not String
       (e.g. status, type, discountModel must be enum types)
✅/❌  All relationships declared with proper JPA annotations (@ManyToOne, @OneToMany, etc.)
✅/❌  @JoinColumn used on owning side of relationships
✅/❌  Pre-built User entity (User.java) is unchanged

REPOSITORY
✅/❌  A Spring Data JPA repository interface exists for each new entity
✅/❌  Repository extends JpaRepository<Entity, Long>

SEED DATA
✅/❌  DataSeeder.java is updated with records for every new entity
✅/❌  At least 3 records per domain entity
✅/❌  Seed covers every status variant (e.g. at least one ACTIVE, one DRAFT)
✅/❌  Pre-built test user seed logic is unchanged

SCOPE
✅/❌  No backend controller or service files modified
✅/❌  No frontend files modified
```

---

### [BACKEND] Issues

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Issue is satisfied by the diff

ENDPOINTS
✅/❌  Every endpoint listed in the Issue is implemented as a @RestController method
✅/❌  HTTP methods and paths match the Issue exactly (@GetMapping, @PostMapping, etc.)
✅/❌  Request body shapes match the Issue (using proper DTOs — not raw Map or Object)
✅/❌  Response shapes match the Issue

AUTH
✅/❌  Every protected endpoint is secured via Spring Security JWT filter
       (SecurityConfig whitelists only auth endpoints — all others require auth)
✅/❌  Unprotected endpoints (if any) are explicitly noted in the Issue and whitelisted

ERROR HANDLING
✅/❌  All errors return { "error": "string" } via ErrorResponse record with correct HTTP status
✅/❌  Missing resource returns 404, not 500
✅/❌  Validation errors return 400, not 500

JAVA QUALITY
✅/❌  No use of raw `Object` type anywhere in changed files — use proper DTOs and generics
✅/❌  No unchecked casts
✅/❌  Proper use of Java records for DTOs where applicable
✅/❌  Service layer separates business logic from controller

SCOPE
✅/❌  Only files in controller/, service/, dto/ packages modified
✅/❌  No frontend files modified
✅/❌  JPA entity classes not modified
```

---

### [FRONTEND] Issues

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Issue is satisfied by the diff

COMPONENTS
✅/❌  Every component named in "What to Build" section exists in the diff
✅/❌  HomePage updated — no longer shows "Features coming soon"
✅/❌  All components are standalone Angular components

DATA-TESTID VALUES
✅/❌  Every data-testid listed in the Issue exists on the correct element
       (check component template for data-testid="..." attributes)
✅/❌  No data-testid values from the Issue are missing

API CALLS
✅/❌  Frontend calls the endpoints listed in the Issue's Context section
✅/❌  Auth token is passed in Authorization header for protected endpoints

TYPESCRIPT
✅/❌  No use of `any` type anywhere in changed files
✅/❌  Components use standalone style — no NgModule declarations

SCOPE
✅/❌  Only files in src/frontend/src/app/ modified
✅/❌  No backend controller, service, or entity files modified
✅/❌  Pre-built files (app.component.ts, app.routes.ts, login/, register/) unchanged
       unless the Issue explicitly requires changes
```

---

### Unit Test PRs (from unit-test-agent)

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the [BACKEND] Issue has at least one test

COVERAGE
✅/❌  Every endpoint has a happy-path test (200/201 response)
✅/❌  Every protected endpoint has a 401 test (no token)
✅/❌  At least one error case per endpoint (e.g. 404 not found, 400 invalid)

TEST QUALITY
✅/❌  @SpringBootTest or @WebMvcTest used correctly
✅/❌  @MockBean used for service/repository mocking where appropriate
✅/❌  Tests are isolated — no shared mutable state between tests
✅/❌  Arrange / Act / Assert pattern followed
✅/❌  Response shape validated — not just status codes

SCOPE
✅/❌  Only test files modified: src/backend/src/test/java/com/workshop/app/
✅/❌  No production source files modified
```

---

## How to Handle Ambiguous Diffs

- **File not in diff but required by Issue** → mark as ❌ Fail — "{file} not found in PR"
- **AC cannot be verified from diff alone** (e.g. runtime behaviour) → mark as
  ⚠️ Unverifiable — "requires runtime check — verify manually"
- **Extra files changed beyond Issue scope** → flag under Standards Checklist as
  ❌ Fail — "out-of-scope file modified: {file}"

---

## Quality Checklist Before Posting Review

```
✅ Review comment uses the exact format above
✅ Every AC from the Issue has a row in the table — none skipped
✅ Outcome is APPROVE only if zero failures
✅ Required Fixes section present if outcome is REQUEST CHANGES
✅ No code changes suggested — review is read-only
✅ Review posted as a PR review (not just a comment) so GitHub tracks it
```
