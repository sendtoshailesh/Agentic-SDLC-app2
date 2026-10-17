---
name: create-design-doc
description: Creates a technical design document and Prisma schema from a BRD and
  GitHub Issues. Use when asked to create a design document, technical specification,
  architecture document, or database schema.
---

# Skill — Create Design Document

## What You Do
Read the BRD and user story Issues and produce two files:
1. `docs/design/design-doc.md` — full technical design
2. `src/backend/prisma/schema.prisma` — complete data model

## Steps
1. Read `docs/requirements/BRD.md` — extract domain entity names, user role names, lifecycle states, and business rules. These names must be used verbatim throughout the design — in model names, route paths, and component names.
2. Use the GitHub MCP tools to list all open issues in this repository labelled `user-story`
   and read the full body of each one — understand API shapes, data-testid values, and slice boundaries
3. Read existing `src/backend/prisma/schema.prisma` — understand what already exists (pre-built User model)
4. Produce `docs/design/design-doc.md` in the format below
5. Produce complete `src/backend/prisma/schema.prisma` including existing + new models
6. **Raise a PR — handle re-runs correctly:**
   - Check whether `docs/design/design-doc.md` already exists on the `main` branch.
   - If it does **not** exist: create a new branch named `design/design-doc`, push both files,
     and open a PR titled `feat: design document and schema [DESIGN]` with `Closes #1`.
   - If it **already exists** (a previous design PR was merged): create a new branch named
     `design/design-doc-v{N}` (increment N until the branch name is free), push the updated
     files to that branch, and open a new PR titled
     `feat: update design document and schema [DESIGN]`.
     Do **not** attempt to reopen or update the already-merged PR — create a fresh one.
   - If an **open** PR for this branch already exists (not yet merged): push the updated files
     to that same branch to update the existing PR — do not open a duplicate.

## Design Doc Format

```markdown
# [App Name] — Design Document
**Date:** [Today]
**Source:** BRD.md + User Story Issues

## 1. Architecture Overview
Describe the system tiers and how they connect.
Include a Mermaid diagram.

## 2. Data Model
Show the complete Prisma schema.
Clearly mark which models are pre-existing and which are new.
Include a Mermaid ER diagram.

## 3. API Endpoints
| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|

## 4. Component Structure
Mermaid diagram of React component hierarchy.
Include data-testid values for all interactive elements.

## 5. Key Flows
Mermaid sequence diagram for the primary user journey.

## 6. Seed Data
For each DATABASE issue, show a table of every seed record to be inserted.
Include one table per model — list every row specified in the issue file.
```

## Prisma Schema Rules
- **Domain fidelity** — model names must match the BRD entity names exactly.
  Use the name the BRD uses — do not substitute a generic equivalent
  (e.g. if the BRD says `Appointment`, the model is `Appointment` — not `Booking` or `Event`)
- **Enums** — every categorical field with a fixed set of values (offer types, lifecycle states,
  discount models, etc.) must be defined as a Prisma `enum` type, not `String`.
  Define each enum above the model that first uses it, clearly labelled `// NEW`.
  Never use `String // VALUE1 | VALUE2` — always use a proper `enum` declaration.
  Prisma enums ARE supported with SQLite — Prisma maps them to strings internally.
  A tooling validation error does not mean enums should be downgraded to String.
- Always include ALL models — existing and new
- Mark pre-existing models with a comment: `// PRE-BUILT — do not modify`
- New models added by this feature clearly labelled: `// NEW`
- Every relation must have both sides defined
- Run `npx prisma validate` mentally — check for missing relations

## API Design Rules
- **Domain fidelity** — route path nouns must match BRD entity names
  (e.g. if the BRD entity is `Appointment`, use `/api/appointments` — not `/api/bookings`)
- RESTful conventions — nouns not verbs
- Protected routes explicitly marked
- Response shapes documented for complex responses
- **Query params completeness** — for every endpoint that accepts optional query parameters
  in the issue files, list all accepted query params in the request/response shape section
- Error responses: `{ error: string }` with correct HTTP status

## Component Design Rules
- Every interactive element must have a `data-testid` attribute
- Document the data-testid value in the component tree
- This is required for Playwright tests to work

## Seed Data Rules
- **Completeness** — every record specified in a DATABASE issue must appear in the seed plan
  tables; do not omit rows — a missing record causes blank pages and Playwright test failures
- Include one table per model; show every column that is populated by seed
- Seed plan must span all slices — primary and extension DATABASE issues combined
- At least one record of each status variant mentioned in the issue must be present
  (e.g. if an issue says "at least one ACTIVE CLIPPED offer", the table must include that row)

## Mermaid Diagrams to Always Include
1. Architecture overview — 3-tier diagram
2. ER diagram — all entities and relationships
3. Component tree — React hierarchy with data-testid values
4. Sequence diagram — primary user journey end to end

## Mermaid Syntax Rules — MUST Follow
These rules prevent parse errors when diagrams are rendered on GitHub or in VS Code.

- **No double quotes in labels** — Mermaid sequence diagram arrow labels cannot contain `"`.
  Bad:  `API-->>FE: 200 Content-Disposition: attachment; filename="data.csv"`
  Good: `API-->>FE: 200 Content-Disposition: attachment; filename=data.csv`
- **Keep labels short and readable** — do not paste full HTTP headers into an arrow label.
  Summarise instead:
  Bad:  `API-->>FE: 200 Content-Type: text/csv Content-Disposition: attachment; filename="data.csv"`
  Good: `API-->>FE: 200 OK (CSV file download)`
- **No colons inside a label after the first colon** — the first `:` separates the arrow target
  from the label; subsequent colons can confuse parsers. Break HTTP status + description into
  separate notes if detail is needed, or use parentheses:
  Good: `API-->>FE: 200 OK (text/csv)`
- **No semicolons in labels** — semicolons are token separators in some Mermaid versions;
  replace with a comma or omit.
- **Participant aliases must not contain spaces or special characters** — use CamelCase or
  underscores: `participant FE as Frontend` is fine; the alias `FE` must be a single token.
- **Validate mentally before writing** — read each arrow label and check it contains no `"`, `;`,
  or multiple `:` characters.

## Example — Structural Patterns to Follow

This example illustrates the expected patterns for any domain.
Replace `{PrimaryEntity}` and `{ActionEntity}` with the BRD's actual entity names.

**New models to add:**
```prisma
// NEW — define enums for all categorical fields before the models that use them
enum {PrimaryEntityStatus} {
  DRAFT
  ACTIVE
  // ... all states from the BRD lifecycle
}

// NEW
model {PrimaryEntity} {
  id          Int                    @id @default(autoincrement())
  title       String
  description String
  status      {PrimaryEntityStatus}  @default(DRAFT)
  ownerId     Int
  owner       User                   @relation(fields: [ownerId], references: [id])
  actions     {ActionEntity}[]
  createdAt   DateTime               @default(now())
}

// NEW
model {ActionEntity} {
  id              Int      @id @default(autoincrement())
  userId          Int
  {primaryId}     Int
  performedAt     DateTime @default(now())
  user            User              @relation(fields: [userId], references: [id])
  {primaryEntity} {PrimaryEntity}   @relation(fields: [{primaryId}], references: [id])

  @@unique([userId, {primaryId}])  // enforce business rule: one action per user per item
}
```

**Key API endpoints pattern:**
- GET  /api/{primary-entities} — list items for authenticated user
- GET  /api/{primary-entities}/:id — get item details
- POST /api/{action-entities} — perform action (`{ {primaryId} }`)
- DELETE /api/{action-entities}/:id — reverse action
- GET  /api/{action-entities} — list user's performed actions

**data-testid pattern:**
- `{entity}-list`, `{entity}-card`, `{entity}-title`
- `{action}-button`, `un{action}-button`
- `{action}ed-list`, `{action}ed-item`
