---
name: generate-junit-tests
description: Generates a JUnit 5 + REST Assured test suite for backend API endpoints
  and controllers. Use when asked to generate unit tests, integration tests, API
  tests, or a test suite for backend code.
---

# Skill — Generate JUnit 5 + REST Assured Tests

## Before You Write Anything

Read these files first:
1. `.github/copilot-instructions.md` — test credentials, coding standards
2. The [BACKEND] GitHub Issue — what endpoints were built
3. `src/backend/src/main/java/com/workshop/app/controller/` — actual implemented controllers
4. `src/backend/src/main/java/com/workshop/app/service/` — actual implemented business logic
5. `docs/design/design-doc.md` — API contracts and response shapes
6. `src/backend/src/main/java/com/workshop/app/model/` — JPA entity field names for mock setup

Derive all test content from the actual code — do not invent endpoints
or response shapes. Test what was built, not what you assume exists.

---

## Steps
1. Read actual controller and service files — identify every endpoint
2. For each endpoint write tests covering: happy path, auth, validation
3. Generate test classes with proper Spring Boot test configuration
4. **Raise a PR — handle re-runs correctly:**
   - Check whether any files already exist in `src/backend/src/test/java/com/workshop/app/`
     on the `main` branch.
   - If they do **not** exist: create a new branch named `test/junit`, push all test files,
     and open a PR titled `test: JUnit 5 + REST Assured tests`.
   - If they **already exist** (a previous test PR was merged): create a new branch named
     `test/junit-v{N}` (increment N until the branch name is free), push the updated files,
     and open a new PR titled `test: update JUnit 5 + REST Assured tests`.
     Do **not** attempt to reopen or update the already-merged PR — create a fresh one.
   - If an **open** PR for this branch already exists (not yet merged): push the updated
     files to that same branch to update the existing PR — do not open a duplicate.

---

## Test File Structure

```java
package com.workshop.app;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

// Feature: {feature name — from the [BACKEND] Issue}
// Source: GitHub Issue #{number}

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class {FeatureName}ControllerTest {

    @LocalServerPort
    private int port;

    private String authToken;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.basePath = "/api";

        // Login with test credentials from copilot-instructions.md
        authToken = given()
            .contentType(ContentType.JSON)
            .body("""
                {
                    "email": "test@example.com",
                    "password": "password123"
                }
                """)
            .when()
            .post("/auth/login")
            .then()
            .statusCode(200)
            .extract()
            .path("token");
    }

    @Nested
    @DisplayName("{METHOD} /api/{path}")
    class {EndpointName}Tests {

        @Test
        @DisplayName("should return {status} on success")
        void happyPath() {
            // arrange — set up test data

            // act + assert — make request and verify response
            given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
            .when()
                .get("/{path}")
            .then()
                .statusCode(200)
                .body("size()", greaterThan(0))
                .body("[0].id", notNullValue());
        }

        @Test
        @DisplayName("should return 401 without auth token")
        void noAuth() {
            when()
                .get("/{path}")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("should return 401 with malformed token")
        void malformedAuth() {
            given()
                .header("Authorization", "Bearer not-a-valid-token")
            .when()
                .get("/{path}")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("should return 400 if required fields missing")
        void missingFields() {
            given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body("{}")
            .when()
                .post("/{path}")
            .then()
                .statusCode(400)
                .body("error", notNullValue());
        }
    }
}
```

---

## Alternative Pattern — MockMvc with @MockBean

For unit tests that do not need the full application context:

```java
package com.workshop.app;

import com.workshop.app.controller.{FeatureName}Controller;
import com.workshop.app.service.{FeatureName}Service;
import com.workshop.app.config.JwtUtil;
import com.workshop.app.config.SecurityConfig;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest({FeatureName}Controller.class)
@Import(SecurityConfig.class)
class {FeatureName}ControllerUnitTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private {FeatureName}Service service;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    @DisplayName("should return list of items")
    void listItems() throws Exception {
        // arrange
        when(service.findAll()).thenReturn(List.of(/* mock data */));
        when(jwtUtil.validateToken(anyString())).thenReturn(true);
        when(jwtUtil.extractUsername(anyString())).thenReturn("test@example.com");

        // act + assert
        mockMvc.perform(get("/api/{path}")
                .header("Authorization", "Bearer valid-token"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].id").exists());
    }
}
```

---

## Coverage Requirements

Every endpoint must have at minimum:

| Test Type | What It Verifies |
|-----------|-----------------|
| Happy path | Correct input returns correct status and response shape |
| Auth test | No token returns 401 |
| Auth test | Malformed token returns 401 |
| Validation | Missing required fields returns 400 |
| Edge case | At least one edge case specific to the endpoint's logic |

---

## Testing Patterns

### Always use Arrange / Act / Assert
```java
@Test
@DisplayName("should create {entity} successfully")
void createEntity() {
    // arrange
    String payload = """
        {
            "title": "Test Item",
            "description": "Test Description"
        }
        """;

    // act + assert
    given()
        .header("Authorization", "Bearer " + authToken)
        .contentType(ContentType.JSON)
        .body(payload)
    .when()
        .post("/{path}")
    .then()
        .statusCode(201)
        .body("id", notNullValue())
        .body("title", equalTo("Test Item"));
}
```

### Validate response shape — not just status
```java
// CORRECT — validates shape matches what Issue specifies
.then()
    .statusCode(200)
    .body("id", notNullValue())
    .body("createdAt", notNullValue())
    .body("items.size()", greaterThan(0));

// WRONG — only checking status is insufficient
.then()
    .statusCode(200);
```

### Auth tests — always three variants
```java
@Test
@DisplayName("should return 401 without token")
void noToken() {
    when()
        .get("/api/{path}")
    .then()
        .statusCode(401);
}

@Test
@DisplayName("should return 401 with malformed token")
void malformedToken() {
    given()
        .header("Authorization", "Bearer not-a-valid-token")
    .when()
        .get("/api/{path}")
    .then()
        .statusCode(401);
}

@Test
@DisplayName("should return 401 with expired token")
void expiredToken() {
    given()
        .header("Authorization", "Bearer expired.jwt.token")
    .when()
        .get("/api/{path}")
    .then()
        .statusCode(401);
}
```

---

## Edge Cases to Always Consider

For any create/write operation:
- Duplicate entry — what does the endpoint return?
- Missing required field — should return 400
- Invalid data type — should return 400

For any read operation:
- Empty result — should return empty array not 404
- Resource not found — should return 404 with `{ "error": "string" }`

For any delete/update:
- Resource belongs to different user — should return 403 or 404
- Resource does not exist — should return 404

---

## Quality Checklist

```
✅ Tests read actual code — no invented endpoints
✅ Every endpoint has happy path, auth, and validation test
✅ Arrange / Act / Assert pattern used throughout
✅ Response shape validated — not just status codes
✅ Test credentials come from copilot-instructions.md
✅ @SpringBootTest or @WebMvcTest used correctly
✅ No production code modified — test files only
✅ Tests are in src/backend/src/test/java/com/workshop/app/
✅ Each test class has @DisplayName for readable output
```
