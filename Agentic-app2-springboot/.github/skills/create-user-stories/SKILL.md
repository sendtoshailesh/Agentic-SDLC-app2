---
name: create-user-stories
description: Decomposes a BRD into atomic INVEST-compliant GitHub Issue files.
  One file per functional slice per role. Written directly into issues/ folder.
  Derives all content from the BRD and copilot-instructions.md — no hardcoded values.
---

# Skill — Create User Stories

## Before You Write Anything

Read these two files first — everything you write derives from them:

1. `.github/copilot-instructions.md`
   - App context and domain
   - Tech stack
   - What is pre-built (never rebuild these)
   - Test user credentials
   - Coding standards

2. `docs/requirements/BRD.md`
   - Feature requirements
   - Functional requirement IDs
   - Out of scope items

---

## Core Principle — INVEST

Every issue must be:
- **I**ndependent — one functional slice, not all features combined
- **N**egotiable — describes what, not how
- **V**aluable — delivers a demonstrable outcome to the user
- **E**stimable — a developer can size it in minutes
- **S**mall — completable in one focused session (half a day max)
- **T**estable — 2-4 specific, verifiable acceptance criteria

---

## Step 1 — Extract Domain Model from BRD

Before grouping into slices, extract and record from the BRD:

```
DOMAIN ENTITIES   → become JPA @Entity class names and Angular component names
                    Use exact BRD names — do not rename
                    (e.g. BRD says "{EntityName}" → entity class is {EntityName},
                    component is {EntityName}ListComponent)

USER ROLE NAMES   → go into every "As a {role}..." user story
                    Use exact BRD names — do not substitute generics
                    (e.g. BRD says "{RoleName}" → user story says "As a {RoleName}...")

LIFECYCLE STATES  → become Java enums, acceptance criteria, and seed data values
                    (e.g. BRD says "{State1} → {State2} → {State3}"
                    → AC must verify each state transition)

BUSINESS RULES    → become acceptance criteria
                    (e.g. BRD says "{Rule}" → AC in both BACKEND and FRONTEND issues)
```

Write this extracted list as your working reference before writing any issue file.

---

## Step 2 — Identify Functional Slices

Group the BRD functional requirements into workflow steps.
Each workflow step that produces a demonstrable user outcome = one slice.

```
FOR EACH SLICE ASK:
  "Can a user complete a meaningful journey with just this slice?"
  If yes → valid slice

SLICE SIZING RULE:
  Primary slice     → simplest complete journey — 3-5 FRs max
  Extension slices  → one per remaining capability — 3-5 FRs max each
                      Create as many extension slices as needed until
                      every in-scope FR is covered — there is no maximum
                      number of extension slices
```

Label slices using the actual domain language from the BRD (from Step 1).
Do not use generic names like "slice-1" or "feature-a".

### Coverage Check — Required Before Proceeding to Step 3

After identifying slices, verify every in-scope FR is assigned:

1. Scan the **entire BRD** for every FR ID (pattern: `FR-NNN`) — check all sections
   including user journeys, appendices, and narrative text, not just the requirements table.
   List every unique FR ID found across the whole document.
2. For each FR, note which slice covers it
3. For any FR not yet assigned to a slice — create a new extension slice for it
4. Only FRs listed in BRD Section 4 "Out of Scope" may be excluded
5. Do NOT stop at primary + one extension if unassigned FRs remain

Produce this table as your working reference — every row must have an assigned slice
before writing any issue file:

| FR ID | Requirement Summary | Assigned Slice |
|-------|---------------------|----------------|
| FR-001 | ... | {slice-name} (primary) |
| FR-002 | ... | {slice-name} (primary) |
| ...   | ... | ... |

If any row has no assigned slice, create a new extension slice for it and update the table.

---

## Step 3 — Determine Files Per Slice

For each slice, only create role files where work is actually needed:

| Role | File naming | Create when |
|------|-------------|-------------|
| DATABASE | `issues/database-{slice}.md` | New JPA entities needed |
| BACKEND | `issues/backend-{slice}.md` | New API endpoints needed |
| FRONTEND | `issues/frontend-{slice}.md` | New Angular components needed |
| PLAYWRIGHT | `issues/playwright-{feature}.md` | One file per feature — full journey |

Use kebab-case slice names derived from the BRD domain language.

> **Feature label contract:** The `{slice}` part of the filename becomes a GitHub label
> automatically applied to every issue for that feature (e.g. all four files
> `database-booking.md`, `backend-booking.md`, `frontend-booking.md`, `playwright-booking.md`
> receive the label `booking`). You **must** use the exact same `{slice}` name across all
> role files for a feature — any inconsistency creates orphaned labels and breaks filtering.

---

## Step 4 — Calculate Assignment Order

Before writing any Issue file, calculate the assignment order for every Issue.
This tells the facilitator exactly which Issue to assign to Copilot next.

### Assignment Order Rules

```
TIER        SLICE POSITION    ORDER NUMBER
────────    ──────────────    ────────────
DATABASE    primary           1
DATABASE    extension 1       2
DATABASE    extension 2       3
BACKEND     primary           next after last DATABASE
BACKEND     extension 1       next
BACKEND     extension 2       next
FRONTEND    primary           next after last BACKEND
FRONTEND    extension 1       next
FRONTEND    extension 2       next
PLAYWRIGHT  (always last)     final number
```

### Example — 2 slices (primary + 1 extension)

```
DATABASE  primary     → Step 1 of 7  assign after: nothing (assign this first)
DATABASE  extension   → Step 2 of 7  assign after: [DATABASE] {primary slice} is merged
BACKEND   primary     → Step 3 of 7  assign after: [DATABASE] {extension slice} is merged
BACKEND   extension   → Step 4 of 7  assign after: [BACKEND] {primary slice} is merged
FRONTEND  primary     → Step 5 of 7  assign after: [BACKEND] {extension slice} is merged
FRONTEND  extension   → Step 6 of 7  assign after: [FRONTEND] {primary slice} is merged
PLAYWRIGHT            → Step 7 of 7  assign after: [FRONTEND] {extension slice} is merged
```

### Example — 1 slice (primary only)

```
DATABASE  primary     → Step 1 of 4  assign after: nothing (assign this first)
BACKEND   primary     → Step 2 of 4  assign after: [DATABASE] {primary slice} is merged
FRONTEND  primary     → Step 3 of 4  assign after: [BACKEND] {primary slice} is merged
PLAYWRIGHT            → Step 4 of 4  assign after: [FRONTEND] {primary slice} is merged
```

Write "assign after: nothing (assign this first)" for Step 1 only.
For all other steps write the exact Issue title the facilitator must wait for.

---

## Step 5 — Write Each File

Add the `## Assignment Order` section as the FIRST section in every Issue file,
immediately after the User Story. Facilitator sees it instantly when opening the Issue.

> **Label note:** The GitHub Actions workflow reads the first line of `## Assignment Order`
> and applies a `step-NN` label automatically (e.g. `step-01`, `step-05`).
> The line **must** start with `Step N` — no leading spaces or extra characters.
> This makes the assignment order visible in the issue list without opening any issue.

### DATABASE issue format

```
# [DATABASE] {Slice Name — from BRD}

## User Story
As a system I need {specific models from BRD} so that {specific benefit}

## Assignment Order
Step {N} of {Total} — assign after: {previous Issue title} is merged
Tier: DATABASE — {primary / extension} slice

## Context
Pre-built entities from copilot-instructions.md:
- {list each pre-built entity that is relevant}
This issue adds only the JPA entities required for this slice.

## Entities to Add
{EntityName} — JPA @Entity class
- fieldName: Type — description
- Use @Enumerated(EnumType.STRING) for enum fields
- Use proper JPA relationship annotations

## Relationships
- {Entity A} has one/many {Entity B}

## Seed Data
Add realistic sample data to DataSeeder.java so the app is
usable immediately after startup — never leave domain tables empty.

{EntityName} — add 3-5 realistic sample records covering:
- {field}: {example value}
- {field}: {example value}

Seed data is required for:
- Frontend to show real content after login (not a blank page)
- Playwright tests to find and interact with real records

## Acceptance Criteria
- [ ] Application starts without errors (Hibernate auto-DDL creates tables)
- [ ] {specific entity} created with correct fields and relations
- [ ] Seed data populates at least 3 sample {entity} records
- [ ] Pre-built User entity and test user unchanged
```

**Rules:**
- Derive entity class names from BRD domain language
- Maximum 2 entities per issue — split if more needed
- Always include Assignment Order as first section after User Story
- Always include Seed Data section — empty tables break frontend and tests
- Never repeat entities defined in other issues
- When a FRONTEND issue describes status-conditional interactive elements
  (e.g. a button that only appears when a record is in a specific state), include
  at least one seed record in that state so the element is reachable in PLAYWRIGHT tests

---

### BACKEND issue format

```
# [BACKEND] {Slice Name — from BRD}

## User Story
As a {user type from BRD} I want to {action} so that {benefit}

## Assignment Order
Step {N} of {Total} — assign after: {previous Issue title} is merged
Tier: BACKEND — {primary / extension} slice

## Context
Pre-built from copilot-instructions.md:
- {list relevant pre-built backend pieces — SecurityConfig, JwtFilter, AuthController, etc.}
This issue adds only the controllers and services required for this slice.

## API Endpoints
- METHOD /api/{path} — description
  Request: {body shape if applicable}
  Response: {response shape}
  Auth: required / not required

## Acceptance Criteria
- [ ] {endpoint} returns {HTTP status} with {response shape}
- [ ] Protected endpoints return 401 without valid JWT
- [ ] {specific validation or error case from BRD}
```

**Rules:**
- Derive endpoint paths from BRD domain language
- Maximum 3-4 endpoints per issue — split if more needed
- Always include Assignment Order as first section after User Story
- Always specify HTTP method, path, request and response shape
- Always include 401 criterion for protected endpoints
- Avoid route shadowing across slices — if an extension slice adds a static
  sub-path under the same base as a primary-slice parameterised route
  (e.g. `/api/things/summary` alongside `/api/things/{id}`), note in the
  Context section: "Register this controller method **before** the `/{id}` mapping"

---

### FRONTEND issue format

```
# [FRONTEND] {Slice Name — from BRD}

## User Story
As a {user type from BRD} I want to {action} so that {benefit}

## Assignment Order
Step {N} of {Total} — assign after: {previous Issue title} is merged
Tier: FRONTEND — {primary / extension} slice

## Context
Pre-built from copilot-instructions.md:
- {list relevant pre-built frontend pieces — pages, components, router, guards}
HomePage currently shows a placeholder — this Issue replaces its
content with the primary feature component below.
API endpoints available: {list endpoints from the corresponding BACKEND issue}

## What to Build
- {ComponentName} — what it does (standalone Angular component)

## HomePage Update
Replace the placeholder content in HomePage to render {PrimaryComponent}.
The user must see real feature UI immediately after login.

## data-testid Values
Every interactive and key display element must have a data-testid.
Playwright tests will use these — list them explicitly:
- `{testid-value}` — on {element description}

## Acceptance Criteria
- [ ] {specific UI behaviour derived from BRD acceptance criteria}
- [ ] All data-testid values listed above are present on correct elements
```

**Rules:**
- Derive component names from BRD domain language
- Maximum 3-4 components per issue — split if more needed
- Always include Assignment Order as first section after User Story
- Always list data-testid values — playwright-agent reads these
- List the API endpoints this UI calls
- Every interactive element named in "What to Build" must have a corresponding
  data-testid, even if it is status-conditional
  (e.g. "a button that only appears for records in state X" → testid `{action}-button`).
  If that element only appears when a record is in a specific state, the DATABASE
  issue for that slice must seed at least one record in that state, and the
  PLAYWRIGHT issue must include a step that exercises it.

---

### PLAYWRIGHT issue format

```
# [PLAYWRIGHT] {Feature Name — from BRD}

## User Story
As a QA engineer I want to verify the {feature} journey end to end

## Assignment Order
Step {N} of {Total} — assign after: {previous Issue title} is merged
Tier: PLAYWRIGHT — assign this last, after all FRONTEND Issues are merged

## Primary Journey — {Slice Name}
One action per step with expected result:
1. {action} — expect {result}
2. {action} — expect {result}
...

## Test Credentials
{Copy from copilot-instructions.md — do not invent}

## data-testid Reference
These must match the data-testid values in the FRONTEND issues exactly:
- `{testid-value}` — used to {assertion description}

## Acceptance Criteria
- [ ] Full journey passes without errors
- [ ] All selectors use data-testid only — no CSS classes or text content
- [ ] {specific end state assertion from BRD}

---

## Extension Journey — {Extension Slice Name} (optional)
> Only run if extension slice issues are implemented and merged.

1. {action} — expect {result}
```

**Rules:**
- One PLAYWRIGHT file per feature — covers primary + optional extension
- Always last in assignment order — needs all DATABASE, BACKEND, FRONTEND merged
- data-testid values must match FRONTEND issues exactly
- Test credentials come from copilot-instructions.md — never hardcode
- Assertion type must match the FRONTEND behaviour description — do not invent:
  - FRONTEND says button is **disabled** when action is not permitted → assert `toBeDisabled()`, not absent
  - FRONTEND says element is **not rendered** in a given state → assert `not.toBeVisible()`
  - FRONTEND says element **changes text or label** after an action → assert the new text
- Before writing the PLAYWRIGHT file, re-read every FRONTEND issue and note
  each conditional UI behaviour explicitly — then mirror it in the assertion
- Every data-testid declared in every FRONTEND issue must appear in the
  `## data-testid Reference` section AND be exercised in at least one journey step
  — do not leave declared testids unreferenced
  — "exercised" means the step performs an action on that element (fill, click,
    select, or assert its value/state); being listed in the reference section alone
    does not count; this applies equally to optional form fields — if a testid
    exists on an optional input, the journey step that submits that form must
    interact with it (e.g. fill a value or assert it is present and empty)

---

## Quality Checklist Before Raising PR

For every file you write, verify:

```
✅ Title is an H1 heading — will become the GitHub Issue title
✅ User story follows "As a... I want... so that..." format
✅ Assignment Order section present in every Issue — correct step number and dependency
✅ Context lists pre-built work from copilot-instructions.md
✅ DATABASE issues include Seed Data section with realistic sample records
✅ FRONTEND issues include "HomePage Update" section with primary component
✅ Scope is limited to this slice only
✅ Acceptance criteria are specific and verifiable — not vague
✅ 2-4 acceptance criteria max — not a laundry list
✅ FRONTEND issues list all data-testid values
✅ PLAYWRIGHT data-testid values match FRONTEND issues
✅ PLAYWRIGHT assertion types match FRONTEND behaviour — disabled ≠ absent ≠ label-change
✅ Every FRONTEND data-testid is referenced and exercised in a PLAYWRIGHT journey step
✅ Every status-conditional interactive element named in "What to Build" has a data-testid,
   the DATABASE seed covers the required state, and PLAYWRIGHT exercises it
✅ BACKEND extension routes that share a base path with a primary /{id} route note registration order
✅ No content duplicated from copilot-instructions.md
✅ No content invented — everything derived from BRD or copilot-instructions
✅ FR coverage table produced — entire BRD scanned (all sections) for FR IDs, every in-scope FR assigned to a slice, none left unissued
```
