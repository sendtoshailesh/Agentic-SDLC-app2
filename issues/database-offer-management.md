# [DATABASE] Offer Management

## User Story
As a system I need an Offer model so that Admins can configure Perks with status, date range, merchant match, SKU list, and discount amount

## Assignment Order
Step 1 of 8 — assign after: nothing (assign this first)
Tier: DATABASE — primary slice

## Context
Pre-built models from copilot-instructions.md:
- User model in src/backend/prisma/schema.prisma
This issue adds only the Offer model required for this slice.

## Models to Add
Enum: OfferStatus { ACTIVE, INACTIVE }

Offer
- id: Int @id @default(autoincrement())
- status: OfferStatus @default(INACTIVE) — Active or Inactive
- startDate: DateTime — offer validity start date
- endDate: DateTime — offer validity end date
- merchantId: String — exact merchant ID for matching
- skus: String — comma-separated list of eligible SKUs
- discountAmount: Float — fixed monetary discount value
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt

## Relationships
- Offer has many Redemptions (Redemption model added in database-perk-application)

## Seed Data
Add realistic sample data to src/backend/prisma/seed.ts so the app is
usable immediately after migration — never leave domain tables empty.

Offer — add 5 sample records covering a mix of ACTIVE and INACTIVE statuses:
- Offer 1: status ACTIVE, merchantId "MERCHANT_001", skus "SKU_A,SKU_B", discountAmount 5.00, startDate 2026-01-01, endDate 2026-12-31
- Offer 2: status ACTIVE, merchantId "MERCHANT_002", skus "SKU_C", discountAmount 10.00, startDate 2026-01-01, endDate 2026-12-31
- Offer 3: status INACTIVE, merchantId "MERCHANT_001", skus "SKU_D", discountAmount 3.00, startDate 2025-01-01, endDate 2025-06-30
- Offer 4: status ACTIVE, merchantId "MERCHANT_003", skus "SKU_E", discountAmount 7.50, startDate 2026-01-01, endDate 2026-12-31
- Offer 5: status INACTIVE, merchantId "MERCHANT_002", skus "SKU_F", discountAmount 2.00, startDate 2026-06-01, endDate 2026-12-31

Seed data is required for:
- Frontend to show real Offer content after login (not a blank page)
- Playwright tests to find and interact with real Offer records

## Acceptance Criteria
- [ ] Migration runs without errors
- [ ] Offer model created with all fields and OfferStatus enum (ACTIVE/INACTIVE)
- [ ] Seed data populates 5 sample Offer records (mix of ACTIVE and INACTIVE statuses)
- [ ] Pre-built User model and test user unchanged

## FR Coverage
- FR-001: Offer model with status, date range, merchantId, skus, discountAmount supports Admin Offer creation
- FR-002: Offer model supports listing and status updates
