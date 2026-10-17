---
name: create-brd
description: Creates a Business Requirements Document from a requirement Issue or text.
  Use this when asked to create a BRD, analyse requirements, or produce a business
  requirements document from an Issue or requirement text.
---

# Skill — Create BRD

## What You Do
Read the requirement and produce a complete BRD that is **faithful to the
domain model, entities, and terminology in the source requirement**.
Do not substitute your own interpretation for the domain the requirement defines.
If the requirement names specific entities, use those exact names — do not
rename them to generic equivalents (e.g. if the requirement says `Booking`,
use `Booking` — not `Reservation` or `Request`).
Do not ask clarifying questions — make reasonable assumptions and document them.

## Source Rule
The requirement text is your only authoritative source — use it verbatim.
Do not simplify, reframe, or substitute it.
**The repository name is not a requirement.** Do not infer the domain, entities,
or feature set from the repository name under any circumstances.

## Steps
1. Read the requirement in full before writing anything.
   If given an Issue number, read the Issue body using the available GitHub tools.
   If given pasted text, use that verbatim.
   If given a file path, read it using the available file tools.
   If you cannot access the Issue, ask the PM to paste the body — do not guess.
2. Extract the domain model — list every named entity, its states/lifecycle, and the actions users perform on it
3. Identify user roles — use the exact role names from the requirement; do not invent generic substitutes
4. Identify functional requirements — derive them from the domain model and named user actions
5. Identify non-functional requirements — if not stated, apply sensible defaults
6. Define scope — what is in and what is out, using the requirement's own framing
7. Document assumptions — where the requirement was unclear and what was assumed
8. Produce the BRD in the format below
9. **Save `docs/requirements/BRD.md` — handle re-runs correctly:**
   - Check whether `docs/requirements/BRD.md` already exists on the `main` branch.
   - If it does **not** exist: create a new branch named `docs/brd`, push the file,
     and open a PR titled `docs: Business Requirements Document`.
   - If it **already exists** (a previous BRD PR was merged): create a new branch named
     `docs/brd-v{N}` (increment N until the branch name is free), push the updated file,
     and open a new PR titled `docs: update Business Requirements Document`.
     Do **not** attempt to reopen or update the already-merged PR — create a fresh one.
   - If an **open** PR for this branch already exists (not yet merged): push the updated file
     to that same branch to update the existing PR — do not open a duplicate.

## BRD Format

```markdown
# Business Requirements Document
**Project:** [App Name]
**Date:** [Today]
**Source:** [Issue number or requirement text reference]

## 1. Summary
One paragraph describing what the application does.

## 2. User Roles
| Role | Description |
|------|-------------|
| [Role] | [What they do] |

## 3. In Scope
- [Feature 1]
- [Feature 2]

## 4. Out of Scope
- [Explicitly excluded feature]

## 5. Functional Requirements
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-001 | [Requirement] | [2 testable criteria] |

## 6. Non-Functional Requirements
| ID | Category | Requirement |
|----|----------|-------------|
| NFR-001 | Security | JWT authentication on all protected routes |
| NFR-002 | Performance | Page load under 3 seconds |
| NFR-003 | Usability | Responsive — works on desktop and mobile |

## 7. Assumptions
- [Assumption 1 — what was unclear and what was assumed]
- [Assumption 2]
```

## Functional Requirements — How to Extract Them
1. **Use the requirement's own domain model** — identify the named entities,
   their states/lifecycles, and the actions users perform on them.
2. **Preserve lifecycle states verbatim** — if the requirement defines states
   (e.g. `Pending → Approved → Completed`), reproduce them exactly as requirements.
3. **Preserve business rules verbatim** — if the requirement defines explicit rules
   (e.g. "manager approval required before scheduling"), capture them as FRs.
4. **Use the requirement's role names** — do not invent generic substitutes.
   If the requirement names specific roles, use those — not generic replacements
   like "User" or "Admin" unless the requirement itself uses those terms.
5. Only after extracting domain-specific requirements, check if generic concerns apply:
   - Is authentication implied? (if users are mentioned, likely yes)
   - Are there CRUD operations on the domain entities?
   - Are there role-based access controls?

## Do Not Do This
- Do NOT rename domain entities to generic equivalents
  (e.g. if the requirement says `Booking`, do not write `Reservation`;
  if it says `Practitioner`, do not write `User` or `Doctor`)
- Do NOT reduce a complex domain to a simple catalogue + form pattern
  unless the requirement actually describes that
- Do NOT invent a simpler domain model because the requirement is complex —
  complexity in the requirement must be reflected in the BRD
- Do NOT discard explicit lifecycle states or business rules as "out of scope"
  unless the requirement itself says so

## Non-Functional Requirement Defaults
Apply these if the requirement does not state otherwise:
- Security: JWT authentication for protected routes
- Performance: Page load under 3 seconds
- Usability: Responsive design for desktop and mobile

## Examples

### Example 1 — Domain Preservation Principle

If the requirement says:
> "Patients book Appointments with Practitioners. Each Appointment moves through
> states: Scheduled → Confirmed → Completed or Cancelled.
> A Referral is required before a specialist Appointment can be Confirmed."

The BRD MUST:
- Name entities as: `Patient`, `Practitioner`, `Appointment`, `Referral`
- Name roles as: `Patient`, `Practitioner` (not "User" and "Doctor")
- Include FR: Patient books/cancels an Appointment
- Include FR: Appointment lifecycle: Scheduled → Confirmed → Completed or Cancelled
- Include business rule as FR: Referral required before specialist Appointment is Confirmed

The BRD must NOT say:
- Entities: `User`, `Booking`, `Request`
- Roles: `User`, `Admin`
- Lifecycle reduced to: `Active` / `Closed`

### Example 2 — Simple Catalogue App

Requirement:
> "We want to build an online food ordering platform. Customers browse
> restaurants, view menus and add items to a cart."

Produces:

**User Roles:** Customer, Restaurant Admin
**In Scope:** Browse restaurants, view menus, cart management
**Out of Scope:** Payment processing (not mentioned — assumed out of scope)
**Assumptions:** Auth required as customers need persistent carts;
payment out of scope as not mentioned in requirement
