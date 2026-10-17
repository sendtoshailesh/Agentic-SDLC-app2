# [BACKEND] Perk Application

## User Story
As a Member I want to submit a transaction so that the system evaluates Active Offers, applies any matching Perk discount, and returns the result including Perk outcome

## Assignment Order
Step 4 of 8 — assign after: [BACKEND] Offer Management is merged
Tier: BACKEND — extension slice

## Context
Pre-built from copilot-instructions.md:
- JWT auth middleware → src/backend/middleware/auth.ts
- Express app entry → src/backend/index.ts
Previously added:
- Offer model with OfferStatus enum (database-offer-management)
- Redemption model (database-perk-application)
- Offer endpoints (backend-offer-management)
This issue adds the transaction submission and Perk evaluation endpoint.

## API Endpoints
- POST /api/transactions — submit a transaction and evaluate Perk eligibility
  Request: { memberId: string, merchantId: string, lineItems: [{ sku: string, quantity: number, unitPrice: number }] }
  Response (perk applied):   200 { transaction_id, gross_amount, discount_amount, net_amount, perk_applied: true, offer_id }
  Response (no match):       200 { transaction_id, gross_amount, discount_amount: 0, net_amount, perk_applied: false }
  Response (perk failure):   200 { transaction_id, gross_amount, discount_amount: 0, net_amount, perk_applied: false, perk_error: string }
  Auth: required (Member JWT)

Perk evaluation logic:
1. Compute gross_amount as sum of (unitPrice × quantity) across all lineItems
2. Find Active Offers (status ACTIVE) where merchantId matches exactly
3. Among those, find one where current date is within startDate–endDate AND at least one lineItem SKU is in the offer's skus list
4. If one match found: set discount_amount to offer.discountAmount, net_amount to gross_amount − discount_amount, create a Redemption record, return perk_applied: true and offer_id
5. If no match: return perk_applied: false, discount_amount: 0, net_amount: gross_amount
6. If evaluation throws an internal error: return perk_applied: false, perk_error with error message — do not block the transaction

Member token: generate as SHA-256 hex digest of memberId and store in the Redemption record

## Acceptance Criteria
- [ ] POST /api/transactions returns 401 for unauthenticated requests
- [ ] A matching Active Offer produces perk_applied: true with correct discount_amount and creates a Redemption record in the database
- [ ] No matching Offer produces perk_applied: false with discount_amount: 0 and no Redemption record created
- [ ] An internal Perk evaluation error produces perk_applied: false with perk_error populated and does not block the transaction response

## FR Coverage
- FR-003: Transaction endpoint evaluates whether exactly one Active Offer matches merchant, SKU, and date range
- FR-004: Matching Offer computes discount_amount and returns net_amount (gross minus discount)
- FR-005: Internal Perk failure sets perk_applied: false and perk_error without blocking the transaction
- FR-006: Successful Perk application creates a Redemption record with all required audit fields
- FR-008: POST /api/transactions requires JWT authentication; unauthenticated requests return 401
