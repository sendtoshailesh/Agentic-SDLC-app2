# [FRONTEND] Redemption Export

## User Story
As an Admin I want to view Redemption records and download them as a CSV file so that I can reconcile Perk discounts with sponsors

## Assignment Order
Step 7 of 8 — assign after: [FRONTEND] Offer Management is merged
Tier: FRONTEND — extension slice

## Context
Pre-built from copilot-instructions.md:
- React app entry → src/frontend/src/main.tsx
- Router + auth guard → src/frontend/src/App.tsx
- Navbar shell → src/frontend/src/components/Navbar.tsx
API endpoints available:
- GET /api/redemptions
- GET /api/redemptions/export

## What to Build
- RedemptionList — table that fetches and displays all Redemption records with columns: offer_id, transaction_id, merchant_id, timestamp, skus, quantity, gross_amount, discount_amount, member_token
- ExportCSVButton — button that triggers GET /api/redemptions/export and initiates a file download of the returned CSV

Add a "Redemptions" navigation link to Navbar.tsx pointing to the Redemptions page (route: /redemptions).

## data-testid Values
Every interactive and key display element must have a data-testid:
- `redemption-list` — on the Redemption list table or container element
- `redemption-item` — on each Redemption row
- `export-csv-button` — on the Export CSV button

## Acceptance Criteria
- [ ] RedemptionList renders seeded Redemption records with all required columns visible
- [ ] ExportCSVButton triggers a file download of valid CSV data matching the seeded Redemption records
- [ ] Navbar includes a "Redemptions" link that navigates to the Redemptions page
- [ ] All data-testid values listed above are present on the correct elements

## FR Coverage
- FR-007: RedemptionList displays all records; ExportCSVButton downloads them as CSV for sponsor reconciliation

