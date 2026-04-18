# Success Metrics & Analytics

> Part of the [Farah.ma PRD](README.md)

---

## 1. Key Performance Indicators

| KPI | Definition | Baseline | Target | Timeline | Tool |
|-----|-----------|----------|--------|----------|------|
| Vendor listings at launch | Count of approved, live vendor profiles | 0 | 500 | Launch day | Admin dashboard |
| Monthly Active Couples | Unique couple users performing ≥ 1 planning action/month | 0 | 5,000 | Month 12 | GA4 |
| Vendor Inquiry Conversion | Inquiries sent ÷ vendor profile views | — | > 5% | Month 6 | GA4 events |
| Mobile traffic share | Mobile sessions ÷ total sessions | — | > 70% | Month 3 | GA4 |
| Average session duration | Mean time on site per session | — | > 8 min | Month 6 | GA4 |
| Premium/Featured subscription rate | Vendors on paid tier ÷ total active vendors | 0% | > 20% | Month 12 | Admin dashboard |
| Vendor profile completeness | % of premium vendors with > 80% completeness score | — | > 80% | Month 6 | Admin dashboard |
| RSVP submission rate | RSVP responses received ÷ RSVP links opened | — | > 60% | Month 3 | GA4 events |

---

## 2. GA4 Event Plan

GA4 is the primary analytics tool. Events are tracked client-side via `gtag()`. **GA4 must be activated only after the user accepts the cookie consent banner** (CNDP compliance).

| Event Name | Trigger | Parameters |
|------------|---------|-----------|
| `vendor_view` | Vendor detail page loaded | `vendor_id`, `vendor_category`, `vendor_city` |
| `inquiry_submit` | Inquiry form submitted successfully | `vendor_id`, `vendor_category` |
| `whatsapp_click` | WhatsApp button clicked (vendor profile or card) | `vendor_id`, `source` (profile\|card\|mobile_bar) |
| `vendor_save` | Vendor saved to moodboard | `vendor_id` |
| `vendor_unsave` | Vendor removed from moodboard | `vendor_id` |
| `photo_save` | Inspiration photo saved | `photo_id`, `photo_style` |
| `rsvp_open` | RSVP page loaded by guest | `wedding_profile_id` |
| `rsvp_submit` | RSVP form submitted | `rsvp_status` (confirmed\|declined) |
| `budget_update` | Budget item amount edited | — |
| `checklist_task_complete` | Task marked done | — |
| `signup_complete` | Couple account registration complete | `method` (email\|google) |
| `vendor_signup_complete` | Vendor profile submitted for review | `category` |
| `subscription_upgrade` | Vendor upgrades to Premium or Featured | `tier` (premium\|featured) |
| `filter_apply` | Vendor directory filter applied | `filter_type`, `filter_value` |
| `search_submit` | Homepage search submitted | `category`, `city` |

---

## 3. Error Monitoring

**Sentry** captures all unhandled JavaScript exceptions and Symfony errors in production.
- Frontend: `@sentry/nextjs` SDK
- Backend: `sentry/sentry-symfony` bundle
- Alerting: configured for error rate spikes (> 1% error rate on any endpoint)

---

## 4. Launch Go / No-Go Criteria

All of the following must be true before public launch:

### Functional
- [ ] All P0 user stories passing acceptance criteria in staging
- [ ] Minimum 500 vendor profiles approved and live
- [ ] CMI payment flow tested end-to-end in production with a real card
- [ ] All four languages (Darija, French, Arabic, English) verified by native speakers
- [ ] RTL layout verified on iOS Safari and Android Chrome

### Performance
- [ ] Lighthouse mobile performance score ≥ 85 on: homepage, vendor directory, vendor profile
- [ ] RSVP page load time ≤ 1.5s on simulated 4G (Lighthouse)
- [ ] Vendor directory API response < 600ms with realistic data volume

### Legal & Compliance
- [ ] CNDP notification submitted (registration does not need to be complete — submission suffices)
- [ ] Cookie consent banner implemented; GA4 initialized only after user accepts
- [ ] Privacy policy page live
- [ ] Terms of service page live

### Infrastructure
- [ ] Domain `farah.ma` registered (ANRT) and pointing to Vercel production
- [ ] Uptime monitoring configured (UptimeRobot or Better Uptime)
- [ ] PostgreSQL backup restore tested successfully
- [ ] Content moderation process in place with a named responsible person
