# Farah.ma — Claude Code Guide

Morocco's first wedding planning platform. Next.js 15 PWA + Symfony 7.2 API, ~50% complete.

> Full PRD, skills, and workflows → `.agent/`

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15 (Pages Router), React 19, Tailwind CSS v4, shadcn/ui, TanStack Query v5, React Hook Form + Zod, Storybook 10 |
| Backend | Symfony 7.2, API Platform 4, Doctrine ORM, FrankenPHP, PostgreSQL 16, JWT (lexik), Mercure |
| Infra | Docker Compose, Makefile, Helm (k8s) |
| i18n | fr (default), ar, ary (Darija), en → `pwa/public/locales/[locale]/common.json` |
| Notable packages | `framer-motion` (animations), `lenis` (smooth scroll), `sonner` (toast), `recharts` (charts), `papaparse` (CSV), `@dnd-kit` (drag-drop), `react-masonry-css` (gallery) |

---

## GitHub Workflow

1. Find the matching issue: `gh issue list --repo Salhi-Yassine/traiteur --state open`
2. If none exists: `gh issue create --title "feat: ..." --label "phase:2,frontend"`
3. Reference in every commit: `git commit -m "feat: checklist drag-drop (Closes #30)"`
4. Never push to `main` directly — open a PR

Full process → `.agent/workflows/github-projects.md`

---

## Definition of Done

Run before every commit or PR:

```bash
make pnpm c="lint"             # Zero ESLint errors
make pnpm c="test"             # All Vitest tests pass
make pnpm c="build-storybook"  # Only if a new component was added
make cs                         # Backend only: PHP-CS-Fixer + PHPStan
```

Checklist:
- [ ] Issue number in commit message (`Closes #N`)
- [ ] Zero hardcoded strings — every user-visible string goes through `t()`
- [ ] Translation keys added to **all 4 locales** (`fr`, `ar`, `ary`, `en`)
- [ ] RTL grep passes: `grep -r "left-\|right-\|ml-\|mr-" pwa/components pwa/pages --include="*.tsx" | grep -v "rtl:\|//"`
- [ ] `.stories.tsx` co-located for every new component
- [ ] No `any` TypeScript types (`@typescript-eslint/no-explicit-any: error` is enforced)
- [ ] Errors use `toast.error()` — never `alert()`
- [ ] Routes use `PATHS.*` — never hardcoded URL strings

---

## After every work session

1. Append completed items to `.agent/docs/DONE.md` with today's date
2. Remove those items from `.agent/docs/TODO.md`
3. Add any newly discovered tasks to the bottom of the correct section in `TODO.md`
4. If an architectural decision was made, record it in `.agent/docs/DECISIONS.md`

Full instructions → `.agent/workflows/progress-tracking.md`

---

## Non-negotiable rules

### Docker
- **Never** run `php`, `composer`, `node`, `npm`, `pnpm` directly on host
- Always use `make <target>` or `docker compose exec <service> <cmd>`
- Fix file permissions with `make chown` if files were created as root

### Frontend (`pwa/`)
- All strings via `useTranslation('common')` — zero hardcoded text (including `aria-label`, `placeholder`, `alt`, `title`)
- TanStack Query for all data fetching — **never** `useEffect + fetch`
- Tailwind utilities only — no inline styles (exception: runtime-computed values like progress bar widths)
- Every new component → co-located `.stories.tsx` file
- RTL: use logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`) — **never** `left-*` / `right-*`
- Icons that point directionally (arrows, chevrons) need `rtl:-scale-x-100`
- No barrel imports: always import directly from the file, never from an `index.ts`
  ```tsx
  ✅ import VendorCard from '@/components/vendors/VendorCard';
  ❌ import { VendorCard } from '@/components/vendors';
  ```
- Run `pnpm lint` before committing

### Backend (`api/`)
- Entity changes → `make full-migrat` (never `doctrine:schema:update --force`)
- Commit both the entity file AND the generated migration file
- Run `make cs` before committing (PHP-CS-Fixer + PHPStan)
- All public methods need return types + PHPDoc
- Business logic in `api/src/Service/` — keep controllers thin

### Naming conventions
- **Translation keys:** `section.element.qualifier` — snake_case (e.g. `vendor_profile.gallery.title`, `invites.rsvp_status.pending`)
- **Serialization groups:** `entity:read` / `entity:write` (e.g. `checklist:read`, `guest:public:write`)
- **Voter attributes:** `noun:action` (e.g. `profile:edit`, `quote:view`)
- **Component files:** PascalCase (`VendorCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useVendorFilters.ts`)
- **Utilities / clients:** camelCase (`apiClient.ts`, `fetchServerSide.ts`)

### Storybook
- Every new component → co-located `ComponentName.stories.tsx` in same directory
- Access at `http://localhost:6006` via `make storybook`
- Run `make pnpm c="build-storybook"` before committing to catch build errors
- Stories must cover all meaningful variants: sizes, states (loading, error, empty), RTL

### Testing
- Run: `make pnpm c="test"` (watch: `make pnpm c="test:watch"`)
- Test files co-located beside the component they test (`VendorCard.test.tsx` beside `VendorCard.tsx`)
- Focus on: `apiClient` auth/refresh branches, Zod schema validation, TanStack Query error paths
- No `any` in test assertions

---

## Design System

- **Primary accent:** Terracotta `#E8472A` (dark: `#C43A20`, light bg: `#FEF0ED`)
- **Neutral scale:** `#1A1A1A` (900) → `#FFFFFF` (50)
- **Fonts:** DM Serif Display (headings) · Plus Jakarta Sans (body) · Tajawal/Cairo (Arabic)
- **Card radius:** 24px · **Shadows:** `shadow-1` (rest) `shadow-2` (hover) `shadow-3` (modal)
- **Card hover:** `.card-hover` utility (shadow lift + -2px translate)
- **WhatsApp green:** `#25D366`
- Design tokens defined in `pwa/styles/globals.css`
- **Layout shells:** `PlanningLayout` (planning pages sidebar), `Navbar`, `Footer`, `LenisProvider` (smooth scroll root) — all in `components/layout/`

---

## Key Makefile commands

```bash
make up              # Start all containers
make bash            # PHP shell
make pwa-sh          # PWA shell
make pnpm c="<cmd>"  # Run pnpm in PWA (e.g. make pnpm c="add axios")
make logs            # Tail logs
make cc              # Clear Symfony cache
make sf c="<cmd>"    # Symfony console command
make full-migrat     # Doctrine: create migration → run → cleanup
make cs              # PHP-CS-Fixer + PHPStan
make storybook       # Storybook on :6006
make chown           # Fix file permissions (WSL / root-created files)
# Shortcuts via make pnpm:
make pnpm c="lint"              # ESLint
make pnpm c="test"              # Vitest
make pnpm c="build-storybook"   # Storybook build check
```

---

## Environment Variables

Required in `pwa/.env.local` for local development:

| Variable | Example | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:80` | Symfony API base (from host browser) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `abc.apps.googleusercontent.com` | Google OAuth client ID |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Next.js base URL (OG tags, share links) |

Inside the Docker network, use `http://api:80` for server-to-server calls (e.g. in `fetchServerSide`).
See `pwa/.env.example` for the full list.

---

## Directory layout

```
traiteur/
├── api/src/
│   ├── Entity/       # Doctrine entities
│   ├── Service/      # Business logic (never in controllers)
│   ├── State/        # API Platform processors/providers
│   ├── Voter/        # Security voters
│   └── Repository/   # Doctrine repositories
├── pwa/
│   ├── pages/
│   │   ├── auth/         # login, register, forgot-password, reset-password, callback
│   │   ├── onboarding/   # couple, vendor (multi-step RHF wizard)
│   │   ├── vendors/      # index (directory), [slug] (profile)
│   │   ├── mariage/      # index, budget, invites, checklist, site, templates
│   │   ├── dashboard/    # vendor
│   │   ├── admin/        # admin panel
│   │   ├── rsvp/         # [token] (public RSVP — no auth required)
│   │   ├── invitation/   # [slug] (couple's shared event page)
│   │   ├── magazine/     # [slug]
│   │   ├── categories/   # index
│   │   └── account/      # profile
│   ├── components/
│   │   ├── ui/           # shadcn/ui primitives + .stories.tsx
│   │   ├── layout/       # Navbar, Footer, PlanningLayout, LenisProvider, LanguageSwitcher
│   │   ├── auth/         # AuthCard, ProtectedRoute
│   │   ├── vendors/      # VendorCard, SearchBar, FilterSidebar, ReservationWidget
│   │   ├── budget/       # BudgetDonutChart, HorizontalStackedBar, BudgetAssistant
│   │   ├── guest/        # RSVPFlow, RSVPSearchWidget
│   │   ├── dashboard/    # WeddingHeroCard, QuickStatCards, MilestoneCategories, etc.
│   │   ├── onboarding/   # VendorOnboardingWizard (multi-step)
│   │   ├── quotes/       # QuoteRequestModal
│   │   └── common/       # shared primitives not in shadcn
│   ├── context/          # AuthContext, MeProvider, DirectionProvider
│   ├── constants/        # paths.ts → PATHS object (use for all route strings)
│   ├── utils/            # apiClient.ts (HTTP client), fetchServerSide.ts (SSR), utils.ts
│   ├── lib/              # hooks.ts, useVendorFilters.ts, utils.ts (cn helper)
│   ├── styles/           # globals.css (design tokens)
│   └── public/locales/   # i18n: fr/ ar/ ary/ en/ — each has common.json
├── .agent/           # PRD, skills, workflows, rules (read for deep context)
├── compose.yaml
└── Makefile
```

---

## Frontend patterns

```tsx
// ── Imports ───────────────────────────────────────────────────────────────────

// apiClient is a default export — no braces
import apiClient from '@/utils/apiClient';            // ✅
import { apiClient } from '@/utils/apiClient';        // ❌ wrong

// PATHS for all route strings — never hardcode
import { PATHS } from '@/constants/paths';
router.push(PATHS.AUTH_LOGIN);       // ✅
router.push('/auth/login');           // ❌

// ── Data fetching (client-side) ───────────────────────────────────────────────

// Always TanStack Query — never useEffect + fetch
const { data: vendors } = useQuery({
  queryKey: ['vendors', filters],
  queryFn: () => apiClient.get('/api/vendor_profiles', { locale }),
  select: (d: any) => d['hydra:member'] as VendorProfile[],  // always unwrap hydra:member
});

// ── Data fetching (server-side: getServerSideProps / getStaticProps) ──────────

// Never use apiClient in SSR — no localStorage in Node.js
import { fetchServerSide } from '@/utils/fetchServerSide';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  try {
    const data = await fetchServerSide('/api/vendor_profiles', { locale });
    return {
      props: {
        items: data['hydra:member'] ?? [],
        ...(await serverSideTranslations(locale || 'fr', ['common'])),
      },
    };
  } catch {
    // Always spread serverSideTranslations in EVERY return branch
    return { props: { items: [], ...(await serverSideTranslations(locale || 'fr', ['common'])) } };
  }
};

// ── Mutations & error handling ────────────────────────────────────────────────

import { toast } from 'sonner';
import { ApiError } from '@/utils/apiClient';

const mutation = useMutation({
  mutationFn: (data: GuestPayload) => apiClient.post('/api/guests', data),
  onSuccess: () => toast.success(t('invites.guest_added_success')),
  onError: (err: ApiError) => toast.error(err.message),  // ApiError.message = hydra:description
});
// Never: alert(), console.error to user, raw hydra:description in UI

// ── i18n — always ─────────────────────────────────────────────────────────────

const { t } = useTranslation('common');
<span>{t('vendor_profile.gallery.title')}</span>
// Key format: section.element.qualifier (snake_case)

// ── Auth guard ────────────────────────────────────────────────────────────────

const { user, isLoading } = useAuth(); // from context/AuthContext
// user.userType: "couple" | "vendor" | "admin"
// Wrap protected pages with <ProtectedRoute> — don't re-implement the check

// ── API response shapes ───────────────────────────────────────────────────────

// Collection: { "hydra:member": [...], "hydra:totalItems": 42 }
// Single resource: { "@id": "/api/vendor_profiles/1", "@type": "VendorProfile", "id": 1, ... }
// Dates: always ISO-8601 strings — parse with new Date()
// 422 error: { "hydra:description": "email: not valid", "violations": [...] }

// ── API filter params (vendor directory pattern) ──────────────────────────────
// cities.slug, category.slug, averageRating[gte], priceRange[], isVerified, order[field]=asc|desc
```

---

## Current project state (2026-05-04)

| Phase | Status |
|-------|--------|
| Phase 1 — Foundation | ~90% |
| Phase 2 — Planning Tools | ~50% |
| Overall | ~48% |

### What's done
- Symfony + Next.js scaffolded, Docker/Makefile/CI wired
- Design system tokens, shadcn/ui primitives, Moroccan patterns
- Entities: User, VendorProfile, Category, City, Review, MenuItem, WeddingProfile, BudgetItem, ChecklistTask, Guest, QuoteRequest, TimelineItem, Role, Permission, InspirationPhoto, SavedPhoto, RefreshToken
- Auth: JWT + silent refresh (gesdinet, `apiClient` 401 interceptor, `auth:logout` event), Google OAuth, password reset, AuthContext, ProtectedRoute
- Forms: all 7 forms migrated from Formik → React Hook Form + Zod (`login`, `register`, `forgot-password`, `reset-password`, `profile`, `onboarding/couple`, `QuoteRequestModal`)
- Vendor directory — fully functional (filters, sort, pagination, grid/list toggle, mobile drawer)
- Vendor profile — full layout, gallery, calendar, widget, i18n, RTL
- Vendor onboarding wizard — 5-step RHF wizard (`/onboarding/vendor`); photo upload step uses file inputs only (Cloudinary pending)
- Budget page — hero with editable total, stats, payment schedule, donut chart (Recharts), horizontal stacked bar, per-category item table, reallocation suggestions
- Guest list — full CRUD, CSV import (Papa.parse), RSVP link copy + WhatsApp share per guest
- Checklist — CRUD, drag-and-drop reordering (`@dnd-kit`), `displayOrder` persisted via PATCH, phase grouping
- RSVP page (`/rsvp/[token]`) — full 3-step public flow, wired to API
- RTL: full logical-property audit complete (`ps-*`, `pe-*`, `start-*`, `end-*`, icon flip classes)
- i18n: real translations in all 4 locales (fr/ar/ary/en)
- Tests: Vitest setup, 16 unit tests for `apiClient` (token helpers, silent refresh branches)
- `fetchServerSide` SSR wrapper, `ErrorBoundary`, `PATHS` constants, `useVendorFilters` hook

### Missing backend entities
`SavedVendor`, `Subscription`, `RsvpLink`

### Top priorities
1. Cloudinary upload in vendor onboarding wizard (Step 2 — `#22`)
2. Vendor inquiry inbox — inbox page + WhatsApp CTA (`#32`)
3. `SavedVendor` entity + `/plan/saved` moodboard page (`#33`)
4. Budget: over-budget row highlighting, default categories pre-populated (`#27`)
5. Missing Storybook stories: `command`, `popover`, `SuccessAnimation`, `ProtectedRoute`, `Layout`
