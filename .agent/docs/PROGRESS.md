# Farah.ma — Project Progress Tracker

> **Last Updated:** 2026-04-10
> **PRD Version:** 1.1
> **Legend:** `[x]` Done · `[/]` In Progress · `[ ]` To Do

---

## 📊 Progress Dashboard

| Phase | Progress | Status |
|-------|----------|--------|
| Phase 1 — Foundation | ~60% | 🟡 In Progress |
| Phase 2 — Planning Tools | ~20% | 🟡 In Progress |
| Phase 3 — Content & Monetization | 0% | ⚪ Not Started |
| Phase 4 — Pre-Launch | 0% | ⚪ Not Started |
| **Overall** | **~27%** | **🟡 In Progress** |

---

## Phase 1 — Foundation (Weeks 1–6)

### 1.1 Project Scaffolding & Infrastructure

- [x] Symfony 7.2 API project initialized with FrankenPHP
- [x] Next.js PWA project initialized (Pages Router)
- [x] Docker Compose setup (`compose.yaml`, `compose.override.yaml`, `compose.prod.yaml`)
- [x] Makefile with dev commands
- [x] PostgreSQL database configured via Doctrine ORM
- [x] Mercure hub configured (`mercure.yaml`)
- [x] Helm chart scaffolded for Kubernetes deployment
- [x] GitHub Actions CI/CD (`.github/` directory exists)
- [x] E2E testing directory scaffolded
- [ ] Vercel deployment configured for PWA
- [ ] Sentry integration (frontend + backend)
- [ ] Environment variable management (`.env.production`, secrets)

### 1.2 Design System & Tokens (US-5.1)

- [x] Design tokens defined in `globals.css` (colors, spacing, typography, shadows, radii)
- [x] Terracotta accent `#E8472A` as primary + full neutral scale
- [x] Semantic colors (success, warning, danger, info, whatsapp)
- [x] Typography: DM Serif Display + Tajawal + Plus Jakarta Sans + Cairo (Google Fonts loaded in `_document.tsx`)
- [x] Arabic/Darija font overrides (`:lang(ar)`, `:lang(ary)`) 
- [x] Elevation system: 3 shadow levels (`shadow-1/2/3`)
- [x] Border radius scale (`radius-xs` through `radius-full`)
- [x] Card component branded (24px radius, shadow-1, hover lift)
- [x] Button component branded (7 variants: primary, secondary, ghost, danger, whatsapp, link, outline)
- [x] Badge component branded (8 variants: default, primary, neutral, verified, warning, danger, outline, category)
- [x] Card hover effect (`shadow-1` → `shadow-2`, -2px Y-translate)
- [x] Image zoom utility (103% scale on hover)
- [x] Nav link animated underline utility
- [x] Skeleton shimmer animation
- [x] Input focus ring style
- [x] WhatsApp button utility
- [x] Verified badge utility
- [x] Section ornament divider (Moroccan star)
- [x] `prefers-reduced-motion` respected
- [x] Custom scrollbar styling
- [x] Selection colors (primary-light bg)
- [x] Moroccan star tessellation pattern (hero bg, category tiles, vendor CTA — 3 of 5 placements)
- [/] Remaining 2 Moroccan pattern placements (logo mark, Real Weddings header border)
- [ ] Responsive breakpoints documented formally
- [x] shadcn/ui HSL tokens mapped for Tailwind v4 compatibility

### 1.3 Authentication & Authorization (US-3.1)

- [x] User entity with Symfony Security
- [x] Password hashing via `UserPasswordHasherListener`
- [x] JWT authentication via `lexik/jwt-authentication-bundle`
- [x] Security firewall configured (login + API)
- [x] Registration controller (`RegistrationController.php`)
- [x] Email verifier (`EmailVerifier.php`)
- [x] Role & Permission entities
- [x] `PermissionVoter` for authorization
- [/] Login page (`pwa/pages/auth/login.tsx` — 161 lines)
- [/] Register page (`pwa/pages/auth/register.tsx` — 264 lines)
- [x] `AuthContext` for frontend auth state
- [x] `ProtectedRoute` component
- [x] `MeProvider` (API state provider for current user)
- [ ] Google OAuth 2.0 integration
- [ ] Password reset flow (with email via Resend)
- [ ] Silent JWT refresh via refresh token
- [ ] Wedding date & budget prompt on first couple login

### 1.4 Vendor Database & Directory — READ (US-1.1)

- [x] `VendorProfile` entity with API Platform resource
- [x] `Category` entity with translations
- [x] `City` entity with translations
- [x] `Review` entity
- [x] `VendorProfileFactory` + `CategoryFactory` + `CityFactory` for fixtures
- [x] `AppStats` entity with `AppStatsProvider` (platform statistics)
- [x] Data fixtures (`AppFixtures.php`, `InitialAppStory.php`)
- [/] Vendor directory page (`pwa/pages/vendors/index.tsx` — 317 lines)
- [/] Filter sidebar component (`FilterSidebar.tsx`)
- [/] SearchBar component with category + city search
- [/] VendorCard component
- [ ] Price range filter with dual-handle slider (500 MAD steps)
- [ ] Rating filter
- [ ] Verified status filter
- [ ] Grid/List toggle view
- [ ] Instant filter application (desktop) / Bottom sheet (mobile)
- [ ] Vendor count per category filter
- [ ] Empty state with suggestion to broaden search
- [ ] Pagination / infinite scroll
- [ ] Sort dropdown (by rating, reviews, newest)

### 1.5 Vendor Profile Page — READ (US-1.2)

- [x] Vendor detail page (`pwa/pages/vendors/[slug].tsx`)
- [x] `StarRating` component
- [x] `PriceRange` component
- [/] `QuoteRequestModal` component for inquiries
- [x] `QuoteRequest` entity (backend)
- [x] `QuoteRequestVoter` for authorization
- [x] Photo gallery with lightbox (Airbnb-style 5-image grid + fullscreen lightbox + keyboard nav)
- [x] Availability calendar (dual-month, date range selection, booked dates, Monday-first)
- [x] Reservation widget (sticky, date picker popover, guest count, social proof badge)
- [x] Services & pricing table (menu items grid with per-person price)
- [/] Reviews section (2-col layout, expand individual review, show-all toggle — sub-ratings not yet)
- [x] Map embed (city-level, click-to-reveal lazy load)
- [x] Sticky WhatsApp CTA (mobile bottom bar + floating bubble)
- [x] WhatsApp deep link with pre-filled message
- [x] "Sauvegarder" heart button (localStorage wishlist, heart animation)
- [x] SEO: `<title>`, meta description, OpenGraph, Twitter Card, `schema.org/LocalBusiness` + FAQPage
- [x] ScrollSpy navigation bar (Photos / Services / Avis / Localisation)
- [x] Know Before You Go section (rules, safety, cancellation — with expand drawers)
- [x] FAQ accordion
- [x] Meet Your Host section
- [x] Amenities grid (show/hide toggle desktop, drawer mobile)
- [x] Similar vendors section (placeholder — needs real API fetch)
- [x] Mobile sticky booking bar
- [x] RTL logical properties throughout (start/end instead of left/right)
- [x] Full i18n coverage on vendor profile page (fr locale)
- [ ] Related vendors: real API fetch (currently hardcoded placeholders)
- [ ] Reviews sub-ratings (quality, communication, value, punctuality)
- [ ] Vendor onboarding wizard

### 1.6 Vendor Onboarding Wizard (US-2.1)

- [ ] Vendor registration flow (separate from couple signup)
- [ ] Profile setup wizard — Step 1: Basic Info
- [ ] Profile setup wizard — Step 2: Photos Upload (Cloudinary)
- [ ] Profile setup wizard — Step 3: Services & Pricing
- [ ] Profile preview before submission
- [ ] "Pending review" status workflow
- [ ] Profile completeness indicator (percentage bar)
- [ ] Email confirmation on approval via Resend
- [ ] Cloudinary integration for photo upload
- [x] `VendorProfileVoter` — vendor can only edit own profile

### 1.7 i18n & RTL Support

- [/] Locale files exist (`pwa/public/locales/` — ar, ary, en, fr)
- [x] `LocaleListener` on Symfony backend
- [/] `LanguageSwitcher` component
- [ ] Full 4-language translation coverage (Darija, French, Arabic, English)
- [ ] RTL layout with CSS logical properties throughout
- [ ] Directional icon flipping in RTL
- [ ] `<html dir="rtl">` + `<html lang="">` dynamic updates
- [ ] Toast positions swap in RTL
- [ ] Text alignment: `text-align: start` everywhere

---

## Phase 2 — Planning Tools (Weeks 7–12)

### 2.1 Budget Planner (US-3.2)

- [x] `BudgetItem` entity with API Platform resource
- [x] `BudgetItemFactory` for fixtures
- [/] Budget page (`pwa/pages/mariage/budget.tsx` — 236 lines)
- [ ] Total budget overview (editable total, spent, remaining, %)
- [ ] Donut chart visualization by category (Recharts)
- [ ] Default categories pre-populated (Salle, Photographe, Traiteur, etc.)
- [ ] Category row: budgeted / spent / remaining amounts
- [ ] Over-budget rows highlighted
- [ ] Inline editing with immediate recalculation
- [ ] Add/remove custom budget categories
- [ ] MAD currency formatting

### 2.2 Guest List Manager (US-3.3)

- [x] `Guest` entity with API Platform resource
- [x] `GuestFactory` for fixtures
- [/] Guest list page (`pwa/pages/mariage/invites.tsx` — 296 lines)
- [ ] Add guests individually (name, phone, email, side, relationship, city)
- [ ] CSV import for bulk guest addition
- [ ] RSVP status badges (Pending / Confirmed / Declined)
- [ ] Meal preference tracking (Standard / Végétarien / Enfants)
- [ ] RSVP link generation (`/rsvp/[code]`)
- [ ] WhatsApp share for RSVP links
- [ ] RSVP summary dashboard (totals, meal breakdown)
- [ ] Table assignment (integer field, sortable)
- [ ] Export to CSV

### 2.3 Wedding Checklist (US-3.4)

- [x] `ChecklistTask` entity with API Platform resource
- [x] `ChecklistTaskFactory` for fixtures
- [/] Checklist page (`pwa/pages/mariage/checklist.tsx` — 263 lines)
- [ ] 40+ default tasks organized by months-before-wedding
- [ ] Tasks grouped by category (Salle, Traiteur, etc.)
- [ ] Task fields: name, due date (auto-calc from wedding date), status, assignee, notes, linked vendor
- [ ] Drag-and-drop reordering
- [ ] Overdue task highlighting
- [ ] Custom task creation
- [ ] Progress bar (X of Y completed)

### 2.4 Guest RSVP Page (US-3.5)

- [ ] RSVP page (`/rsvp/[code]`)
- [ ] No-login RSVP experience
- [ ] Couple names + wedding date display
- [ ] Name entry or pre-populated selection
- [ ] Attendance selection (Confirmer / Décliner)
- [ ] Conditional meal preference selector
- [ ] Thank-you confirmation screen
- [ ] Expired link handling (friendly message, not 404)
- [ ] Performance: < 1.5s load on 4G

### 2.5 Vendor Inquiry Inbox (US-2.2)

- [x] `QuoteRequest` entity (inquiry model exists)
- [ ] Inquiry inbox page for vendors
- [ ] Status badges (New / Read / Replied)
- [ ] Inquiry detail view (couple info, wedding date, budget, message)
- [ ] "Répondre via WhatsApp" button
- [ ] Free tier inquiry limit (5/month) with upgrade prompt
- [ ] Email notification to vendor on new inquiry (Resend)

### 2.6 Vendor Analytics Dashboard (US-2.3)

- [ ] Free tier: profile view count (last 30 days)
- [ ] Premium/Featured: full analytics (views, clicks, saves, inquiry count, rate)
- [ ] Line chart (30/90 day toggle)
- [ ] Inline upgrade prompt for Free tier vendors

### 2.7 Save Vendors to Moodboard (US-1.3)

- [ ] Save action on vendor cards and profile pages
- [ ] `/plan/saved` page with saved vendors
- [ ] Unsave with confirmation toast
- [ ] Heart icon with optimistic UI
- [ ] Persist across sessions

### 2.8 Planning Dashboard

- [/] Planning dashboard page (`pwa/pages/mariage/index.tsx` — 145 lines)
- [/] Planning layout component (`PlanningLayout.tsx`)
- [ ] Wedding date countdown
- [ ] Quick stats (budget remaining, tasks due, guests confirmed)
- [ ] Quick links to all planning tools

---

## Phase 3 — Content & Monetization (Weeks 13–16)

### 3.1 Inspiration Gallery (US-4.1)

- [ ] `InspirationPhoto` entity (backend) — _not yet created_
- [ ] Inspiration gallery page (`/inspiration`)
- [ ] Masonry grid layout (3-col desktop, 2-col mobile)
- [ ] Filter by style (Traditional, Modern, Bohème, Andalou)
- [ ] Filter by region
- [ ] Filter by elements (Caftan, Fanfara, Zellige, Lanterns)
- [ ] Save-to-moodboard heart on hover
- [ ] Lightbox/modal with shareable URL (`/inspiration/[id]`)
- [ ] Admin approval workflow for photos

### 3.2 Real Weddings Section

- [ ] Real weddings listing page
- [ ] Individual real wedding story page
- [ ] Article header with Moroccan geometric border pattern
- [ ] Linked vendor profiles

### 3.3 CMI Payment Integration

- [ ] CMI merchant agreement (business prerequisite)
- [ ] Subscription tiers entity/logic (Free / Premium 400 MAD / Featured 800 MAD)
- [ ] CMI redirect-based checkout from Symfony
- [ ] Webhook receiver at `POST /api/webhooks/cmi`
- [ ] HMAC-SHA256 signature verification
- [ ] Transaction log / `subscriptions` table
- [ ] Invoice generation (Twig PDF template)
- [ ] Upgrade/downgrade flow in vendor dashboard

### 3.4 Promoted Listings

- [ ] Featured vendor badge & prominence in search results
- [ ] Premium vendor features (30 photos, full analytics)
- [ ] Subscription management page for vendors

---

## Phase 4 — Pre-Launch (Weeks 17–19)

### 4.1 Performance Optimization

- [ ] Lighthouse mobile score ≥ 85 (homepage, directory, profile)
- [ ] LCP < 2.5s
- [ ] FCP < 1.5s
- [ ] CLS < 0.1
- [ ] TTI < 3.5s on 4G
- [ ] Vendor directory API response < 600ms
- [ ] RSVP page load < 1.5s
- [ ] Image optimization (thumbnails < 80KB, gallery < 250KB, hero < 400KB)
- [ ] Database indexes created and verified

### 4.2 Accessibility & RTL QA

- [ ] WCAG 2.1 Level AA compliance
- [ ] Contrast ratios verified (4.5:1 normal, 3:1 large)
- [ ] Tab navigation / focus ring audit
- [ ] Modal focus trap implementation
- [ ] All icon buttons have `aria-label`
- [ ] `aria-live` on form errors
- [ ] Star ratings have `role="img"` + `aria-label`
- [ ] `prefers-reduced-motion` respected
- [ ] Tap targets ≥ 44×44px
- [ ] RTL layout verified on iOS Safari + Android Chrome
- [ ] Playwright RTL screenshot regression tests

### 4.3 SEO & Analytics

- [ ] Google Analytics 4 integration (with cookie consent)
- [ ] All GA4 events implemented (vendor_view, inquiry_submit, whatsapp_click, etc.)
- [ ] Meta titles and descriptions on all public pages
- [ ] `schema.org/LocalBusiness` structured data on vendor profiles
- [ ] Sitemap generation
- [ ] Google Search Console setup

### 4.4 Legal & Compliance

- [ ] CNDP notification submitted
- [ ] Cookie consent banner implementation
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Invoice generation for CMI transactions

### 4.5 Vendor Acquisition & Content

- [ ] 500 vendor profiles approved and live
- [ ] Vendor outreach campaign (Casablanca + Marrakech priority)
- [ ] Wedding photography sourced (hero, inspiration, real weddings)
- [ ] All 4 languages verified by native speakers
- [ ] Content moderation process with named owner

### 4.6 Launch Readiness

- [ ] `farah.ma` domain registered via ANRT
- [ ] DNS pointing to Vercel production
- [ ] CMI payment flow tested end-to-end with real card
- [ ] Uptime monitoring configured (UptimeRobot / Better Uptime)
- [ ] Disaster recovery tested (PostgreSQL backup/restore)
- [ ] Load test: 500 concurrent simulated users

---

## Missing Entities (PRD vs. Codebase)

| PRD Entity | Codebase | Status |
|-----------|----------|--------|
| `users` | `User.php` ✅ | Exists |
| `vendors` / `VendorProfile` | `VendorProfile.php` ✅ | Exists |
| `vendor_photos` | ❌ | Not created — need entity for Cloudinary `cloudinary_id` |
| `vendor_services` | ❌ | Not created — services & pricing table |
| `reviews` | `Review.php` ✅ | Exists |
| `inquiries` | `QuoteRequest.php` ✅ | Exists (named differently) |
| `wedding_profiles` | `WeddingProfile.php` ✅ | Exists |
| `guests` | `Guest.php` ✅ | Exists |
| `budget_items` | `BudgetItem.php` ✅ | Exists |
| `checklist_tasks` | `ChecklistTask.php` ✅ | Exists |
| `rsvp_links` | ❌ | Not created — unique RSVP token links |
| `saved_vendors` | ❌ | Not created — couple saves vendors |
| `saved_photos` | ❌ | Not created — couple saves inspiration photos |
| `inspiration_photos` | ❌ | Not created |
| `subscriptions` | ❌ | Not created — CMI transaction log |
| `categories` | `Category.php` ✅ | Exists |
| `cities` | `City.php` ✅ | Exists |
| `menu_items` | `MenuItem.php` ✅ | Exists (extra, not in PRD) |
| `translations` | `Translation.php` ✅ | Exists (extra, for i18n) |

---

## 🎯 Recommended Next Priorities

> [!TIP]
> **Top 5 priorities to work on next** (highest impact, unblocking):
> 1. **Design System tokens & branding** — Everything visual depends on this
> 2. **Complete vendor directory UX** — Core user-facing feature (filters, pagination, sort)
> 3. **Complete vendor profile page** — Photo gallery, reviews, WhatsApp CTA
> 4. **Complete auth flows** — Google OAuth, password reset, JWT refresh
> 5. **Vendor onboarding wizard** — Unblocks vendor supply (G1: 500 vendors at launch)
