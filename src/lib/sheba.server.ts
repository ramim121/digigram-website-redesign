import "server-only";

import { shebaGet, SHEBA_CONFIGURED } from "@/lib/api/sheba";
import type { ShebaProject } from "@/lib/sheba";
import type { Bi } from "@/lib/i18n";
import { shebaProjectSeed } from "@/content/shebaProjects.data";

/**
 * Fetching and mapping for Shathi Sheba partner projects.
 *
 * The type and the status vocabulary live in `lib/sheba.ts` because the cards
 * that render them are client components and this module is `server-only`.
 * What stays here is everything that touches the network or the raw row shape.
 *
 * Never throws. `/projects` renders its Shathi half regardless of whether the
 * Sheba platform answers.
 */

/** The row shape `app/projects/public` returns. Every field may be null. */
type ApiShebaProject = {
    id: string;
    project_code: string;
    name_en: string;
    name_bn: string | null;
    interest_slug: string | null;
    division: string | null;
    district: string | null;
    upazila: string | null;
    division_bn: string | null;
    district_bn: string | null;
    upazila_bn: string | null;
    image_url: string | null;
    summary_en: string | null;
    summary_bn: string | null;
    market_overview_en: string | null;
    market_overview_bn: string | null;
    duration_label: string | null;
    duration_label_bn: string | null;
    income_label_en: string | null;
    income_label_bn: string | null;
    model_en: string | null;
    model_bn: string | null;
    loan_partners_en: string | null;
    loan_partners_bn: string | null;
    loan_partner_logos: unknown;
    capacity_label_en: string | null;
    capacity_label_bn: string | null;
    capacity: number | null;
    status: string;
    start_date: string | null;
    end_date: string | null;
};

/**
 * A bilingual pair, or null when neither side has text.
 *
 * Bangla falls back to English rather than to an empty string: a Bangla reader
 * seeing "4 months" is mildly untranslated, whereas seeing a blank metric looks
 * like the data failed to load. Several of these columns are genuinely
 * English-only in the platform today.
 */
function bi(en: string | null | undefined, bn: string | null | undefined): Bi | null {
    const english = en?.trim() ?? "";
    const bangla = bn?.trim() ?? "";
    if (!english && !bangla) return null;
    return { en: english || bangla, bn: bangla || english };
}

/** "Natore, Rajshahi" — most specific first, deduplicated, national → null. */
function place(row: ApiShebaProject): Bi | null {
    const en = [row.upazila, row.district, row.division].filter(Boolean) as string[];
    const bn = [
        row.upazila_bn ?? row.upazila,
        row.district_bn ?? row.district,
        row.division_bn ?? row.division,
    ].filter(Boolean) as string[];
    if (en.length === 0) return null;
    return { en: [...new Set(en)].join(", "), bn: [...new Set(bn)].join(", ") };
}

/**
 * Lender logo URLs out of the `loan_partner_logos` JSON column.
 *
 * THE COLUMN HOLDS OBJECTS, NOT STRINGS.
 * Each entry is `{ name, logo_url }` — the app renders the logo beside the
 * lender's name. An earlier version of this function accepted only an array of
 * strings, so every entry was filtered out and the lender strip on every card
 * rendered empty while the API was returning two perfectly good logos. Both
 * shapes are handled now: a bare string, or an object with `logo_url` (or
 * `url`, which is what the admin console writes in one older seed).
 *
 * MySQL also hands JSON columns back already parsed on some driver versions and
 * as a string on others, so a string input is parsed first. Anything
 * unrecognisable yields an empty list rather than throwing — a missing logo
 * must never take down a project card.
 */
function logoList(value: unknown): string[] {
    let parsed = value;
    if (typeof value === "string") {
        try {
            parsed = JSON.parse(value);
        } catch {
            return [];
        }
    }
    if (!Array.isArray(parsed)) return [];

    return parsed
        .map((entry) => {
            if (typeof entry === "string") return entry;
            if (entry && typeof entry === "object") {
                const record = entry as { logo_url?: unknown; url?: unknown };
                if (typeof record.logo_url === "string") return record.logo_url;
                if (typeof record.url === "string") return record.url;
            }
            return "";
        })
        .filter((url) => url.length > 0);
}

function mapProject(row: ApiShebaProject): ShebaProject {
    return {
        id: String(row.id),
        code: row.project_code,
        title: bi(row.name_en, row.name_bn) ?? { en: row.project_code, bn: row.project_code },
        status: row.status === "open" ? "open" : "opening_soon",
        image: row.image_url || null,
        location: place(row),
        model: bi(row.model_en, row.model_bn),
        summary: bi(row.summary_en, row.summary_bn),
        marketOverview: bi(row.market_overview_en, row.market_overview_bn),
        duration: bi(row.duration_label, row.duration_label_bn),
        income: bi(row.income_label_en, row.income_label_bn),
        capacity:
            bi(row.capacity_label_en, row.capacity_label_bn) ??
            (row.capacity
                ? { en: `${row.capacity} farmers`, bn: `${row.capacity} জন কৃষক` }
                : null),
        lenders: bi(row.loan_partners_en, row.loan_partners_bn),
        lenderLogos: logoList(row.loan_partner_logos),
        interestSlug: row.interest_slug,
    };
}

/**
 * Open and opening-soon Sheba projects.
 *
 * `unavailable` is distinct from an empty list: no projects open right now is a
 * true statement the page can print, whereas a failed fetch is not. The page
 * hides the Sheba tab entirely on failure rather than claiming there are none.
 */
export async function fetchShebaProjects(): Promise<{
    data: ShebaProject[];
    /** True when the rows are the drafted seed rather than live platform data. */
    stale: boolean;
}> {
    if (SHEBA_CONFIGURED) {
        const res = await shebaGet<ApiShebaProject[]>("app/projects/public");
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
            return { data: res.data.map(mapProject), stale: false };
        }
    }

    /*
     * Unconfigured, unreachable, or answering with an empty list — all three
     * fall back to the drafted project rather than to nothing.
     *
     * An empty live response is treated as a failure on purpose. In principle
     * it could mean "no partner projects are open", but in practice every
     * observed empty response has been the platform being down or an
     * environment missing SHEBA_API_URL, and the cost of the two readings is
     * asymmetric: showing a real open project as cached is a small
     * inaccuracy, while silently dropping the entire partner-projects section
     * is the failure that made this page look Shathi-only in the first place.
     */
    return { data: shebaProjectSeed, stale: true };
}
