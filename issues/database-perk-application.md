# [DATABASE] Perk Application

## User Story
As a system I need a Redemption model so that every successful Perk application is recorded with full audit detail for sponsor reconciliation

## Assignment Order
Step 2 of 8 — assign after: [DATABASE] Offer Management is merged
Tier: DATABASE — extension slice

## Context
Pre-built models from copilot-instructions.md:
- User model in src/backend/prisma/schema.prisma
Previously added:
- Offer model and OfferStatus enum (database-offer-management)
This issue adds only the Redemption model required for this slice.

## Models to Add
Redemption
- id: Int @id @default(autoincrement())
- offerId: Int — foreign key to Offer
- transactionId: String — UUID generated at transaction time
- merchantId: String — merchant ID from the transaction payload
- skus: String — comma-separated SKUs from the matched line items
- quantity: Int — total quantity of matched line items
- grossAmount: Float — gross transaction amount before discount
- discountAmount: Float — Perk discount applied
- memberToken: String — one-way hash (SHA-256) of the member identifier
- createdAt: DateTime @default(now())

## Relationships
- Redemption belongs to Offer via offerId (Offer.id)
- Redemption records must not be deleted or modified once created (no soft-delete, no update mutations)

## Seed Data
Add realistic sample data to src/backend/prisma/seed.ts so the app is
usable immediately after migration — never leave domain tables empty.

Redemption — add 3 sample records referencing the seeded Offers:
- Redemption 1: offerId 1, transactionId "txn-001", merchantId "MERCHANT_001", skus "SKU_A", quantity 2, grossAmount 50.00, discountAmount 5.00, memberToken "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2"
- Redemption 2: offerId 2, transactionId "txn-002", merchantId "MERCHANT_002", skus "SKU_C", quantity 1, grossAmount 80.00, discountAmount 10.00, memberToken "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3"
- Redemption 3: offerId 4, transactionId "txn-003", merchantId "MERCHANT_003", skus "SKU_E", quantity 3, grossAmount 120.00, discountAmount 7.50, memberToken "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2"

Seed data is required for:
- Frontend Redemption page to show records after login (not a blank page)
- Playwright tests to verify the CSV export contains real data

## Acceptance Criteria
- [ ] Migration runs without errors
- [ ] Redemption model created with all required audit fields and relation to Offer
- [ ] Seed data populates 3 sample Redemption records linked to seeded Offers
- [ ] Pre-built User model and test user unchanged

## FR Coverage
- FR-006: Redemption model stores every successful Perk application with full audit fields

