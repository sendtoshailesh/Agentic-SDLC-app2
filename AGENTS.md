# AGENTS.md

Instructions for GitHub Copilot Coding Agent when assigned a GitHub Issue.

## Before You Start
Read these files first — in this order:
1. `.github/copilot-instructions.md` — project context and standards
2. The assigned GitHub Issue — requirements and acceptance criteria
3. `docs/design/design-doc.md` — architecture and API contracts (if it exists)
4. `src/backend/prisma/schema.prisma` — current data model

## What Is Pre-built — Do Not Touch
- `src/backend/middleware/auth.ts` — JWT middleware
- `src/backend/routes/auth.ts` — login and register routes
- `src/backend/index.ts` — Express app entry point
- `src/frontend/src/App.tsx` — React Router and auth guard
- `src/frontend/src/pages/LoginPage.tsx`
- `src/frontend/src/pages/RegisterPage.tsx`
- `src/backend/prisma/schema.prisma` User model — do not modify the User model

## Issue Assignment Guide

### [DATABASE] Issues — Architect assigns
You are responsible for:
- Adding new domain models to `src/backend/prisma/schema.prisma`
- Running `npm run db:migrate` (from `src/backend/`) to create the migration
- Running `npm run db:generate` (from `src/backend/`) to regenerate the client
- Adding domain seed data to `src/backend/prisma/seed.ts` as specified in the Issue
- Running `npm run db:seed` (from `src/backend/`) after adding seed data

**Enums are mandatory — never use String for categorical fields.**
If the Issue specifies `Enum (VALUE1, VALUE2, ...)` for a field, you MUST declare
a proper Prisma `enum` type — never use `String` or `String // VALUE1 | VALUE2`.
Prisma enums ARE supported with SQLite. Define each enum above the model that uses it.
Example:
```prisma
enum OfferStatus {
  DRAFT
  ACTIVE
  SUSPENDED
}

model Offer {
  status OfferStatus @default(DRAFT)
}
```
If a migration or generate command fails with a version error, use the `npm run db:*`
scripts — they use the local Prisma version in node_modules, not any global binary.

**Seed data is mandatory — never skip it.**
The [DATABASE] Issue specifies what sample records to create.
Empty domain tables cause the frontend to show a blank page
and Playwright tests to fail — both break the workshop pipeline.

Do not touch backend or frontend files.

### [BACKEND] Issues — Backend Dev assigns
You are responsible for:
- `src/backend/routes/` — new route files only
- `src/backend/controllers/` — new controller files only
- `src/backend/services/` — new service files only

Always use existing auth middleware on protected routes.
Do not touch frontend files or schema.prisma.

### [FRONTEND] Issues — UI Dev assigns
You are responsible for:
- `src/frontend/src/pages/` — new and updated page files
- `src/frontend/src/components/` — new component files
- `src/frontend/src/context/` — new context files
- `src/frontend/src/services/` — new API service files
- `src/frontend/src/components/Navbar.tsx` — only if the Issue requires changes

**HomePage update — always required:**
`src/frontend/src/pages/HomePage.tsx` currently shows a placeholder.
Replace its content with the primary feature component this Issue builds.
The user must see real feature UI after login — not "Features coming soon".

All interactive elements must have `data-testid` attributes.
The exact `data-testid` values are specified in the Issue.
Do not touch backend files or schema.prisma.

## Implementation Order
Always implement in this order to avoid dependency failures:
1. [DATABASE] — schema + seed data must exist before API can reference models
2. [BACKEND]  — API must exist before frontend can fetch data
3. [FRONTEND] — connects to working API with real data

## PR Conventions
- Link PR to the originating Issue using `Closes #N`
- PR title format: `feat: {feature name} [{issue type}]`
- Run `npm run lint` before raising PR — fix all errors
- Run `npm run build` — confirm it succeeds
- Do not merge your own PR — leave for human review

## Run Commands

> **WARNING — Never use `npx prisma ...` for database commands.**
> `npx` fetches the latest Prisma version from npm (currently v7+), which is incompatible
> with this project's Prisma v5 setup and will fail with "No seed command configured".
> Always use the `npm run db:*` scripts below — they use the local version in `node_modules`.

```bash
# Backend
cd src/backend && npm run dev

# Frontend
cd src/frontend && npm run dev

# Database — always run from src/backend/ using npm scripts
# This ensures the LOCAL Prisma version (^5.0.0) is used, not any globally installed version
cd src/backend
npm run db:migrate   # ✅ DO THIS — never: npx prisma migrate dev
npm run db:generate  # ✅ DO THIS — never: npx prisma generate
npm run db:seed      # ✅ DO THIS — never: npx prisma db seed

# Tests
npm run test
npx playwright test
```

## Prisma + SQLite Note
Prisma enums ARE supported with SQLite — Prisma maps them to strings in the database internally.
If `prisma validate` or `prisma migrate dev` fails with a version error, it means a globally
installed Prisma is being invoked instead of the local one. Always use the `npm run db:*` scripts
above, which resolve through `node_modules/.bin/prisma` and use the correct local version.
Never downgrade enum fields to `String` types to work around a tooling version mismatch.
