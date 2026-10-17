# Agentic SDLC Workshop

A hands-on workshop where a team of 5 takes a single business requirement
all the way to tested, working code — using AI agents at every step.

---

## What You Will Build

You will be given a feature requirement on the day. Starting from a bare app
with only login and registration working, your team will use AI agents to:

- Write a Business Requirements Document
- Break it into technical Issues
- Design the data model and API
- Build the backend and frontend
- Generate and run end-to-end tests

Everything is built during the workshop. Nothing is pre-built except auth.

---

## Before You Arrive — Prerequisites

### Tools — Install these before the workshop day

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18 or higher | `node --version` |
| Git | Any recent | `git --version` |
| VS Code | Latest | — |

### GitHub Access — Required

| Requirement | Details |
|-------------|---------|
| GitHub account | Any GitHub account |
| AI agent | GitHub Copilot with coding agent enabled (Agents tab), **or** Claude — see [Running the Agentic SDLC with Claude](#running-the-agentic-sdlc-with-claude-claude-code--claude-chat) |
| Your own copy of this repo | Fork it or click **Use this template** on GitHub |

> ⚠️ **If using GitHub Copilot:** the coding agent must be enabled for your
> account (Copilot settings → Coding agent). If the **Agents tab** is not
> visible in your repo, enable it there — or use Claude instead.

---

## Setup — Do This Before the Workshop Starts

### 1. Clone the workshop repo

Template repo: https://github.com/sendtoshailesh/Agentic-SDLC-app2
Create your own copy (**Use this template** or **Fork**), then clone it:

```bash
git clone https://github.com/[your-account]/[AppName].git
cd [AppName]
```

### 2. Install dependencies

```bash
# Backend
cd src/backend && npm install

# Frontend — open a new terminal
cd src/frontend && npm install
```

### 3. Set up environment files

```bash
# Backend — no changes needed, defaults work
cp src/backend/.env.example src/backend/.env

# Frontend — your facilitator will tell you the app name
cp src/frontend/.env.example src/frontend/.env
```

Open `src/frontend/.env` and set the app name your facilitator gives you:
```
VITE_APP_NAME="[AppName]"
```

### 4. Set up the database

```bash
cd src/backend
npm run db:migrate   # never: npx prisma migrate dev
npm run db:seed      # never: npx prisma db seed
```

### 5. Start the app

```bash
# Terminal 1 — backend (port 3001)
cd src/backend && npm run dev

# Terminal 2 — frontend (port 5173)
cd src/frontend && npm run dev
```

### 6. Verify it works

Open http://localhost:5173 in your browser.

Login with:
```
Email:    test@example.com
Password: password123
```

You should see a page that says **"Features coming soon"** after login.
This is correct — the feature is built during the workshop.

---

## After Merging Agent PRs — Run This Every Time

Each time the coding agent raises a PR and you merge it, run these steps
before starting the app. Skipping them causes TypeScript errors or a blank/broken UI.

```bash
cd src/backend

# 1. Install any new packages the agent added to package.json
npm install

# 2. Apply any new database migrations (new tables, columns)
npm run db:migrate

# 3. Regenerate the Prisma client to match the updated schema
npm run db:generate

# 4. Load seed data so the UI shows real records (not a blank page)
npm run db:seed
```

> **Why is this needed?**
> The coding agent adds new npm packages, Prisma models, and seed data as part of
> its implementation. When you pull those changes locally, the Prisma client is
> out of date and the database tables don't exist yet — these four commands bring
> your local environment in sync with what the agent built.

Then start (or restart) the backend:

```bash
npm run dev
```

---

## Your Role

Your facilitator will assign you one of these roles:

| Role | What You Do |
|------|-------------|
| PM | Write requirements, create Issues |
| Architect | Design the system, assign DATABASE work |
| Backend Dev | Build the API, generate unit tests |
| UI Dev | Build the frontend components |
| QA Engineer | Generate and run Playwright tests |

See `workshop/workshop-flow.md` for exactly what your role does during the workshop.

---

## Where Agents Live

Copilot agents live on GitHub — not in VS Code.
(Using Claude instead? See [Running the Agentic SDLC with Claude](#running-the-agentic-sdlc-with-claude-claude-code--claude-chat).)

```
github.com → your repo → Agents tab → New session → agent dropdown
```

You will find: `brd-agent`, `user-story-agent`, `design-agent`,
`unit-test-agent`, `playwright-agent`

> If the **Agents tab** is not visible — coding agent is not enabled
> for your account. Enable it in your Copilot settings, or use Claude (below).

---

## Running the Agentic SDLC with Claude (Claude Code & Claude Chat)

Every GitHub Copilot agent, skill and instruction file in this repo has a Claude
equivalent, so you can do the whole workshop with Claude instead of (or alongside) Copilot.

### How the Copilot pieces map to Claude

| GitHub Copilot | Claude Code | Claude Chat (claude.ai) |
|----------------|-------------|-------------------------|
| `.github/copilot-instructions.md` | `CLAUDE.md` (imports it automatically) | Project knowledge file |
| `AGENTS.md` (Coding Agent rules) | `CLAUDE.md` (imports it automatically) | Project knowledge file |
| `.github/agents/*.agent.md` | `.claude/agents/*.md` (subagents) | Project knowledge (`agent-*.md`) |
| `.github/skills/*/SKILL.md` | `.claude/skills/*/SKILL.md` (slash commands) | Uploaded skills (`.zip`) |
| Copilot Coding Agent (assign Issue) | `.github/workflows/claude.yml` (`@claude` / `claude` label) | — |
| Copilot tool approvals | `.claude/settings.json` (pre-approved `npm run`, `gh` commands; blocks `npx prisma`) | — |

> The `.github/` files are the source of truth. If you edit an agent or skill there,
> copy the change to `.claude/` too.

### Option A — Claude Code (terminal or VS Code)

**Setup (one time)**
```bash
npm install -g @anthropic-ai/claude-code   # or install the Claude Code VS Code extension
gh auth login                               # agents use the gh CLI to read Issues / PRs
cd Agentic-SDLC-app2 && claude
```
Run `/agents` to see the agents, and type `/` to see the skills.

**Workshop flow by role**

| Step | Role | Copilot agent | Claude Code command |
|------|------|---------------|---------------------|
| 1. BRD | PM | `brd-agent` | `/create-brd #1` or *"use brd-agent on Issue #1"* |
| 2. User stories | PM | `user-story-agent` | `/create-user-stories` → commit `issues/*.md` → push (the workflow creates the Issues) |
| 3. Plan | PM | `plan-agent` | `/create-plan` |
| 4. Design + schema | Architect | `design-agent` | `/create-design-doc` |
| 5. Build [DATABASE] / [BACKEND] / [FRONTEND] | Architect / Backend / UI | Assign Issue to Copilot | Locally: *"Implement Issue #N following AGENTS.md"*, or on GitHub: comment `@claude implement this issue` |
| 6. Review PR | Any | `review-agent` | `/review-pull-request #PR` |
| 7. Unit tests | Backend Dev | `unit-test-agent` | `/generate-jest-tests` |
| 8. E2E tests | QA | `playwright-agent` | `/generate-playwright-tests` → `npx playwright test` |

Skills (`/create-brd`, …) run in your main session. Agents (*"use design-agent to …"*)
run as separate subagents with their own context. Use whichever you like.

### Option B — Claude on GitHub (the Coding Agent equivalent)

1. Install the Claude GitHub App on the repo. The easiest way is to run `/install-github-app` in Claude Code.
2. Add the repo secret `ANTHROPIC_API_KEY`.
3. On any Issue or PR, comment `@claude <task>` (e.g. `@claude implement this issue`),
   or add the `claude` label to an Issue. Claude follows `CLAUDE.md` → `AGENTS.md`
   and opens a PR, just like the Copilot Coding Agent.

### Option C — Claude Chat (claude.ai), no install needed

Chat can't run commands or open PRs, but it can write the documents (BRD, stories, plan,
design, tests) for you to paste into the repo.

```bash
./scripts/package-claude-chat.sh    # builds dist/claude-chat/
```
1. **Skills:** in claude.ai go to **Settings → Capabilities → Skills → Upload skill** and
   upload each zip from `dist/claude-chat/skills/`.
2. **Project:** create a Claude Project (e.g. "Agentic SDLC") and add every file in
   `dist/claude-chat/project-knowledge/` as project knowledge.
3. In the project chat, paste the Issue or requirement text and ask, e.g.
   *"Create the BRD for this requirement"* or *"Act as design-agent and produce the design doc"*.
4. Save the output to the path the skill names (e.g. `docs/requirements/BRD.md`) and commit it.

---

## Tech Stack

```
Backend   Node.js + Express + Prisma + SQLite
Frontend  React + Vite + TypeScript
Tests     Jest (unit) + Playwright (e2e)
Database  SQLite (local file — no setup needed)
```
