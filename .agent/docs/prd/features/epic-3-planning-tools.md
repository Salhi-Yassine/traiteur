# Epic 3 — Couple Planning Tools

> Part of the [Farah.ma PRD](../README.md) · Phase 1–2

---

## Overview

The couple's private planning workspace. Authenticated tools for managing their wedding budget, guest list, checklist, and RSVP flow — all scoped to their `WeddingProfile`.

**Overall epic status:** 🟡 Core flows exist; polish and several key features missing across all stories.

---

## US-3.1 — Account Registration & Login

> As Nadia, I want to create an account so that my planning data is saved and accessible from any device.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P0 — Must Have | 1 | M | 🟡 Partial — silent refresh missing |

### Acceptance Criteria

- [x] Signup: email + password, and Google OAuth
- [x] Login: email/password and Google SSO
- [x] Password reset flow — sends a reset link via Resend (`POST /api/auth/forgot-password` + `POST /api/auth/reset-password`)
- [x] On first couple login, redirected to couple onboarding wizard (`/onboarding/couple`) — collects wedding date, city, budget, guest count estimate
- [x] On first vendor login, redirected to vendor onboarding wizard (`/onboarding/vendor`)
- [x] `AuthContext` exposes `user`, `refreshUser()`, `redirectAfterAuth()`, `logout()`
- [x] Couple onboarding wizard: 4 steps (names → date + city → budget + guests → success), posts `WeddingProfile`
- [ ] **Silent JWT refresh** — JWT expires after 1h; no refresh token interceptor exists yet; users are silently logged out mid-session

### Implementation Notes

- Auth pages: `pwa/pages/auth/login.tsx`, `register.tsx`, `forgot-password.tsx`, `reset-password.tsx`, `callback.tsx` (Google OAuth token handoff)
- Context: `pwa/context/AuthContext.tsx` — `User` type includes `weddingProfile` and `vendorProfile`
- Shared card shell: `pwa/components/auth/AuthCard.tsx`
- Backend: `POST /api/auth/login` (lexik JWT) · `GoogleAuthController` (OAuth redirect + callback + JWT issuance)
- Password reset: custom 32-byte token on `User` entity (not symfonycasts/verify-email — see `DECISIONS.md`)
- `userType` values: `"couple"` / `"vendor"` (matches `User::TYPE_COUPLE` / `User::TYPE_VENDOR`)

### Work Required

- [ ] Add refresh token endpoint to backend: `POST /api/auth/refresh` (lexik refresh token bundle or custom implementation)
- [ ] Add Axios interceptor in `pwa/utils/apiClient.ts`: on `401` response, attempt silent refresh; if refresh fails, call `logout()` and redirect to `/auth/login`
- [ ] Store refresh token in HTTP-only cookie (set by Symfony on login response)

---

## US-3.2 — Budget Planner

> As Nadia, I want to track my wedding budget by category so that I know exactly how much I have spent and how much remains.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P0 — Must Have | 2 | L | 🟡 Partial — chart and polish missing |

### Acceptance Criteria

- [x] Budget overview: total spent, total remaining, percentage used (summary cards)
- [x] Add/delete budget items via modal
- [x] All data via TanStack Query (`useQuery` + `useMutation`)
- [ ] **Editable total budget field** — inline edit on the budget header; `PATCH /api/wedding_profiles/{id}` with updated `totalBudget`
- [ ] **Donut chart** — visualizes spend by category (Recharts `PieChart` with `innerRadius`); shows top 5 categories + "Autres"
- [ ] **Default categories pre-populated** — when a `WeddingProfile` is created, seed 10 default `BudgetItem` rows: Salle de Fête, Photographe, Traiteur, Négafa, Décoration, DJ, Transport, Robe, Fleurs, Divers
- [ ] **Over-budget row highlighting** — row background `var(--color-warning-bg)` when `spentAmount > budgetedAmount`
- [ ] **MAD currency formatting** — all amounts display as `120 000 MAD` (Moroccan number format: space as thousands separator)

### Implementation Notes

- Page: `pwa/pages/mariage/budget.tsx`
- Entity: `api/src/Entity/BudgetItem.php` — fields: `id`, `weddingProfile`, `category` (string), `budgetedAmount`, `spentAmount`, `notes`
- `WeddingProfile` entity has a `totalBudget` field
- Layout: `pwa/components/planning/PlanningLayout.tsx`

### Work Required

- [ ] Editable total budget: add inline edit (click-to-edit pattern) on budget header; `useMutation` PATCH to `/api/wedding_profiles/{id}`
- [ ] Recharts donut: install Recharts (`make pnpm c="add recharts"`); add `<PieChart>` to budget page with category data from `useQuery`
- [ ] Default seeding: in `WeddingProfile` API Platform state processor (`PostPersist`), create 10 default `BudgetItem` rows with `budgetedAmount: 0`
- [ ] Over-budget rows: add conditional class in budget table row: `spentAmount > budgetedAmount ? 'bg-warning-bg' : ''`
- [ ] MAD formatting: create `formatMAD(amount: number): string` utility in `pwa/utils/utils.ts` using `Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })`

---

## US-3.3 — Guest List Manager

> As Nadia, I want to manage my guest list and send RSVP links so that I can track attendance without using WhatsApp groups.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P0 — Must Have | 2 | L | 🟡 Partial — RSVP links and bulk features missing |

### Acceptance Criteria

- [x] Add guests individually (name, phone, email, side: bride/groom/both, relationship, city)
- [x] Delete guests
- [x] Guest list shows RSVP status badges: Pending / Confirmed / Declined
- [x] Meal preference display: Standard / Végétarien / Enfants
- [x] Guest count stats: total invited, confirmed, pending, declined
- [ ] **RSVP link generation** — each guest has a unique `guestToken` (already on entity); UI must display the link `https://farah.ma/rsvp/{token}` with a copy-to-clipboard button
- [ ] **WhatsApp share for RSVP links** — "Envoyer via WhatsApp" button opens `wa.me/{guestPhone}?text=Bonjour {name}, voici votre lien RSVP: {link}`
- [ ] **CSV import** — bulk add guests from a CSV file (columns: name, phone, email, side, city)
- [ ] **Table assignment** — integer field per guest; sortable column in table view; displayed as "Table 3"
- [ ] **Export to CSV** — download full guest list with RSVP status and meal preferences

### Implementation Notes

- Page: `pwa/pages/mariage/invites.tsx`
- Entity: `api/src/Entity/Guest.php` — `guestToken` UUID field already exists; used by the RSVP page (`/rsvp/[token]`)
- RSVP page: `pwa/pages/rsvp/[token].tsx` — fully implemented (public, no-login flow)
- API: `GET /api/guests?weddingProfile=/api/wedding_profiles/{id}` · `POST /api/guests` · `DELETE /api/guests/{id}`

### Work Required

- [ ] RSVP link UI: add "Copier le lien RSVP" button per guest row; use `navigator.clipboard.writeText()` with toast confirmation
- [ ] WhatsApp share: add "Envoyer via WhatsApp" icon button per guest row; construct `wa.me` URL with pre-filled message
- [ ] CSV import: file input → parse with a lightweight CSV parser (`papaparse`); bulk `POST /api/guests` in sequence or add a bulk endpoint to the backend
- [ ] Table assignment: add `tableNumber` integer field to `Guest` entity; expose via API; add editable column to guest table
- [ ] CSV export: client-side generation using `papaparse` or manual string construction; `<a download>` trigger

---

## US-3.4 — Wedding Checklist

> As Nadia, I want a pre-built wedding checklist adapted to Moroccan wedding timelines so that I don't miss any preparation steps.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P0 — Must Have | 2 | M | 🟡 Partial — default tasks and drag-drop missing |

### Acceptance Criteria

- [x] Add / toggle / delete tasks via mutations
- [x] Progress bar: X of Y tasks completed (percentage)
- [x] Category tags + due dates display
- [ ] **40+ default tasks** — pre-seeded when `WeddingProfile` is created; organized by months-before-wedding (12m → 1m → week-of); grouped by categories: Salle, Traiteur, Photographe, Négafa, Tenue, Invitations, Beauté, Lune de Miel, Administratif
- [ ] **Drag-and-drop reordering** — using `@dnd-kit/core` (compatible with React 19); persists new `sortOrder` via `PATCH /api/checklist_tasks/{id}`
- [ ] **Overdue task highlighting** — task row background `var(--color-warning-bg)` when `dueDate < today && status !== done`; overdue count shown in checklist header

### Implementation Notes

- Page: `pwa/pages/mariage/checklist.tsx`
- Entity: `api/src/Entity/ChecklistTask.php` — fields: `id`, `weddingProfile`, `title`, `category`, `dueDate`, `status`, `isDefault`, `sortOrder`, `notes`
- Due dates auto-calculated from `weddingProfile.weddingDate` minus `monthsBefore`

### Work Required

- [ ] Default task fixture: create `ChecklistTaskSeeder` service; called from `WeddingProfile` state processor on `PostPersist`; seeds 40+ tasks with `isDefault: true`, `monthsBefore`, `category`
- [ ] DnD: install `@dnd-kit/core` (`make pnpm c="add @dnd-kit/core @dnd-kit/sortable"`); wrap task list in `<SortableContext>`; on drag end, `useMutation` PATCH with new `sortOrder`
- [ ] Overdue highlighting: compute `isOverdue` in render (`task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'`); apply warning class; show count in header badge

---

## US-3.5 — Guest RSVP Page

> As Amina (a guest), I want to confirm my attendance from a WhatsApp link without creating an account so that I can RSVP in under 60 seconds.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P0 — Must Have | 2 | S | ✅ Functionally complete |

### Acceptance Criteria

- [x] Page loads without login or account creation
- [x] Shows couple names, wedding date, and welcome message
- [x] Step 1: Attendance selection — Confirmer / Décliner
- [x] Step 2 (conditional on Confirmer): meal preference selector — Standard / Végétarien / Enfants
- [x] Step 3: Thank-you confirmation screen with confetti animation
- [x] Guest data loaded server-side via `getServerSideProps` using `guestToken`
- [x] Submits to `PATCH /api/public/guests/{token}`
- [ ] **Expired / invalid token handling** — currently shows a 404 error; should render a friendly expiry message with couple contact info (if available)
- [ ] **Performance** — load time < 1.5s on simulated 4G (not yet measured with Lighthouse)

### Implementation Notes

- Page: `pwa/pages/rsvp/[token].tsx`
- Public API endpoint: `PATCH /api/public/guests/{token}` — no authentication required; updates `rsvpStatus` + `mealPreference`
- Token source: `Guest.guestToken` (UUID stored on entity)

### Work Required

- [ ] `getServerSideProps`: on API error (404 / 410), return `{ props: { expired: true, coupleName: ... } }` instead of `notFound()`; render a friendly "Ce lien a expiré" page with couple's name
- [ ] Run Lighthouse on `/rsvp/[token]` and ensure score ≥ 85 and load < 1.5s
