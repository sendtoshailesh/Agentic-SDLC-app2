# [BACKEND] Offer Management

## User Story
As an Admin I want to create, list, and update Offers via the API so that I can configure Perk discounts for Members

## Assignment Order
Step 3 of 8 — assign after: [DATABASE] Perk Application is merged
Tier: BACKEND — primary slice

## Context
Pre-built from copilot-instructions.md:
- JWT auth middleware → src/backend/middleware/auth.ts
- Auth routes → src/backend/routes/auth.ts
- Express app entry → src/backend/index.ts
Previously added:
- Offer model with OfferStatus enum (database-offer-management)
This issue adds only the Offer endpoints required for this slice.

## API Endpoints
- POST /api/offers — create a new Offer
  Request: { status: "ACTIVE" | "INACTIVE", startDate: string (ISO), endDate: string (ISO), merchantId: string, skus: string, discountAmount: number }
  Response: 201 { id, status, startDate, endDate, merchantId, skus, discountAmount, createdAt }
  Auth: required (Admin JWT)

- GET /api/offers — list all Offers
  Response: 200 [{ id, status, startDate, endDate, merchantId, skus, discountAmount, createdAt }]
  Auth: required (Admin JWT)

- PATCH /api/offers/:id — update an Offer's status
  Request: { status: "ACTIVE" | "INACTIVE" }
  Response: 200 { id, status }
  Auth: required (Admin JWT)

## Acceptance Criteria
- [ ] POST /api/offers returns 201 with the persisted Offer; returns 400 when any required field is missing
- [ ] GET /api/offers returns 200 with an array of all Offers including seeded records
- [ ] PATCH /api/offers/:id returns 200 with updated status; returns 404 for an unknown id
- [ ] All three endpoints return 401 without a valid JWT

## FR Coverage
- FR-001: POST /api/offers creates an Offer with all required fields; rejects missing fields with 400
- FR-002: GET /api/offers lists all Offers; PATCH /api/offers/:id updates status
- FR-009: All Admin endpoints require valid JWT; unauthenticated requests return 401
