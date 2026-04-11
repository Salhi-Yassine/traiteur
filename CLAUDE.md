# Farah.ma — Claude Code Guide

Morocco's first wedding planning platform. Next.js 15 PWA + Symfony 7.2 API, ~25% complete.

> Full PRD, skills, and workflows → `.agent/`

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15 (Pages Router), React 19, Tailwind CSS v4, shadcn/ui, TanStack Query v5, Formik + Yup, Storybook 10 |
| Backend | Symfony 7.2, API Platform 4, Doctrine ORM, FrankenPHP, PostgreSQL 16, JWT (lexik), Mercure |
| Infra | Docker Compose, Makefile, Helm (k8s) |
| i18n | fr (default), ar, ary (Darija), en → `pwa/public/locales/[locale]/common.json` |

---

## Before starting any task

1. Find the matching GitHub issue: `gh issue list --repo Salhi-Yassine/traiteur --state open`
2. If none exists, create one before coding
3. Reference the issue number in commit messages (`Closes #N`)

Full workflow → `.agent/workflows/github-projects.md`

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
- All strings via `useTranslation('common')` — zero hardcoded text
- TanStack Query for all data fetching — **never** `useEffect + fetch`
- Tailwind utilities only — no inline styles
- Every new component → co-located `.stories.tsx` file
- RTL: use logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`) — **never** `left-*` / `right-*`
- Run `pnpm lint` before committing

### Backend (`api/`)
- Entity changes → `make full-migrat` (never `doctrine:schema:update --force`)
- Run `make cs` before committing (PHP-CS-Fixer + PHPStan)
- All public methods need return types + PHPDoc
- Business logic in `api/src/Service/` — keep controllers thin

---

## Design System

- **Primary accent:** Terracotta `#E8472A` (dark: `#C43A20`, light bg: `#FEF0ED`)
- **Neutral scale:** `#1A1A1A` (900) → `#FFFFFF` (50)
- **Fonts:** DM Serif Display (headings) · Plus Jakarta Sans (body) · Tajawal/Cairo (Arabic)
- **Card radius:** 24px · **Shadows:** `shadow-1` (rest) `shadow-2` (hover) `shadow-3` (modal)
- **Card hover:** `.card-hover` utility (shadow lift + -2px translate)
- **WhatsApp green:** `#25D366`
- Design tokens defined in `pwa/styles/globals.css`

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
make chown           # Fix file permissions
```

---

## Directory layout

```
traiteur/
├── api/              # Symfony backend
│   └── src/
│       ├── Entity/       # Doctrine entities
│       ├── Service/      # Business logic
│       ├── State/        # API Platform processors/providers
│       └── Voter/        # Security voters
├── pwa/              # Next.js frontend
│   ├── pages/            # File-based routing (Pages Router)
│   ├── components/
│   │   ├── ui/           # shadcn/ui primitives + .stories.tsx
│   │   └── vendors/      # Vendor-specific components
│   ├── context/          # AuthContext, MeProvider, DirectionProvider
│   ├── lib/              # api.ts, hooks.ts, utils.ts
│   ├── styles/           # globals.css (design tokens)
│   └── public/locales/   # i18n translation files
├── .agent/           # PRD, skills, workflows, rules (read this for deep context)
├── compose.yaml
└── Makefile
```

---

## Frontend patterns

```tsx
// Data fetching — always TanStack Query
const { data } = useQuery({ queryKey: ['vendors'], queryFn: () => api.get('/api/vendor_profiles') });

// i18n — always
const { t } = useTranslation('common');
<span>{t('vendor_profile.some_key')}</span>

// Auth guard
const { user } = useAuth(); // from context/AuthContext

// getStaticProps → public SEO pages
// getServerSideProps → authenticated or dynamic pages
```

---

## Current project state (2026-04-10)

| Phase | Status |
|-------|--------|
| Phase 1 — Foundation | ~60% |
| Phase 2 — Planning Tools | ~20% |
| Overall | ~25% |

### What's done
- Symfony + Next.js scaffolded, Docker/Makefile/CI wired
- Design system tokens, shadcn/ui primitives, Moroccan patterns
- Entities: User, VendorProfile, Category, City, Review, MenuItem, WeddingProfile, BudgetItem, ChecklistTask, Guest, QuoteRequest
- Auth: JWT, registration, login pages (partial), AuthContext, ProtectedRoute
- Vendor profile page (full layout, gallery, calendar, widget, i18n)
- Vendor directory page (partial — needs filters, pagination)
- Planning tools pages: budget, guests, checklist, dashboard (all partial)

### Missing backend entities
`InspirationPhoto`, `SavedVendor`, `SavedPhoto`, `Subscription`, `RsvpLink`

### Top priorities
1. Complete vendor directory (filters, pagination, sort)
2. Vendor onboarding wizard (unblocks vendor supply)
3. Auth: Google OAuth + password reset + JWT refresh
4. Planning tools completion (budget donut chart, guest RSVP, checklist drag)
5. Inspiration gallery (Phase 3)
