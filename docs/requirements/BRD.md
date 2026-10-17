# Business Requirements Document
**Project:** Perk Application Platform
**Date:** 2026-03-20
**Source:** GitHub Issue #1 — [REQUIREMENT] Perk Application

## 1. Summary
The platform needs to support real-time application of third-party funded discounts (Perks) at the point of transaction, and maintain auditable Redemption records for sponsor reconciliation. When a Member transacts at a Merchant, the system checks whether an Active Offer matches the transaction (merchant, SKU, date range) and, if so, computes and applies a discount before any purse or benefit deductions. Every successfully applied Offer is recorded as a Redemption event. An Admin can export Redemption records as a CSV report. The initial delivery is a locally-run prototype focused on validating the core discount-application and logging flows.

## 2. User Roles
| Role | Description |
|------|-------------|
| Member | End-user who submits transactions and receives Perk discounts when an Active Offer matches. |
| Admin | Platform or sponsor representative who configures Offers and exports Redemption reports for reconciliation. |

## 3. In Scope
- Offer management: create and configure Offers (status, date range, merchant match, SKU match, discount value)
- Real-time Perk application: evaluate whether an Active Offer applies to a given transaction and compute the discount amount
- Discount ordering: Perks discount applied before purse/benefit deductions
- Failure handling: if Perk application fails, proceed with the transaction without the discount and flag the failure
- Redemption logging: store a Redemption event for every transaction where an Offer was successfully applied
- CSV export: export Redemption records containing offer_id, transaction_id, merchant_id, timestamp, sku(s), quantity, gross amount, discount amount, and tokenized member identifier
- JWT-protected API endpoints for transaction submission and report export
- Minimal Admin UI to manage Offers and download the CSV report

## 4. Out of Scope
- Payment processing and purse/benefit deduction logic (assumed to be handled by an existing external system)
- Multi-offer stacking (requirement specifies "one configured offer applies" per transaction)
- Member self-service portal (Members interact only through transaction submission)
- Real-time sponsor dashboard / analytics beyond CSV export
- Email or push notifications
- Multi-tenant or production-grade deployment (prototype runs locally)

## 5. Functional Requirements
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-001 | Admin can create an Offer with: status (Active / Inactive), start date, end date, merchant ID, SKU list, and discount amount/percentage. | 1. A valid Offer is persisted and returned via the API. 2. An Offer with missing required fields is rejected with a 400 error. |
| FR-002 | Admin can list all Offers and update an Offer's status between Active and Inactive. | 1. GET /offers returns all Offers. 2. PATCH /offers/:id updates status and persists the change. |
| FR-003 | Given a transaction payload (member identifier, merchant ID, line items with SKU and quantity), the system checks whether exactly one Active Offer applies. | 1. An Active Offer whose merchant ID, at least one SKU, and current date falls within start/end range is matched. 2. If no Offer matches, transaction proceeds without a discount. |
| FR-004 | When an Offer matches, the system computes the Perk discount and applies it before purse/benefit deductions. | 1. Response includes computed discount_amount. 2. Discount is reflected in the net amount returned. |
| FR-005 | If Perk evaluation or application fails (e.g. service error), the transaction proceeds without the discount and the failure is flagged in the response. | 1. Response body includes `perk_applied: false` and `perk_error` message on failure. 2. Transaction is not blocked. |
| FR-006 | A Redemption record is stored for every transaction where an Offer was successfully applied. | 1. Redemption record contains: offer_id, transaction_id, merchant_id, timestamp, sku(s), quantity, gross_amount, discount_amount, tokenized member identifier. 2. Record is queryable via the API. |
| FR-007 | Admin can export all Redemption records as a CSV file. | 1. GET /redemptions/export returns a downloadable CSV. 2. CSV columns match: offer_id, transaction_id, merchant_id, timestamp, sku(s), quantity, gross_amount, discount_amount, member_token. |
| FR-008 | Member submits a transaction via an authenticated API endpoint. | 1. Unauthenticated requests to POST /transactions are rejected with 401. 2. Authenticated requests are processed and return the transaction result including Perk outcome. |
| FR-009 | Admin endpoints (Offer management and Redemption export) are protected and require Admin-level JWT. | 1. Requests without a valid Admin JWT are rejected with 401/403. 2. Valid Admin JWT grants access. |

## 6. Non-Functional Requirements
| ID | Category | Requirement |
|----|----------|-------------|
| NFR-001 | Security | JWT authentication required on all protected routes (Member and Admin) |
| NFR-002 | Performance | API responses under 3 seconds on local prototype hardware |
| NFR-003 | Usability | Minimal responsive UI sufficient for prototype demonstration on desktop |
| NFR-004 | Auditability | Redemption records must not be deleted or modified once created |
| NFR-005 | Simplicity | Prototype scope — SQLite database, single-node local deployment, no external dependencies |

## 7. Assumptions
- A single Offer is evaluated per transaction; multi-offer stacking is out of scope for this prototype.
- "Merchant match" and "SKU match" are evaluated by exact ID equality; wildcard or category matching is not required.
- The tokenized member identifier is a one-way hash of the Member's ID, generated by the platform; the algorithm is an implementation decision.
- Purse/benefit deduction logic is external to this system; the platform returns the discount amount for the caller to apply downstream.
- "Failure" in Perk application covers internal errors only (e.g. database unavailability); an Offer simply not matching is not a failure.
- Admin role is bootstrapped via the existing seed/auth setup; a separate Admin registration flow is out of scope.
- The Offer discount is expressed as a fixed monetary amount for prototype simplicity; percentage-based discounts are a future enhancement.
- No soft-delete or edit of Redemption records is permitted to preserve audit integrity.
