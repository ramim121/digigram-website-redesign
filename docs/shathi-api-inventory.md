# Shathi API — complete route inventory

Source: `saathi-web-application` (Next.js 13 Pages Router, Sequelize + MySQL/RDS,
S3 for media, AWS SES for email, BulkSMSBD for SMS, Firebase Admin for push).

**125 routes** under `src/pages/api`. Derived by static scan of every handler
(methods actually branched on, auth checks actually present, models imported),
then spot-verified by reading the handlers.

Auth column:
- **public** — no token check in the handler
- **user** — requires `Authorization: Bearer <jwt>`
- **admin** — requires a token whose `userType === 'admin'`
- **optional** — works without a token, returns more when an admin token is present

> Several routes marked *public* below **should not be** — see
> [`SECURITY-FINDINGS.md`](./SECURITY-FINDINGS.md) §2–3. The table records what
> the code does today, not what it ought to do.

---

## 1. Authentication & identity

| Route | Methods | Auth | Notes |
|---|---|---|---|
| `/api/login` | POST | public | **Admin login.** `{email, password}` → bcrypt compare against `users` where `userType='admin'`. Returns `{success, token, user}`. JWT `{idUsers, userType}`, 30-day expiry. |
| `/api/otp` | POST, PUT | optional | **The app login.** `POST {phone}` sends a 4-digit OTP via BulkSMSBD. `PUT {phone, otp}` verifies → returns `{token, user}`. With no `Authorization` header it signs in *or auto-creates* the user; with one, it attaches/changes the phone on the current account. Phone regex `^(\+88)?(01[3-9]\d{8})$`. |
| `/api/auth/google` | POST | public | Google Sign-In; verifies ID token via `google-auth-library`, creates user, pulls avatar to S3. |
| `/api/auth/apple` | POST | public | Apple Sign-In via `apple-signin-auth`. |
| `/api/admin_registration` | POST | admin | Creates another admin user. |
| `/api/verify` | POST | admin | Manual verification: `{idUsers, verificationType: email\|phone\|nid, verificationStatus: approved\|rejected}`. Fires a notification. |
| `/api/delete-user` | POST, PUT | public | Account deletion. POST sends an OTP by SMS + email; PUT confirms. |
| `/api/version` | GET | public | App version gate for the mobile clients. |
| `/api/hello` | GET | public | create-next-app leftover. Safe to delete. |

**Token shape** — `jwt.sign({ idUsers, userType }, JWT_SECRET, { expiresIn: '30d' })`.
There is no refresh token and no revocation list; a token is valid for 30 days
regardless of logout.

---

## 2. Projects — the investment catalogue

This is what the marketing site consumes.

| Route | Methods | Auth | Notes |
|---|---|---|---|
| `/api/projects/get_projects_for_investment` | GET | public | **Primary public listing.** All projects except `closed`/`completed`, with `totalInvestedUnits` and `totalRemainingUnits` computed via subquery over confirmed investments. Filters out fully-subscribed. `special` projects sort first. Includes `ProjectProperty` + `ProjectCategory`. No pagination. |
| `/api/projects/details/[id]` | GET | optional | **Public project detail.** Includes `ProjectProperty`, `CreatedBy`, `ProjectPartners` → `User` → `ProfilePicture`, `MainImage`, `FeaturedImages`, `ProjectCategory`, plus computed unit totals. An **admin** token returns a much larger payload additionally including every `ProjectInvestor` with user identity and booking records. |
| `/api/projects/get_all_projects` | GET | public | Unfiltered project list. |
| `/api/popular_projects` | GET | public | Paged. Homepage carousel candidate. |
| `/api/projects/project-partners/[id]` | GET | public | Partners attached to a project. |
| `/api/projects/top-partners/[projectId]/[limit]` | GET | public | Top partners per project. |
| `/api/investors/invested-projects/[id]` | GET | public ⚠ | Portfolio for a given user ID. |
| `/api/projects/list` | GET | admin | Paged admin table. |
| `/api/projects/create` | POST | admin | Joi-validated, S3 image upload. |
| `/api/projects/update/[id]` | POST | admin | Joi + S3. |
| `/api/projects/edit-info/[id]` | GET | admin | Prefill for the edit form. |
| `/api/projects/status_change` | POST | admin | Moves `projectStatus`. |
| `/api/projects/partner_assign` | POST | admin | Assign partners to a project. |
| `/api/projects/project_assign` | POST | admin | Assign projects to a partner. |
| `/api/projects/get-projects-for-assign/[id]` | GET | admin | |
| `/api/projects/get-projects-for-project-assign` | GET | admin | |
| `/api/projects/delete-partner-assign/[id]` | DELETE | public ⚠ | |
| `/api/project-categories/get_all_categories` | GET | public | Category filter chips. |
| `/api/project-categories/list` | GET | admin | Paged. |
| `/api/project-categories/create` | POST | admin | Joi + S3. |

### `Project` model — the actual field set

`src/models/Project.ts`, table `projects`, `underscored: true` (so the DB is
snake_case, the API returns camelCase).

| Field | Type | Note |
|---|---|---|
| `idProjects` | INT PK | **There is no slug.** |
| `idProjectCategories` | INT | → `ProjectCategory` |
| `projectName` | STRING | single language |
| `summary` | TEXT | |
| `description` | TEXT | rich text |
| `projectBanner` | STRING | |
| `location` | STRING | single language, free text |
| `otherLocations` | STRING | |
| `returnRangeMin` / `returnRangeMax` | DECIMAL(12,2) | return % band |
| `totalReturnMin` / `totalReturnMax` | DECIMAL(12,2) | return amount band |
| `unitInvestmentValue` | DECIMAL(12,2) | price per unit |
| `investmentType` | ENUM | `sustainable_return` \| `fast_return` |
| `returnType` | ENUM | `variable` \| `fixed` |
| `duration` + `tenure` | INT + ENUM | `months` \| `years` |
| `collectionStarts` / `collectionEnds` | DATEONLY | |
| `totalAvailableUnits` | INT | `0` means uncapped |
| `investorUnitCapacity` | INT | per-investor cap |
| `insurance` | DECIMAL(12,2) | |
| `projectStatus` | ENUM | `created`, `collection_started`, `collection_done`, `project_started`, `project_finished`, `fund_disbursed`, `closed`, `completed` |
| `showInUpcoming` | ENUM | `yes` \| `no` |
| `projectType` | ENUM | `regular` \| `special` |
| `createdBy` | INT | → `User` |

Computed on the listing/detail queries: `totalInvestedUnits`,
`totalRemainingUnits`.

`ProjectProperty` (1:1) carries cattle-specific figures:
`cattleLiveWeightRate`, `cattleInitialWeightMin/Max`, `cattleFinalWeightMin/Max`.

---

## 3. Bookings & investments — the money path

| Route | Methods | Auth | Notes |
|---|---|---|---|
| `/api/bookings/create` | POST | user | Investor books units. Joi + notification. |
| `/api/bookings/list` | GET | admin | Paged. |
| `/api/bookings/active-booking` | GET | admin | Paged. |
| `/api/bookings/details/[id]` | GET | public ⚠ | |
| `/api/bookings/confirm` | PUT | admin | Confirms a booking → notification. |
| `/api/bookings/deny` | PUT | admin | |
| `/api/bookings/cancel` | PUT | admin | |
| `/api/bookings/change-partner` | PUT | admin | |
| `/api/bookings/collection_status_change` | PUT | admin | |
| `/api/bookings/investment_status_change` | PUT | admin | Drives `investment_status`; `confirmed` is what the unit-count subqueries sum. |
| `/api/bookings/manual_booking` | POST | admin | Offline/cheque bookings. |
| `/api/bookings/manual_notification` | POST | admin | |
| `/api/bookings/proof-of-payment-upload/[id]` | POST | user | S3 upload. |
| `/api/bookings/proof-of-payment-upload/upload` | POST | admin | |
| `/api/investments/create` | POST | admin | |
| `/api/investments/list` | GET | admin | |
| `/api/investment_plans` | GET | public | |
| `/api/digigram_bank_info` | GET | public | Company bank details for manual transfer. |

---

## 4. Partners (Shathi farmers)

| Route | Methods | Auth | Notes |
|---|---|---|---|
| `/api/partners/get_all_partners` | GET | public ⚠ | |
| `/api/top_partners` | GET | public | Paged. Homepage candidate. |
| `/api/partners/list` | GET | admin | Paged. |
| `/api/partners/details/[id]` | GET | admin | |
| `/api/partners/edit-info/[id]` | GET | admin | |
| `/api/partners/registration` | POST | admin | Joi + S3. |
| `/api/partners/update/[id]` | POST | admin | Joi + S3. |
| `/api/partners/get_partner_for_assign` | GET | public | |
| `/api/partners/get-partners-for-assign/[id]` | GET | admin | |
| `/api/all_skills` | GET | public | |
| `/api/skills/list` | GET | admin | Paged. |
| `/api/skills/create` | POST | admin | |

Partner `User` fields exposed on the public project detail: `fullName`, `role`,
`location`, `interestedIn`, `disability`, `joiningDate`, `phoneNumber`, `age`,
`skills`, `bio`, `ProfilePicture`.

> `phoneNumber` and `disability` are returned on a **public** endpoint. Both are
> personal data and `disability` is a special category. Recommend dropping both
> from the public projection.

---

## 5. Marketing content — what the new site reads

| Route | Methods | Auth | Notes |
|---|---|---|---|
| `/api/stat-panels/all-stat-panel` | GET | public | Ordered by `priority`. Optional `?q=` filters `statType`. ⚠️ **Not the stat band.** See "Verified against live data" below — every row is `statType: "image"`, so this is a homepage image carousel, not numeric statistics. |
| `/api/investor-testimonials/all-testimonials` | GET | public | Ordered by `priority`. |
| `/api/partnerships/all-partnerships` | GET | public | Ordered by `priority`. Partner/supporter logos. |
| `/api/blogs/list` | GET | public | |
| `/api/top_blogs` | GET | public | Paged. |
| `/api/blogs/edit-info/[id]` | GET | public | Serves a single post. |
| `/api/live-update/list/[id]` | GET | public | **Project timeline / milestone updates.** |
| `/api/contact` | POST | public | Joi: `{name, email, subject, message}` — **rejects unknown keys**. |
| `/api/blogs/create` \| `/update/[id]` | POST | admin | Joi + S3. |
| `/api/blogs/delete/[id]` | DELETE | public ⚠ | |
| `/api/investor-testimonials/create` \| `/update` | POST | admin | Joi + S3. |
| `/api/investor-testimonials/delete` | DELETE | admin | |
| `/api/investor-testimonials/list` | GET | admin | Paged. |
| `/api/partnerships/create` \| `/update` | POST | admin | Joi + S3. |
| `/api/partnerships/delete` | DELETE | admin | |
| `/api/partnerships/list` | GET | admin | Paged. |
| `/api/stat-panels/create` \| `/update` | POST | admin | Joi + S3. |
| `/api/stat-panels/delete` | DELETE | admin | |
| `/api/stat-panels/list` | GET | admin | Paged. |
| `/api/live-update/create` | POST | admin | Joi + S3. |

---

## 6. Shop — products & orders

| Route | Methods | Auth | Notes |
|---|---|---|---|
| `/api/products` | GET | public | Paged. |
| `/api/partner-product/[...params]` | GET | public | Catch-all. |
| `/api/product-categories` | GET | public | |
| `/api/product-categories/get_all_categories` | GET | public | |
| `/api/products/list` \| `/details/[id]` | GET | admin | |
| `/api/products/create` | POST | admin | Joi. |
| `/api/products/add_packing` | POST | admin | Joi. |
| `/api/products/get-product-packing/[id]` | GET | admin | |
| `/api/products/assign_partners` | POST | admin | Joi. |
| `/api/products/get_partner_for_assign` | GET | admin | |
| `/api/products/images_upload` | POST | admin | S3. |
| `/api/product-categories/create` \| `/update/[id]` | POST | admin | Joi + S3. |
| `/api/product-categories/list` | GET | admin | Paged. |
| `/api/unit/get_all_unit` | GET | public | |
| `/api/unit/list` \| `/create` \| `/update/[id]` | GET/POST | admin | |
| `/api/orders` | GET | admin | Paged. |
| `/api/orders/[id]` | GET | admin | |
| `/api/orders/status_change` | POST | admin | |
| `/api/user/order` | POST, GET | user | Customer-side ordering. |

---

## 7. User profile, banking, location

| Route | Methods | Auth | Notes |
|---|---|---|---|
| `/api/user` | GET, PUT | user | Profile read/update, Joi-validated. |
| `/api/user/address` | GET, PUT, POST, DELETE | user | Full CRUD. |
| `/api/user/investors` | GET | public ⚠ | |
| `/api/profile/picture` | POST | user | S3. |
| `/api/profile/nid` | POST | user | S3. **NID scans — personal identity data.** |
| `/api/banks/get_all_banks` | GET | public | Bank list for the picker. |
| `/api/banks/[id]` | GET | public | Branches for a bank. |
| `/api/banks/user-bank` | GET, POST, PUT | user | The user's own bank account. Joi. |
| `/api/banks/update/[id]` | POST | public ⚠⚠ | **See SECURITY-FINDINGS §2 — no auth, no ownership check.** |
| `/api/banks/edit-info/[id]` | GET | public ⚠ | |
| `/api/user-bank/[id]` | GET | public ⚠ | |
| `/api/location/divisions` | GET | public | |
| `/api/location/districts` | GET | public | |
| `/api/location/police-stations` | GET | public | |

---

## 8. Notifications

| Route | Methods | Auth | Notes |
|---|---|---|---|
| `/api/fcm` | POST | user | Registers/updates the FCM device token. |
| `/api/my-notifications` | GET | user | Paged in-app inbox. |
| `/api/manual-notification/create` | POST | admin | Joi + S3. |
| `/api/manual-notification/list` | GET | admin | Paged. |
| `/api/manual-notification/details/[id]` | GET | admin | |

`generateNotification(event, actor, target)` in `src/notifications/` fans out to
in-app + push + SES email. Templates in `src/notifications/email_templates/`:
`signup_completion`, `email_verified_manual`, `phone_verified_manual`,
`nid_verified`, `nid_verification_failed`, `account_delete_otp`,
`project_maturity_2_weeks`.

> `project_maturity_2_weeks.html` pulls its images from
> `api-test.digigramventures.com` (a test host, in a shipped template) and has no
> `${data.*}` interpolation at all — it greets "Dear Shathi Investor" and cannot
> name the project or the amount.

---

## Response conventions

Every handler returns one of:

```jsonc
{ "success": true,  "data": <payload> }        // list / detail
{ "success": true,  "message": "..." }          // mutations
{ "success": true,  "token": "...", "user": {} } // auth
{ "success": false, "message": "..." }          // 400 / 401 / 404 / 405
```

- HTTP status is meaningful: 400 validation//generic, 401 bad token, 403 wrong
  role, 404 missing, 405 wrong method.
- Joi errors are **joined into one string with `". <br>"`** — an HTML separator in
  a JSON field. The site must not render this raw; split on `<br>` and render a
  list.
- Paged endpoints accept `page` / `limit` query params.
- Media paths are keys relative to `S3_URL`
  (`https://saathi-production-2025.s3.ap-southeast-1.amazonaws.com/`).
- Most handlers wrap in `micro-cors` with `origin: '*'`; a few (all the ones
  without `Cors(...)`) send **no CORS headers at all** and therefore cannot be
  called from a browser cross-origin — server-side fetch only.

---

## Verified against live data

Probed `https://api.digigramventures.com/` directly. Three things the source
code alone did not tell me, two of which contradict what I first assumed:

### 1. Project categories are not what the brief assumed

The design brief's filter chips (Livestock / Agriculture / Agri inputs) do not
exist. The real `project_categories` rows are:

| id | categoryName |
|---|---|
| 9 | Agriculture and livestock |
| 10 | Artisanal |
| 11 | Environmental |

All six live projects are category 9. The website's filter chips must be
rebuilt from this endpoint rather than hardcoded.

### 2. `stat-panels` is an image carousel, not statistics

Every live row is `statType: "image"`, with `statValue` holding an S3 filename
and `statLabel` reading "First Image", "Second Image"… There is **no API source
for the homepage stat band** (1,000+ farmers, 70% women, ৳1.02 Cr). Those
numbers stay in `src/content/company.ts` with their deck citations until
someone adds a real stats table.

### 3. Live projects (6 open, all category 9)

| id | Name | Location | Unit | Return | Tenure | Type | Units (avail/inv/rem) |
|---|---|---|---|---|---|---|---|
| 45 | Project Potato 02 | Rangunia, Chattogram | ৳30,000 | 6–7% | 4 mo | fast | 100 / 2 / 98 |
| 48 | Project Sack Ginger 2 | Rangunia, Chattogram | ৳25,000 | 13–15% | 8 mo | sustainable | 300 / 17 / 283 |
| 49 | Project Cattle 03 | Rangunia, Chattogram | ৳50,000 | 6–7% | 4 mo | fast | 450 / 184 / 266 |
| 50 | Project Cattle 04 | Rangunia, Chattogram | ৳100,000 | 20–22% | 12 mo | sustainable | 650 / 2 / 648 |
| 51 | Project Paddy 01 | Rangunia, Chattogram | ৳20,000 | 4–5% | 3 mo | fast | 450 / 6 / 444 |
| 53 | Project Women Led Cooperatives Feed Mill 01 | Natore | ৳10,000 | 9–10% | 6 mo | sustainable | 200 / 5 / 195 |

All six are `projectStatus: "created"` — so `created` is the normal state for a
live, investable project. The site's status derivation must treat
`projectStatus NOT IN (closed, completed)` + `totalRemainingUnits > 0` as open,
exactly as `get_projects_for_investment` already does, rather than matching on
`collection_started`.

### 4. Partnerships are real, with logos — ASSET-GAP closed

Eight rows, each with an image: Red Hat Impact, Lend For Good, Heifer, Orange
Corner Bangladesh, Sajida Foundation, Biniyog Briddhi, Amra Shadhin Women
Cooperative, CDC. This replaces the hardcoded list and the "logos pending" note
on the site.

### 5. S3 image paths

Objects live under a **prefix per type**, and the marketing prefixes are
publicly readable (verified `200 image/png`):

| Content | Path |
|---|---|
| Partnership logos | `{S3_URL}partnerships/{image}` |
| Blog featured | `{S3_URL}blog-featured-images/{featuredImage}` |
| Profile photos | `{S3_URL}profile/{profileImage}` |
| Push notification | `{S3_URL}push-notification/{image}` |

`S3_URL = https://saathi-production-2025.s3.ap-southeast-1.amazonaws.com/`.
A missing object returns **403, not 404** (ListBucket is denied), so a broken
image cannot be distinguished from a private one by status code — the site's
image `onError` placeholder handles both.

### 6. Other live counts

`investor-testimonials/all-testimonials` returns **0 rows** — the drafted
partner profiles in `src/content/company.ts` remain the only source until the
client populates this. `blogs/list` returns 1 post. `banks/get_all_banks`
returns 62 banks. `investment_plans` returns 15 plans.

---

## Gaps against what the new website needs

| Website needs | API today | Resolution |
|---|---|---|
| **Bilingual content** (`{en, bn}`) | Every text field is single-language: `projectName`, `location`, `description`, `summary`, blog and testimonial bodies | **Blocking decision.** Either add `_bn` columns + admin fields, or accept English-only project data on the Bangla site, or maintain BN copy in the website repo keyed by project ID |
| **Slugs** for SEO URLs (`/projects/project-cattle-01`) | Integer `idProjects` only | Derive `slugify(projectName)-{id}` in the site and resolve by trailing ID. Non-blocking, but a real `slug` column would be better for stable URLs |
| **Category taxonomy** livestock / agriculture / agri-inputs | `ProjectCategory` table — actual rows unknown | Need a dump of `project_categories` to map the filter chips |
| **Milestones / timeline** | `/api/live-update/list/[id]` exists | Map live updates → timeline. Need the model shape |
| **Derived `closing_soon` / `funded`** | Not returned | Derive site-side from `collectionEnds` and `totalRemainingUnits`, as the current build already does |
| **Project cover + gallery** | `MainImage`, `FeaturedImages` (File relations), `projectBanner` | Prefix with `S3_URL`; add the S3 host to `next.config.ts` `images.remotePatterns` |
| **Contact form fields** (phone, enquiry type) | Joi accepts only `{name, email, subject, message}` | Already handled site-side by folding them into `subject`/`message`. Add real columns when convenient |
| **Investor login on the web** | `/api/otp` works and is CORS-open | Usable as-is. Replaces the demo session in `src/components/auth/session.tsx` |
| **Web booking / payment** | `/api/bookings/create` (user auth) exists | The invest flow *can* complete on the web. Confirm whether that is wanted for v1 |

---

## What I need before wiring this up

1. **Base URL** for the API the website should call (staging + production), and
   whether the site is allowed to call it browser-side or must proxy server-side.
2. **A sample response** from `/api/projects/get_projects_for_investment` and
   `/api/projects/details/{id}` against real data — the Sequelize includes make
   the exact JSON shape hard to predict from source alone.
3. **The `project_categories` rows**, so the category filter maps to real IDs.
4. **The bilingual decision** from the gaps table. This one changes the shape of
   the integration, so it should be settled first.
5. Confirmation on whether **web booking** is in scope, or the site stops at the
   app deep-link as originally planned.
