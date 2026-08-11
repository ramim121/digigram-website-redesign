# Asset & content gaps

Everything the site currently fakes, approximates or asserts without evidence, and what
is needed to close it. Nothing on this list is invented content presented as real —
each item renders either a clearly-marked placeholder or a visible caveat.

Ordered by what blocks launch.

---

## ✅ Resolved (August 2026)

### 1. Shathi Sheba logo — DONE
Supplied vector installed. `public/assets/brand/shathi-sheba-mark.svg` (three-petal
mark, paths from the supplied file) plus `shathi-sheba-horizontal.svg` (the full
supplied lockup, for email signatures / OG cards / print). The interim PNG crop is
deleted.

The wordmark is set as HTML text in the site's display font rather than as the SVG
`<text font-family="Segoe UI">` in the supplied file — that font is not the brand face,
renders differently per machine, and cannot be translated. As real text it stays sharp
at any size and now carries a Bangla variant (`সাথী সেবা`) via
`<ShathiShebaLogo locale="bn" />`.

### 5. App store links — DONE
Real listings wired into `src/lib/site.ts`:
- Play Store: `https://play.google.com/store/apps/details?id=com.digigramsaathi`
- App Store: `https://apps.apple.com/us/app/shathi/id6737144295`

`shebaPlayStore` is deliberately an empty string — Shathi Sheba is pre-launch and a
badge pointing at a 404 is worse than no badge. Anything reading it must check for
empty.

### 6. Google Analytics — DONE
GA4 `G-JLQYQDN2RZ` in `src/components/analytics/Analytics.tsx`, mounted in the locale
layout. Three deliberate changes from the raw snippet you supplied:
- `next/script` with `strategy="afterInteractive"` instead of the bare `async` tag —
  gtag.js is ~90 kB and this audience is on low-end phones over patchy mobile data, so
  it must not sit in the critical path or delay Largest Contentful Paint.
- `anonymize_ip: true`.
- Disabled outside `NODE_ENV=production` and when `NEXT_PUBLIC_GA_ID` is blank, so
  local dev and preview deploys never pollute the property.

Override the ID per environment with `NEXT_PUBLIC_GA_ID`.

---

## ⚠ Still blocking

### 2. Projects API — IN PROGRESS
The real API is now mapped: see [`docs/shathi-api-inventory.md`](./docs/shathi-api-inventory.md).
`/api/projects/get_projects_for_investment` and `/api/projects/details/{id}` are the two
endpoints the site needs, both public, both CORS-open.

**Still needed before wiring:** base URL (staging + production), a sample response
against real data, the `project_categories` rows, and **the bilingual decision** — every
text field in the `projects` table is single-language today. See the gaps table at the
end of the inventory.

Until then `src/content/projects.data.ts` still serves the ten real projects from the
current site, with invented collection windows, unit counts, cooperative names and
milestone dates to exercise the UI states.

### 3. Terms, Privacy, refund policy
**Now:** drafts in `src/content/legal.ts`, written to match how the service actually
works. Both pages render a visible "draft for legal review" banner.
**Need:** counsel-reviewed text. I can draft, but I cannot sign these off as legally
sufficient — a Bangladeshi lawyer needs to review them before the banner comes off.
Replace the content and delete the banner in `src/components/layout/LegalPage.tsx`.

### 4. Shathi partner profiles — CONTENT DONE, CONSENT PENDING
Full profiles written for all six partners already published on the current site
(Roji Akter, Nilu Akter, Ruma Akter, Anowar Hossain, Raju Akter, Mohammad Mofazzol):
a quote plus a paragraph-length story each, in English and Bangla, in
`src/content/company.ts`.

Every entry carries `consentGranted: false`. The copy is drafted from the field
narratives in the decks — it is **not** each partner's own words, and the portraits are
reused from the current site. As signed releases come in, flip the flag per partner and
switch the Voices carousel from `testimonials` to `consentedTestimonials()`, which
filters to signed entries only so an unsigned profile cannot reach production by
accident.

---

## Content still to supply

| Item | Status | Where it lands |
|---|---|---|
| Partner logos (Heifer, Orange Corners, B-Briddhi, SAJIDA, LendForGood, EcoDev) | Names rendered as text cards with a "logos pending" note | `PartnerBand` in `src/components/sections/Shared.tsx` |
| Team portraits | Initials in a teal circle; note on the page | `src/app/[locale]/about/page.tsx` |
| Media & awards | Empty-state card explaining what will appear | `/about#media` |
| Live vacancies | Four illustrative roles, marked as functions we hire into | `src/app/[locale]/about/careers/page.tsx` |
| Shadhin Feed product & packaging photography | Cattle photography used instead; note on the page | `/products/shadhin-feed` |
| Registration / KYC field list | Profile wizard is a 2-step shell built so fields can be added without redesign | `src/components/auth/ProfileWizard.tsx` |
| Meta pixel | Not installed (GA4 is — see above) | `src/components/analytics/Analytics.tsx` |
| Blog bylines | Attributed to "DigiGram Ventures" | `src/content/blog.ts` |

---

## Numbers to verify before publishing

All of these are quoted from the June 2026 email deck or the July 2026 overview deck and
carry a source line in `src/content/company.ts`. Each stat on the homepage and impact
page links to `/impact#methodology`.

- 1,000+ farmers connected · 150+ rural producers registered
- 70% women participation · 15% persons with disabilities
- BDT 1.02 Cr mobilised · up to 20% income increase in pilots
- 15.4% of Shathi partners are persons with disabilities, 19.2% are caregivers
  *(from the current site's FAQ — reconcile with the 15% figure above)*
- 900g ADG, 100→500 ton/month, 67% buy ungraded feed *(Shadhin Feed)*
- 20.5% below poverty line, 10.5% extreme poverty (BBS 2022); 22% gender pay gap;
  136% increase in female agricultural labour; 9% disability prevalence

Two source conflicts were resolved on the site and should be confirmed:

1. **Project Cattle 02 return** — the current homepage says 5–7%, the Shathi page says
   8–10%. The rebuild uses **8–10%**.
2. **Name spelling** — the June deck says "Shakhawat Hossain", the July deck and live
   site say "Sakhawat". The rebuild uses **Sakhawat**.

---

## Generated assets (and what was deliberately not generated)

**Generated** — abstract/illustrative only, per the brief:

- `public/assets/brand/village-motif.png` — line-art village frieze, footer, 7% opacity
- `public/assets/brand/empty-state.png` — empty basket + seedling, used on empty states
  and 404

**Not generated, and must not be:** photographs of farmers, team portraits, product and
packaging shots, partner logos, app screenshots. Every photograph on the site is a real
asset recovered from the client's own files:

| Source | Used for |
|---|---|
| `Current Digigram website images/about.webp` | homepage hero, About |
| `banner_webpage_1–6.webp` | Shathi app mockups, "how it works" |
| `team-1-*.webp` | Shathi partner portraits (consent pending) |
| `impact_1–2.webp` | Impact field stories |
| legacy `qurbani_cow/*.jpg` | project covers (cattle, goat) |
| Shathi Sheba app screenshots | Shathi Sheba product page |
| Design-system bundles + `shathi_new_logo.ai` | all DigiGram and Shathi logo lockups |

**Low-resolution:** `vegetables.jpg`, `ginger.jpg`, `turmeric.jpg` and
`cattle-project.jpg` are cropped out of 640px marketing creatives to remove baked-in
Bangla text. They are soft on a 2× display. Replace with original photography when
available.

---

## Open decisions still outstanding

From §19 of the design brief, these were **not** covered by the answers given:

1. Which payment methods to display (bKash, Nagad, bank transfer, cheque) — the site
   currently names all four in the FAQ and terms.
2. Whether the Shathi Mart B2C storefront returns later (it was dropped from v1).
3. Whether `Invest now` should ever complete on the web, or remain an app deep-link.
4. Office hours — currently stated as Sunday–Thursday 09:00–18:00; confirm.
5. Social profile URLs in `src/lib/site.ts` are assumed; confirm or correct.
