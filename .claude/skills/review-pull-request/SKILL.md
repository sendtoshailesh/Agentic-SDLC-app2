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

SCHEMA
✅/❌  Every model named in the Issue exists in schema.prisma
✅/❌  All categorical fields use Prisma enum — not String
       (e.g. status, type, discountModel must be enum types)
✅/❌  All relations declared on both sides (both model and related model)
✅/❌  Pre-built User model is unchanged

MIGRATION
✅/❌  A new migration file exists under prisma/migrations/

SEED DATA
✅/❌  seed.ts is updated with records for every new model
✅/❌  At least 3 records per domain model
✅/❌  Seed covers every status variant (e.g. at least one ACTIVE, one DRAFT)
✅/❌  Pre-built test user seed is unchanged

SCOPE
✅/❌  No backend route or controller files modified
✅/❌  No frontend files modified
```

---

### [BACKEND] Issues

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Issue is satisfied by the diff

ENDPOINTS
✅/❌  Every endpoint listed in the Issue is implemented
✅/❌  HTTP methods and paths match the Issue exactly
✅/❌  Request body shapes match the Issue
✅/❌  Response shapes match the Issue

AUTH
✅/❌  Every protected endpoint uses the authenticate middleware from
       src/backend/middleware/auth.ts
✅/❌  Unprotected endpoints (if any) are explicitly noted in the Issue

ERROR HANDLING
✅/❌  All errors return { error: string } with correct HTTP status
✅/❌  Missing resource returns 404, not 500
✅/❌  Validation errors return 400, not 500

TYPESCRIPT
✅/❌  No use of `any` type anywhere in changed files
✅/❌  Async functions use async/await — no raw .then() chains

SCOPE
✅/❌  Only files in src/backend/routes/, controllers/, services/ modified
✅/❌  No frontend files modified
✅/❌  schema.prisma not modified
```

---

### [FRONTEND] Issues

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Issue is satisfied by the diff

COMPONENTS
✅/❌  Every component named in "What to Build" section exists in the diff
✅/❌  HomePage.tsx updated — no longer shows "Features coming soon"

DATA-TESTID VALUES
✅/❌  Every data-testid listed in the Issue exists on the correct element
       (check component source for data-testid="..." attributes)
✅/❌  No data-testid values from the Issue are missing

API CALLS
✅/❌  Frontend calls the endpoints listed in the Issue's Context section
✅/❌  Auth token is passed in Authorization header for protected endpoints

TYPESCRIPT
✅/❌  No use of `any` type anywhere in changed files
✅/❌  Components are functional style with hooks — no class components

SCOPE
✅/❌  Only files in src/frontend/src/ modified
✅/❌  No backend route, controller, or schema files modified
✅/❌  Pre-built files (App.tsx, main.tsx, LoginPage, RegisterPage) unchanged
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
✅/❌  Prisma client is mocked — no real database calls in unit tests
✅/❌  Tests are isolated — no shared mutable state between tests
✅/❌  No test imports production code that touches the file system or network

SCOPE
✅/❌  Only test files modified: src/backend/__tests__/
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
