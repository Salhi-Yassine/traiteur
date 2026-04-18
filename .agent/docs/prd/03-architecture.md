# Technical Architecture

> Part of the [Farah.ma PRD](README.md)
> Architectural decisions with rationale → `.agent/docs/DECISIONS.md`

---

## 1. System Overview

Farah.ma uses a **decoupled API + PWA** architecture. The backend is a Symfony 7.2 application running on FrankenPHP, exposing a hypermedia REST API built with API Platform 4. The frontend is a Next.js 15 PWA (React 19, TypeScript) that consumes this API exclusively — there are **no Next.js API routes**; all business logic lives in Symfony. PostgreSQL 16 is the primary database, managed via Doctrine ORM and Doctrine Migrations. Authentication uses JWT issued by `lexik/jwt-authentication-bundle`. Real-time push events are delivered via a Mercure hub embedded in the FrankenPHP runtime. Cloudinary handles all image storage and delivery.

```
Browser / Mobile PWA
    │
    ├── Vercel Edge CDN
    │       └── Next.js 15 PWA
    │               ├── REST JSON-LD / JWT ──► Symfony 7.2 API (FrankenPHP)
    │               │                               ├── PostgreSQL 16 (Doctrine ORM)
    │               │                               ├── Mercure Hub (built-in)
    │               │                               ├── Cloudinary (image CDN)
    │               │                               ├── Resend (transactional email)
    │               │                               └── CMI (payment gateway)
    │               ├── SSE ◄──────────────── Mercure Hub
    │               ├── Google Maps JS API
    │               └── Google OAuth 2.0
    └── WhatsApp wa.me (deep link — no API)
```

**Why this stack:** Separating the API from the frontend gives a clean contract boundary, makes the API independently testable, and positions V2 native apps to consume the same API without backend changes. FrankenPHP eliminates the PHP-FPM + Nginx layer — one container handles HTTP/2, HTTP/3, and Mercure. See `DECISIONS.md` for full rationale on every major choice.

---

## 2. Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | Next.js 15, Pages Router, React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI primitives |
| Data fetching | TanStack Query v5 (all client-side remote state) |
| Forms | Formik + Yup |
| i18n | next-i18next, static JSON locale files |
| Backend framework | Symfony 7.2, API Platform 4 |
| Runtime | FrankenPHP (PHP 8.4 + Caddy + Mercure in one binary) |
| Database | PostgreSQL 16, Doctrine ORM 3.x, Doctrine Migrations |
| Auth | lexik/jwt-authentication-bundle (RS256 JWT) |
| Real-time | Mercure (built into FrankenPHP via symfony/mercure-bundle) |
| Image CDN | Cloudinary |
| Email | Resend (via Symfony Mailer) |
| Payments | CMI (Moroccan interbank gateway) |
| Infra | Docker Compose (dev), Helm/k8s (prod), GitHub Actions CI/CD |
| Component docs | Storybook 10 |

---

## 3. Data Model

### Existing Entities

| Entity | File | Key Fields |
|--------|------|-----------|
| `User` | `api/src/Entity/User.php` | `id`, `email`, `password`, `userType` (couple\|vendor\|admin), `weddingProfile`, `vendorProfile` |
| `VendorProfile` | `api/src/Entity/VendorProfile.php` | `id`, `slug`, `businessName`, `category`, `citiesServed`, `averageRating`, `reviewCount`, `isVerified`, `subscriptionTier`, `whatsappNumber` |
| `Category` | `api/src/Entity/Category.php` | `id`, `slug`, `translations` |
| `City` | `api/src/Entity/City.php` | `id`, `slug`, `translations` |
| `Review` | `api/src/Entity/Review.php` | `id`, `vendorProfile`, `author`, `rating`, `comment`, `qualityScore`, `communicationScore`, `valueScore`, `punctualityScore` |
| `MenuItem` | `api/src/Entity/MenuItem.php` | `id`, `vendorProfile`, `name`, `description`, `priceMin`, `priceMax` |
| `WeddingProfile` | `api/src/Entity/WeddingProfile.php` | `id`, `user`, `partnerOneName`, `partnerTwoName`, `weddingDate`, `city`, `totalBudget`, `guestCountEstimate`, `slug` |
| `BudgetItem` | `api/src/Entity/BudgetItem.php` | `id`, `weddingProfile`, `category`, `budgetedAmount`, `spentAmount`, `notes` |
| `ChecklistTask` | `api/src/Entity/ChecklistTask.php` | `id`, `weddingProfile`, `title`, `category`, `dueDate`, `status`, `isDefault`, `sortOrder`, `monthsBefore` |
| `Guest` | `api/src/Entity/Guest.php` | `id`, `weddingProfile`, `name`, `phone`, `email`, `side`, `rsvpStatus`, `mealPreference`, `guestToken` (UUID) |
| `QuoteRequest` | `api/src/Entity/QuoteRequest.php` | `id`, `vendorProfile`, `name`, `email`, `phone`, `weddingDate`, `guestCount`, `budgetMad`, `message`, `status` |
| `TimelineItem` | `api/src/Entity/TimelineItem.php` | `id`, `weddingProfile`, `title`, `date`, `description` |
| `Role` / `Permission` | `api/src/Entity/Role.php` etc. | RBAC support |

### Missing Entities (planned)

| Entity | Status | Needed For |
|--------|--------|-----------|
| `SavedVendor` | ❌ Not created | US-1.3 Moodboard |
| `InspirationPhoto` | ❌ Not created | US-4.1 Inspiration Gallery |
| `SavedPhoto` | ❌ Not created | US-4.1 Moodboard saves |
| `VendorEvent` | ❌ Not created | US-2.3 Analytics |
| `Subscription` | ❌ Not created | Phase 3 CMI billing |

---

## 4. API Design

Built with **API Platform 4** — auto-generates JSON-LD / Hydra-compliant endpoints from Doctrine entity annotations. All endpoints under `/api/`. Responses use the Hydra collection format:

```json
{
  "@context": "/api/contexts/VendorProfile",
  "@id": "/api/vendor_profiles",
  "@type": "hydra:Collection",
  "hydra:member": [...],
  "hydra:totalItems": 42
}
```

### Authentication

- **JWT Bearer tokens** — `lexik/jwt-authentication-bundle`, RS256, 1h expiry
- **Refresh token** — HTTP-only cookie (not yet implemented — see US-3.1)
- **Public endpoints** — vendor directory, vendor profiles, RSVP page require no token
- **Authorization** — Symfony Security Voters enforce row-level ownership

### Key Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/vendor_profiles` | List vendors (filterable, paginated) | Public |
| GET | `/api/vendor_profiles/{slug}` | Get vendor profile | Public |
| POST | `/api/vendor_profiles` | Create vendor profile | Bearer — vendor role |
| PATCH | `/api/vendor_profiles/{id}` | Update vendor profile | Bearer — owner Voter |
| POST | `/api/quote_requests` | Submit inquiry to vendor | Public |
| GET | `/api/quote_requests` | Get vendor's inquiries | Bearer — vendor role |
| PATCH | `/api/quote_requests/{id}` | Update inquiry status | Bearer — vendor owner Voter |
| GET | `/api/wedding_profiles/{id}` | Get couple's wedding profile | Bearer — couple owner |
| PATCH | `/api/wedding_profiles/{id}` | Update wedding profile | Bearer — couple owner Voter |
| GET | `/api/budget_items` | Get budget items | Bearer — couple owner |
| POST | `/api/budget_items` | Add budget item | Bearer — couple role |
| PATCH | `/api/budget_items/{id}` | Update budget item | Bearer — couple owner Voter |
| DELETE | `/api/budget_items/{id}` | Delete budget item | Bearer — couple owner Voter |
| GET | `/api/guests` | Get guest list | Bearer — couple owner |
| POST | `/api/guests` | Add guest | Bearer — couple role |
| PATCH | `/api/guests/{id}` | Update guest | Bearer — couple owner |
| DELETE | `/api/guests/{id}` | Delete guest | Bearer — couple owner Voter |
| GET | `/api/checklist_tasks` | Get checklist | Bearer — couple owner |
| POST | `/api/checklist_tasks` | Add task | Bearer — couple role |
| PATCH | `/api/checklist_tasks/{id}` | Update task | Bearer — couple owner Voter |
| PATCH | `/api/public/guests/{token}` | RSVP submit (public) | Token-based (no JWT) |
| POST | `/api/auth/login` | Issue JWT | Public |
| POST | `/api/auth/refresh` | Refresh JWT | Refresh token (not yet implemented) |
| POST | `/api/auth/google` | Google OAuth → JWT | Public |
| POST | `/api/auth/forgot-password` | Request password reset | Public |
| POST | `/api/auth/reset-password` | Confirm password reset | Public |
| POST | `/api/webhooks/cmi` | CMI payment webhook | CMI HMAC signature |

### Vendor Directory Filters (`GET /api/vendor_profiles`)

API Platform `#[ApiFilter]` annotations:
- `SearchFilter` on `category.slug`, `cities.slug`, `businessName`
- `RangeFilter` on `averageRating`
- `ExistsFilter` on `priceRange`
- `BooleanFilter` on `isVerified`
- `OrderFilter` on `averageRating`, `reviewCount`, `createdAt`

### Critical Request Schemas

**`POST /api/quote_requests`**
```json
{
  "vendorProfile": "/api/vendor_profiles/{id}",
  "name": "string",
  "email": "string",
  "phone": "+212XXXXXXXXX",
  "weddingDate": "YYYY-MM-DD",
  "guestCount": 150,
  "budgetMad": 120000,
  "message": "string (min 20 chars)"
}
```

**`PATCH /api/public/guests/{token}`**
```json
{
  "rsvpStatus": "confirmed | declined",
  "mealPreference": "standard | vegetarian | children"
}
```

---

## 5. Security

| Concern | Implementation |
|---------|---------------|
| Authentication | RS256 JWT, 1h expiry, refresh token via HTTP-only cookie |
| Authorization | Symfony Security Voters per entity — no reliance on DB-level row filtering |
| Password hashing | Symfony Security `sodium` hasher (PHP 8.x default) |
| Password reset | 32-byte random hex token on `User` entity, nulled on use |
| CORS | `nelmio/cors-bundle` — allow only `farah.ma` + Vercel preview domains |
| Input validation | Symfony Validator on all API request bodies; API Platform applies automatically |
| SQL injection | Doctrine parameterized DQL/QueryBuilder throughout |
| XSS | React default escaping (frontend); no raw HTML rendering |
| RSVP token security | UUID-derived (128-bit entropy); expired tokens return `410 Gone` |
| Mercure security | Subscriber JWT scoped to subscriber's own resource topics |
| Payment security | No card data on Farah.ma servers; CMI handles PCI-DSS; webhook verified via HMAC-SHA256 |
| Data at rest | AES-256 (database host default) |
| TLS | FrankenPHP + Caddy automatic Let's Encrypt; Vercel automatic SSL |
| CNDP | Notification required before launch (Morocco data protection) |

---

## 6. Infrastructure & Deployment

| Environment | Frontend | Backend |
|-------------|----------|---------|
| Development | `next dev` in Docker (`make pwa-sh`) | FrankenPHP + PostgreSQL via Docker Compose |
| Preview | Vercel preview deployment | Staging backend container |
| Production | Vercel (region: `fra1`) | FrankenPHP container — VPS or Railway/Fly.io (Europe West) |

**CI/CD (GitHub Actions):**
- Backend: `composer validate` → PHPStan → PHPUnit → Doctrine schema validation
- Frontend: ESLint + TypeScript type-check + Next.js build
- Merges to `main` trigger production deploys (Vercel auto-deploy + backend container push)

**Database migrations:** `make full-migrat` locally; `php bin/console doctrine:migrations:migrate` in CI before container start. Migrations are always backward-compatible for zero-downtime deploys.

**Disaster recovery:** PostgreSQL daily `pg_dump` to S3-compatible bucket (Cloudflare R2). RPO: 24h. RTO: 4h.

---

## 7. Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse mobile performance | ≥ 85 |
| LCP | < 2.5s |
| FCP | < 1.5s |
| CLS | < 0.1 |
| TTI (simulated 4G) | < 3.5s |
| Vendor directory API response | < 600ms |
| RSVP page total load | < 1.5s |
| Vendor thumbnail | < 80KB |
| Vendor gallery image | < 250KB |
| Hero image | < 400KB |
| Uptime SLA | 99.9% |

**Required database indexes at launch:**
- `vendor_profiles(category_id)`, `vendor_profiles(subscription_tier)`, `vendor_profiles(average_rating)`
- `reviews(vendor_profile_id)`, `quote_requests(vendor_profile_id, status)`
- `guests(wedding_profile_id, rsvp_status)`
- Full-text index on `vendor_profiles(business_name, description)` for PostgreSQL FTS
