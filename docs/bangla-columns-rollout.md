# Bangla columns (`*_bn`) — rollout status

Phase B. The website serves a full Bangla mirror from the **same** records as
English, using a `*_bn` column per translatable field rather than a parallel
content store. A null `*_bn` means "not translated yet" and the reader falls
back to the English column, so nothing breaks part-way through translation.

Migration: `saathi-web-application/db/migrations/002_bangla_columns.sql`
(22 columns, re-runnable, nullable, INSTANT on MySQL 8).

---

## Status: complete

| Layer | Status |
|---|---|
| SQL migration — all 22 columns across 8 tables | ✅ |
| Sequelize models — Project, Blog, InvestorTestimonial, Partnership, AppStatPanel, ProjectCategory, PartnerAdditionalInfo, User | ✅ |
| TypeScript types for all of the above | ✅ |
| Public partner allowlist (`src/utils/publicFields.ts`) carries the `*_bn` columns | ✅ |
| `projects/details/[id]` partner projections carry them | ✅ |

| Panel | API create/update | Admin form |
|---|---|---|
| Partnerships | ✅ | ✅ |
| Investor testimonials | ✅ | ✅ |
| Stat panels | ✅ | ✅ |
| Project categories | ✅ | ✅ |
| Blogs | ✅ | ✅ second TinyMCE instance |
| Projects | ✅ | ✅ second TinyMCE instance |
| Partner profiles + additional info | ✅ | ✅ dedicated "বাংলা / Bangla" tab |

`npx tsc --noEmit` reports **0 errors** across the whole project.

Two notes from doing the work:

- **`projects.description` is dead.** Nothing writes it — the project rich-text
  editor writes `summary`. `description_bn` exists in the migration for symmetry
  but is intentionally not wired to any form, exactly like its English
  counterpart. Read `summary` / `summaryBn` for project body copy.
- **`app_stat_panel.stat_value_bn` is suppressed for image rows.** An image
  row's `statValue` is a filename, not copy, so both the form and the API skip
  the Bangla value when `statType === 'image'`.

## The pattern, for reference

Each panel took three mechanical edits. Using partnerships as the example:

**1. API create + update route** (`src/pages/api/<panel>/create.ts`, `update.ts`)

```ts
// a) Joi schema — optional, never required
nameBn: Joi.string().optional().allow(null, ''),

// b) the `data` object built from formidable fields
nameBn: fields.nameBn ? fields.nameBn[0] : null,

// c) the Model.create({...}) / existing.update({...}) call
nameBn: data.nameBn || null,
```

Optional, not required — the existing workflow writes English first and
translates later, and making these mandatory would block it.

**2. Admin page** (`src/pages/...`)

- add the field to the `FormData` interface and the `useState` initialiser
- `newFormData.append('<field>Bn', formData.<field>Bn || '')`
- reset it in the post-submit `setFormData`
- populate it in `handleEdit` (`item.<field>Bn || ''`)
- render the input with `lang="bn"`, a Bangla placeholder, no required marker,
  and the muted helper "Optional. Falls back to the English … if left blank."

**3. Nothing on the read side** — the panel list endpoints return whole rows, so
the new columns appear automatically once written.

### Where each column landed

| Panel | Columns | API routes | Admin page |
|---|---|---|---|
| Investor testimonials | `nameBn`, `testimonialBn` | `api/investor-testimonials/{create,update}.ts` | `pages/setup/investor_testimonial.tsx` |
| Stat panels | `statLabelBn`, `statValueBn` | `api/stat-panels/{create,update}.ts` | `pages/setup/stat_panel.tsx` |
| Project categories | `categoryNameBn` | `api/project-categories/create.ts` | `pages/setup/project_category.tsx` |
| Blogs | `headingBn`, `descriptionBn` | `api/blogs/create.ts`, `api/blogs/update/[id].ts` | `pages/blogs/create.tsx`, `pages/blogs/edit/[id].tsx` |
| Projects | `projectNameBn`, `summaryBn`, `locationBn`, `otherLocationsBn` | `api/projects/create.ts`, `api/projects/update/[id].ts` | `pages/projects/create.tsx`, `pages/projects/edit/[id].tsx` |
| Partner profiles | `fullNameBn`, `roleBn`, `bioBn`, `skillsBn`, `locationBn`, `interestedInBn`, `educationBn` | `api/partners/update/[id].ts` | `pages/partners/edit/[id].tsx` |
| Partner additional info | `livelihood_activity_bn`, `primary_goal_bn` | same partner route | same, in the Bangla tab |

The rich-text panels (blogs, projects) each got a **second TinyMCE instance**
rather than a textarea, so Bangla body copy keeps its formatting. Those editors
set a Bangla-capable `content_style` font stack
(`"Noto Sans Bengali","Nirmala UI",…`) so the editing surface renders the script
instead of tofu boxes.

### A note on the TinyMCE typecheck errors

Those five pages used to report ten `TS7006: Parameter 'evt' implicitly has an
'any' type` errors. The cause was not the code: `@tinymce/tinymce-react` imports
its types from the `tinymce` package, which was never installed, so
`TinyMCEEditor` resolved to nothing and `onInit`'s parameters lost their
contextual types. Installing `tinymce` as a devDependency fixed all ten at once
without touching a line of the JSX.

The `knex-stringcase` error was separate: that package ships ESM-only
declarations that classic `node` module resolution refuses to load. Rather than
change `moduleResolution` project-wide in a Next 13 app, there is now an ambient
declaration at `src/types/knex-stringcase.d.ts` describing the one function the
project actually calls.

## Verification

```sql
SELECT TABLE_NAME, COLUMN_NAME
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE() AND COLUMN_NAME LIKE '%\_bn'
ORDER BY TABLE_NAME, COLUMN_NAME;
-- 22 rows
```

Then, per panel: save a record with Bangla text, confirm it round-trips through
the list endpoint, and confirm the English column is untouched.

## Note on scope

Numbers, dates and enums are deliberately **not** duplicated. Amounts and dates
are formatted per-locale at render time (Bangla digits in prose, Western in
tables, per the established rule); enum values are keys whose labels are
translated in the front end. Duplicating them in the database would create two
sources of truth for the same number.
