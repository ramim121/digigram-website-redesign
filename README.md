# DigiGram Ventures — website redesign

A bilingual (English / বাংলা) Next.js rebuild of `digigramventures.com`, replacing the
Agrikon HTML template the current site runs on.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static prerender of every route in both languages
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

---

## What is here

| Area | Where |
|---|---|
| Design tokens (3 brand layers, Bangla type) | `src/app/globals.css` |
| Bilingual helpers, number/date formatting | `src/lib/i18n.ts` |
| Company facts, routes, navigation | `src/lib/site.ts` |
| Project data layer + API seam | `src/lib/projects.ts` |
| SEO: metadata, hreflang, JSON-LD | `src/lib/seo.ts` |
| Content (EN+BN pairs) | `src/content/*` |
| UI kit | `src/components/ui/*` |
| Pages | `src/app/[locale]/*` |

### Routes

```
/                          /bn/
/about                     /bn/about
/about/careers             /bn/about/careers
/impact                    /bn/impact
/products                  /bn/products
/products/shathi           [purple token layer]
/products/shathi-sheba     [wine token layer]
/products/shadhin-feed
/projects                  [Shathi-branded]
/projects/[slug]           [Shathi-branded, public]
/projects/[slug]/invest    auth-gated stub
/blog  ·  /blog/[slug]
/contact  ·  /faq
/login  ·  /login/otp  ·  /register/profile  ·  /account
/terms  ·  /privacy  ·  /delete-account  ·  404
```

Every route prerenders as static HTML in both languages — 90 pages, no server render
on the request path.

---

## The three decisions worth knowing

### 1. Locale routing

English is served at the root (`/about`), Bangla under a prefix (`/bn/about`).
`src/middleware.ts` rewrites a root request to the internal `/en/…` segment, so the URL
stays clean while `app/[locale]/layout.tsx` still knows the language and can set
`<html lang>` correctly **without making any page dynamic**. A direct hit on `/en/about`
308-redirects to `/about` so the two forms never both rank.

`hreflang` alternates (`en-BD`, `bn-BD`, `x-default`) are emitted on every page and in
`sitemap.xml`.

### 2. Brand colour is a runtime token layer, not a second stylesheet

`globals.css` declares semantic tokens (`--brand`, `--on-brand`, `--brand-tint`, …) and
maps them into Tailwind through `@theme inline`, so `bg-brand` compiles to
`background-color: var(--brand)`. Putting `data-brand="shathi"` or
`data-brand="shathi-sheba"` on any element re-colours everything inside it:

```tsx
<div data-brand="shathi">…</div>      {/* purple  #633E94 */}
<div data-brand="shathi-sheba">…</div> {/* wine    #7B1536 */}
```

Site chrome (header, footer, forms) stays DigiGram teal on every page — only the content
region switches. The Products mega-menu is the one place all three colours appear
together, which is deliberate.

Canonical values, as confirmed with the client:

| Brand | Core | Source |
|---|---|---|
| DigiGram | `oklch(0.55 0.075 180)` ≈ `#388073` | workspace design system |
| Shathi | `#633E94` (`--purple-600`) | Shathi design system ramp |
| Shathi Sheba | `#7B1536` | Shathi Sheba app `--brand` |

### 3. Projects go through one data seam

`fetchProjects()` / `fetchProject()` in `src/lib/projects.ts` are the only functions that
know where project data comes from. They currently read `src/content/projects.data.ts`
(the ten real projects from the live site, re-typed into the API contract from §12 of the
design brief). To go live:

```ts
export async function fetchProjects(query) {
  const res = await fetch(`${API}/api/v1/projects?…`, { next: { revalidate: 300 } })
  // map the payload into `Project`
}
```

Nothing else changes. Two rules are enforced in the data layer rather than the UI, so no
page can forget them:

- `closing_soon` and `funded` are **derived**, never stored.
- A null date renders **nothing** — the `<Fact>` component returns `null` rather than
  printing an empty "Collection Starts :" label like the current site does.

---

## Bilingual content

Content is authored as inline pairs rather than two parallel dictionaries:

```ts
const line: Bi = { en: "Invest Now, Shape Tomorrow", bn: "আজ বিনিয়োগ করুন, আগামী গড়ুন" }
t(line, locale)
```

A translator sees the English they must match, and a missing Bangla string is a type
error rather than a silent English fallback.

**Numerals** follow the client's decision: Bangla digits in prose and stat bands
(`১,০০০+ কৃষক`, `৳ ১.০২ কোটি`), Western digits in project fact tables, the return
calculator and every form input, so returns stay scannable and comparable.
`formatBdt(value, locale, { variant: "data" })` opts into the Western form.

**Type**: Montserrat + Open Sans + IBM Plex Mono for Latin; Anek Bangla + Noto Sans
Bengali for Bangla, swapped by `[lang="bn"]` in CSS. Bangla body leading goes to 1.7 and
letter-spacing is forced to 0 — Bangla conjuncts break when tracked.

---

## Auth

Phone → OTP → profile, with **no password anywhere in the system**. There is no auth
backend yet, so `src/components/auth/session.tsx` stores a demo session in
`localStorage` and exposes the exact surface a real one would. Any six digits sign you
in; `000000` exercises the incorrect-code state.

Browsing is never gated. Only `/projects/[slug]/invest` is, and a logged-out visitor who
taps *Invest* has their destination recorded so login returns them there rather than to
the homepage.

---

## Accessibility & performance

- ~111–124 kB First Load JS per route; no client JS on purely static pages.
- Fonts self-hosted by `next/font` — no third-party request, `display: swap`.
- Accordions are native `<details>`/`<summary>`: no JS, correct semantics, and every FAQ
  answer is in the DOM for crawlers.
- Every form control has a real `<label>`; errors are inline and wired with
  `aria-describedby`.
- Visible focus rings on everything interactive; skip-to-content link in the header.
- `prefers-reduced-motion` disables the scroll-in animation entirely.
- QA sweep across 18 routes × 3 viewports × 2 languages found no console errors, failed
  requests, or horizontal overflow.

---

## Before launch

Read **`ASSET-GAPS.md`** — it lists every placeholder, every unverified number and every
missing asset, with what is needed to resolve it.

Set `NEXT_PUBLIC_SITE_URL` to the production origin so canonical URLs, `hreflang` and
`sitemap.xml` resolve correctly.
