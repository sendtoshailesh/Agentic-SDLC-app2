# Agentic SDLC Workshop — 7-Hour Agenda

**Format:** Hands-on, role-based teams of 5
**Prerequisite:** Repo forked, Copilot access confirmed

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express + TypeScript |
| Frontend | React + TypeScript + Vite |
| Database | SQLite via Prisma ORM |
| Auth | JWT (pre-built — not rebuilt during workshop) |
| Unit Testing | Jest |
| E2E Testing | Playwright |
| AI Agents | GitHub Copilot (chat agents + coding agent) |

---

## Schedule

| Time  | Duration | Session |
|-------|----------|---------|
| 10:00 | 30 min   | **Welcome & Setup** |
| 10:30 | 30 min   | **Module 1: Agentic AI in the SDLC** |
| 11:00 | 60 min   | **Module 2: Requirements Phase (PM)** |
| 12:00 | 15 min   | *Break* |
| 12:15 | 45 min   | **Module 3: Design Phase (Architect)** |
| 13:00 | 45 min   | *Lunch* |
| 13:45 | 90 min   | **Module 4: Build Phase (All roles)** |
| 15:15 | 15 min   | *Break* |
| 15:30 | 60 min   | **Module 5: Testing Phase (Backend Dev + QA)** |
| 16:30 | 30 min   | **Module 6: Governance & Review** |
| 17:00 | 30 min   | **Debrief** |
| 17:30 | —        | *Close* |

---

## Module Details

### 10:00 — Welcome & Setup (30 min)
- Roles assigned: PM, Architect, Backend Dev, UI Dev, QA Engineer
- Repo fork + environment check (Node, npm, VS Code, Agents tab visible)
- Demo: what the finished app looks like

### 10:30 — Module 1: Agentic AI in the SDLC (30 min)
- Traditional SDLC vs agentic SDLC — what changes, what doesn't
- The 7-agent pipeline walkthrough
- How `copilot-instructions.md` and `AGENTS.md` act as the agent's rulebook
- Key principle: **agents draft, humans decide**

### 11:00 — Module 2: Requirements Phase — PM Role (60 min)

| Step | Agent | Output |
|------|-------|--------|
| 1 | `brd-agent` | `docs/requirements/BRD.md` |
| 2 | `user-story-agent` | `issues/*.md` → GitHub Issues auto-created |
| 3 | `plan-agent` | `docs/requirements/plan.md` |

Review and merge each PR. Observe GitHub Actions create Issues automatically.

### 12:15 — Module 3: Design Phase — Architect Role (45 min)

| Step | Agent | Output |
|------|-------|--------|
| 4 | `design-agent` | `docs/design/design-doc.md` + `schema.prisma` |

Review the ER diagram, API contracts, and that the `User` model is unchanged.

### 13:45 — Module 4: Build Phase — All Roles (90 min)

| Step | Role | Tool | Output |
|------|------|------|--------|
| 5 | Architect | Copilot Coding Agent | [DATABASE] schema + seed data |
| 6 | Backend Dev | Copilot Coding Agent | [BACKEND] routes + controllers |
| 7 | UI Dev | Copilot Coding Agent | [FRONTEND] pages + components |

Each role reviews and merges their PRs. Optionally use `review-agent` for automated pass/fail checking.

> **Critical:** DATABASE must be merged before BACKEND starts. BACKEND before FRONTEND.

### 15:30 — Module 5: Testing Phase — Backend Dev + QA (60 min)

| Step | Role | Agent | Output |
|------|------|-------|--------|
| 8 | Backend Dev | `unit-test-agent` | `src/backend/__tests__/*.test.ts` |
| 9 | QA Engineer | `playwright-agent` | `e2e/*.spec.ts` |
| 10 | QA Engineer | — | `npx playwright test --ui` → all green ✅ |

### 16:30 — Module 6: Governance & Review (30 min)
- Live demo of `review-agent` on a merged PR
- Discussion: where should humans always stay in the loop?
- Security, business rules, and UX judgment — what agents can't replace

### 17:00 — Debrief (30 min)
- Which phase saved the most time?
- What would you trust immediately vs always review?
- How would you adapt this template to your own project?

---

> **Key message:** Humans stay in the review loop at every step —
> agents handle the *drafting*, humans make the *decisions*.
