import "server-only";

import { projectSeed } from "@/content/projects.data";
import { apiGet } from "@/lib/api/client";
import { idFromSlug, mapProject } from "@/lib/api/map";
import type { ApiProject } from "@/lib/api/types";
import { daysUntil, decorate, isInvestable, type Project, type ProjectQuery } from "@/lib/projects";

/**
 * Server-side project fetching.
 *
 * WHY THIS IS A SEPARATE MODULE FROM `lib/projects.ts`
 * `lib/projects.ts` holds types, labels and the pure derived-status rules, and
 * client components (`ProjectExplorer`) import those. The moment the fetchers
 * lived alongside them, every client component transitively pulled in the
 * `server-only` API client and the build failed. Keeping the split explicit
 * means a client component physically cannot import a backend call.
 *
 * Everything here degrades rather than throws: if the backend is unreachable
 * the site renders seed content and flags it as stale, because a marketing page
 * that 500s is worse than one showing slightly old numbers.
 */

/**
 * Live project list, or `null` when the backend is unreachable.
 *
 * An empty array is NOT failure — a genuinely empty catalogue should render as
 * "no projects", not silently resurrect seed content.
 */
async function loadLiveProjects(): Promise<Project[] | null> {
    const res = await apiGet<ApiProject[]>("projects/get_projects_for_investment");
    if (!res.ok || !Array.isArray(res.data)) return null;

    /*
     * That endpoint decides *which* projects are investable, but returns no
     * imagery at all — no MainImage, no FeaturedImages, and `projectBanner` is
     * null on every row. So every card fell back to the motif placeholder while
     * the detail pages, which use `projects/details/:id`, showed real photos.
     * It read as "the images are broken" when it was really two endpoints
     * disagreeing about what a project row contains.
     *
     * `get_all_projects` does carry the file rows, so images are merged in from
     * there by id. The investment endpoint stays the authority on membership —
     * it applies the product rule about what is open — and this only fills in
     * pictures.
     *
     * If the enrichment call fails the list still renders, just with
     * placeholder art. A missing photo is not a reason to show no projects.
     */
    const withImages = await apiGet<ApiProject[]>("projects/get_all_projects");
    const imagery = new Map<number, ApiProject>();
    if (withImages.ok && Array.isArray(withImages.data)) {
        for (const row of withImages.data) imagery.set(Number(row.idProjects), row);
    }

    return res.data.map((row) => {
        const extra = imagery.get(Number(row.idProjects));
        return mapProject(
            extra
                ? {
                      ...row,
                      MainImage: row.MainImage ?? extra.MainImage,
                      FeaturedImages: row.FeaturedImages?.length
                          ? row.FeaturedImages
                          : extra.FeaturedImages,
                  }
                : row,
        );
    });
}

/**
 * The project list, filtered and sorted.
 *
 * The endpoint takes no filter or sort parameters — it returns the whole
 * investable set (six rows today) — so both happen here. At this size that is
 * cheaper than paginating, and it keeps one code path for live and seed data.
 *
 * `stale: true` means the call failed and this is seed content; the UI shows a
 * notice rather than passing fixtures off as live figures.
 */
export async function fetchProjects(
    query: ProjectQuery = {},
): Promise<{ data: Project[]; total: number; stale: boolean }> {
    const { category = "all", status = "all", sort = "newest", limit } = query;

    const live = await loadLiveProjects();
    const stale = live === null;
    let rows = (live ?? projectSeed).map(decorate);

    if (category !== "all") rows = rows.filter((p) => p.category === category);
    if (status !== "all") {
        rows =
            status === "open"
                ? rows.filter((p) => p.status === "open" || p.status === "closing_soon")
                : rows.filter((p) => p.status === status);
    }

    rows = [...rows].sort((a, b) => {
        switch (sort) {
            case "return":
                return b.returnPct.max - a.returnPct.max;
            case "tenure":
                return a.tenureMonths - b.tenureMonths;
            case "closing": {
                const av = daysUntil(a.collectionEnds) ?? Number.MAX_SAFE_INTEGER;
                const bv = daysUntil(b.collectionEnds) ?? Number.MAX_SAFE_INTEGER;
                return av - bv;
            }
            default:
                return 0;
        }
    });

    const total = rows.length;
    if (limit) rows = rows.slice(0, limit);

    return { data: rows, total, stale };
}

/**
 * A single project. The detail endpoint is tried first because only that payload
 * carries partners and the image gallery; then the list; then seed data.
 */
export async function fetchProject(slug: string): Promise<Project | null> {
    const id = idFromSlug(slug);

    if (id !== null) {
        const detail = await apiGet<ApiProject | ApiProject[]>(`projects/details/${id}`);
        if (detail.ok && detail.data) {
            const row = Array.isArray(detail.data) ? detail.data[0] : detail.data;
            if (row) return decorate(mapProject(row));
        }

        const live = await loadLiveProjects();
        const match = live?.find((p) => p.slug === slug);
        if (match) return decorate(match);
    }

    const seeded = projectSeed.find((p) => p.slug === slug);
    return seeded ? decorate(seeded) : null;
}

export async function fetchRelated(slug: string, count = 3): Promise<Project[]> {
    const pool = (await loadLiveProjects()) ?? projectSeed;
    const current = pool.find((p) => p.slug === slug);
    if (!current) return [];

    return pool
        .filter((p) => p.slug !== slug)
        .sort((a, b) => {
            const sameA = a.category === current.category ? 0 : 1;
            const sameB = b.category === current.category ? 0 : 1;
            return sameA - sameB;
        })
        .slice(0, count)
        .map(decorate);
}

export async function projectSummary(): Promise<{ openCount: number; availableBdt: number }> {
    const pool = (await loadLiveProjects()) ?? projectSeed;
    const rows = pool.map(decorate).filter(isInvestable);

    return {
        openCount: rows.length,
        availableBdt: rows.reduce((sum, p) => sum + p.unitsRemaining * p.unitAmountBdt, 0),
    };
}

/**
 * Slugs for static generation. Falls back to seed slugs so a build cannot fail
 * because the API was briefly down; anything missing still renders on demand.
 */
export async function allProjectSlugs(): Promise<string[]> {
    const live = await loadLiveProjects();
    return (live ?? projectSeed).map((p) => p.slug);
}
