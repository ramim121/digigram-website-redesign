import type { Bi } from "@/lib/i18n";
import type { Project, ProjectCategory, ProjectStatus, ProjectType } from "@/lib/projects";
import { s3Url } from "./config";
import { num, nullIfBlank, type ApiFile, type ApiProject } from "./types";

/**
 * Maps live API rows into the site's `Project` shape.
 *
 * Everything the UI renders goes through here, which is where the awkward parts
 * of the backend contract are absorbed once instead of in every component.
 *
 * ON NOT INVENTING NUMBERS
 * The design brief specifies a `producers` block with cooperative name, women's
 * share and PwD share. The API does not carry most of it: partner gender lives
 * on `PartnerAdditionalInfo`, which the public project projection does not
 * include, and there is no cooperative field at all. Rather than fabricate
 * plausible percentages, unknown values are `null` and the UI omits the row —
 * the brief is explicit that every number must be sourced or marked. The one
 * share we *can* compute honestly is PwD, from the partners' `disability` flag.
 */

/** Real category ids, confirmed against the live API. */
const CATEGORY_BY_ID: Record<number, ProjectCategory> = {
    9: "agriculture_livestock",
    10: "artisanal",
    11: "environmental",
};

/** Fallback for a category id we have not seen before — better than crashing a page. */
const DEFAULT_CATEGORY: ProjectCategory = "agriculture_livestock";

export function mapCategory(id: number | null | undefined): ProjectCategory {
    return (id != null && CATEGORY_BY_ID[id]) || DEFAULT_CATEGORY;
}

/**
 * Collapses the backend's eight-state lifecycle into the five states the site
 * shows. `decorate()` in lib/projects.ts may later upgrade `open` to
 * `closing_soon` or `funded` from dates and remaining units.
 */
export function mapStatus(row: ApiProject): ProjectStatus {
    if (row.showInUpcoming === "yes") return "upcoming";

    switch (row.projectStatus) {
        case "created":
        case "collection_started":
            return "open";
        case "collection_done":
        case "project_started":
        case "project_finished":
        case "fund_disbursed":
            // Collection has closed, so no further investment is possible, but the
            // project is still running — "fully funded" is the honest label.
            return "funded";
        case "closed":
        case "completed":
            return "completed";
        default:
            return "open";
    }
}

/**
 * URL-safe slug. The id is appended because project names repeat in the data
 * ("Project Potato 02" style names are reused across seasons) and a collision
 * would make two projects share a page.
 */
export function projectSlug(row: ApiProject): string {
    const base = (row.projectName ?? "project")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    return `${base || "project"}-${row.idProjects}`;
}

/** Numeric id back out of a slug produced above. */
export function idFromSlug(slug: string): number | null {
    const match = /-(\d+)$/.exec(slug);
    return match ? Number(match[1]) : null;
}

function bi(en: string | null | undefined, bn: string | null | undefined): Bi {
    const english = nullIfBlank(en) ?? "";
    // A blank Bangla column means "not translated yet" — fall back to English so
    // a partly translated record still renders rather than showing a gap.
    return { en: english, bn: nullIfBlank(bn) ?? english };
}

function fileUrl(file: ApiFile | null | undefined, prefix = "projects"): string | null {
    return s3Url(prefix, file?.fileName ?? null);
}

function tenureInMonths(row: ApiProject): number {
    const duration = num(row.duration);
    return row.tenure === "years" ? duration * 12 : duration;
}

/** Date-only strings pass through; timestamps are trimmed to the date part. */
function isoDate(value: string | null | undefined): string | null {
    const raw = nullIfBlank(value);
    if (!raw) return null;
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

export function mapProject(row: ApiProject): Project {
    const unitAmount = num(row.unitInvestmentValue);
    const totalUnits = num(row.totalAvailableUnits);

    // `totalRemainingUnits` is a decimal-as-string and is absent on some routes.
    // Fall back to total minus invested, then to total, so the progress bar can
    // never read as "fully funded" purely because a field was missing.
    const remaining =
        row.totalRemainingUnits != null
            ? num(row.totalRemainingUnits, totalUnits)
            : row.totalInvestedUnits != null
              ? Math.max(0, totalUnits - num(row.totalInvestedUnits))
              : totalUnits;

    const partners = row.ProjectPartners ?? [];
    const partnersCount = partners.length;

    // Only computed when partner records are actually present — a detail payload
    // has them, a list payload does not, and 0 partners must not read as "0% PwD".
    const pwdSharePct =
        partnersCount > 0
            ? Math.round(
                  (partners.filter((p) => p.User?.disability === "yes").length / partnersCount) * 100,
              )
            : null;

    const gallery = (row.FeaturedImages ?? [])
        .map((file) => fileUrl(file))
        .filter((url): url is string => Boolean(url));

    const cover = fileUrl(row.MainImage) ?? gallery[0] ?? null;

    return {
        id: String(row.idProjects),
        slug: projectSlug(row),
        title: bi(row.projectName, row.projectNameBn),
        category: mapCategory(row.idProjectCategories),
        status: mapStatus(row),
        coverImage: cover ?? "",
        gallery,
        location: bi(row.location, row.locationBn),
        projectType: row.investmentType as ProjectType,
        tenureMonths: tenureInMonths(row),
        unitAmountBdt: unitAmount,
        returnPct: { min: num(row.returnRangeMin), max: num(row.returnRangeMax) },
        returnAmountBdt: { min: num(row.totalReturnMin), max: num(row.totalReturnMax) },
        collectionStarts: isoDate(row.collectionStarts),
        collectionEnds: isoDate(row.collectionEnds),
        totalUnits,
        unitsRemaining: remaining,
        partnersCount,
        // `summary` is the body copy; `description` is a dead column.
        descriptionHtml: bi(row.summary, row.summaryBn),
        producers: {
            // No cooperative field exists in the API.
            cooperative: null,
            district: nullIfBlank(row.location) ? bi(row.location, row.locationBn) : null,
            partners: partnersCount,
            // Requires PartnerAdditionalInfo.gender, which the public projection
            // deliberately does not expose. Left null rather than guessed.
            womenSharePct: null,
            pwdSharePct,
        },
        // The backend has no milestone table. The collection window is the only
        // dated, verifiable timeline, so it is the only thing rendered.
        milestones: buildMilestones(row),
    };
}

function buildMilestones(row: ApiProject): Project["milestones"] {
    const starts = isoDate(row.collectionStarts);
    const ends = isoDate(row.collectionEnds);
    const status = mapStatus(row);
    const collectionDone = status === "funded" || status === "completed";

    return [
        {
            label: { en: "Collection opens", bn: "সংগ্রহ শুরু" },
            date: starts,
            state: starts && new Date(starts) <= new Date() ? "done" : "upcoming",
        },
        {
            label: { en: "Collection closes", bn: "সংগ্রহ শেষ" },
            date: ends,
            state: collectionDone ? "done" : "current",
        },
        {
            label: { en: "Project completes", bn: "প্রকল্প সম্পন্ন" },
            date: null,
            state: status === "completed" ? "done" : "upcoming",
        },
    ];
}
