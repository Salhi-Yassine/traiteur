# Appendix

> Part of the [Farah.ma PRD](README.md)

---

## A. Glossary

| Term | Definition |
|------|-----------|
| **Négafa** | Moroccan wedding dresser and ceremony director. One of the most important vendors at a traditional Moroccan wedding — manages the bride's multiple outfit changes and the Amariya ceremony. |
| **Amariya** | The traditional Moroccan wedding chair carried by attendants during the Amariya procession; a Négafa typically coordinates this ceremony. |
| **Haïti / Henné** | The pre-wedding henna ceremony. "Haïti" refers to the henna artist who performs the ceremony. |
| **Fanfara** | Traditional Moroccan brass and percussion ensemble that accompanies wedding processions. |
| **Darija** | Moroccan Arabic dialect (`ary`). Different from Modern Standard Arabic (`ar`); the default spoken language of most Moroccan users. Treated as a distinct locale in Farah.ma. |
| **MAD** | Moroccan Dirham (درهم). All prices on Farah.ma are denominated in MAD using Western Arabic numerals. |
| **ANRT** | Agence Nationale de Réglementation des Télécommunications — Morocco's domain registrar. Manages `.ma` domain registrations. |
| **CMI** | Centre Monétique Interbancaire — Morocco's primary interbank payment network. The most widely accepted payment gateway for Moroccan e-commerce. |
| **CNDP** | Commission Nationale de contrôle de la protection des Données à caractère Personnel — Morocco's data protection authority (equivalent to France's CNIL). Registration required before processing personal data. |
| **SARL** | Société à Responsabilité Limitée — the standard Moroccan limited liability company structure required for the CMI merchant agreement. |
| **RTL** | Right-to-Left — text direction for Arabic and Darija. Requires full layout mirroring via CSS logical properties. |
| **Hydra / JSON-LD** | The hypermedia format used by API Platform. Responses include `@context`, `@type`, and IRI-based resource identifiers (e.g., `"/api/vendor_profiles/uuid"`). |
| **FrankenPHP** | Modern PHP application server built on Caddy. Provides HTTP/1.1, HTTP/2, HTTP/3, automatic TLS, and an embedded Mercure hub in a single binary. Replaces traditional PHP-FPM + Nginx. |
| **Mercure** | Open protocol for real-time server-sent events (SSE). Built into FrankenPHP runtime. Used to push new inquiry notifications to vendors and RSVP updates to couples. |
| **LCP** | Largest Contentful Paint — Core Web Vitals metric measuring main content load speed. Target: < 2.5s. |
| **lexik JWT** | `lexik/jwt-authentication-bundle` — issues and validates RS256-signed JWT access tokens in Symfony. |
| **Symfony Voter** | Symfony Security component encapsulating authorization logic for a resource type (e.g., "can this user edit this VendorProfile?"). Used throughout the API for row-level ownership checks. |
| **Subscription tier** | Vendor pricing plan: Free (limited) / Premium (400 MAD/mo) / Featured (800 MAD/mo). |

---

## B. V2 / V3 Feature Backlog

Features explicitly deferred from V1, ordered by likely implementation sequence:

| Feature | Target | Reason Deferred |
|---------|--------|----------------|
| Admin moderation dashboard UI | V1.1 | Manual moderation sufficient at launch; needed shortly after |
| Silent JWT refresh | V1 — in progress | Currently missing; auth sessions expire after 1h |
| Native iOS app | V2 | Web-first validates market |
| Native Android app | V2 | Web-first validates market |
| In-platform live chat | V2 | `wa.me` links sufficient for V1 |
| Online booking with deposit payment | V2 | Requires merchant escrow + legal complexity |
| AI-powered vendor recommendations | V2 | Requires data volume not available at launch |
| Multi-vendor side-by-side comparison | V2 | Deferred |
| Drag-and-drop seating chart canvas | V2 | List-based table assignment covers V1 |
| Vendor video reels | V2 | Bandwidth cost + moderation complexity |
| Push notifications | V2 | Requires native app or service worker |
| Algolia full-text search | V2 | PostgreSQL FTS covers V1 needs |
| Multi-language auto-translation of vendor content | V2 | Machine translation quality requires validation |
| Wedding website builder for couples | V3 | Separate product surface |
| Marketplace for wedding products | V3 | Different business model |
| WhatsApp Business API | V2 | Requires provider evaluation and API agreement |

---

## C. Infrastructure Costs (Estimated, Monthly at Launch)

| Resource | Monthly Cost (MAD) | Notes |
|----------|------------|-------|
| VPS / Container host (FrankenPHP + PostgreSQL) | ~400–800 | e.g., Railway, Fly.io, or Hetzner VPS (4 vCPU / 8 GB RAM) |
| Vercel Pro (frontend) | ~180 | Serverless, preview deployments, CI |
| Cloudinary Plus | ~950 | 80 GB storage, 80 GB/mo bandwidth |
| Resend | ~100 | 50,000 emails/month |
| Google Maps API | ~200–500 | Dependent on map embed + autocomplete volume |
| Twilio/Infobip SMS | ~150 | ~500 OTP sends/month estimate at launch |
| Cloudflare R2 (PostgreSQL backups) | ~50 | Daily `pg_dump` |
| Sentry (frontend + backend) | ~0 | Free tier covers V1 error volume |
| **Total estimated** | **~2,030–2,730 MAD/mo** | Review at Month 3 |

---

## D. References

- ANRT domain registration: https://www.anrt.ma
- CMI payment gateway: https://www.cmi.co.ma
- CNDP data protection: https://www.cndp.ma
- API Platform documentation: https://api-platform.com/docs
- Next.js 15 documentation: https://nextjs.org/docs
- FrankenPHP documentation: https://frankenphp.dev
- Cloudinary Next.js integration: https://cloudinary.com/documentation/next_integration
- WCAG 2.1 guidelines: https://www.w3.org/TR/WCAG21
- Comparable — The Knot: https://www.theknot.com
- Comparable — Zankyou Morocco: https://www.zankyou.ma

---

## E. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-31 | Initial PRD — executive summary, OKRs, personas, user stories, architecture, API contracts, resource plan, risk register |
| 1.1 | 2026-03-31 | Tech stack update: replaced Supabase + Next.js API routes with Symfony 7.2 / API Platform 4 / FrankenPHP; replaced Supabase Auth with lexik JWT; replaced Supabase Realtime with Mercure; updated all architecture diagrams, API contracts, security section, and glossary |
| 1.2 | 2026-04-18 | Restructured from single file to multi-file PRD (`prd/` directory). Updated all acceptance criteria to reflect actual implementation state as of 2026-04-17 (~38% complete). Removed remaining stale Supabase references from metrics and infrastructure sections. Added Implementation Notes and Work Required sections to all feature files. Added missing entities table to architecture doc. |
