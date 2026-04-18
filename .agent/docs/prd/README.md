# Farah.ma — PRD Index

> **Version:** 1.2 | **Updated:** 2026-04-17 | **Status:** In Development (~38% complete)

Morocco's first full-featured, deeply localized wedding planning platform. Connects engaged couples with verified local vendors across all Moroccan regions, and provides a unified planning suite — budget tracker, guest list, checklist, and moodboard — in one product. Four languages (Darija, French, MSA, English), full RTL, all pricing in MAD.

---

## Documents

| File | Contents |
|------|----------|
| [01-goals.md](01-goals.md) | Problem statement, OKRs, non-goals |
| [02-personas.md](02-personas.md) | User personas, requirements traceability matrix |
| [features/epic-1-vendor-discovery.md](features/epic-1-vendor-discovery.md) | US-1.1 Search, US-1.2 Profile, US-1.3 Save |
| [features/epic-2-vendor-dashboard.md](features/epic-2-vendor-dashboard.md) | US-2.1 Onboarding, US-2.2 Inbox, US-2.3 Analytics |
| [features/epic-3-planning-tools.md](features/epic-3-planning-tools.md) | US-3.1 Auth, US-3.2 Budget, US-3.3 Guests, US-3.4 Checklist, US-3.5 RSVP |
| [features/epic-4-inspiration.md](features/epic-4-inspiration.md) | US-4.1 Inspiration Gallery |
| [03-architecture.md](03-architecture.md) | System overview, data model, API contracts, infra, security |
| [04-design.md](04-design.md) | UX philosophy, user flows, wireframes, RTL, accessibility |
| [05-metrics.md](05-metrics.md) | KPIs, GA4 event plan, launch go/no-go criteria |
| [06-timeline.md](06-timeline.md) | Phase plan, Gantt, dependencies, risk register |
| [07-appendix.md](07-appendix.md) | Glossary, references, V2 backlog, changelog |

---

## Executive Summary

**Farah.ma** (فرح — Arabic for "joy") solves a clear market gap: Moroccan couples plan weddings across fragmented channels — Instagram DMs, WhatsApp groups, word-of-mouth — with no pricing transparency, no verified reviews, and no unified planning tool. Vendors have no professional web presence beyond Instagram and receive no structured leads.

The platform offers an experience comparable to The Knot (US) or Zankyou (Europe), built from the ground up for Morocco's cultural context, payment infrastructure (CMI gateway), and mobile-first user behavior.

**Business model:** Vendor subscription tiers — Free / Premium (400 MAD/mo) / Featured (800 MAD/mo) — plus promoted listing fees.

**V1 primary success metric:** 500 verified vendor listings live on launch day.

---

## Current Status (2026-04-17)

| Phase | Progress |
|-------|----------|
| Phase 1 — Foundation | ~80% |
| Phase 2 — Planning Tools | ~35% |
| Phase 3 — Content & Monetization | 0% |
| Phase 4 — Pre-Launch | 0% |
| **Overall** | **~38%** |

### What's shipped
- Auth: JWT, Google OAuth, password reset, couple + vendor onboarding wizards
- Vendor directory: filters, sort, pagination, RTL, grid/list toggle
- Vendor profile: gallery, calendar, widget, SEO, WhatsApp CTA
- Planning tools: budget (partial), guest list (partial), checklist (partial), dashboard
- RSVP page: full 3-step public flow, token-gated
- i18n: real translations in all 4 locales (fr/ar/ary/en)
- Vendor dashboard + account settings page

### Top 5 unblocking priorities
1. Silent JWT refresh (sessions expire after 1h — no interceptor yet)
2. Budget donut chart (Recharts — page otherwise functional)
3. RSVP link generation UI (`guestToken` exists on entity, not wired to frontend)
4. Checklist drag-and-drop reordering
5. Cloudinary upload integration (wizard UI exists, file inputs only)
