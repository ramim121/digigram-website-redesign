import type { Bi } from "@/lib/i18n";

/**
 * Shathi Sheba partner projects — the shape and the vocabulary.
 *
 * Split from `sheba.server.ts` the same way `projects.ts` is split from
 * `projects.server.ts`, and for the same hard reason: the fetcher is marked
 * `server-only`, and the project cards render inside `ProjectExplorer`, which
 * is a client component. Importing a type from a `server-only` module is enough
 * to fail the build, so everything the browser half touches — the type, the
 * status labels — lives here, and only the fetching lives there.
 *
 * WHAT A PARTNER PROJECT IS.
 * The mirror image of a Shathi investment. A Shathi project asks an investor
 * for capital and offers a return band. A Sheba partner project asks a farmer
 * for participation and offers inputs, a loan from a named bank, and a
 * guaranteed buy-back from a named offtake buyer. Same rural cycle, opposite
 * ends of it — which is what `/projects` now shows in one place.
 */

export type ShebaStatus = "open" | "opening_soon";

export type ShebaProject = {
    id: string;
    code: string;
    title: Bi;
    status: ShebaStatus;
    /** Absolute S3 URL, or null when the project has no artwork. */
    image: string | null;
    /** "Natore, Rajshahi", or null for a national project. */
    location: Bi | null;
    /** "Buy back offer + profit share model". */
    model: Bi | null;
    summary: Bi | null;
    marketOverview: Bi | null;
    /** "4 months". */
    duration: Bi | null;
    /** "Up to ৳14,000 income". */
    income: Bi | null;
    /** "100 farmers in your upazila". */
    capacity: Bi | null;
    /** "Loan provided by BRAC Bank & DigiGram Ventures". */
    lenders: Bi | null;
    /** Logo URLs for the lenders, when the platform holds them. */
    lenderLogos: string[];
    interestSlug: string | null;
};

/**
 * Status copy.
 *
 * "Accepting applications" rather than "Open": on a page that also lists
 * investments, a bare "Open" would read as "open for investment", which is the
 * one thing a Sheba project is not.
 */
export const shebaStatusLabel: Record<ShebaStatus, Bi> = {
    open: { en: "Accepting applications", bn: "নিবন্ধন চলছে" },
    opening_soon: { en: "Opening soon", bn: "শীঘ্রই শুরু" },
};
