# Architecture & Design Decisions

> Record significant choices here so they are never re-debated.
> Format: decision, why, trade-offs accepted.

---

## Tech Stack

### Pages Router over App Router (Next.js)
**Decision:** Use Next.js Pages Router, not App Router.
**Why:** At project start, App Router + React Server Components were too immature for production. API Platform's JSON-LD responses integrate more naturally with `getServerSideProps` / `getStaticProps` patterns. TanStack Query handles all client-side caching.
**Trade-off:** No React Server Components, no streaming SSR. Acceptable for this scope.

### Symfony + API Platform over Node/Supabase
**Decision:** Symfony 7.2 + API Platform 4 as the backend.
**Why:** Type-safe PHP entities, automatic JSON-LD/Hydra API generation, built-in Doctrine migrations, mature security voters. Replaced an earlier Supabase approach (v1.0 → v1.1 PRD rewrite on 2026-03-31).
**Trade-off:** More infra complexity (FrankenPHP container vs. managed Supabase). Accepted for control and Morocco-specific hosting flexibility.

### FrankenPHP (single binary: PHP + Caddy + Mercure)
**Decision:** Use FrankenPHP instead of separate Nginx + PHP-FPM + Mercure.
**Why:** One container, built-in HTTP/2, built-in Mercure hub for SSE. Simplifies Docker Compose and production deployment.
**Trade-off:** Less conventional than Nginx + PHP-FPM — debugging is slightly less standard.

### JWT over Session Auth
**Decision:** Stateless JWT authentication (`lexik/jwt-authentication-bundle`).
**Why:** Decoupled API that Next.js PWA can call from browser and SSR alike. Sessions would require sticky sessions or a Redis session store.
**Trade-off:** No built-in token revocation — mitigated by short expiry + refresh token pattern.

### TanStack Query (no Redux/Zustand)
**Decision:** TanStack Query for all remote state. No global client-side store.
**Why:** The app's state is mostly server state (vendor data, budget items, guests). TanStack Query handles caching, invalidation, and optimistic updates without extra boilerplate.
**Trade-off:** Complex cross-component local UI state (e.g. multi-step wizard) may eventually need `useContext` or Zustand. Fine for current scope.

---

## Design System

### Single Terracotta Accent (`#E8472A`)
**Decision:** One primary accent color, never two.
**Why:** Moroccan wedding aesthetic — warmth and restraint. Multiple accents create visual noise on a content-heavy platform.
**Trade-off:** Less flexibility for component differentiation — solved with neutral shades and opacity variants.

### 24px Card Radius
**Decision:** Fixed 24px radius on all cards, not a Tailwind scale value.
**Why:** Distinctive brand feel. More generous than Tailwind's `rounded-2xl` (16px) — intentional softness.

### DM Serif Display for Headings
**Decision:** DM Serif Display (Latin) + Tajawal (Arabic) for display headings.
**Why:** Elegant, editorial feel appropriate for a wedding platform. Tajawal has matching weight distribution for Arabic/Darija.
**Trade-off:** Two font families to load. Mitigated by `font-display: swap` and preconnect hints.

---

## i18n

### Darija (ary) as a separate locale from MSA (ar)
**Decision:** Treat Moroccan Darija (`ary`) as a distinct locale, not a dialect of `ar`.
**Why:** The target users speak Darija natively. MSA feels formal and distant. Having both allows users to pick.
**Trade-off:** Double the translation work for Arabic content. Prioritize `fr` → `ary` → `ar` → `en` in that order.

### `next-i18next` with static JSON files
**Decision:** All translations in `pwa/public/locales/[locale]/common.json`. No database-driven i18n.
**Why:** Simple, fast, no API call needed. Translations are managed in-repo with the code they describe.
**Trade-off:** Requires a deploy to update any string. Acceptable — strings don't change often.

---

## Progress Tracking

### Dynamic width inline styles for progress bars
**Decision:** `style={{ width: \`${percent}%\` }}` is an accepted exception to the Tailwind-only rule.
**Why:** Tailwind utility classes are resolved at build time. Runtime-computed percentage values (budget progress, task completion) cannot be expressed as Tailwind utilities. CSS custom properties via `style` are the correct pattern for this case.
**How to apply:** Only use inline styles for truly runtime-computed values (e.g., progress bars, chart dimensions). Any value known at build time must use Tailwind utilities. Add an inline comment `{/* Dynamic width — inline style is correct here */}` next to the element.
**Date:** 2026-04-11

---

### Password reset via custom token, not symfonycasts/verify-email-bundle
**Decision:** Use a 32-byte random hex token stored on the `User` entity, not `symfonycasts/verify-email-bundle`.
**Why:** The verify-email bundle ties its signed URL to the user's current password hash — circular for reset flows. A plain random token is simpler to test and reason about.
**Trade-off:** Token is stored in the DB (one extra column). Mitigated by setting it to `null` on use.
**Date:** 2026-04-16

### Password reset endpoints are plain Symfony controllers, not API Platform resources
**Decision:** `POST /api/auth/forgot-password` and `POST /api/auth/reset-password` use `#[Route]` on a plain `AbstractController`, not `#[ApiResource]`.
**Why:** Password reset is a command-style operation (no GET, no collection, no IRI). Wrapping it in API Platform would require a dummy class just to satisfy the framework model.
**Date:** 2026-04-16

### AuthCard shared component for all auth pages
**Decision:** Extract card shell (outer wrapper + header) into `components/auth/AuthCard.tsx`.
**Why:** login, register, forgot-password, reset-password, callback all share identical structural markup. Single source of truth for the Airbnb-pattern header (X button + Farah.ma logotype centered).
**Date:** 2026-04-16

### userType values aligned to backend constants
**Decision:** Frontend now uses `"couple"/"vendor"` matching `User::TYPE_COUPLE`/`User::TYPE_VENDOR`. Was `"client"/"caterer"` — a silent bug where the API returned 422 on the `Assert\Choice` validator.
**Date:** 2026-04-16

### Split file approach (DONE.md + TODO.md + DECISIONS.md)
**Decision:** Replace single PROGRESS.md with three focused files.
**Why:** PROGRESS.md mixed planning and history — it was always stale. DONE.md is append-only (never lies), TODO.md is the live prioritized backlog, DECISIONS.md captures the why.
**Linked to:** GitHub Projects for visual kanban tracking.
**Date:** 2026-04-10
