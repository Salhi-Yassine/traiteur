# Done Log

> Append-only. Never edit past entries. Format: `- [YYYY-MM-DD] Description`

---

## 2026-04-10

### Infrastructure & Tooling
- [2026-04-10] Created `CLAUDE.md` at project root (auto-loaded by Claude Code each session)
- [2026-04-10] Created `.agent/workflows/progress-tracking.md` — rule for updating DONE/TODO after each session
- [2026-04-10] Split PROGRESS.md tracking into DONE.md + TODO.md + DECISIONS.md

### Vendor Profile Page (`pwa/pages/vendors/[slug].tsx`)
- [2026-04-10] Removed P0-V1 debug badge from ReservationWidget
- [2026-04-10] Fixed `priceRange: "MADMADMAD"` fallback data artifact
- [2026-04-10] Fixed duplicate amenities array — single source + `showAllAmenities` toggle (desktop inline, mobile drawer)
- [2026-04-10] Wired "Afficher les équipements" desktop button (was non-functional)
- [2026-04-10] Wired "Contacter l'hôte" button — now links to WhatsApp if available
- [2026-04-10] Wired per-review "Afficher plus" — expands review text
- [2026-04-10] Wired "Afficher les X avis" — toggles showing all reviews
- [2026-04-10] Wired 3× Know Before You Go "Afficher plus" — opens per-section Drawer
- [2026-04-10] Added KBYG detail Drawer controlled by `kbygDrawer` state
- [2026-04-10] Fixed FAQ heading hardcoded string → `t("vendor_profile.faq.title")`
- [2026-04-10] Fixed "Services & Formules" heading → `t("vendor_profile.services.title")`
- [2026-04-10] Fixed trust badge "Extrêmement réactif" → `t("vendor_profile.trust_badge.reactive")`
- [2026-04-10] Fixed gallery hint text to match actual tap behavior
- [2026-04-10] Added 15+ missing i18n keys to `fr/common.json` (faq, services, nav, reviews, gallery, location, trust_badge, show_less, saved, reservation success)
- [2026-04-10] Fixed `reviews_count` value ("Note & Avis" → "avis")
- [2026-04-10] RTL: replaced `right-6`/`left-6` with `end-6`/`start-6` on lightbox buttons, tap zones, trust badge, WhatsApp bubble
- [2026-04-10] Calendar week start fixed to Monday (`(rawFirstDay + 6) % 7`) — Morocco locale
- [2026-04-10] Compact calendar: added month label between prev/next buttons
- [2026-04-10] Google Maps: replaced eager iframe with click-to-reveal overlay
- [2026-04-10] Mobile sticky bar: replaced `offsetTop` with `scrollIntoView({ behavior: 'smooth' })`
- [2026-04-10] Removed unused `Badge` import from ReservationWidget

---

## 2026-03-31 (pre-session baseline)

### Infrastructure
- Symfony 7.2 API + Next.js 15 PWA scaffolded
- Docker Compose setup (compose.yaml, compose.override.yaml, compose.prod.yaml)
- Makefile with all dev commands
- PostgreSQL 16 via Doctrine ORM
- Mercure hub configured
- Helm chart scaffolded
- GitHub Actions CI/CD scaffolded
- E2E testing directory scaffolded

### Design System
- Design tokens in `globals.css` (colors, spacing, typography, shadows, radii)
- Terracotta `#E8472A` primary + full neutral scale
- Semantic colors (success, warning, danger, info, whatsapp)
- Typography stack: DM Serif Display + Tajawal + Plus Jakarta Sans + Cairo
- 3-level shadow system, border radius scale
- shadcn/ui primitives: Button (7 variants), Card, Badge (8 variants), Input, Dialog, Drawer, Popover
- Card hover utility, image zoom, nav link underline, skeleton shimmer
- Moroccan star tessellation pattern (3 of 5 placements)

### Backend Entities
- User, VendorProfile, Category, City, Review, MenuItem
- WeddingProfile, BudgetItem, ChecklistTask, Guest, QuoteRequest
- AppStats with AppStatsProvider
- Factories + fixtures for all entities
- JWT auth, security firewall, VendorProfileVoter, QuoteRequestVoter

### Frontend
- AuthContext, ProtectedRoute, MeProvider, DirectionProvider
- Header, Footer, Navigation, LanguageSwitcher
- StarRating, PriceRange, VendorCard, FilterSidebar components
- Login page (partial), Register page (partial)
- Vendor directory page (partial — no pagination/sort)
- Vendor profile page (partial — see 2026-04-10 for completions)
- Budget page (partial), Guest list page (partial), Checklist page (partial), Dashboard (partial)
- Locale files exist for fr, ar, ary, en
