# Done Log

> Append-only. Never edit past entries. Format: `- [YYYY-MM-DD] Description`

---

## 2026-04-18

### RTL audit — full sweep (2026-04-18)
- [2026-04-18] `components/quotes/QuoteRequestModal.tsx` — 8× `pl-4` → `ps-4` on form labels and error messages
- [2026-04-18] `components/vendors/SearchBar.tsx` — 2× `pr-0.5` → `pe-0.5` on scroll containers
- [2026-04-18] `components/guest/RSVPFlow.tsx` — 2× `ArrowRight` icons: added `rtl:-scale-x-100`
- [2026-04-18] `components/guest/RSVPSearchWidget.tsx` — `ArrowRight`: added `rtl:-scale-x-100`
- [2026-04-18] `pages/dashboard/vendor.tsx` — `ChevronRight` nav link: added `rtl:-scale-x-100`
- [2026-04-18] `pages/e/[slug].tsx` — `ChevronLeft` + `ChevronRight` carousel controls: added `rtl:-scale-x-100`
- [2026-04-18] `components/layout/PlanningLayout.tsx` — decorative blob: `right-0 -mr-12` → `end-0 -me-12`
- [2026-04-18] `pages/mariage/index.tsx` — decorative blob: `right-0 -mr-32` → `end-0 -me-32`

### Tech debt & RTL refactor (2026-04-18)
- [2026-04-18] `pwa/components/ui/select.tsx` — RTL: `pl-2 pr-8` → `ps-2 pe-8`, `right-2` → `end-2` on SelectItem
- [2026-04-18] `pwa/components/layout/Navbar.tsx` — RTL: fixed mobile drawer close animation (`translate-x-full` → `translate-x-full rtl:-translate-x-full`); removed duplicate `aria-label` attribute on drawer dialog
- [2026-04-18] `pwa/lib/useVendorFilters.ts` — extracted all filter state + handlers from 658-line vendors page into a reusable hook; `SortKey` type exported from hook
- [2026-04-18] `pwa/pages/vendors/index.tsx` — replaced inline filter state with `useVendorFilters` hook; page reduced ~80 lines
- [2026-04-18] `api/src/Repository/ReviewRepository.php` — added `computeStats(VendorProfile)` returning avg + count in one query
- [2026-04-18] `api/src/Service/ReviewAggregationService.php` — created; calls `computeStats` and updates `averageRating` + `reviewCount` on VendorProfile
- [2026-04-18] `api/src/State/ReviewProcessor.php` — injected `ReviewAggregationService` + remove processor; recalculates stats after both POST and DELETE
- [2026-04-18] `api/src/Entity/Review.php` — wired `ReviewProcessor` to the Delete operation (was missing)
- [2026-04-18] `Makefile` — fixed `remove-migration-files`: `find $(PROJECT_DIR)/migrations` (ran on host) → `$(EXEC_PHP) find /app/migrations` (runs in container)
- [2026-04-18] `pwa/pages/_document.tsx` — confirmed SSR `dir`/`lang` already correct via `__NEXT_DATA__.locale`; no change needed

### Phase A tooling improvements — quick wins (2026-04-19)
- [2026-04-19] `pwa/pages/_app.tsx` — wired `ErrorBoundary` around app root; added `ReactQueryDevtools` (dev-only, lazy import)
- [2026-04-19] `Makefile` — removed `remove-migration-files` from `full-migrat` target (was silently deleting migration history)
- [2026-04-19] `pwa/.eslintrc.json` — extended with `@typescript-eslint/recommended`; added `@typescript-eslint/no-explicit-any: error` and `import/order` rules
- [2026-04-19] `pwa/package.json` — replaced `formik + yup` with `react-hook-form + zod + @hookform/resolvers`; added `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `vite`; added `test`, `test:watch`, `test:ui` scripts
- [2026-04-19] Migrated all 7 forms from Formik → React Hook Form + Zod: `auth/login.tsx`, `auth/register.tsx`, `auth/forgot-password.tsx`, `auth/reset-password.tsx`, `account/profile.tsx`, `onboarding/couple.tsx`, `quotes/QuoteRequestModal.tsx`
- [2026-04-19] `pwa/components/quotes/QuoteRequestModal.tsx` — replaced raw `fetch()` with `apiClient.post()`; replaced all hardcoded French strings with `t()` calls; replaced `alert()` with `toast.success()` (sonner)
- [2026-04-19] All 4 locale files — added `quote_modal.*` keys (17 keys each: header, event types, validation messages, submit states) and `common.close`, `common.cancel`
- [2026-04-19] `pwa/vitest.config.ts` — created Vitest config (jsdom environment, globals, @/ alias)
- [2026-04-19] `pwa/tests/setup.ts` — created test setup with `@testing-library/jest-dom` matchers
- [2026-04-19] `pwa/tests/apiClient.test.ts` — created 16 unit tests covering: token helpers (set/get/remove), ApiError class, fetchApi (200/204/422/404), Authorization header, Accept-Language, silent refresh (no token → logout, valid refresh → retry + token rotation, invalid refresh → logout)

### Deep refactor pass — clean code, system design, best practices (2026-04-19)
- [2026-04-19] `api/src/Voter/VendorProfileVoter.php` — created; implements `profile:create` (vendor-only), `profile:edit` (owner or admin), `profile:view` (public); fixes silent deny that was blocking all vendor profile creation/editing
- [2026-04-19] `api/src/Voter/QuoteRequestVoter.php` — created; `quote:create` (any auth), `quote:view` (client or vendor), `quote:manage` (vendor or admin)
- [2026-04-19] `api/src/State/QuoteRequestProcessor.php` — created; auto-sets authenticated user as `client` on POST (mirrors ReviewProcessor pattern)
- [2026-04-19] `api/src/Entity/QuoteRequest.php` — added 4 ORM indexes (vendor_profile_id, client_id, status, created_at); wired QuoteRequestProcessor; wired QuoteRequestVoter security attributes
- [2026-04-19] `api/src/Entity/VendorProfile.php` — added 4 indexes (avg_rating, review_count, created_at, is_verified); `#[Assert\Url]` on coverImageUrl; whatsapp regex + length=20; minGuests/maxGuests: varchar→smallint + Range + GreaterThanOrEqual; `@internal` docblock on aggregate setters
- [2026-04-19] `api/src/Entity/Review.php` — added ORM index on created_at
- [2026-04-19] `api/src/Entity/WeddingProfile.php` — added ORM indexes on user_id and slug
- [2026-04-19] `api/src/Entity/User.php` — phone length 30→20, added Regex constraint
- [2026-04-19] `api/migrations/Version20260419002303.php` — executed; PostgreSQL-safe varchar→smallint cast (`DROP DEFAULT` + `USING ::SMALLINT`); all new indexes applied
- [2026-04-19] `pwa/constants/paths.ts` — created; centralized `PATHS` object for all app routes (type-safe `AppPath` union type)
- [2026-04-19] `pwa/utils/fetchServerSide.ts` — created; SSR-safe fetch wrapper (no localStorage) for use in `getServerSideProps`/`getStaticProps`
- [2026-04-19] `pwa/components/ui/ErrorBoundary.tsx` — created; class component with `getDerivedStateFromError` + `componentDidCatch`, custom `fallback` prop support
- [2026-04-19] `pwa/types/api.ts` — fixed `QuoteRequest` (was completely wrong schema); added `VendorProfilePayload`; fixed `minGuests`/`maxGuests` string→number
- [2026-04-19] `pwa/pages/dashboard/vendor.tsx` — proper TanStack Query generics (`useQuery<VendorProfileType>`, `useQuery<HydraCollection<QuoteRequest>>`); eliminated all `any`
- [2026-04-19] `pwa/pages/onboarding/vendor.tsx` — mutation typed with `VendorProfilePayload`; PATHS auth guard
- [2026-04-19] `pwa/pages/vendors/[slug].tsx` — hardcoded alert/share text → `t()` calls; fetchServerSide in SSR
- [2026-04-19] `pwa/pages/vendors/index.tsx` — hardcoded aria-labels/pagination → `t()` calls; `window.location.href` → `onClear()`; fetchServerSide in SSR
- [2026-04-19] `pwa/pages/index.tsx` — fetchServerSide replaces raw fetch() in getStaticProps
- [2026-04-19] `pwa/pages/categories/index.tsx` — fetchServerSide replaces raw fetch() in getStaticProps
- [2026-04-19] `pwa/context/AuthContext.tsx` — all hardcoded paths → PATHS constants; `auth:logout` → PATHS.AUTH_LOGIN
- [2026-04-19] `pwa/pages/dashboard/vendor.tsx` + `onboarding/vendor.tsx` — auth guards use PATHS constants
- [2026-04-19] All 4 locale files — added `vendor_profile.link_copied`, `vendor_profile.share_text`, `filters.grid_view`, `filters.list_view`, `common.prev_page`, `common.next_page`
- [2026-04-19] `pwa/pages/e/[slug].tsx` → `pwa/pages/invitation/[slug].tsx` — renamed for SEO; 6 URL references updated (Navbar, OG generation, links)

### Silent JWT refresh — full implementation (Closes #43)
- [2026-04-18] `api/src/Entity/RefreshToken.php` — created; extends bundle base class with `#[ORM\Entity]` + `#[ORM\Table]` only (no field redeclarations — base XML mapping covers id/refreshToken/username/valid)
- [2026-04-18] `api/config/packages/gesdinet_jwt_refresh_token.yaml` — created; `single_use: true` (token rotation), ttl from env
- [2026-04-18] `api/config/packages/security.yaml` — added `api_token_refresh` firewall using gesdinet v2.0 `refresh-jwt:` authenticator; added `PUBLIC_ACCESS` access_control entry
- [2026-04-18] `api/config/packages/lexik_jwt_authentication.yaml` — added `token_ttl` from env
- [2026-04-18] `api/.env` — added `JWT_TOKEN_TTL=3600` and `REFRESH_TOKEN_TTL=2592000`
- [2026-04-18] `api/src/Controller/GoogleAuthController.php` — injects `RefreshTokenGeneratorInterface` + `RefreshTokenManagerInterface`; issues refresh token on OAuth callback and appends `&refresh_token=` to frontend redirect
- [2026-04-18] `api/config/bundles.php` — registered `GesdinedJWTRefreshTokenBundle` (Flex contrib recipes disabled)
- [2026-04-18] DB migration executed: `refresh_token` table created
- [2026-04-18] `pwa/utils/apiClient.ts` — added `getRefreshToken/setRefreshToken/removeRefreshToken`; module-level refresh lock (`refreshPromise`); `attemptRefresh()`; 401 interceptor with single-flight retry; `dispatchLogout()` fires `auth:logout` DOM event; `ApiError` gains `status?: number`
- [2026-04-18] `pwa/context/AuthContext.tsx` — stores refresh token on login; clears on logout; `loginWithToken` accepts optional `refreshToken` param; `auth:logout` event listener drives forced-logout redirect
- [2026-04-18] `pwa/pages/auth/callback.tsx` — reads `refresh_token` query param from Google OAuth redirect and stores it via `setRefreshToken` before calling `loginWithToken`
- [2026-04-18] `pwa/pages/_app.tsx` — QueryClient configured with retry=false for 401 `ApiError` (prevents React Query from racing the single refresh with 3 redundant retries)

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

## 2026-04-20

### Couple Dashboard redesign (Epic 6) — Complete
- [2026-04-20] `pwa/types/api.ts` — added `Greeting` interface; extended `WeddingProfile` with `brideName`, `groomName`, `coverImage`, `totalBudgetMad`, `stylePersona`, `quizResults`, `greetings` fields
- [2026-04-20] All 4 locale files — added `dashboard.couple.hero.*`, `stats.*`, `inspiration.*`, `vendors_section.*`, `milestones.*`, `plan_widget.*` keys; added missing `wall_of_love.*`, `consensus_match.*`, `elder_mode.*` to EN/AR/ARY locales
- [2026-04-20] `pwa/components/dashboard/HeroBanner.tsx` + `.stories.tsx` — editorial hero with couple names, countdown, cover photo; elder mode collapses to text-only
- [2026-04-20] `pwa/components/dashboard/StatsPillsRow.tsx` + `.stories.tsx` — horizontal pill row: days left, budget, tasks remaining, guest count
- [2026-04-20] `pwa/components/dashboard/InspirationGallery.tsx` + `.stories.tsx` — CSS masonry of 4 curated Unsplash wedding photos with gradient labels
- [2026-04-20] `pwa/components/dashboard/VendorDiscovery.tsx` + `.stories.tsx` — horizontally scrollable featured vendor cards; fetches `["featuredVendors"]` query; skeleton + empty CTA state
- [2026-04-20] `pwa/components/dashboard/MilestoneCategories.tsx` + `.stories.tsx` — 6 category photo cards linking to vendor directory filtered by `category.slug`
- [2026-04-20] `pwa/components/dashboard/WeddingPlanWidget.tsx` + `.stories.tsx` — mini checklist widget showing next 5 incomplete tasks with progress bar; elder mode hides progress bar
- [2026-04-20] `pwa/pages/mariage/index.tsx` — full redesign: replaced setup-progress hero with `HeroBanner`; added `StatsPillsRow`; kept 4 nav stat cards; added 2-col magazine zone (InspirationGallery, VendorDiscovery, MilestoneCategories, WallOfLove in left; WeddingPlanWidget + ConsensusMatch in right); wired real `["greetings", profileId]` query replacing hardcoded mock; added pulse PATCH mutation; helper functions for `formatTimeAgo`, `computeConsensusScore`, `computeSharedStyles`

### Farah Magazine feature (P5.4) — Complete (Closes #44)
- [2026-04-20] `pwa/utils/fetchServerSide.ts` — fixed env var — now reads `NEXT_PUBLIC_ENTRYPOINT` first (Docker internal `http://php`) before falling back to `NEXT_PUBLIC_API_URL` (resolves getStaticProps API failures)
- [2026-04-20] `api/src/Entity/Article.php` — added `isFeatured`, `tags`, `widgetType`, `relatedVendors` fields; added `getReadingTimeMinutes()` computed getter (strips HTML, counts words ÷ 200 wpm)
- [2026-04-20] `api/src/Entity/ArticleCategory.php` — added `iconSvg` nullable text field for inline SVG icons
- [2026-04-20] `api/src/EventListener/ArticlePublishListener.php` — created; listens to postPersist/postUpdate Doctrine events, triggers non-blocking ISR revalidation via webhook
- [2026-04-20] `api/config/services.yaml` — wired ArticlePublishListener with env var injection (PWA_INTERNAL_URL, PWA_REVALIDATE_SECRET)
- [2026-04-20] `api/.env` — added PWA_INTERNAL_URL and PWA_REVALIDATE_SECRET config
- [2026-04-20] `api/src/DataFixtures/MagazineFixtures.php` — created; seeded 15 anchor articles across 6 French categories with 400+ words HTML content, Unsplash images, Darija translations, reading times; gastronomie articles set widgetType='hamlau'
- [2026-04-20] `api/migrations/Version20260420005612.php` + `Version20260420013014.php` — executed; added article fields, indexes, and translations
- [2026-04-20] `pwa/pages/api/revalidate.ts` — created; NextJS ISR webhook endpoint (validates secret, revalidates paths array)
- [2026-04-20] `pwa/pages/magazine/index.tsx` — created; landing page with featured hero, category bar filtering, 3-col article grid, TanStack Query with initial SSG data
- [2026-04-20] `pwa/pages/magazine/[slug].tsx` — created; article detail with reading progress bar, JSON-LD Article schema, shop-the-look vendor cards, HamlauCalculator/HireTheProsWidget rendering
- [2026-04-20] `pwa/components/magazine/ArticleCard.tsx` — created; article preview card (featured/grid variants) with image, excerpt, category, reading time, date
- [2026-04-20] `pwa/components/magazine/MagazineCategoryBar.tsx` — created; responsive sticky pill selector with shimmer skeleton during TanStack Query fetch
- [2026-04-20] `pwa/components/magazine/ReadingProgressBar.tsx` — created; fixed 3px terracotta line tracking scroll progress (0-100%)
- [2026-04-20] `pwa/components/magazine/InlineVendorCard.tsx` — created; single vendor card + ShopTheLook group component for article shop-the-look CTAs
- [2026-04-20] `pwa/components/magazine/HamlauCalculator.tsx` — created; interactive widget for catering quantity planning
- [2026-04-20] `pwa/components/magazine/HireTheProsWidget.tsx` — created; inline call-to-action linking to vendor directory filtered by category
- [2026-04-20] `pwa/lib/mockMagazineData.ts` — created; mock articles, categories, vendors matching exact API format for Storybook testing
- [2026-04-20] `pwa/pages/magazine/index.stories.tsx` — created; page-level Storybook stories (Default + EmptyState)
- [2026-04-20] `pwa/pages/magazine/[slug].stories.tsx` — created; page-level stories (Default with HamlauCalculator, WithoutWidgetCalculator, WithRelatedVendors)
- [2026-04-20] `pwa/components/magazine/*.stories.tsx` — created Storybook stories for all components (ArticleCard, HamlauCalculator, HireTheProsWidget, InlineVendorCard, ReadingProgressBar)
- [2026-04-20] i18n — added `magazine.seo.*`, `magazine.all_articles`, `magazine.latest_articles`, `magazine.no_articles`, `magazine.shop_the_look.title` keys to all 4 locales (fr/en/ar/ary)
- [2026-04-20] `Makefile` — added `magazine-seed` target for fixture loading; added `pwa-storybook` target for development
- [2026-04-20] `pwa/components/magazine/MagazineHero.tsx` — created immersive featured article hero with parallax-ready design
- [2026-04-20] `pwa/components/magazine/TopicGrid.tsx` — created visual category navigation with circular imagery
- [2026-04-20] `pwa/components/magazine/TrendingSection.tsx` — created high-contrast dark-mode trending pulse section
- [2026-04-20] `pwa/components/magazine/ArticleCard.tsx` — refactored with multiple editorial variants (landscape, compact, default)
- [2026-04-20] `pwa/pages/magazine/index.tsx` — redesigned landing page with modular editorial layout (Closes #epic-5)
- [2026-04-20] `pwa/pages/magazine/[slug].tsx` — redesigned article detail with parallax header and sticky editorial sidebars
- [2026-04-20] `pwa/components/magazine/HireTheProsWidget.tsx` — added variant support for sidebar integration
- [2026-04-20] `pwa/public/locales/fr/common.json` — added 10+ new editorial i18n keys for magazine redesign

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
