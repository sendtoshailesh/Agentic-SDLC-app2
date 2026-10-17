# Workshop Flow

Follow the section for your role. Each role has clear steps and handoff points.
When you finish your steps — wait for the next role to complete theirs before continuing.

---

## The Pipeline

```
PM → brd-agent → user-story-agent → Issues created
                                         ↓
Architect → design-agent → assign DATABASE Issues to Copilot
                                         ↓
Backend Dev → assign BACKEND Issues to Copilot → unit-test-agent
                                         ↓
UI Dev → assign FRONTEND Issues to Copilot
                                         ↓
QA → playwright-agent → run tests
```

---

> **Quick start:** To begin the workshop immediately, skip to [🟦 PM — Product Manager](#-pm--product-manager).
> The sections below explain how GitHub.com and VS Code agents work — useful background but not required to proceed.

## How Agents Work

You can run agents from **GitHub.com** or from **VS Code**. Pick one approach and use it consistently throughout the workshop.

### Option A — GitHub.com (Agents Tab)

1. Go to your repo on GitHub → click the **Agents tab**
2. Click **New session**
3. Click the agent dropdown → select the agent you want
4. Type your instruction and press Enter
5. The agent works autonomously and raises a **Pull Request**
6. You review the PR and merge it — or add a comment asking for changes

> You do not write code. You review what the agent produces and decide if it is good enough.

---

### Option B — VS Code (Cloud Agents)

**One-time setup — complete this before the workshop starts:**

1. Install **VS Code** (latest stable or Insiders build)
2. Install the **GitHub Copilot** and **GitHub Copilot Chat** extensions
3. Sign in to GitHub via the extensions

> No MCP or Personal Access Token configuration is required.
> Cloud agents run on GitHub's remote infrastructure and have native access to your repository and Issues.

**Running an agent in VS Code:**

1. Open Copilot Chat (`Ctrl+Alt+I` / `Cmd+Alt+I`)
2. Click **New Chat** → click the session type dropdown → select **Cloud**
3. Click the agent picker → select the agent (e.g. `brd-agent`)
4. Type your instruction and press Enter
5. The agent runs remotely on GitHub's infrastructure, pushes a branch,
   and opens a **Pull Request** on GitHub automatically
6. Go to the **Pull Requests tab** on GitHub.com to review and merge — same as Option A

> See [VS Code Cloud Agents documentation](https://code.visualstudio.com/docs/copilot/agents/cloud-agents) for more detail.

---

## How to Review a Pull Request

> **GitHub.com:** This step is always done on GitHub.com regardless of which option you used to run the agent.

1. Go to the **Pull Requests tab** on GitHub
2. Open the PR raised by the agent
3. Click the **Files changed** tab to see what was produced
4. Check the items listed in your role's review checklist below
5. Click **Review changes** (top-right of the Files changed tab)
6. Add an overall comment if needed
7. Select **Approve** if satisfied, or **Request changes** if something needs fixing
8. Click **Submit review**
9. Once approved → click **Merge pull request** → **Confirm merge**

> If you requested changes, the agent will receive your feedback and push an update to the same PR — do not close the PR.

---

## 🟦 PM — Product Manager

You go first. No one can start until you finish.

### Step 1 — Create the BRD

Go to the **Agents tab** → New session → select **brd-agent**

Type:
```
Create a BRD from Issue #1  -- Note issue number could be different in your case. Enter appropriate number
```
and press **Enter**

The agent will work autonomously. Watch the session progress — when it finishes it will display a **View pull request** link.

**Open the Pull Request:**
1. Click **View pull request** in the agent session (or go to the **Pull Requests tab** on GitHub.com)
2. Open the PR — the title should be something like `feat: create BRD [brd-agent]`
3. Click **Files changed** to see `docs/requirements/BRD.md`

**Verify the content — check these things:**
- The feature described in Issue  is fully captured
- There is a numbered list of Functional Requirements (FR-001, FR-002 etc.)
- Out of scope items are explicitly listed
- Nothing important from Issue #1 is missing

**If changes are needed:**
1. Click the **Files changed** tab → click **Review changes**
2. Add a comment describing what needs fixing
3. Select **Request changes** → click **Submit review**
4. The agent will receive the review and push an updated commit to the same PR — do not close it

**When satisfied — merge the PR:**
1. Click **Ready for review** if the PR is in draft state
2. Click **Merge pull request** → **Confirm merge**
3. The `docs/requirements/BRD.md` file is now on the `main` branch

---

### Step 2 — Create User Stories

Go to the **Agents tab** → New session → select **user-story-agent**

Type:
```
Create user stories from the BRD
```
and press **Enter**

Wait for the agent to raise a PR with files in the `issues/` folder.

**Review — check these things:**
- File names use the correct domain language (e.g. `database-room-catalogue.md` not `database-items.md`)
- Every issue file has an `## Assignment Order` section at the top
- The DATABASE issue has a `## Seed Data` section
- The FRONTEND issue lists `data-testid` values for every interactive element
- The PLAYWRIGHT issue references the same `data-testid` values as the FRONTEND issue

**Merge when satisfied.**

> After you merge, GitHub Actions automatically creates the Issues with labels.
> Check the **Issues tab** — you should see all issues appear within 1-2 minutes.

**Hand off to Architect** — tell them Issues are ready.

---

## 🟨 Architect

Wait for PM to merge both PRs and confirm Issues are visible in the Issues tab.

### Step 1 — Create Design Document

**If using GitHub.com:** Go to the **Agents tab** → New session → select **design-agent**

**If using VS Code:** Open Copilot Chat → New Chat → Cloud → select `design-agent`

Type:
```
Create the design document and schema from the BRD and Issues
```
and press **Enter**

Wait for PR with `docs/design/design-doc.md` and updated `src/backend/prisma/schema.prisma`

**Review — check these things:**
Review the design doc against the user stories and BRD to confirm the schema and API design are complete and consistent. 

**Merge when satisfied.**

---
## 🟥 Database Dev

### Step 1 — Assign DATABASE Issues to Copilot

**If using GitHub.com:** Open the **Issues tab** → find the issue labelled `database` with the lowest Assignment Order step → open it → Assignees → select **Copilot**

**If using VS Code:** Open Copilot Chat → New Chat → select **Cloud** → describe the task referencing the Issue number and press **Enter**

Find the issue labelled `database` with the lowest Assignment Order step and read the `## Assignment Order` section → it tells you exactly when to assign it.

```
[GitHub.com]  Issues tab → open [DATABASE] Issue → Assignees → select Copilot
[VS Code]     Copilot Chat → New Chat → Cloud → describe task
```

> If Copilot does not appear as an assignee option on GitHub.com — coding agent is not
> enabled for your account. Enable it in Copilot settings, or use Claude (see README).

Wait for PR with updated schema, migration files, and seed data.

**Optional — use review-agent to check the PR automatically:**

- **If using GitHub.com:** Agents tab → New session → `review-agent` → type `Review the PR for Issue #N`
- **If using VS Code:** Open Copilot Chat → New Chat → Cloud → select `review-agent` → type `Review the PR for Issue #N` and press **Enter**

The review-agent will post a structured pass/fail checklist as a PR review comment.

**If reviewing manually, check these things:**
- Migration runs without errors (check the PR description)
- `seed.ts` has at least 3 realistic sample records for domain tables
- The pre-built `User` model and test user seed are unchanged
- No frontend or backend route files were modified
- All categorical fields (status, type) use Prisma `enum` — not `String`

**Merge → then assign the next DATABASE Issue (if any) following Assignment Order.**

**Hand off to Backend Dev** once all DATABASE Issues are merged.
Repeat the steps for all database user stories.
---

## 🟥 Backend Dev

Wait for Architect to confirm all DATABASE Issues are merged.

### Step 1 — Assign BACKEND Issues to Copilot

**If using GitHub.com:** Open the **Issues tab** → find the issue labelled `backend` with the lowest Assignment Order step → open it → Assignees → select **Copilot**

**If using VS Code:** Open Copilot Chat → New Chat → select **Cloud** → describe the task referencing the Issue number and press **Enter**

Find the issue labelled `backend` with the lowest Assignment Order step and read the `## Assignment Order` section → it tells you exactly when to assign it.

```
[GitHub.com]  Issues tab → open [BACKEND] Issue → Assignees → select Copilot
[VS Code]     Copilot Chat → New Chat → Cloud → describe task
```

> If Copilot does not appear as an assignee option on GitHub.com — coding agent is not
> enabled for your account. Enable it in Copilot settings, or use Claude (see README).

Wait for PR with new files in `src/backend/routes/` and `src/backend/controllers/`

**Optional — use review-agent to check the PR automatically:**

- **If using GitHub.com:** Agents tab → New session → `review-agent` → type `Review the PR for Issue #N`
- **If using VS Code:** Open Copilot Chat → New Chat → Cloud → select `review-agent` → type `Review the PR for Issue #N` and press **Enter**

The review-agent will post a structured pass/fail checklist as a PR review comment.

**If reviewing manually, check these things:**
- All endpoints listed in the Issue are implemented
- Every protected endpoint uses the auth middleware
- Business rules are enforced (e.g. double booking check, capacity limit)
- No frontend files were modified
- Response shapes match what the Issue specifies
- No `any` types used in TypeScript

**Merge → then assign the next BACKEND Issue (if any) following Assignment Order.**

---

### Step 2 — Generate Unit Tests

**If using GitHub.com:** Go to the **Agents tab** → New session → select **unit-test-agent**

**If using VS Code:** Open Copilot Chat → New Chat → Cloud → select `unit-test-agent`

Type:
```
Generate Jest unit tests from the [BACKEND] Issue
```
and press **Enter**

Wait for PR with test files in `src/backend/__tests__/`

**Review — check these things:**
- Every endpoint has at least a happy path test and an auth test
- No production code files were modified — test files only

**Merge when satisfied.**

**Hand off to UI Dev.**

---

## 🟩 UI Dev

Wait for Backend Dev to confirm all BACKEND Issues are merged.

### Step 1 — Assign FRONTEND Issues to Copilot

**If using GitHub.com:** Open the **Issues tab** → find the issue labelled `frontend` with the lowest Assignment Order step → open it → Assignees → select **Copilot**

**If using VS Code:** Open Copilot Chat → New Chat → select **Cloud** → describe the task referencing the Issue number and press **Enter**

Find the issue labelled `frontend` with the lowest Assignment Order step and read the `## Assignment Order` section → it tells you exactly when to assign it.

```
[GitHub.com]  Issues tab → open [FRONTEND] Issue → Assignees → select Copilot
[VS Code]     Copilot Chat → New Chat → Cloud → describe task
```

> If Copilot does not appear as an assignee option on GitHub.com — coding agent is not
> enabled for your account. Enable it in Copilot settings, or use Claude (see README).

Wait for PR with new pages and components in `src/frontend/src/`

**Optional — use review-agent to check the PR automatically:**

- **If using GitHub.com:** Agents tab → New session → `review-agent` → type `Review the PR for Issue #N`
- **If using VS Code:** Open Copilot Chat → New Chat → Cloud → select `review-agent` → type `Review the PR for Issue #N` and press **Enter**

The review-agent will post a structured pass/fail checklist as a PR review comment.

**If reviewing manually, check these things:**
- The HomePage no longer shows "Features coming soon"
- Every `data-testid` value listed in the Issue is present on the correct element
- The UI calls the correct API endpoints (check the Issue for endpoint paths)
- No backend files were modified
- No `any` types used in TypeScript

**Merge → then assign the next FRONTEND Issue (if any) following Assignment Order.**

**Hand off to QA Engineer.**

---

## 🟪 QA Engineer

Wait for UI Dev to confirm all FRONTEND Issues are merged.

### Step 1 — Generate Playwright Tests

**If using GitHub.com:** Go to the **Agents tab** → New session → select **playwright-agent**

**If using VS Code:** Open Copilot Chat → New Chat → Cloud → select `playwright-agent`

Type:
```
Generate Playwright tests from the [PLAYWRIGHT] Issue
```
and press **Enter**

Wait for PR with test files in `e2e/`

**Review — check these things:**
- All selectors use `data-testid` — no CSS class selectors or text content selectors
- The full user journey from the PLAYWRIGHT Issue is covered
- Login is handled in `beforeEach` — not repeated inside every test
- The PR description notes any missing `data-testid` values

**Merge when satisfied.**

---

### Step 2 — Run the Tests

Make sure both servers are running:

```bash
# Terminal 1
cd src/backend && npm run dev

# Terminal 2
cd src/frontend && npm run dev
```

Run Playwright:
```bash
npx playwright test --ui
```

**All green = done ✅**

---

## Troubleshooting

**Agent not in the dropdown**
- Refresh the page and try again
- If still missing — coding agent may not be enabled for your account
- Enable it in your Copilot settings — this is not a repo setting

**Copilot not available as assignee on an Issue**
- Coding agent is not enabled for your account
- Or switch to Claude — see the README

**PR raised but looks wrong**
- Scroll to the bottom of the PR
- Leave a comment describing what needs fixing
- The agent will update and push again — do not close the PR

**Issues not created after PM merges**
- Check the **Actions tab** for a failed workflow run
- Tell your facilitator — this is a setup issue not your fault

**Frontend shows a blank page**
- The DATABASE seed data may be missing
- Tell your facilitator

**Playwright test fails with "element not found"**
- A `data-testid` is missing from a component
- Open the component file, add the missing attribute, re-run the tests

**App shows wrong name in the browser tab**
- Check `src/frontend/.env` has `VITE_APP_NAME` set correctly
- Restart the frontend dev server after editing `.env`

**Login does not work**
```
Email:    test@example.com
Password: password123
```
- If still failing — run `cd src/backend && npx prisma db seed`

---

## VS Code Troubleshooting

**Agent not in the VS Code agent picker**
- Make sure you selected **Cloud** as the session type — not Ask or Edit mode
- The `.github/agents/` folder must be present on the default branch of the repo
- Reload VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window") and try again

**Cloud session type not available in the New Chat dropdown**
- Update VS Code and the GitHub Copilot Chat extension to the latest version
- Sign out and sign back in to GitHub via the Copilot extension

**Agent runs but no PR appears**
- Check the **Pull Requests tab** on GitHub.com — the PR may already be there
- If the session timed out, re-run the agent with the same instruction

**Assigning Issues to the Copilot coding agent from VS Code**
- Open Copilot Chat → New Chat → select **Cloud** as the session type
- Describe the task and reference the Issue number
- See [VS Code Cloud Agents documentation](https://code.visualstudio.com/docs/copilot/agents/cloud-agents)
