# UX/UI Specifications

> Part of the [Farah.ma PRD](README.md)
> Design tokens live in `pwa/styles/globals.css`

---

## 1. Design Philosophy

Version 3.0 adopts a **white-first, single-accent** design language inspired by Airbnb — pure white surfaces, one bold terracotta accent, generous spacing, and rounded cards — while preserving Moroccan cultural identity through typography, color choice, and geometric pattern details used sparingly.

**Core principles:**
- **White-first surfaces** — Every page starts from pure white. Color signals meaning, not decoration.
- **One accent, with discipline** — Terracotta `#E8472A` appears only on the most important action on any screen. Never decorative.
- **Moroccan identity through type** — DM Serif Display (Latin) + Tajawal Bold (Arabic) for headings; Plus Jakarta Sans for all UI and body text.
- **Depth through shadow** — Cards elevate on hover via shadow upgrade (`shadow-1` → `shadow-2`) and 2px Y-translate, not color change.
- **Cultural motifs in five places only** — Hero section background, section ornament dividers, category tile background, logo mark, Real Weddings header border. Everywhere else: clean and neutral.

---

## 2. Design Tokens

All tokens defined in `pwa/styles/globals.css`.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#E8472A` | Primary CTAs, active states, links |
| `--color-primary-dark` | `#C43A20` | Primary hover state |
| `--color-primary-light` | `#FEF0ED` | Primary background tints |
| `--color-neutral-900` | `#1A1A1A` | Headings, body text |
| `--color-neutral-600` | `#4A4A4A` | Secondary text |
| `--color-neutral-300` | `#D4D4D4` | Borders, dividers |
| `--color-neutral-100` | `#F5F5F5` | Surface backgrounds |
| `--color-neutral-50` | `#FFFFFF` | Page backgrounds |
| `--color-success` | `#16A34A` | Confirmed RSVP, verified badge |
| `--color-warning` | `#D97706` | Over-budget, overdue tasks |
| `--color-warning-bg` | `#FEF3C7` | Warning row backgrounds |
| `--color-danger` | `#DC2626` | Destructive actions, errors |
| `--color-whatsapp` | `#25D366` | WhatsApp buttons |

### Typography

| Language | Display / Headings | Body / UI |
|----------|--------------------|-----------|
| French / English | DM Serif Display | Plus Jakarta Sans |
| Darija (`ary`) / Arabic (`ar`) | Tajawal 700 | Plus Jakarta Sans |

Font overrides applied via `:lang(ar)`, `:lang(ary)` CSS selectors in `globals.css`.

### Spacing & Shape

| Token | Value |
|-------|-------|
| Card radius | 24px |
| `shadow-1` | Rest state |
| `shadow-2` | Hover state (lift) |
| `shadow-3` | Modal/overlay |
| Card hover | `.card-hover` — `shadow-2` + `-2px` Y-translate |

---

## 3. User Flows

### Couple — Vendor Discovery

```
Homepage
  └── Search (category + city)
        └── /vendors (directory with filters)
              └── VendorCard click
                    └── /vendors/[slug] (profile)
                          ├── "Contacter via WhatsApp" → wa.me deep link
                          ├── Inquiry form → POST /api/quote_requests
                          └── "Sauvegarder" heart → /plan/saved
```

### Couple — First Login Onboarding

```
Register / Google OAuth
  └── /onboarding/index.tsx (guard)
        ├── userType=couple, no weddingProfile → /onboarding/couple
        │     └── 4-step wizard (names → date+city → budget+guests → success)
        │           └── /mariage (planning dashboard)
        └── userType=vendor, no vendorProfile → /onboarding/vendor
              └── 5-step wizard → /dashboard/vendor
```

### Vendor — Onboarding

```
/for-vendors landing
  └── Register (email + password or Google)
        └── /onboarding/vendor
              ├── Welcome screen (feature bullets + skip option)
              ├── Step 1: Basic info
              ├── Step 2: Description + cities + contacts
              ├── Step 3: Price range
              ├── Step 4: Photos (Cloudinary upload — pending)
              ├── Step 5: Preview + languages
              └── Submit → "Pending review" status → /dashboard/vendor
```

### Guest — RSVP Flow

```
WhatsApp link: /rsvp/{token}
  └── Token valid?
        ├── No → "Ce lien a expiré" page (friendly message)
        └── Yes → Step 1: Attendance (Confirmer / Décliner)
                      └── Confirmed → Step 2: Meal preference
                                          └── Step 3: Thank-you + confetti
```

---

## 4. Page-by-Page Wireframe Descriptions

### `/vendors` — Vendor Directory

- **Layout:** Left filter sidebar (desktop, sticky) / bottom-sheet `Drawer` (mobile)
- **Toolbar:** Sort dropdown · grid/list toggle · active filter pills with remove per chip + clear-all
- **Grid:** `VendorCard` components — cover photo, category badge, name, city, star rating + count, price range, WhatsApp CTA
- **Empty state:** Friendly message + "broaden your search" suggestion (pending)
- **Pagination:** Page numbers + scroll-to-top, driven by `hydra:totalItems`

### `/vendors/[slug]` — Vendor Profile

- **Header:** Full-width cover image, 5-image gallery grid (lightbox on click)
- **ScrollSpy nav:** Photos · Services · Avis · Localisation (sticky below header)
- **Body sections:** About · Services & Pricing table · Reviews · Map (click-to-reveal)
- **Sidebar (desktop) / sticky bar (mobile):** Reservation widget with date picker + "Contacter via WhatsApp"
- **Sections below fold:** Know Before You Go (3 expandable drawers) · FAQ accordion · Meet Your Host · Similar vendors
- **Mobile sticky bar:** "Contacter via WhatsApp" + price range + floating WhatsApp bubble

### `/mariage/budget` — Budget Planner

- **Header:** Total budget (editable inline) · spent · remaining · percentage bar
- **Visual:** Donut chart by category (Recharts — pending)
- **Table:** Category name · budgeted · spent · remaining · over-budget highlight
- **Actions:** Add category modal · edit amounts inline · delete row

### `/mariage/invites` — Guest List

- **Stats bar:** Total · Confirmed · Declined · Pending
- **Table:** Name · Side · RSVP status badge · Meal preference · RSVP link copy + WhatsApp share · Actions
- **Add modal:** Name, phone, email, side, relationship, city fields
- **Bulk actions:** CSV import (pending) · CSV export (pending)

### `/mariage/checklist` — Wedding Checklist

- **Header:** Progress bar (X of Y) · overdue count badge
- **Grouped list:** Tasks grouped by category, each with drag handle · title · due date · status toggle · overdue highlight
- **Add task modal:** Title, category, due date, notes

### `/rsvp/[token]` — Guest RSVP

- **Minimal layout:** No header/footer nav — single-purpose page
- **Step 1:** Couple names + date (large, welcoming) · Confirmer / Décliner radio
- **Step 2:** Meal preference selector (conditional on confirmation)
- **Step 3:** Thank-you + confetti · no further actions

---

## 5. i18n & RTL Layout

### Languages

| Code | Language | Direction | Priority |
|------|----------|-----------|----------|
| `fr` | French | LTR | Default |
| `ary` | Darija (Moroccan Arabic) | RTL | 2nd |
| `ar` | Modern Standard Arabic | RTL | 3rd |
| `en` | English | LTR | 4th |

Language persisted in `localStorage`. `<html dir="rtl" lang="ar">` updated dynamically on locale switch (pending — see TODO.md).

### RTL Implementation Rules

These rules are **non-negotiable**; enforced in code review:

- Use CSS logical properties throughout: `margin-inline-start`, `padding-inline-end`, `border-inline-start`
- Tailwind: use `ps-*` / `pe-*` / `ms-*` / `me-*` / `start-*` / `end-*` — **never** `pl-*` / `pr-*` / `left-*` / `right-*`
- Directional icons (arrows, chevrons, back buttons): flip via `rtl:scale-x-[-1]` Tailwind class
- Flex row layouts reverse automatically via the `dir` HTML attribute
- Toast notifications: bottom-right in LTR, bottom-left in RTL
- Text alignment: `text-align: start` — never `text-align: left`
- MAD prices: always Western Arabic numerals (1,234) regardless of locale — never Eastern Arabic (١٢٣٤) for monetary values

### Pending RTL Tasks

- [ ] `<html dir="rtl">` + `<html lang="">` dynamic update on locale switch (currently static from server)
- [ ] Directional icon flipping audit across all pages
- [ ] Toast position swap in RTL
- [ ] Full `text-align: start` audit

---

## 6. Accessibility Requirements

**Target: WCAG 2.1 Level AA.** These are mandatory requirements, not aspirational targets.

| Requirement | Implementation |
|-------------|---------------|
| Contrast ratios | 4.5:1 normal text (< 18px) · 3:1 large text (≥ 18px bold or ≥ 24px) |
| Keyboard navigation | All interactive elements reachable via Tab; logical order matches visual (reversed in RTL) |
| Focus rings | `outline: 3px solid var(--color-primary); outline-offset: 2px` — `outline: none` prohibited without custom replacement |
| Modal focus trap | Focus trapped inside modals while open; returns to trigger element on close |
| Icon buttons | All icon-only buttons have `aria-label` |
| Form errors | `aria-live="polite"` + `aria-describedby` linking field to error element |
| Star ratings | `role="img"` with `aria-label="4.8 étoiles sur 5"` |
| Reduced motion | All CSS animations + transitions disabled; skeleton shimmer stopped |
| Tap targets | Minimum 44×44px for all interactive elements |
| Language attribute | `<html lang="">` updates on locale switch |
