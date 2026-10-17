# Agentic SDLC Workshop — Facilitator Notes

**Duration:** 2-3 hours  
**Participants:** 5 (one per role)  
**Goal:** One complete vertical slice — from requirement to passing tests

---

## What You Need

```
YOU (Facilitator)                     EACH PARTICIPANT / TEAM
─────────────────────────────         ──────────────────────────────────
Template repo (this repo)             Own copy of the repo (fork or "Use this template")
Issue #1 content                      GitHub Copilot (coding agent + Agents tab) — or Claude
Running the workshop                  PAT_TOKEN secret + Actions enabled in their copy
Your local dry run                    Teammates added as collaborators
```

> This repo is public. Anyone can create their own workshop copy from it —
> no special access is needed beyond a GitHub account and an AI agent
> (GitHub Copilot or Claude — see the main README).

---

## Prerequisites — Confirm Before Workshop Day

### For You

| Requirement | Details |
|-------------|---------|
| GitHub Copilot licence with coding agent, or Claude | Required to run the agents |
| Template repo | `https://github.com/sendtoshailesh/Agentic-SDLC-app2` |
| Agreed app name | e.g. BookItApp, FindTutor — used for repo and VITE_APP_NAME |
| Agreed workshop requirement | What feature the team will build — goes into Issue #1 |

### For Each Participant

| Requirement | Details |
|-------------|---------|
| GitHub account | Added as a collaborator on the team's workshop repo |
| GitHub Copilot (coding agent enabled) or Claude | Required to run the agents |
| Node.js 18 or higher | `node --version` to verify |
| Git | Any recent version |
| VS Code | Latest |

> ⚠️ **Most common blocker — confirm this before the workshop day:**
> If using GitHub Copilot, the coding agent must be enabled for the
> participant's account (Copilot settings → Coding agent).
> How to verify: each participant should see the **Agents tab** in their repo.
> If not, use Claude instead — see "Running the Agentic SDLC with Claude" in the README.

---

## How It Works

Every workshop team creates a fresh, isolated copy of this template repo.
No reuse. No cleanup needed.

```
https://github.com/sendtoshailesh/Agentic-SDLC-app2   ← public template
         ↓ fork / "Use this template"
[your-account-or-org]/[AppName]                      ← team workshop repo
         ↑
         participants work here on the day
```

---

## Before Every Workshop — Your Steps

### Step 1 — Verify the template on your own machine

Confirm the template works end to end.
Do this once whenever the template is updated.

```bash
# Clone the template repo
git clone https://github.com/sendtoshailesh/Agentic-SDLC-app2.git
cd Agentic-SDLC-app2

# Backend
cd src/backend && npm install
cp src/backend/.env.example src/backend/.env

# Frontend — open a new terminal
cd src/frontend && npm install
cp src/frontend/.env.example src/frontend/.env
# Open src/frontend/.env and set:
# VITE_APP_NAME="TestApp"

# Database
cd src/backend
npm run db:migrate   # never: npx prisma migrate dev
npm run db:seed      # never: npx prisma db seed

# Start backend (port 3001)
npm run dev

# Start frontend (port 5173) — new terminal
cd src/frontend && npm run dev
```

Open http://localhost:5173 and confirm:

```
✅ Login page loads with the correct app name
✅ Login with test@example.com / password123 succeeds
✅ HomePage shows "Features coming soon" after login
✅ Logout works — redirects to login
```
DO NOT PUSH ANYTHING BACK TO TEMPLATE REPO

Only proceed to Step 2 once this passes.

---

### Step 2 — Create the team workshop repo

At least **2 days before the workshop**:

```
1. Open https://github.com/sendtoshailesh/Agentic-SDLC-app2
2. Click "Use this template" (or Fork) → name it [AppName]
3. Settings → Actions → General → allow Actions to create Issues
4. Settings → Secrets → Actions → add PAT_TOKEN (classic PAT with repo scope)
5. Settings → Collaborators → add all 5 participants
6. (Claude users) add ANTHROPIC_API_KEY secret — see README
```

---

### Step 3 — Confirm the repo is ready

```
✅ Workshop repo created and accessible to all participants
✅ Agents tab visible in the repo (Copilot) — or Claude Code set up
✅ All 5 participants added as collaborators
```

---

### Step 4 — Create Issue #1

Create the workshop requirement issue in the team repo:

```
Title:  [REQUIREMENT] {Feature Name}
Label:  requirement
```

**Body template:**
```
## Feature Name
{Feature Name}

## Business Context
{Why this feature is needed — 2-3 sentences}

## What Users Can Do
- {User action 1}
- {User action 2}
- {User action 3}

## Out of Scope
- {Excluded item 1}
- {Excluded item 2}

## Acceptance Criteria
- [ ] {Criterion 1}
- [ ] {Criterion 2}
- [ ] {Criterion 3}
```

---

### Step 5 — Verify the team workshop repo

```bash
git clone https://github.com/[your-account-or-org]/[AppName].git
cd [AppName]

# Start backend (port 3001)
cd src/backend && npm install
npm run dev

# Start frontend (port 5173) — new terminal
cd src/frontend && npm install
npm run dev
```

Open http://localhost:5173 and confirm:

```
✅ Login page loads with the correct app name
✅ Login with test@example.com / password123 succeeds
✅ HomePage shows "Features coming soon" after login
✅ Agents tab visible in the workshop repo
✅ All 5 agents visible in agent dropdown:
   brd-agent, user-story-agent, design-agent,
   unit-test-agent, playwright-agent
✅ Issue #1 visible in Issues tab
```

That is all you need to confirm. If these pass — the workshop is ready.

---

## On The Workshop Day

### Workshop Schedule

| Time | Phase | Who | What |
|------|-------|-----|------|
| 0:00 | Intro | Facilitator | Agentic SDLC concept — 15 min |
| 0:15 | Setup | All | Clone workshop repo, verify app runs — 15 min |
| 0:30 | Phase 1 | PM | brd-agent + user-story-agent — 20 min |
| 0:50 | Phase 2 | Architect | design-agent + DATABASE Issues — 20 min |
| 1:10 | Phase 3 | Backend Dev | BACKEND Issues + unit-test-agent — 20 min |
| 1:30 | Phase 4 | UI Dev | FRONTEND Issues — 20 min |
| 1:50 | Phase 5 | QA | playwright-agent + run tests — 20 min |
| 2:10 | Demo | All | npx playwright test --ui on screen — 10 min |
| 2:20 | Debrief | All | Discussion — 20 min |
| 3:00 | End | | |

---

### Intro Talking Points (15 min)

> "Today you will take a single business requirement all the way to
> tested, working code — using AI agents at every step of the SDLC.
> You are not pair programming with AI. You are directing autonomous
> agents that do the work and raise PRs for your review."

> "When you clone this repo you get auth, a User model, and a page
> that says 'Features coming soon'. Nothing else. Every model, every
> API route, every UI component — the agents build it from the
> requirement in Issue #1."

> "These agents are not chat assistants. You assign a task, they go
> away, do the work, and come back with a Pull Request. Your job is
> to review and merge — or push back with a comment."

---

### Phase-by-Phase Facilitation Notes

**Phase 1 — PM**
- Watch for PM chatting with the agent instead of assigning once and waiting
- brd-agent should produce numbered FRs and explicit out of scope
- user-story-agent derives domain language from BRD — file names, model names
- Every Issue must have an Assignment Order section
- After merge — confirm Issues appear in Issues tab within 1-2 minutes

**Phase 2 — Architect**
- design-agent reads BOTH BRD and Issues
- Check schema has every model the BRD implies
- data-testid contract starts here — flows through to Playwright
- DATABASE PR must merge before Backend Dev starts

**Phase 3 — Backend Dev**
- Focus review on: auth middleware, response shapes, business rules
- No frontend files should be modified
- unit-test-agent runs after all BACKEND PRs are merged

**Phase 4 — UI Dev**
- Critical check: data-testid values from FRONTEND Issue present in components
- HomePage must no longer show "Features coming soon"
- No backend files should be modified

**Phase 5 — QA**
- playwright-agent must use data-testid selectors only — no CSS classes
- If selectors are wrong — QA comments on PR requesting correction
- Project `npx playwright test --ui` on screen for the demo moment

---

## Issue Assignment Order

Every Issue generated by user-story-agent contains an `## Assignment Order` section.
Participants use this to know which Issue to assign next.

```
DATABASE (all slices) → BACKEND (all slices) → FRONTEND (all slices) → PLAYWRIGHT
```

Typical order for a 2-slice feature:
```
Step 1  [DATABASE]   primary slice
Step 2  [DATABASE]   extension slice
Step 3  [BACKEND]    primary slice
Step 4  [BACKEND]    extension slice
Step 5  [FRONTEND]   primary slice
Step 6  [FRONTEND]   extension slice
Step 7  [PLAYWRIGHT]
```

---

## If Something Goes Wrong Mid-Workshop

Do not try to fix a broken workshop repo.
Create a fresh one from the template — it takes 5 minutes.

```
Repeat Step 2 → new repo name
→ you create Issue #1 again
→ continue
```

This is faster and more reliable than debugging a broken state.

---

## Quick Reference — Common Commands

```bash
# Database — always run from src/backend/ using npm scripts (never npx prisma)
cd src/backend
npm run db:generate  # never: npx prisma generate
npm run db:migrate   # never: npx prisma migrate dev
npm run db:seed      # never: npx prisma db seed
npx prisma studio    # studio is read-only, safe to use with npx

# Servers
cd src/backend && npm run dev            # start backend on port 3001
cd src/frontend && npm run dev           # start frontend on port 5173

# Tests
npx playwright test --ui                 # run E2E tests with visual UI
npx playwright test                      # run E2E tests headless
cd src/backend && npm run test           # run Jest unit tests
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Agents tab not visible | Coding agent not enabled for the account — enable it in Copilot settings, or use Claude (see README) |
| Agent not in dropdown | Check `.agent.md` is in `.github/agents/` on main branch |
| Issues not created after merge | Check PAT_TOKEN secret is set — Actions tab → Re-run failed job |
| GraphQL: Resource not accessible | PAT_TOKEN missing or expired — regenerate it and update the repo secret |
| Issues skipped — already exists | Previous run closed issues — workflow uses `--state open`, re-run is safe |
| Frontend shows blank page | Seed data missing — run `cd src/backend && npm run db:seed` |
| Playwright fails on selectors | data-testid missing from component — add manually and re-run |
| Browser tab shows wrong name | Check `VITE_APP_NAME` in `src/frontend/.env` — restart dev server |
| PR raised but wrong content | Leave comment on PR — do not close — agent will update |
| Session cancelled mid-work | Check if PR was raised — if not, re-assign the Issue to Copilot |
| Something badly broken | Create a fresh workshop repo from the template |
