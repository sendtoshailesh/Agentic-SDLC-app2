# [PLAYWRIGHT] Perk Application Platform

## User Story
As a QA engineer I want to verify the Perk Application Platform journey end to end

## Assignment Order
Step 8 of 8 — assign after: [FRONTEND] Redemption Export is merged
Tier: PLAYWRIGHT — assign this last, after all FRONTEND Issues are merged

## Primary Journey — Offer Management
One action per step with expected result:
1. Navigate to the app root URL — expect the login page to be visible
2. Fill the email field with "test@example.com" and the password field with "password123", click the login submit button — expect redirect to the HomePage
3. Expect `offer-list` to be visible and at least one `offer-item` row to be present (seeded Offers)
4. Click `create-offer-button` — expect `offer-form` to be visible
5. Fill `offer-merchant-input` with "MERCHANT_TEST", `offer-sku-input` with "SKU_Z", `offer-discount-input` with "15", `offer-start-date-input` with "2026-01-01", `offer-end-date-input` with "2026-12-31", select "ACTIVE" in `offer-status-select`
6. Click `offer-submit-button` — expect a new `offer-item` containing "MERCHANT_TEST" to appear in `offer-list` without a full page reload
7. Locate the new Offer's `toggle-status-button` and click it — expect the `offer-status-badge` for that row to change from "ACTIVE" to "INACTIVE"

## Extension Journey — Redemption Export
> Only run if [FRONTEND] Redemption Export is implemented and merged.

1. Click the "Redemptions" link in the Navbar — expect navigation to the Redemptions page
2. Expect `redemption-list` to be visible and at least one `redemption-item` row to be present (seeded Redemptions)
3. Click `export-csv-button` — expect a file download to be triggered

## Test Credentials
- Email:    test@example.com
- Password: password123

## data-testid Reference
These must match the data-testid values in the FRONTEND issues exactly:
- `offer-list` — assert visible after login; confirm at least one `offer-item` is rendered
- `offer-item` — assert at least one row present in `offer-list`; locate the newly created Offer row
- `offer-status-badge` — assert badge text changes from "ACTIVE" to "INACTIVE" after toggle
- `create-offer-button` — click to open CreateOfferForm
- `offer-form` — assert visible after clicking `create-offer-button`
- `offer-merchant-input` — fill with "MERCHANT_TEST"
- `offer-sku-input` — fill with "SKU_Z"
- `offer-discount-input` — fill with "15"
- `offer-start-date-input` — fill with "2026-01-01"
- `offer-end-date-input` — fill with "2026-12-31"
- `offer-status-select` — select "ACTIVE"
- `offer-submit-button` — click to submit CreateOfferForm
- `toggle-status-button` — click to toggle offer status; assert `offer-status-badge` changes to "INACTIVE"
- `redemption-list` — assert visible on the Redemptions page
- `redemption-item` — assert at least one row present in `redemption-list`
- `export-csv-button` — click to trigger CSV file download

## Acceptance Criteria
- [ ] Full offer management journey passes without errors: login → view list → create offer → offer appears in list → toggle status → badge updates
- [ ] Status badge reflects "INACTIVE" after toggle — assert toBeDisabled() is not used; assert text content change
- [ ] All selectors use data-testid only — no CSS classes or text content selectors
- [ ] Redemptions page shows seeded records and clicking export-csv-button triggers a file download

## FR Coverage
- FR-001: E2E creates an Offer via the UI and asserts it appears in the list
- FR-002: E2E toggles Offer status and asserts the status badge updates
- FR-007: E2E navigates to Redemptions page and triggers CSV download via export-csv-button

