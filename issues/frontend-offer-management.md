# [FRONTEND] Offer Management

## User Story
As an Admin I want to view, create, and toggle the status of Offers in the UI so that I can configure Perk discounts without using the API directly

## Assignment Order
Step 6 of 8 — assign after: [BACKEND] Redemption Export is merged
Tier: FRONTEND — primary slice

## Context
Pre-built from copilot-instructions.md:
- React app entry → src/frontend/src/main.tsx
- Router + auth guard → src/frontend/src/App.tsx
- Navbar shell → src/frontend/src/components/Navbar.tsx
- Login and Register pages (pre-built — do not rebuild)
HomePage.tsx currently shows a placeholder — this Issue replaces its content with the OfferList component below.
API endpoints available:
- POST /api/offers
- GET /api/offers
- PATCH /api/offers/:id

## What to Build
- OfferList — fetches and renders all Offers in a table with columns: id, merchantId, skus, discountAmount, status (badge), startDate, endDate, and a toggle-status button per row
- CreateOfferForm — form (modal or inline) with input fields for merchantId, skus (comma-separated), discountAmount, startDate, endDate, and status (dropdown); submits to POST /api/offers; new Offer appears in the list on success
- ToggleStatusButton — button rendered per Offer row that switches status between ACTIVE and INACTIVE via PATCH /api/offers/:id and updates the status badge in place without a full page reload

## HomePage Update
Replace the placeholder content in HomePage.tsx to render OfferList (with CreateOfferForm accessible via the create-offer-button).
The user must see the Offer list with real seeded data immediately after login.

## data-testid Values
Every interactive and key display element must have a data-testid:
- `offer-list` — on the Offer list table or container element
- `offer-item` — on each Offer row
- `offer-status-badge` — on each Offer's status badge element
- `create-offer-button` — on the button that opens CreateOfferForm
- `offer-form` — on the CreateOfferForm element
- `offer-merchant-input` — on the merchantId text input
- `offer-sku-input` — on the SKU list text input
- `offer-discount-input` — on the discount amount number input
- `offer-start-date-input` — on the start date input
- `offer-end-date-input` — on the end date input
- `offer-status-select` — on the status dropdown/select
- `offer-submit-button` — on the CreateOfferForm submit button
- `toggle-status-button` — on each row's status toggle button

## Acceptance Criteria
- [ ] OfferList renders seeded Offers with correct data and ACTIVE/INACTIVE status badges immediately after login
- [ ] CreateOfferForm submits valid data to POST /api/offers and the new Offer appears in offer-list without a full page reload
- [ ] ToggleStatusButton calls PATCH /api/offers/:id and the offer-status-badge for that row updates to the new status without a full page reload
- [ ] All data-testid values listed above are present on the correct elements

## FR Coverage
- FR-001: CreateOfferForm enables Admin to create Offers with all required fields via the UI
- FR-002: OfferList shows all Offers; ToggleStatusButton switches status between ACTIVE and INACTIVE

