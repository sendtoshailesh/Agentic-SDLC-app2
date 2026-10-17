---
name: create-design-doc
description: Creates a technical design document and JPA entity classes from a BRD and
  GitHub Issues. Use when asked to create a design document, technical specification,
  architecture document, or database schema.
---

# Skill — Create Design Document

## What You Do
Read the BRD and user story Issues and produce:
1. `docs/design/design-doc.md` — full technical design
2. New JPA entity classes in `src/backend/src/main/java/com/workshop/app/model/` — complete data model

## Steps
1. Read `docs/requirements/BRD.md` — extract domain entity names, user role names, lifecycle states, and business rules. These names must be used verbatim throughout the design — in entity class names, controller paths, and Angular component names.
2. Use the GitHub MCP tools to list all open issues in this repository labelled `user-story`
   and read the full body of each one — understand API shapes, data-testid values, and slice boundaries
3. Read existing JPA entity classes in `src/backend/src/main/java/com/workshop/app/model/` — understand what already exists (pre-built User entity)
4. Produce `docs/design/design-doc.md` in the format below
5. Produce JPA entity class files for all new domain models
6. **Raise a PR — handle re-runs correctly:**
   - Check whether `docs/design/design-doc.md` already exists on the `main` branch.
   - If it does **not** exist: create a new branch named `design/design-doc`, push all files,
     and open a PR titled `feat: design document and JPA entities [DESIGN]` with `Closes #1`.
   - If it **already exists** (a previous design PR was merged): create a new branch named
     `design/design-doc-v{N}` (increment N until the branch name is free), push the updated
     files to that branch, and open a new PR titled
     `feat: update design document and JPA entities [DESIGN]`.
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
Show the JPA entity classes with annotations.
Clearly mark which entities are pre-existing and which are new.
Include a Mermaid ER diagram.

## 3. API Endpoints
| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|

## 4. Component Structure
Mermaid diagram of Angular component hierarchy.
Include data-testid values for all interactive elements.

## 5. Key Flows
Mermaid sequence diagram for the primary user journey.

## 6. Seed Data
For each DATABASE issue, show a table of every seed record to be inserted.
Include one table per entity — list every row specified in the issue file.
```

## JPA Entity Rules
- **Domain fidelity** — entity class names must match the BRD entity names exactly.
  Use the name the BRD uses — do not substitute a generic equivalent
  (e.g. if the BRD says `Appointment`, the entity is `Appointment` — not `Booking` or `Event`)
- **Java enums** — every categorical field with a fixed set of values (offer types, lifecycle states,
  discount models, etc.) must be defined as a Java `enum` type, not `String`.
  Use `@Enumerated(EnumType.STRING)` on every enum field in the entity.
  Define each enum either as a nested type or in its own file in the model/ package.
  Never use `String` for categorical fields — always use a proper Java enum.
- All entities use `@Entity` and `@Table` annotations
- Use `@Id` with `@GeneratedValue(strategy = GenerationType.IDENTITY)` for primary keys
- Use `@ManyToOne`, `@OneToMany`, etc. for relationships with proper `@JoinColumn`
- Use `@Column` annotations for constraints (nullable, unique, length)
- Mark pre-existing entities with a comment: `// PRE-BUILT — do not modify`
- New entities added by this feature clearly labelled: `// NEW`
- Every relationship must have both sides defined (bidirectional where needed)

## API Design Rules
- **Domain fidelity** — route path nouns must match BRD entity names
  (e.g. if the BRD entity is `Appointment`, use `/api/appointments` — not `/api/bookings`)
- RESTful conventions — nouns not verbs
- Protected routes explicitly marked
- Response shapes documented for complex responses
- **Query params completeness** — for every endpoint that accepts optional query parameters
  in the issue files, list all accepted query params in the request/response shape section
- Error responses: `{ "error": "string" }` via ErrorResponse record with correct HTTP status

## Component Design Rules
- Every interactive element must have a `data-testid` attribute
- Document the data-testid value in the component tree
- This is required for Playwright tests to work

## Seed Data Rules
- **Completeness** — every record specified in a DATABASE issue must appear in the seed plan
  tables; do not omit rows — a missing record causes blank pages and Playwright test failures
- Include one table per entity; show every column that is populated by seed
- Seed plan must span all slices — primary and extension DATABASE issues combined
- At least one record of each status variant mentioned in the issue must be present
  (e.g. if an issue says "at least one ACTIVE CLIPPED offer", the table must include that row)

## Mermaid Diagrams to Always Include
1. Architecture overview — 3-tier diagram
2. ER diagram — all entities and relationships
3. Component tree — Angular hierarchy with data-testid values
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

**New JPA entities to add:**
```java
// NEW — define enum for lifecycle states
public enum {PrimaryEntityStatus} {
    DRAFT, ACTIVE
    // ... all states from the BRD lifecycle
}

// NEW
@Entity
@Table(name = "{primary_entities}")
public class {PrimaryEntity} {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private {PrimaryEntityStatus} status = {PrimaryEntityStatus}.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "{primaryEntity}", cascade = CascadeType.ALL)
    private List<{ActionEntity}> actions = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and setters
}

// NEW
@Entity
@Table(name = "{action_entities}",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "{primary_id}"}))
public class {ActionEntity} {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "{primary_id}", nullable = false)
    private {PrimaryEntity} {primaryEntity};

    @Column(nullable = false, updatable = false)
    private LocalDateTime performedAt = LocalDateTime.now();

    // Getters and setters
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
