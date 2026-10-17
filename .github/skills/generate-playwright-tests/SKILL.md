---
name: generate-playwright-tests
description: Generates Playwright E2E test scripts from the [PLAYWRIGHT] GitHub Issue.
  Use when asked to generate E2E tests, Playwright tests, browser tests, or
  end-to-end test scripts.
---

# Skill — Generate Playwright Tests

## Before You Write Anything

Read these files first:
1. `.github/copilot-instructions.md` — test credentials, app context
2. The [PLAYWRIGHT] GitHub Issue — exact journey steps and data-testid values
3. `docs/design/design-doc.md` — data-testid values and component structure
4. `src/frontend/src/` — verify data-testid values exist in components

Derive all selectors from the [PLAYWRIGHT] Issue and design-doc.
Do not invent selectors — if a data-testid is not in the Issue or design-doc,
note it in the PR description as missing.

---

## Steps
1. Read [PLAYWRIGHT] Issue — get journey steps and data-testid reference
2. Read design-doc component tree — verify data-testid values
3. Write test files in `e2e/` folder
4. **Raise a PR — handle re-runs correctly:**
   - Check whether any `e2e/*.spec.ts` files already exist on the `main` branch.
   - If they do **not** exist: create a new branch named `test/playwright`, push all files,
     and open a PR titled `test: Playwright E2E tests`.
   - If they **already exist** (a previous Playwright PR was merged): create a new branch
     named `test/playwright-v{N}` (increment N until the branch name is free), push the
     updated files, and open a new PR titled `test: update Playwright E2E tests`.
     Do **not** attempt to reopen or update the already-merged PR — create a fresh one.
   - If an **open** PR for this branch already exists (not yet merged): push the updated
     files to that same branch to update the existing PR — do not open a duplicate.
   - Note any missing data-testid values in the PR description.

---

## Test File Structure

```typescript
import { test, expect } from '@playwright/test'

// Credentials from copilot-instructions.md
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123'

test.describe('{Feature} journey', () => {

  test.beforeEach(async ({ page }) => {
    // Login before each test — do not repeat this inside tests
    await page.goto('/login')
    await page.getByTestId('email-input').fill(TEST_EMAIL)
    await page.getByTestId('password-input').fill(TEST_PASSWORD)
    await page.getByTestId('login-button').click()
    await page.waitForURL('**/home')
  })

  test('{journey description from [PLAYWRIGHT] Issue}', async ({ page }) => {
    // Follow the steps from the [PLAYWRIGHT] Issue exactly
    // One action per step — assert after each significant action
  })

})
```

---

## Selector Rules — Non-negotiable

```
✅ ALWAYS use: page.getByTestId('{testid}')
❌ NEVER use:  page.locator('.css-class')
❌ NEVER use:  page.locator('#id')
❌ NEVER use:  page.getByText('visible text')
❌ NEVER use:  page.locator('button:nth-child(2)')
```

data-testid values come from the [PLAYWRIGHT] Issue.
If a needed selector is not listed — add a note in the PR description.

---

## Test Structure Rules

### One focused assertion per test
```typescript
// CORRECT — focused test, one thing being verified
test('should show feature list after login', async ({ page }) => {
  await expect(page.getByTestId('feature-list')).toBeVisible()
  await expect(page.getByTestId('feature-item').first()).toBeVisible()
})

// WRONG — testing entire journey in one test is fragile
test('do everything', async ({ page }) => {
  // 20 actions and assertions...
})
```

### Always assert after actions
```typescript
// Every click/fill/navigate needs a following assertion
await page.getByTestId('submit-button').click()
await expect(page.getByTestId('success-message')).toBeVisible() // ← assert

await page.goto('/some-route')
await expect(page.getByTestId('page-heading')).toBeVisible() // ← assert
```

### Use waitForURL or waitFor for navigation
```typescript
await page.getByTestId('nav-link').click()
await page.waitForURL('**/target-path')
// now safe to assert on new page content
```

---

## Journey Mapping

Translate each step in the [PLAYWRIGHT] Issue to a test action:

| Issue step | Playwright action |
|-----------|------------------|
| Navigate to X | `await page.goto('/x')` |
| Click {element} | `await page.getByTestId('{testid}').click()` |
| Fill {field} with {value} | `await page.getByTestId('{testid}').fill('{value}')` |
| Expect {element} visible | `await expect(page.getByTestId('{testid}')).toBeVisible()` |
| Expect {text} | `await expect(page.getByTestId('{testid}')).toContainText('{text}')` |
| Expect count | `await expect(page.getByTestId('{testid}')).toHaveCount({n})` |

---

## Missing data-testid Handling

If a component is missing a required data-testid:
- Do NOT use a CSS fallback selector
- Comment the test step with: `// TODO: data-testid '{name}' missing from component`
- List all missing testids in the PR description under "Missing Selectors"
- The UI Dev must add them before tests can pass

---

## Quality Checklist

```
✅ All selectors use getByTestId — no CSS or text selectors
✅ Credentials use env vars with fallback to copilot-instructions values
✅ beforeEach handles login — not repeated inside individual tests
✅ Every action has a following assertion
✅ Journey steps match the [PLAYWRIGHT] Issue exactly
✅ Missing data-testid values documented in PR description
✅ No production code modified — e2e/ files only
```
