# Todo — Prioritized Backlog

> Ordered by priority. Top = next to work on.
> Move items to DONE.md when complete (with date).
> Link to GitHub issue when one exists: `[#42]`

---

## 🔴 Phase 1 — Foundation (in progress)

### Vendor Directory (US-1.1)
- [ ] Price range filter — dual-handle slider (500 MAD steps)
- [ ] Rating filter (1–5 stars)
- [ ] Verified status filter toggle
- [ ] Sort dropdown (rating / reviews / newest)
- [ ] Pagination or infinite scroll
- [ ] Vendor count per active filter
- [ ] Empty state with "broaden search" suggestion
- [ ] Grid/List toggle view
- [ ] Mobile: bottom sheet for filters

### Vendor Profile (US-1.2)
- [ ] Similar vendors section — real API fetch (currently hardcoded placeholders)
- [ ] Reviews sub-ratings (quality, communication, value, punctuality)

### Auth (US-3.1)
- [ ] Google OAuth 2.0 integration (credentials in .env — `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`)
- [ ] Password reset flow — **backend done** (`POST /api/auth/forgot-password` + `POST /api/auth/reset-password`), **frontend done** (`/auth/forgot-password` + `/auth/reset-password`); pending: `make full-migrat` + `make cs` once Docker is running
- [ ] Silent JWT refresh (refresh token)
- [ ] Wedding date + budget prompt on first couple login

### Vendor Onboarding Wizard (US-2.1)
- [ ] Step 1: Basic info (name, category, cities, description, tagline)
- [ ] Step 2: Photo upload (Cloudinary integration)
- [ ] Step 3: Services & pricing
- [ ] Profile preview before submission
- [ ] "Pending review" status + email confirmation on approval
- [ ] Profile completeness indicator

### i18n & RTL
- [ ] Full translation coverage — ar, ary, en locales (fr is primary)
- [ ] `<html dir="rtl">` dynamic update on locale switch
- [ ] RTL audit: text-align: start everywhere, icon flipping
- [ ] Toast positions swap in RTL

### Tech Debt & Quality
- [ ] Convert `pwa/pages/mariage/budget.tsx` from `useEffect + apiClient.get` to TanStack Query (known rule violation)
- [ ] Missing Storybook stories for UI components: `checkbox`, `dialog`, `drawer`, `input`, `label`, `popover`, `select`, `tabs`, `textarea`, `alert`, `command`, `PriceRange`, `StarRating`

---

## 🟡 Phase 2 — Planning Tools (partial)

### Budget Planner (US-3.2)
- [ ] Editable total budget field
- [ ] Donut chart by category (Recharts)
- [ ] Over-budget row highlighting
- [ ] Default categories pre-populated
- [ ] MAD currency formatting

### Guest List (US-3.3)
- [ ] RSVP link generation (`/rsvp/[code]`)
- [ ] WhatsApp share for RSVP links
- [ ] CSV import for bulk guest add
- [ ] Table assignment (integer field)
- [ ] Export to CSV

### Checklist (US-3.4)
- [ ] 40+ default tasks organized by months-before-wedding
- [ ] Drag-and-drop reordering
- [ ] Overdue task highlighting
- [ ] Progress bar (X of Y completed)

### RSVP Page (US-3.5)
- [ ] `/rsvp/[code]` page (no-login experience)
- [ ] Attendance + meal preference selection
- [ ] Thank-you confirmation screen
- [ ] Expired link handling

### Vendor Inquiry Inbox (US-2.2)
- [ ] Inbox page for vendors (New / Read / Replied badges)
- [ ] Inquiry detail view
- [ ] "Répondre via WhatsApp" CTA
- [ ] Email notification to vendor on new inquiry (Resend)

### Save Vendors / Moodboard (US-1.3)
- [ ] `SavedVendor` entity (backend)
- [ ] `/plan/saved` page
- [ ] Heart icon with optimistic UI
- [ ] Persist across sessions (API, not just localStorage)

### Planning Dashboard
- [ ] Wedding date countdown
- [ ] Quick stats widget (budget remaining, tasks due, guests confirmed)

---

## ⚪ Phase 3 — Content & Monetization

- [ ] `InspirationPhoto` entity (backend)
- [ ] Inspiration gallery page — masonry grid, filters, lightbox
- [ ] Save-to-moodboard on inspiration photos
- [ ] Real Weddings section
- [ ] CMI payment integration (subscription tiers)
- [ ] Vendor analytics dashboard

---

## ⚪ Phase 4 — Pre-Launch

- [ ] Lighthouse mobile ≥ 85 on homepage, directory, profile
- [ ] WCAG 2.1 AA audit
- [ ] Google Analytics 4 + cookie consent
- [ ] Sitemap generation
- [ ] CNDP notification + privacy policy + terms of service
- [ ] 500 vendor profiles live
- [ ] `farah.ma` domain + DNS
- [ ] Load test: 500 concurrent users
