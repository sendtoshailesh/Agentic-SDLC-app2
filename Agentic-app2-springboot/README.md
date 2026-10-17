# Agentic SDLC Workshop — Spring Boot + Angular Edition

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
| Java JDK | 21 or higher | `java --version` |
| Maven | 3.9 or higher | `mvn --version` |
| Node.js | 18 or higher | `node --version` |
| Angular CLI | 19.x | `ng version` |
| Git | Any recent | `git --version` |
| VS Code | Latest | — |

### GitHub Access — Required

| Requirement | Details |
|-------------|---------|
| GitHub account | Any GitHub account |
| AI agent | GitHub Copilot with coding agent enabled (Agents tab), **or** Claude — see the root README of this repo |
| Your own copy of the workshop repo | Fork it or click **Use this template** on GitHub |

> ⚠️ **If using GitHub Copilot:** the coding agent must be enabled for your
> account (Copilot settings → Coding agent). If the **Agents tab** is not
> visible in your repo, enable it there — or use Claude instead.

---

## Setup — Do This Before the Workshop Starts

### 1. Clone the workshop repo

Create your own copy of the template (**Use this template** or **Fork**), then clone it:

```bash
git clone https://github.com/[your-account]/[AppName].git
cd [AppName]
```

### 2. Build and start the backend

```bash
cd src/backend
mvn clean package -DskipTests
mvn spring-boot:run
```

The backend starts on **port 8080**. It automatically:
- Creates the SQLite database (`workshop.db`)
- Runs Hibernate DDL to create tables
- Seeds the test user via DataSeeder

### 3. Install and start the frontend

```bash
# Open a new terminal
cd src/frontend
npm install
ng serve
```

The frontend starts on **port 4200** and proxies `/api` calls to port 8080.

### 4. Verify it works

Open http://localhost:4200 in your browser.

Login with:
```
Email:    test@example.com
Password: password123
```

You should see a page that says **"Features coming soon"** after login.
This is correct — the feature is built during the workshop.

---

## After Merging Agent PRs — Run This Every Time

Each time the coding agent raises a PR and you merge it:

```bash
# 1. Pull latest changes
git pull

# 2. Rebuild backend (picks up new entities, controllers, seed data)
cd src/backend
mvn clean package -DskipTests
mvn spring-boot:run

# 3. Restart frontend if new components were added
cd src/frontend
npm install   # only if package.json changed
ng serve
```

> **Why is this needed?**
> The coding agent adds new JPA entities, controllers, and Angular components.
> Maven needs to recompile to pick up the new Java classes, and Hibernate
> auto-DDL creates any new tables on startup. The DataSeeder runs every time
> and adds missing seed records.

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

---

## Where Agents Live

All agents live on GitHub — not in VS Code.

```
github.com → your repo → Agents tab → New session → agent dropdown
```

You will find: `brd-agent`, `user-story-agent`, `design-agent`,
`unit-test-agent`, `playwright-agent`

> If the **Agents tab** is not visible — coding agent is not enabled
> for your account. Enable it in your Copilot settings, or use Claude.

---

## Tech Stack

```
Backend   Java 21 + Spring Boot 3.4 + Spring Data JPA + SQLite
Frontend  Angular 19 + TypeScript
Tests     JUnit 5 + REST Assured (unit) + Playwright (e2e)
Database  SQLite (local file — no setup needed)
Auth      Spring Security + JWT
```
