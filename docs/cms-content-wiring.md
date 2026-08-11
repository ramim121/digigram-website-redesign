# CMS content on the website — partnerships, blog, investor testimonials

Phase C's remaining wiring. Projects were connected earlier; this covers the
three surfaces the client edits from the admin panel day to day.

## What now comes from the API

| Surface | Endpoint | Renders in |
|---|---|---|
| Partner logos | `partnerships/all-partnerships` | `PartnerBand` — home + about |
| Investor testimonials | `investor-testimonials/all-testimonials` | `InvestorVoiceBand` — home |
| Blog | `blogs/list` | `/blog`, `/blog/[slug]`, home news strip |

New files:

- `src/lib/api/content.ts` — mappers (`mapPartnership`, `mapTestimonial`, `mapBlog`)
- `src/lib/content.server.ts` — `server-only` fetchers
- `src/lib/blog.ts` — client-safe blog helpers and the fallback image

The server/client split mirrors `projects.server.ts` / `projects.ts`: a client
component that imports the fetchers is a build error, not a silent leak of the
backend origin into the browser bundle.

## Decisions worth knowing about

**Blog posts are merged, not replaced.** The CMS holds one post; `content/blog.ts`
holds three drafted long-form pieces that are the site's entire organic-search
surface. Switching to live-only would have deleted them at launch without
anyone deciding to. Both sets render, deduplicated by slug, live winning a
collision. To retire the drafted set later, empty `content/blog.ts` — nothing
else changes.

The three drafted posts exist only in the repo. If the client wants to own them,
they should be pasted into the admin's blog panel (which now has Bangla fields);
after that, delete them from `content/blog.ts` so there is one source.

**Investor testimonials are a new section, not a replacement.** `company.testimonials`
are **Shathi partner** stories, every one with `consentGranted: false`, drafted
from field narratives. The API's testimonials are **investors** who submitted
copy through the product. Different people, different consent rules — so the
site has both bands and they are labelled distinctly ("Shathi partners, in their
words" vs "Why they funded a cycle").

**No byline is invented.** `blogs.written_by` is an admin user id and there is no
public endpoint to resolve it to a name, so `author` is null and the line is
omitted. Same rule as the project mapper: absent data renders as absent, never
as a plausible guess.

**No category is invented either.** The blogs table has no category column, so
CMS posts show a neutral "News" / "খবর" label rather than being filed under a
topic nobody chose.

**Excerpt and reading time are derived.** The API sends only the HTML body.
Excerpts are the first ~190 characters of stripped text; reading time is word
count at 200 wpm English / 140 wpm Bangla, and the higher of the two is shown so
neither locale is understated. Both are estimates and are presented as such.

**The public site does not call `blogs/edit-info/{id}`.** It is unauthenticated
today, but it is the admin form's loader; building the public blog on it means a
future lock silently breaks the site. `blogs/list` already returns the full
body, so the detail page reads from there.

## S3 prefixes

Transcribed from the upload handlers rather than guessed:

| Content | Prefix | Handler |
|---|---|---|
| Partner logos | `partnerships/` | `partnerships/create.ts` |
| Testimonial photos | `investor-testimonials/` | `investor-testimonials/create.ts` |
| Blog featured images | `blog-featured-images/` | `blogs/create.ts` |

All three are public objects on `saathi-files-new.s3.ap-southeast-1.amazonaws.com`
— confirmed with a live request, which also ruled out the other bucket
(`saathi-production-2025` returns 403 for these keys).

## Bangla

The mappers read `nameBn`, `headingBn`, `descriptionBn`, `testimonialBn` and
fall back to English when null.

**The deployed test API does not return them yet.** Sequelize selects only the
attributes its models declare, so until the Phase B model changes are deployed,
these payloads carry English alone. Nothing breaks — every Bangla field is
optional in the types and falls back — but the Bangla site will show English CMS
copy until the backend ships.

## Verified

Against the live test API with a production build (`next build && next start`):

```
partner logos on /en          7 distinct   (API returns 7)
investor band                 present, 2 rows
/en/blog                      4 posts      (3 drafted + 1 live)
/en/blog/breaking-barriers-…-12   200, body renders
/bn/blog/breaking-barriers-…-12   200
build                         75 pages, was 73
```
