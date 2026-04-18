# Timeline & Milestones

> Part of the [Farah.ma PRD](README.md)
> Live task tracking → `.agent/docs/TODO.md` · Completed work → `.agent/docs/DONE.md`

---

## 1. Phase Overview

| Phase | Description | Duration | Status |
|-------|-------------|----------|--------|
| Phase 1 — Foundation | Design system, auth, vendor DB, core pages | 6 weeks | ~80% complete |
| Phase 2 — Planning Tools | Couple planning suite, RSVP, vendor dashboard | 6 weeks | ~35% complete |
| Phase 3 — Content & Monetization | Inspiration gallery, CMI payment integration | 4 weeks | Not started |
| Phase 4 — Pre-Launch | Performance, accessibility, vendor acquisition | 3 weeks | Not started |

---

## 2. Phase 1 — Foundation (Weeks 1–6)

### Completed ✅

- Docker Compose + Makefile + CI/CD scaffolded
- Design system tokens (`globals.css`), shadcn/ui primitives
- All core entities: User, VendorProfile, Category, City, Review, MenuItem, WeddingProfile, BudgetItem, ChecklistTask, Guest, QuoteRequest, TimelineItem
- JWT auth, Symfony Security, voters
- Google OAuth 2.0 end-to-end (`GoogleAuthController` + `callback.tsx`)
- Password reset flow (backend + frontend)
- AuthContext, ProtectedRoute, MeProvider, DirectionProvider
- Vendor directory: filters, sort, pagination, grid/list toggle, RTL
- Vendor profile page: gallery, calendar, widget, SEO, WhatsApp CTA
- Vendor onboarding wizard (5 steps)
- Couple onboarding wizard (4 steps)
- Vendor dashboard (`/dashboard/vendor`): status banners, completeness bar, quick actions
- Account settings page (`/account/profile`)
- i18n: real translations in all 4 locales (fr/ar/ary/en)
- RSVP page (`/rsvp/[token]`): full 3-step public flow

### Remaining 🟡

- [ ] Silent JWT refresh (refresh token interceptor)
- [ ] Cloudinary direct upload in onboarding Step 4
- [ ] Vendor "pending review" status workflow + approval email
- [ ] Profile completeness indicator (real data)
- [ ] `<html dir>` + `<html lang>` dynamic update on locale switch
- [ ] RTL audit: icon flipping, toast positions, `text-align: start`
- [ ] Vendor count per active filter (directory)
- [ ] Empty state in vendor directory
- [ ] Similar vendors section — real API fetch (profile page)
- [ ] Review sub-ratings rendering (profile page)

---

## 3. Phase 2 — Planning Tools (Weeks 7–12)

### Completed ✅

- Budget page: TanStack Query, add/delete items, summary cards
- Guest list page: add/delete guests, RSVP status display, stats
- Checklist page: add/toggle/delete tasks, progress bar, category tags
- Planning dashboard (`/mariage`): setup progress, links to sub-pages

### Remaining 🟡

- [ ] Budget: editable total budget field
- [ ] Budget: donut chart (Recharts)
- [ ] Budget: default categories pre-populated on WeddingProfile creation
- [ ] Budget: over-budget row highlighting
- [ ] Budget: MAD currency formatting
- [ ] Guests: RSVP link generation UI + copy-to-clipboard
- [ ] Guests: WhatsApp share per guest
- [ ] Guests: CSV import
- [ ] Guests: table assignment field
- [ ] Guests: CSV export
- [ ] Checklist: 40+ default tasks seeded on WeddingProfile creation
- [ ] Checklist: drag-and-drop reordering (`@dnd-kit/core`)
- [ ] Checklist: overdue task highlighting
- [ ] Vendor inquiry inbox pages (`/dashboard/inquiries`)
- [ ] Vendor analytics section (real data)
- [ ] Save vendors to moodboard (API-backed, not localStorage)
- [ ] `/plan/saved` page
- [ ] Planning dashboard: wedding date countdown
- [ ] Planning dashboard: quick stats widget

---

## 4. Phase 3 — Content & Monetization (Weeks 13–16)

- [ ] `InspirationPhoto` entity + `SavedPhoto` entity
- [ ] Inspiration gallery page (`/inspiration`) — masonry grid, filters, lightbox
- [ ] Save-to-moodboard on inspiration photos
- [ ] Real Weddings section (listing + story pages)
- [ ] CMI merchant agreement (business prerequisite — start early)
- [ ] Subscription tiers: Free / Premium (400 MAD) / Featured (800 MAD)
- [ ] CMI redirect-based checkout from Symfony
- [ ] CMI webhook receiver + HMAC-SHA256 verification
- [ ] Subscription table + invoice generation (Twig PDF)
- [ ] Upgrade/downgrade flow in vendor dashboard

---

## 5. Phase 4 — Pre-Launch (Weeks 17–19)

- [ ] Lighthouse mobile ≥ 85 on homepage, directory, profile
- [ ] WCAG 2.1 AA audit
- [ ] GA4 integration + cookie consent banner
- [ ] All GA4 events implemented
- [ ] Sitemap generation
- [ ] CNDP notification submitted
- [ ] Privacy policy + terms of service pages
- [ ] 500 vendor profiles live (Casablanca + Marrakech priority)
- [ ] All 4 languages verified by native speakers
- [ ] Playwright RTL screenshot regression tests
- [ ] Load test: 500 concurrent simulated users
- [ ] `farah.ma` domain registered (ANRT) + DNS
- [ ] Uptime monitoring configured
- [ ] Disaster recovery tested (PostgreSQL backup/restore)

---

## 6. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| CMI merchant agreement delays (4–8 weeks) | High | High | Begin application in parallel with development. Launch without live payments if needed; interim: bank transfer for subscriptions. |
| ANRT domain registration delays (2–4 weeks) | High | High | Submit application early. Develop on staging subdomain as fallback. |
| Insufficient vendor supply at launch (< 500) | Medium | High | Begin vendor acquisition outreach in Phase 3. Soft launch in Casablanca + Marrakech only reduces required supply to ~150. |
| Darija translation quality issues | Medium | Medium | Engage a native Darija reviewer before Phase 4. Budget 2 weeks for content review. |
| Google Maps API cost overruns | Low | Medium | Restrict API key to `farah.ma` domain. City-level-only maps (no Geocoding API calls). Monitor usage weekly. |
| RTL layout regressions in vendor-submitted content | Medium | Low | Playwright RTL screenshot regression tests in CI. |
| React 19 + `@dnd-kit` compatibility issues | Low | Low | Evaluate on a feature branch before committing; HTML5 drag API as fallback. |
