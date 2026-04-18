# Goals, Problem Statement & Non-Goals

> Part of the [Farah.ma PRD](README.md)

---

## 1. Problem Statement

Engaged couples in Morocco spend an estimated **20–30 hours** coordinating vendor discovery across Instagram, WhatsApp, and word-of-mouth referrals. This process yields no pricing transparency, no verified reviews, and no single place to track what has been booked versus what is still pending. Families are coordinated through sprawling WhatsApp groups; budget overruns are common because there is no tool to track deposits and commitments in one place.

Simultaneously, Moroccan wedding vendors — venues, photographers, Négafas, caterers, decorators — operate without a professional web presence. Most have only an Instagram page and rely entirely on referrals for new business. They receive no analytics on how many couples viewed their profile, have no way to receive structured inquiries, and cannot differentiate their quality from unverified competitors.

**The market reality:**
- Average Moroccan wedding budget: **80,000–200,000 MAD**
- One of the most significant family investments a household makes
- No existing digital infrastructure to support it

---

## 2. Goals & OKRs

| # | Objective | Key Result | Baseline | Target | Timeline |
|---|-----------|------------|----------|--------|----------|
| G1 | Establish vendor supply at launch | Verified vendors live on platform | 0 | 500 | Launch day |
| G2 | Drive couple engagement | Monthly active couples using planning tools | 0 | 5,000 | Month 12 |
| G3 | Prove vendor ROI | Inquiry conversion rate (views → inquiry sent) | — | > 5% | Month 6 |
| G4 | Build mobile-first engagement | Share of traffic from mobile devices | — | > 70% | Month 3 |
| G5 | Establish content depth | Average session duration | — | > 8 min | Month 6 |
| G6 | Drive subscription revenue | Premium/Featured vendor subscription rate | 0% | > 20% of active vendors | Month 12 |

**Primary V1 success metric: 500 verified vendor listings live on launch day.**

---

## 3. Non-Goals (Explicit V1 Scope Boundaries)

The following are explicitly out of scope for V1. They are not deferred indefinitely — see [07-appendix.md](07-appendix.md) for the V2/V3 backlog with rationale.

| Out of scope | Why deferred |
|-------------|-------------|
| Native iOS/Android app | Web-first validates the market before native investment |
| In-platform live chat | WhatsApp `wa.me` deep links are sufficient for V1 vendor-couple communication |
| Online booking with deposit payments | Requires merchant escrow and legal complexity |
| AI-powered vendor recommendations | Requires data volume not available at launch |
| Multi-vendor side-by-side comparison | Deferred to V2 |
| Drag-and-drop seating chart canvas | List-based table assignment covers V1 |
| Wedding website builder for couples | A separate product surface, targeted for V3 |
| Admin moderation dashboard UI | Manual moderation by a founder is sufficient for V1; V1.1 target |
| Algolia full-text search | PostgreSQL full-text search covers V1 needs |
| WhatsApp Business API | `wa.me` links require no API agreement and are sufficient for V1 |
| Multi-language auto-translation of vendor content | Machine translation quality requires validation before enabling |

---

## 4. Open Questions

| # | Question | Owner | Impact if Unresolved |
|---|----------|-------|---------------------|
| Q1 | Is `farah.ma` available via ANRT? Registration timeline? | Founders | Blocks public launch URL |
| Q2 | What legal entity operates Farah.ma? Moroccan SARL required for CMI | Founders + Legal | Blocks subscription billing |
| Q3 | CMI merchant agreement timeline and required docs? | Founders + Legal | Blocks subscription billing at launch |
| Q4 | Initial photography content budget and sourcing plan? | Founders + Content Lead | Blocks homepage and inspiration gallery quality |
| Q5 | Soft launch Casablanca + Marrakech only, or national? | Founders | Affects required vendor supply (500 national vs ~150 for two cities) |
| Q6 | Who is the named content moderator at launch? | Founders | Blocks launch — must have named owner before go-live |
| Q7 | Should wedding date picker display Hijri calendar equivalent? | Product Lead | Affects DatePicker implementation; proposed: yes, Hijri in smaller text below Gregorian |
| Q8 | Who writes and QAs Darija (`ary`) translations? | Founders + Content Lead | Blocks RTL/Darija QA in Phase 4 |
| Q9 | Vendor "Vérifié" badge criteria — does RC documentation need to be provided? | Founders | Affects vendor onboarding flow |
| Q10 | SMS provider: Twilio vs. Infobip — verified Morocco coverage? | Engineering | Affects password reset reliability |

---

## 5. Assumptions

| # | Assumption | Risk if Wrong | Validation Plan |
|---|-----------|---------------|-----------------|
| A1 | Moroccan vendors are willing to create/maintain a digital profile for free visibility | Low vendor adoption | 20 vendor interviews in Week 1 |
| A2 | WhatsApp `wa.me` links are sufficient for V1 communication | Couples expect in-platform messaging | Monitor inquiry-to-WhatsApp conversion at launch; revisit Month 3 |
| A3 | PostgreSQL FTS is sufficient for vendor search at 500–2,000 vendors | Poor search quality | Benchmark FTS with 2,000 test records in Phase 1 |
| A4 | Mobile web engagement is sufficient vs. native app | Higher bounce rate than expected | Instrument session depth + return visit rate in GA4; native app in V2 if bounce > 60% |
| A5 | CMI covers ≥ 90% of Moroccan vendor payment methods | Significant payment methods not covered | Confirm with CMI during merchant agreement process |
