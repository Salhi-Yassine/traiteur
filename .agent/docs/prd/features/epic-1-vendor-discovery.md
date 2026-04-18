# Epic 1 — Vendor Discovery & Directory

> Part of the [Farah.ma PRD](../README.md) · Phase 1

---

## Overview

Allows couples to discover, evaluate, and shortlist Moroccan wedding vendors without an account. This is the primary acquisition surface — the first thing a new user encounters, and the feature that must exist for vendor supply to have any value.

**Overall epic status:** 🟡 Core complete — 4 acceptance criteria remaining across 3 stories.

---

## US-1.1 — Search Vendors by Category and City

> As Nadia, I want to search for vendors by category and city so that I can quickly find qualified photographers in Casablanca.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P0 — Must Have | 1 | L | ✅ Functionally complete |

### Acceptance Criteria

- [x] Search bar on homepage accepts free-text and a city dropdown; on submit routes to `/vendors` with query params pre-filled
- [x] Vendor directory page shows results filtered by category, city, price range, minimum rating (`averageRating[gte]`), and verified status (`isVerified`)
- [x] Filters apply instantly on desktop (no "Apply" button); on mobile, filters apply when user taps "Voir X résultats" in the bottom sheet (`FilterModal` — `Drawer` on mobile, `Dialog` on desktop)
- [x] Results display as cards (grid or list toggle) showing: cover photo, category badge, vendor name, city, star rating + count, price range, WhatsApp CTA
- [x] Active filter pills with remove-per-filter and clear-all button
- [x] Pagination driven by `hydra:totalItems`; scroll-to-top on page change
- [x] Sort dropdown: rating, reviews, price ascending, price descending
- [ ] **Vendor count per active filter** — filter labels should show matching result count
- [ ] **Empty state** — friendly message + "broaden search" suggestion when no results match

### Implementation Notes

- Page: `pwa/pages/vendors/index.tsx` — uses `getServerSideProps`, not TanStack Query (SSR for SEO)
- Filter modal: `pwa/components/vendors/FilterModal.tsx`
- Card component: `pwa/components/vendors/VendorCard.tsx` — supports `variant="grid" | "list"`
- API filter params: `cities.slug`, `category.slug`, `averageRating[gte]`, `priceRange[]`, `isVerified`, `order[field]=asc|desc`
- Sort mapping helper: `sortToApiParams()` in the same page file

### Remaining Work

- [ ] Add `hydra:totalItems` count to each filter option label (requires a secondary API call per filter value, or a custom API endpoint)
- [ ] Design and implement empty state component with suggestion to broaden filters

---

## US-1.2 — View Vendor Profile

> As Nadia, I want to view a vendor's full profile so that I can evaluate their work, pricing, and reviews before contacting them.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P0 — Must Have | 1 | L | ✅ Functionally complete |

### Acceptance Criteria

- [x] Vendor detail page includes: photo gallery (lightbox on click), services & pricing table, about section, reviews, map embed (city-level, click-to-reveal), sticky WhatsApp contact bar on mobile
- [x] Photo gallery: Airbnb-style 5-image grid + fullscreen lightbox with keyboard navigation
- [x] "Contacter via WhatsApp" button opens `wa.me/[intlPhone]?text=[pre-filled message]` including vendor name (and couple's wedding date if logged in)
- [x] Inquiry form alternative — captures: name, email, phone, wedding date, guest count, budget, message (`QuoteRequestModal`)
- [x] "Sauvegarder" heart button saves vendor to moodboard (currently localStorage wishlist with heart animation — API persistence is US-1.3)
- [x] Page is indexable by Google with `<title>`, meta description, OpenGraph, Twitter Card, `schema.org/LocalBusiness` + FAQPage structured data
- [x] ScrollSpy navigation bar: Photos / Services / Avis / Localisation
- [x] Availability calendar: dual-month, date range selection, booked dates, Monday-first (Moroccan locale)
- [x] Know Before You Go section: rules, safety, cancellation — each with expand drawer
- [x] FAQ accordion
- [x] Meet Your Host section
- [x] Amenities grid — show/hide toggle (desktop inline, mobile drawer)
- [x] RTL: all `left-*`/`right-*` replaced with logical properties (`start-*`/`end-*`)
- [x] Full i18n coverage (fr locale primary; ar/ary/en covered)
- [ ] **Similar vendors section** — currently hardcoded placeholders; needs real API fetch (`GET /api/vendor_profiles?category={slug}&cities.slug={city}&itemsPerPage=3`)
- [ ] **Review sub-ratings** — quality, communication, value, punctuality sub-scores (fields exist on `Review` entity, not yet rendered)

### Implementation Notes

- Page: `pwa/pages/vendors/[slug].tsx` — uses `getStaticProps` + `revalidate` (ISR)
- The `QuoteRequestModal` is partially implemented; wired to `POST /api/quote_requests`
- Calendar week-start fix: `(rawFirstDay + 6) % 7` (Morocco starts Monday)
- Map: click-to-reveal iframe overlay (no Geocoding API calls — city-level only)

### Remaining Work

- [ ] Replace similar vendors hardcoded array with `useQuery` call filtering by same category + city, excluding current vendor
- [ ] Add sub-rating bars to review cards (4 fields: quality, communication, value, punctuality — all on `Review` entity)

---

## US-1.3 — Save Vendors to Moodboard

> As Nadia, I want to save vendors I like to a moodboard so that I can review my shortlist later without re-searching.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P1 — Should Have | 2 | S | ❌ Not started (localStorage only) |

### Acceptance Criteria

- [ ] Save action available on vendor cards (directory) and vendor profile pages
- [ ] Heart icon fills immediately on click (optimistic UI)
- [ ] Saved vendors appear in `/plan/saved` with the same card layout as the directory
- [ ] Unsaving a vendor shows a confirmation toast and removes from list immediately
- [ ] Save state persists across sessions for authenticated users (API-backed, not localStorage)
- [ ] Unauthenticated users are prompted to log in when attempting to save

### Implementation Notes

- Backend entity `SavedVendor` does not yet exist — needs to be created
- Current implementation: `localStorage` wishlist in the vendor profile page
- Target: `POST /api/saved_vendors` with `{ vendorProfile: "/api/vendor_profiles/{id}" }`
- Page `/plan/saved` does not yet exist

### Work Required

**Backend:**
- [ ] Create `SavedVendor` entity: `id`, `user` (ManyToOne), `vendorProfile` (ManyToOne), `createdAt`
- [ ] Add API Platform resource with `GET` (collection, scoped to current user) + `POST` + `DELETE`
- [ ] Add `SavedVendorVoter` — user may only delete their own saved vendors
- [ ] Run `make full-migrat`

**Frontend:**
- [ ] Create `pwa/pages/plan/saved.tsx` — uses `useQuery` to fetch saved vendors, renders `VendorCard` grid
- [ ] Replace localStorage heart in `VendorCard` and vendor profile with API-backed `useMutation`
- [ ] Optimistic UI: heart fills immediately; rolls back on API error
- [ ] Add login prompt modal for unauthenticated save attempts
