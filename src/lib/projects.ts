import type { Bi, Locale } from "@/lib/i18n";

/**
 * Project domain model: types, derived-status rules and display labels.
 *
 * This module is **client-safe** and must stay that way — `ProjectExplorer` and
 * other client components import from it. All backend calls live in
 * `lib/projects.server.ts`; mapping from the raw API payload lives in
 * `lib/api/map.ts`. No component touches raw JSON.
 *
 * Two rules from the brief are enforced *here* rather than in the UI, so no
 * page can forget them:
 *   1. `closing_soon` and `funded` are DERIVED, never stored.
 *   2. A null date is null — the UI hides the row instead of rendering an
 *      empty "Collection Starts :" label like the current site does.
 */

/**
 * The real categories, confirmed against the live API:
 *   9 → Agriculture and livestock, 10 → Artisanal, 11 → Environmental.
 * The design brief's livestock / agriculture / agri_inputs split does not exist
 * in the backend.
 */
export type ProjectCategory = "agriculture_livestock" | "artisanal" | "environmental";
export type ProjectStatus = "upcoming" | "open" | "closing_soon" | "funded" | "completed";
export type ProjectType = "sustainable_return" | "fast_return";

export type Project = {
  id: string;
  slug: string;
  title: Bi;
  category: ProjectCategory;
  /** Stored status. `open` may be upgraded to `closing_soon`/`funded` by `decorate()`. */
  status: ProjectStatus;
  coverImage: string;
  gallery: string[];
  location: Bi;
  projectType: ProjectType;
  tenureMonths: number;
  unitAmountBdt: number;
  returnPct: { min: number; max: number };
  returnAmountBdt: { min: number; max: number };
  collectionStarts: string | null;
  collectionEnds: string | null;
  totalUnits: number;
  unitsRemaining: number;
  partnersCount: number;
  descriptionHtml: Bi;
  /**
   * Nullable on purpose. The API carries a cooperative name for nobody and
   * partner gender only behind auth, so those arrive as null and the UI omits
   * the row. The brief forbids inventing statistics, and a plausible-looking
   * "62% women" with no source behind it is exactly what it forbids.
   */
  producers: {
    cooperative: Bi | null;
    district: Bi | null;
    partners: number;
    womenSharePct: number | null;
    pwdSharePct: number | null;
  };
  milestones: {
    label: Bi;
    date: string | null;
    state: "done" | "current" | "upcoming";
  }[];
};

export type ProjectQuery = {
  category?: ProjectCategory | "all";
  status?: ProjectStatus | "all";
  sort?: "return" | "tenure" | "closing" | "newest";
  limit?: number;
};

const CLOSING_SOON_DAYS = 7;

/** Reference date for derived state. Injectable so tests aren't time-bombs. */
function now(): Date {
  return new Date();
}

/** Exported so the server module can sort by "closing soonest" with the same rule. */
export function daysUntil(iso: string | null, from = now()): number | null {
  if (!iso) return null;
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  return Math.ceil((target.getTime() - from.getTime()) / 86_400_000);
}

/**
 * Applies the derived-status rules. Order matters: a fully-subscribed project
 * is `funded` even if its collection window is still open.
 */
export function decorate(project: Project): Project {
  if (project.status === "completed" || project.status === "upcoming") return project;

  if (project.unitsRemaining <= 0) {
    return { ...project, status: "funded" };
  }

  const left = daysUntil(project.collectionEnds);
  if (left !== null && left >= 0 && left <= CLOSING_SOON_DAYS) {
    return { ...project, status: "closing_soon" };
  }

  return project;
}

export function isInvestable(project: Project): boolean {
  return (
    (project.status === "open" || project.status === "closing_soon") && project.unitsRemaining > 0
  );
}

export function fundedPct(project: Project): number {
  if (project.totalUnits <= 0) return 0;
  const taken = project.totalUnits - project.unitsRemaining;
  return Math.min(100, Math.max(0, Math.round((taken / project.totalUnits) * 100)));
}

/* ------------------------------------------------------- server fetching --
 * fetchProjects / fetchProject / fetchRelated / projectSummary /
 * allProjectSlugs live in `lib/projects.server.ts`.
 *
 * They are deliberately NOT here: this module is imported by client components
 * (ProjectExplorer), and co-locating the fetchers made those components pull in
 * the `server-only` API client, which fails the build. Keeping the split means a
 * client component cannot import a backend call by accident.
 * ------------------------------------------------------------------------- */

/* ---------------------------------------------------------------- labels -- */

export const categoryLabel: Record<ProjectCategory | "all", Bi> = {
  all: { en: "All", bn: "সব" },
  agriculture_livestock: { en: "Agriculture and livestock", bn: "কৃষি ও পশুসম্পদ" },
  artisanal: { en: "Artisanal", bn: "কারুশিল্প" },
  environmental: { en: "Environmental", bn: "পরিবেশ" },
};

export const statusLabel: Record<ProjectStatus, Bi> = {
  upcoming: { en: "Upcoming", bn: "আসন্ন" },
  open: { en: "Open", bn: "চলমান" },
  closing_soon: { en: "Closing soon", bn: "শেষ হতে চলেছে" },
  funded: { en: "Fully funded", bn: "পূর্ণ বিনিয়োগকৃত" },
  completed: { en: "Completed", bn: "সম্পন্ন" },
};

export const projectTypeLabel: Record<ProjectType, Bi> = {
  sustainable_return: { en: "Sustainable Return", bn: "টেকসই রিটার্ন" },
  fast_return: { en: "Fast Return", bn: "দ্রুত রিটার্ন" },
};

export const sortLabel: Record<NonNullable<ProjectQuery["sort"]>, Bi> = {
  newest: { en: "Newest", bn: "নতুন" },
  return: { en: "Return %", bn: "রিটার্ন %" },
  tenure: { en: "Tenure", bn: "মেয়াদ" },
  closing: { en: "Closing soonest", bn: "আগে শেষ হবে" },
};

export function statusTone(status: ProjectStatus): "open" | "warn" | "done" | "muted" {
  switch (status) {
    case "open":
      return "open";
    case "closing_soon":
      return "warn";
    case "funded":
    case "completed":
      return "done";
    default:
      return "muted";
  }
}

export type { Locale };
