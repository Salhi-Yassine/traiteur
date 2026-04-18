# User Personas & Requirements Traceability

> Part of the [Farah.ma PRD](README.md)

---

## 1. User Personas

### Persona 1 — Nadia (The Couple / Primary Planner)

| Attribute | Detail |
|-----------|--------|
| Age / Location | 26, Casablanca |
| Situation | Engaged, wedding in 9 months, works in finance |
| Languages | Darija + French daily; Arabic + English occasionally |
| Device usage | Mobile-first (WhatsApp, Instagram); uses laptop for research |
| Wedding budget | ~120,000 MAD |
| Tech proficiency | High — expects Airbnb/Booking.com-quality UX |

**Goals:**
- Find reliable vendors within budget
- Keep family coordination organized
- Avoid losing track of deposits and deadlines

**Pain points:**
- Cannot easily compare vendor pricing across Instagram DMs
- Coordination split across five WhatsApp groups
- No clear record of what is booked vs. pending
- Budget keeps shifting with no tracking tool

**How Farah.ma helps:** Single platform for vendor discovery, budget tracking, guest management, and RSVP coordination — all in Darija or French, all in MAD.

---

### Persona 2 — Hassan (The Vendor / Small Business Owner)

| Attribute | Detail |
|-----------|--------|
| Age / Location | 38, Marrakech |
| Business | Wedding photography studio |
| Current web presence | Instagram (12,000 followers), no dedicated website |
| Communication | Responds to inquiries via WhatsApp DMs |
| Tech proficiency | Medium — comfortable with smartphones and Instagram, less so with web dashboards |

**Goals:**
- Be discovered by couples outside his existing network
- Receive structured, qualified leads (not spam DMs)
- Look professional online without managing complex software

**Pain points:**
- No web presence beyond Instagram
- Cannot track how many people see his work
- Misses bookings because informal DMs get buried
- Receives unqualified spam inquiries

**How Farah.ma helps:** A professional profile page with a verified badge, structured inquiry inbox, WhatsApp deep link integration, and analytics showing profile views — all manageable from a simple dashboard.

---

### Persona 3 — Amina (The Wedding Guest / RSVP User)

| Attribute | Detail |
|-----------|--------|
| Age | Any (20–70) |
| Entry point | Received a WhatsApp link from a couple |
| Account status | No Farah.ma account — must not be required to create one |
| Device | Low-end Android phone, variable network quality |
| Tech proficiency | Variable — must work for a non-technical user |

**Goals:**
- Confirm attendance and meal preference in under 60 seconds

**Pain points:**
- Confused by multi-step forms
- Reluctant to create an account just to RSVP
- Slow connection may time out on heavy pages

**How Farah.ma helps:** A single-purpose RSVP page, no account required, < 1.5s load time, 3 steps maximum.

---

## 2. Requirements Traceability Matrix

| Story ID | Description | Goal(s) | Priority | Phase | Status |
|----------|-------------|---------|----------|-------|--------|
| US-1.1 | Search vendors by category & city | G2, G3 | P0 | 1 | ✅ Done (2 ACs remaining) |
| US-1.2 | View vendor profile page | G3, G4 | P0 | 1 | ✅ Done (2 ACs remaining) |
| US-1.3 | Save vendors to moodboard | G2, G5 | P1 | 2 | ❌ Not started |
| US-2.1 | Vendor profile setup wizard | G1, G6 | P0 | 1 | 🟡 Partial (3 ACs remaining) |
| US-2.2 | Vendor inquiry inbox | G3, G6 | P0 | 2 | ❌ Not started |
| US-2.3 | Vendor analytics dashboard | G6 | P1 | 2 | ❌ Not started |
| US-3.1 | Couple account registration & login | G2 | P0 | 1 | 🟡 Partial (silent refresh missing) |
| US-3.2 | Budget planner | G2, G5 | P0 | 2 | 🟡 Partial (chart + polish missing) |
| US-3.3 | Guest list manager | G2, G5 | P0 | 2 | 🟡 Partial (RSVP links + CSV missing) |
| US-3.4 | Wedding checklist | G2, G5 | P0 | 2 | 🟡 Partial (defaults + DnD missing) |
| US-3.5 | Guest RSVP page | G4 | P0 | 2 | ✅ Done (expired link handling missing) |
| US-4.1 | Inspiration gallery | G2, G5 | P1 | 3 | ❌ Not started |

**Legend:** ✅ Functionally complete · 🟡 Core done, polish/features missing · ❌ Not started
