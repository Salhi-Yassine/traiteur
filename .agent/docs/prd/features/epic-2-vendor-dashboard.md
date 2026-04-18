# Epic 2 — Vendor Onboarding & Dashboard

> Part of the [Farah.ma PRD](../README.md) · Phase 1–2

---

## Overview

Allows vendors to create a professional profile and manage their business on Farah.ma — from the initial onboarding wizard, through receiving and responding to couple inquiries, to understanding their visibility via analytics.

**Overall epic status:** 🟡 Onboarding wizard done; inquiry inbox and analytics not yet built.

---

## US-2.1 — Vendor Profile Setup Wizard

> As Hassan, I want to create and complete my vendor profile so that couples can discover my business on Farah.ma.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P0 — Must Have | 1 | XL | 🟡 Partial — 3 ACs remaining |

### Acceptance Criteria

- [x] Welcome screen with 3 feature bullets and "Passer pour l'instant" skip option available on all steps
- [x] Step 1: Business name, tagline, category
- [x] Step 2: Description (max 1,000 chars), cities served (multi-select), WhatsApp number, website, Instagram
- [x] Step 3: Price range selector
- [x] Step 4: Cover image + gallery upload (file inputs — Cloudinary integration pending)
- [x] Step 5: Preview + languages spoken
- [x] Per-step Formik validation before proceeding
- [x] Full profile preview before final submission
- [x] On submit, redirects to `/dashboard/vendor`
- [x] `VendorProfileVoter` — vendor can only edit their own profile
- [ ] **Cloudinary direct upload** — Step 4 currently uses plain `<input type="file">`. Must upload to Cloudinary directly from the browser using a signed upload preset; store resulting `cloudinary_id` on the profile
- [ ] **"Pending review" status workflow** — profile goes into a non-public `pending` status on submit; admin approves; vendor receives email confirmation via Resend on approval
- [ ] **Profile completeness indicator** — percentage bar in dashboard header listing specific missing fields (e.g., "Add your WhatsApp number to reach 80%")

### Implementation Notes

- Wizard page: `pwa/pages/onboarding/vendor.tsx`
- Onboarding guard: `pwa/pages/onboarding/index.tsx` — reads `user.vendorProfile` state and redirects to correct wizard or dashboard
- Vendor dashboard: `pwa/pages/dashboard/vendor.tsx` — includes status banners (pending/approved), profile completeness bar, stats row, quick actions
- API: `POST /api/vendor_profiles` (create) · `PATCH /api/vendor_profiles/{id}` (update)
- Auth guard: `ProtectedRoute` with `userType="vendor"` check

### Work Required

**Cloudinary upload (Step 4):**
- [ ] Backend: `GET /api/vendor_profiles/upload-signature` — returns a Cloudinary signed upload preset (server-side signing via Cloudinary PHP SDK)
- [ ] Frontend: replace file input with Cloudinary Upload Widget or direct fetch to `https://api.cloudinary.com/v1_1/{cloud}/image/upload`
- [ ] Store returned `public_id` in form state; submit to API

**Pending review workflow:**
- [ ] Add `status` field to `VendorProfile` entity (`pending | approved | rejected`); default: `pending`
- [ ] API Platform security: `status !== approved` → profile excluded from public `GET /api/vendor_profiles` collection
- [ ] Backend: trigger Resend email on status change to `approved` (Symfony event listener on `PostUpdate`)
- [ ] Frontend: `dashboard/vendor.tsx` already has pending/approved status banners — wire to real `status` field

**Profile completeness:**
- [ ] Backend: add `completenessScore` computed field (or frontend-computed from profile fields)
- [ ] Frontend: `dashboard/vendor.tsx` already has a completeness bar — wire to real data with field-by-field suggestions

---

## US-2.2 — Vendor Inquiry Inbox

> As Hassan, I want to view and respond to couple inquiries so that I can convert leads into bookings.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P0 — Must Have | 2 | M | ❌ Not started |

### Acceptance Criteria

- [ ] Inquiry inbox page shows all received inquiries with status badges: **New** / **Read** / **Replied**
- [ ] Inquiry detail shows: couple name, email, phone, wedding date, guest count, budget, message, timestamp
- [ ] "Répondre via WhatsApp" button pre-fills `wa.me/[couplePhone]?text=[pre-filled message]`
- [ ] Reading an inquiry auto-updates its status from `New` → `Read`
- [ ] Free tier vendors see "0 of 5 inquiries remaining this month" indicator; at limit, inquiry form on their public profile is hidden and replaced with an upgrade prompt
- [ ] New inquiry triggers an email notification to the vendor's registered email (Resend)
- [ ] Vendor can mark inquiry as "Replied" after responding

### Implementation Notes

- `QuoteRequest` entity exists at `api/src/Entity/QuoteRequest.php` with `QuoteRequestVoter`
- API: `GET /api/quote_requests` (vendor-scoped collection) · `PATCH /api/quote_requests/{id}` (update status)
- Inquiry page will live at: `pwa/pages/dashboard/inquiries/index.tsx` + `[id].tsx`

### Work Required

**Backend:**
- [ ] Add `status` enum field to `QuoteRequest` (`new | read | replied`); default `new`
- [ ] Add `PATCH /api/quote_requests/{id}` to update status (already partially set up via `QuoteRequestVoter`)
- [ ] Add inquiry limit logic: `QuoteRequestStateProcessor` — check count for free-tier vendor in current month before persisting; return `429` if at limit
- [ ] Resend email on `POST /api/quote_requests` (new inquiry) → notify vendor

**Frontend:**
- [ ] `pwa/pages/dashboard/inquiries/index.tsx` — list view with New/Read/Replied badge filter tabs
- [ ] `pwa/pages/dashboard/inquiries/[id].tsx` — detail view with "Répondre via WhatsApp" CTA
- [ ] Auto-mark as Read when detail page opens (`useMutation` PATCH on mount)
- [ ] Sidebar nav link in vendor dashboard already scaffolded — wire to new page

---

## US-2.3 — Vendor Analytics Dashboard

> As Hassan, I want to see how many couples are viewing and saving my profile so that I can understand my visibility and justify upgrading my subscription.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P1 — Should Have | 2 | M | ❌ Not started |

### Acceptance Criteria

- [ ] **Free tier:** Profile view count shown as a single number (last 30 days)
- [ ] **Premium/Featured:** Full analytics — views, clicks, saves, inquiry count, inquiry-to-view rate — as a line chart (Recharts, 30/90-day toggle)
- [ ] Analytics data updates daily (not real-time)
- [ ] Upgrade prompt shown inline within the analytics section for Free tier vendors (links to subscription upgrade flow)

### Implementation Notes

- Requires a `VendorAnalytics` or `VendorEvent` tracking mechanism — not yet implemented
- Simplest V1 approach: log `vendor_view` events to a dedicated table on every `GET /api/vendor_profiles/{slug}` (state provider hook)
- Free tier: aggregate count query; Premium: daily breakdown query grouped by event type

### Work Required

**Backend:**
- [ ] Create `VendorEvent` entity: `id`, `vendorProfile`, `eventType` (`view | whatsapp_click | save | inquiry`), `occurredAt`, `userAgent` (optional)
- [ ] `VendorProfileProvider` (state provider): log a `view` event on every public profile fetch (debounce: one event per IP per vendor per hour)
- [ ] `GET /api/vendor_profiles/{id}/analytics` — returns aggregated stats; access restricted to profile owner; data scoped by subscription tier
- [ ] Run `make full-migrat`

**Frontend:**
- [ ] Analytics section in `pwa/pages/dashboard/vendor.tsx` — replace placeholder stats with real API data
- [ ] Recharts `LineChart` for Premium/Featured vendors (30/90-day toggle)
- [ ] Upgrade CTA for Free tier vendors pointing to subscription page (Phase 3)
