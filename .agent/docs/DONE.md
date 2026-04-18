# Done Log

> Append-only. Never edit past entries. Format: `- [YYYY-MM-DD] Description`

---

## 2026-04-18

### Structural review & refactor — full audit pass (Closes #42)
- [2026-04-18] `pwa/types/api.ts` — synced all interfaces with actual Doctrine entities: fixed `VendorProfile` (coverImageUrl, whatsapp, cities, priceRange, galleryImages, tags, etc.), `Review` (body, title, author), `AppStats` (matches AppStatsProvider output), removed phantom fields (status, facebookUrl, coverPhotoUrl, priceRangeMin/Max)
- [2026-04-18] `pwa/utils/apiClient.ts` — added generics to `fetchApi<T>`, `get<T>`, `post<T>`, `patch<T>`, `delete<T>`; `ApiError.data` typed as `Record<string, unknown>` instead of `any`
- [2026-04-18] `pwa/context/AuthContext.tsx` — replaced `any` on `login`/`register` with `LoginCredentials`/`RegisterPayload` imported from `types/api`
- [2026-04-18] `pwa/components/ui/alert.tsx` — RTL: `[&>svg]:left-4` → `start-4`, `[&>svg~*]:pl-7` → `ps-7`
- [2026-04-18] `pwa/components/layout/Navbar.tsx` — RTL: `right-0` → `end-0` on mobile drawer; i18n: replaced all hardcoded French strings (Ouvrir le menu, Fermer le menu, Navigation principale, Navigation mobile, Langue, Connecté en tant que) with `t()` calls
- [2026-04-18] All 4 locale files (fr/en/ar/ary) — added `nav.open_menu`, `nav.close_menu`, `nav.main_nav`, `nav.mobile_nav`, `nav.drawer`, `nav.language`, `nav.connected_as` keys
- [2026-04-18] `api/src/Entity/Review.php` — added ORM indexes on `vendor_profile_id` and `author_id` foreign key columns
- [2026-04-18] `api/src/Entity/VendorProfile.php` — added ORM indexes on `category_id` and `owner_id` foreign key columns
- [2026-04-18] `api/src/Repository/CategoryRepository.php` — created with `findAllWithVendorCounts()`: single DQL query returning translated category names + vendor counts (replaces 2 separate queries)
- [2026-04-18] `api/src/Entity/Category.php` — wired to `CategoryRepository`
- [2026-04-18] `api/src/State/AppStatsProvider.php` — removed `EntityManagerInterface`, injected typed repositories (`VendorProfileRepository`, `ReviewRepository`, `CityRepository`, `CategoryRepository`); categories now fetched via single `findAllWithVendorCounts()` call
- [2026-04-18] `api/src/Repository/VendorProfileRepository.php` — `findFeatured()` now eager-joins category + cities (eliminates N+1); added `findByCategory()` query method; TranslationWalker hint moved inside the repository
- [2026-04-18] `api/src/State/ReviewProcessor.php` — new API Platform processor; auto-sets authenticated user as `author` on POST, preventing spoofing; wired to `Review::Post` via `processor: ReviewProcessor::class`
- [2026-04-18] DB migration executed: 4 new indexes on `review` and `vendor_profile` tables

---

## 2026-04-17

### User onboarding UX — all 3 user types (Airbnb-like flow)
- [2026-04-17] `pwa/context/AuthContext.tsx` — extended `User` type with `weddingProfile`/`vendorProfile`, added `refreshUser()`, added `redirectAfterAuth()` helper used by login/register/loginWithToken
- [2026-04-17] `pwa/pages/onboarding/index.tsx` — guard router: reads user type + profile state, redirects to correct wizard or dashboard; fixes broken `/onboarding` URL vendors were sent to
- [2026-04-17] `pwa/pages/onboarding/couple.tsx` — 4-step wizard (names → date+city → budget+guests → success), Formik, per-step validation, POSTs `/api/wedding_profiles`, SuccessAnimation summary card
- [2026-04-17] `pwa/pages/onboarding/vendor.tsx` — added welcome screen with 3 feature bullets, "Passer pour l'instant" skip on all steps, fixed final redirect to `/dashboard/vendor`
- [2026-04-17] `pwa/pages/dashboard/vendor.tsx` — new vendor dashboard: sidebar nav, status banners (pending/approved), profile completeness bar, stats row, quick actions (edit/view/WhatsApp share), recent inquiries list
- [2026-04-17] `pwa/pages/account/profile.tsx` — shared account settings page: personal info form (PATCH `/api/users/{id}`), email display, password change link, logout danger zone
- [2026-04-17] All 4 i18n locale files (fr/en/ar/ary) updated with `onboarding.couple.*`, `onboarding.vendor.*`, `dashboard.vendor.*`, `account.*` keys

### Discovery audit — features found complete (no new code written)
- [2026-04-17] Google OAuth 2.0: `api/src/Controller/GoogleAuthController.php` (redirect + callback + JWT issuance) + `pwa/pages/auth/callback.tsx` (token handoff to AuthContext) — fully wired end-to-end
- [2026-04-17] Vendor directory — price range filter (`priceRange[]`), min rating (`averageRating[gte]`), verified toggle (`isVerified`) — all wired to API via `getServerSideProps`
- [2026-04-17] Vendor directory — sort: 4 options (rating, reviews, price_asc, price_desc) via `sortToApiParams()` helper
- [2026-04-17] Vendor directory — pagination: `<Pagination>` component driven by `hydra:totalItems`, scroll-to-top on page change
- [2026-04-17] Vendor directory — grid/list toggle: `view` state, `variant` prop passed to `VendorCard`
- [2026-04-17] Vendor directory — active filter pills: removable chips + clear-all button
- [2026-04-17] Vendor directory — mobile filters: `FilterModal` uses `Drawer` on mobile, `Dialog` on desktop
- [2026-04-17] Vendor onboarding wizard: 5-step flow (basic info → description+cities → price range → cover+gallery → preview+languages), per-step Formik validation, submits to API and redirects to vendor profile
- [2026-04-17] RSVP page (`/rsvp/[token]`): 3-step flow (welcome → meal preferences → success), loads guest via `guestToken`, submits to `/api/public/guests/{token}`, includes confetti animation
- [2026-04-17] Budget page (`budget.tsx`): confirmed using TanStack Query (`useQuery` + `useMutation`) — the useEffect tech debt item was stale
- [2026-04-17] i18n: ar/ary/en locale files confirmed as real translations (ar: 437 lines, ary: 444 lines, en: 445 lines) — not stubs

---

## 2026-04-16

### Auth — Airbnb-like redesign + password reset (Closes #41)
- [2026-04-16] Deleted dead `RegistrationController.php`, `RegistrationForm.php`, `templates/registration/` (HTML-based, conflicted with API-first registration via `/api/users`)
- [2026-04-16] Added `passwordResetToken` + `passwordResetTokenExpiresAt` fields to `User` entity (not exposed via API groups)
- [2026-04-16] Added `findOneByResetToken()` to `UserRepository`
- [2026-04-16] Created `Service/PasswordResetService.php` — `initiateReset()` + `resetPassword()`, silently ignores unknown emails
- [2026-04-16] Created `Controller/PasswordResetController.php` — `POST /api/auth/forgot-password` + `POST /api/auth/reset-password` (plain Symfony, not API Platform)
- [2026-04-16] Created `templates/emails/reset_password.html.twig` — responsive HTML email with terracotta CTA button
- [2026-04-16] Added 16 `auth.*` i18n keys to all 4 locale files (fr, en, ar, ary) for forgot/reset password flows
- [2026-04-16] Created `components/auth/AuthCard.tsx` — shared card shell (Airbnb header pattern: [X] + Farah.ma logotype centered) + `AuthCard.stories.tsx`
- [2026-04-16] Refactored `login.tsx` — uses `AuthCard`, removed redundant footer Farah.ma link
- [2026-04-16] Refactored `register.tsx` — uses `AuthCard`, **fixed `userType` bug**: `"client"/"caterer"` → `"couple"/"vendor"` (was failing `Assert\Choice` validator on backend)
- [2026-04-16] Created `pages/auth/forgot-password.tsx` — email form with success state (CheckCircle)
- [2026-04-16] Created `pages/auth/reset-password.tsx` — password + confirm fields, handles missing/invalid token state

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
