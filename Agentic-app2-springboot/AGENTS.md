# AGENTS.md

Instructions for GitHub Copilot Coding Agent when assigned a GitHub Issue.

## Before You Start
Read these files first — in this order:
1. `.github/copilot-instructions.md` — project context and standards
2. The assigned GitHub Issue — requirements and acceptance criteria
3. `docs/design/design-doc.md` — architecture and API contracts (if it exists)
4. `src/backend/src/main/java/com/workshop/app/model/` — current data model (JPA entities)

## What Is Pre-built — Do Not Touch
- `src/backend/src/main/java/com/workshop/app/config/SecurityConfig.java` — Spring Security config
- `src/backend/src/main/java/com/workshop/app/config/JwtAuthenticationFilter.java` — JWT filter
- `src/backend/src/main/java/com/workshop/app/config/JwtUtil.java` — JWT utility
- `src/backend/src/main/java/com/workshop/app/controller/AuthController.java` — login/register endpoints
- `src/backend/src/main/java/com/workshop/app/service/AuthService.java` — auth business logic
- `src/backend/src/main/java/com/workshop/app/model/User.java` — User entity (do not modify)
- `src/backend/src/main/java/com/workshop/app/repository/UserRepository.java` — User repo
- `src/backend/src/main/java/com/workshop/app/seed/DataSeeder.java` — test user seed (do not remove existing seed logic)
- `src/backend/src/main/java/com/workshop/app/Application.java` — Spring Boot entry point
- `src/frontend/src/app/app.component.ts` — Angular root component
- `src/frontend/src/app/app.routes.ts` — Angular Router and auth guard
- `src/frontend/src/app/pages/login/` — Login page
- `src/frontend/src/app/pages/register/` — Register page
- `src/frontend/src/app/guards/auth.guard.ts` — Route guard
- `src/frontend/src/app/services/auth.service.ts` — Auth API service

## Issue Assignment Guide

### [DATABASE] Issues — Architect assigns
You are responsible for:
- Adding new JPA entity classes to `src/backend/src/main/java/com/workshop/app/model/`
- Adding new Spring Data JPA repository interfaces to `src/backend/src/main/java/com/workshop/app/repository/`
- Adding domain seed data to `src/backend/src/main/java/com/workshop/app/seed/DataSeeder.java` as specified in the Issue

**Java enums are mandatory — never use String for categorical fields.**
If the Issue specifies `Enum (VALUE1, VALUE2, ...)` for a field, you MUST declare
a proper Java `enum` type — never use `String` or `String // VALUE1 | VALUE2`.
Apply `@Enumerated(EnumType.STRING)` on every enum field in the JPA entity.
Define each enum in its own file or as a nested type within the entity class.
Example:
```java
public enum OfferStatus {
    DRAFT, ACTIVE, SUSPENDED
}

@Entity
public class Offer {
    @Enumerated(EnumType.STRING)
    private OfferStatus status = OfferStatus.DRAFT;
}
```

No migration commands are needed — Hibernate auto-DDL (`spring.jpa.hibernate.ddl-auto=update`)
handles schema changes automatically on application startup.

**Seed data is mandatory — never skip it.**
The [DATABASE] Issue specifies what sample records to create.
Empty domain tables cause the frontend to show a blank page
and Playwright tests to fail — both break the workshop pipeline.
Add seed logic to `DataSeeder.java` — it implements `CommandLineRunner`
and runs automatically on startup.

Do not touch backend controller/service files or frontend files.

### [BACKEND] Issues — Backend Dev assigns
You are responsible for:
- `src/backend/src/main/java/com/workshop/app/controller/` — new controller classes only
- `src/backend/src/main/java/com/workshop/app/service/` — new service classes only
- `src/backend/src/main/java/com/workshop/app/dto/` — new DTO records/classes only

Always use existing Spring Security JWT filter on protected routes.
Do not touch frontend files or JPA entity classes.

### [FRONTEND] Issues — UI Dev assigns
You are responsible for:
- `src/frontend/src/app/pages/` — new and updated page components
- `src/frontend/src/app/components/` — new feature components
- `src/frontend/src/app/services/` — new API service files
- `src/frontend/src/app/components/navbar/` — only if the Issue requires changes

**HomePage update — always required:**
`src/frontend/src/app/pages/home/` currently shows a placeholder.
Replace its content with the primary feature component this Issue builds.
The user must see real feature UI after login — not "Features coming soon".

All interactive elements must have `data-testid` attributes.
The exact `data-testid` values are specified in the Issue.
Do not touch backend files or JPA entity classes.

## Implementation Order
Always implement in this order to avoid dependency failures:
1. [DATABASE] — JPA entities + seed data must exist before API can reference models
2. [BACKEND]  — API must exist before frontend can fetch data
3. [FRONTEND] — connects to working API with real data

## PR Conventions
- Link PR to the originating Issue using `Closes #N`
- PR title format: `feat: {feature name} [{issue type}]`
- Run `mvn clean package` before raising PR — fix all errors
- Run `cd src/frontend && ng build` — confirm it succeeds
- Do not merge your own PR — leave for human review

## Run Commands

```bash
# Backend
cd src/backend && mvn spring-boot:run

# Frontend
cd src/frontend && ng serve

# Build
cd src/backend && mvn clean package
cd src/frontend && ng build

# Database — no commands needed
# Hibernate auto-DDL handles schema on startup (spring.jpa.hibernate.ddl-auto=update)
# DataSeeder.java runs automatically on startup

# Tests
cd src/backend && mvn test
npx playwright test
```

## JPA + SQLite Note
Hibernate auto-DDL (`spring.jpa.hibernate.ddl-auto=update`) manages the SQLite schema.
Java enums with `@Enumerated(EnumType.STRING)` are stored as strings in the database.
Never downgrade enum fields to `String` types. There are no migration commands to run —
schema changes are applied automatically when the application starts.
