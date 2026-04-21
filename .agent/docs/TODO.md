# Todo — Prioritized Backlog

> Ordered by priority. Top = next to work on.
> Move items to DONE.md when complete (with date).
> Link to GitHub issue when one exists: `[#42]`

---

## 🔴 Phase 1 — Foundation (in progress)

### Vendor Directory (US-1.1)
- [ ] Vendor count per active filter
- [ ] Empty state with "broaden search" suggestion

### Vendor Profile (US-1.2)
- [ ] Similar vendors section — real API fetch (currently hardcoded placeholders)
- [ ] Reviews sub-ratings (quality, communication, value, punctuality)

### Vendor Onboarding Wizard (US-2.1)
- [ ] Cloudinary direct upload integration (Step 2 currently uses file inputs only)
- [ ] "Pending review" status + email confirmation on approval
- [ ] Profile completeness indicator

### i18n & RTL
- [ ] RTL audit: text-align: start everywhere (run follow-up scan after new components are added)

### Tech Debt & Quality
- [ ] Missing Storybook stories: `command`, `popover`, `SuccessAnimation`, `ProtectedRoute`, `Layout`, `PlanningLayout`, `Admin/App`, `ErrorBoundary`, `QuoteRequestModal`
- [ ] Toast positions swap in RTL (Toaster uses sonner — check RTL position in Arabic locale)
- [ ] Add more Vitest tests: AuthContext (login/logout/forced-logout), useVendorFilters (filter state machine), fetchServerSide (error branches)
- [ ] Phase B: Redis + rate limiting + Messenger (async emails) — see plan file
- [ ] Phase C: Cloudinary uploads (onboarding wizard) + Meilisearch (vendor search)
- [ ] Phase D: Bundle analysis (@next/bundle-analyzer) + PgBouncer

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
