# [BACKEND] Redemption Export

## User Story
As an Admin I want to query and export Redemption records via the API so that I can reconcile Perk discounts with sponsors

## Assignment Order
Step 5 of 8 — assign after: [BACKEND] Perk Application is merged
Tier: BACKEND — extension slice

## Context
Pre-built from copilot-instructions.md:
- JWT auth middleware → src/backend/middleware/auth.ts
- Express app entry → src/backend/index.ts
Previously added:
- Redemption model (database-perk-application)
- Transaction endpoint that creates Redemption records (backend-perk-application)
This issue adds Redemption query and CSV export endpoints.
Note: Register /api/redemptions/export BEFORE any /api/redemptions/:id route in index.ts to prevent the static path being shadowed by the parameterised route.

## API Endpoints
- GET /api/redemptions — list all Redemption records
  Response: 200 [{ id, offerId, transactionId, merchantId, skus, quantity, grossAmount, discountAmount, memberToken, createdAt }]
  Auth: required (Admin JWT)

- GET /api/redemptions/export — download all Redemption records as a CSV file
  Response: 200 CSV file with Content-Type: text/csv and Content-Disposition: attachment; filename="redemptions.csv"
  CSV columns (header row): offer_id, transaction_id, merchant_id, timestamp, skus, quantity, gross_amount, discount_amount, member_token
  Auth: required (Admin JWT)

## Acceptance Criteria
- [ ] GET /api/redemptions returns 200 with an array of all Redemption records including seeded records
- [ ] GET /api/redemptions/export returns a valid CSV file with the correct column headers and one data row per Redemption record
- [ ] Both endpoints return 401 without a valid Admin JWT
- [ ] Neither endpoint allows deletion or modification of Redemption records (read-only)

## FR Coverage
- FR-007: GET /api/redemptions/export returns CSV with all required columns; GET /api/redemptions returns queryable records
- FR-009: Both Admin endpoints require valid JWT; unauthenticated requests return 401
