# Epic 4 — Inspiration Gallery

> Part of the [Farah.ma PRD](../README.md) · Phase 3

---

## Overview

A curated, browsable gallery of Moroccan wedding photos for couples seeking visual inspiration. Photos are filtered by style and region, can be saved to a personal moodboard, and are approved by an admin before appearing publicly.

**Overall epic status:** ❌ Not started — backend entity and frontend page both missing.

---

## US-4.1 — Browse & Save Inspiration Photos

> As Nadia, I want to browse Moroccan wedding photos filtered by style and region so that I can build a visual moodboard for my wedding.

| Priority | Phase | Effort | Status |
|----------|-------|--------|--------|
| P1 — Should Have | 3 | M | ❌ Not started |

### Acceptance Criteria

- [ ] Inspiration gallery at `/inspiration` shows photos in a **masonry grid** (3-column desktop, 2-column mobile)
- [ ] Filter by **style**: Traditional, Modern, Bohème, Andalou
- [ ] Filter by **region**: Casablanca, Marrakech, Fès, Rabat, Agadir, Tanger, Autres
- [ ] Filter by **elements**: Caftan, Fanfara, Zellige, Lanterns, Amariya
- [ ] Hovering a photo reveals a save-to-moodboard heart icon and the style tag
- [ ] Clicking a photo opens a **lightbox/modal** (URL updates to `/inspiration/[id]` for shareability)
- [ ] Lightbox shows: full-size photo, style + region tags, linked vendor profile (if applicable), save button
- [ ] Saved inspiration photos appear in `/plan/saved` alongside saved vendors
- [ ] Photos only appear publicly after admin sets `approved: true`
- [ ] Admin approval workflow: simple boolean toggle (can be done directly via API or a minimal admin page)

### Implementation Notes

**Missing backend entity (`InspirationPhoto`):**

```php
// Fields needed on InspirationPhoto entity
id: uuid
cloudinaryId: string       // Cloudinary public_id for the image
style: string (enum)       // traditional | modern | boheme | andalou
region: string             // casablanca | marrakech | fes | ...
elements: string[]         // [caftan, fanfara, zellige, ...]
vendorProfile: ?ManyToOne  // optional linked vendor
uploadedBy: ManyToOne      // User (admin or vendor)
approved: bool             // default false — admin must approve
approvedAt: ?DateTime
createdAt: DateTime
```

**Missing backend entity (`SavedPhoto`):**

```php
// Fields needed on SavedPhoto entity
id: uuid
user: ManyToOne
inspirationPhoto: ManyToOne
createdAt: DateTime
```

- Gallery page will live at: `pwa/pages/inspiration/index.tsx`
- Lightbox route: `pwa/pages/inspiration/[id].tsx`
- Saved page `/plan/saved` will show both `SavedVendor` and `SavedPhoto` in tabs

### Work Required

**Backend:**
- [ ] Create `InspirationPhoto` entity with fields above
- [ ] Create `SavedPhoto` entity with `SavedPhotoVoter`
- [ ] Add API Platform resources: `GET /api/inspiration_photos` (public, filtered by `approved=true`), `POST` (admin/vendor upload), `PATCH` (admin approval)
- [ ] Add `#[ApiFilter]` annotations: `SearchFilter` on `style`, `region`, `elements`
- [ ] Run `make full-migrat`
- [ ] Add Cloudinary signed upload endpoint: `GET /api/inspiration_photos/upload-signature`

**Frontend:**
- [ ] Install CSS masonry layout — evaluate `react-masonry-css` or CSS `columns` approach
- [ ] `pwa/pages/inspiration/index.tsx` — masonry grid with filter bar; TanStack Query for data fetching
- [ ] `pwa/pages/inspiration/[id].tsx` — lightbox/detail page; `getStaticProps` + ISR for SEO
- [ ] Save button: `POST /api/saved_photos` with optimistic UI (same pattern as SavedVendor in US-1.3)
- [ ] `/plan/saved` page: tabbed layout — "Prestataires" tab (saved vendors) + "Inspiration" tab (saved photos)
- [ ] Add all new i18n keys to all 4 locale files
