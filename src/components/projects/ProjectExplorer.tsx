"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ShebaProjectCard } from "@/components/projects/ShebaProjectCard";
import { ProjectCardSkeleton } from "@/components/ui/Primitives";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  categoryLabel,
  sortLabel,
  statusLabel,
  type Project,
  type ProjectCategory,
  type ProjectQuery,
  type ProjectStatus,
} from "@/lib/projects";
import type { ShebaProject } from "@/lib/sheba";
import { t, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * Filter + sort + progressive reveal over the project list.
 *
 * Filtering happens client-side because the whole list is small and already in
 * the payload; when the API is live this component keeps its props and the
 * parent starts passing a paginated page instead. The empty, error and
 * end-of-list states below are the ones the design brief asks for — they are
 * real states, not placeholders.
 *
 * TWO PRODUCT LINES, ONE PAGE.
 * `/projects` now carries both halves of the rural cycle: Shathi investments,
 * where a person puts in capital and takes a return band, and Shathi Sheba
 * partner projects, where a farmer applies and a bank lends against a
 * guaranteed buy-back. They come from two different backends and have no field
 * in common beyond a name and a district.
 *
 * The product tabs are therefore a *switch*, not another filter. The category,
 * status and sort controls below them describe investments — unit price,
 * funding, return — and none of them mean anything for a partner project. So
 * they are shown for the Shathi views and hidden for the Sheba one, rather
 * than being left on screen governing nothing. In the combined view they still
 * apply to the investment grid, and the partner projects follow underneath
 * under their own heading, so it is always visible which list a control moves.
 */

type StatusTab = "open" | "upcoming" | "funded" | "completed" | "all";

/** Which product line is on screen. */
type ProductTab = "all" | "shathi" | "sheba";

const PAGE_SIZE = 9;

export function ProjectExplorer({
  projects,
  shebaProjects = [],
  shebaStale = false,
  locale,
  loadFailed = false,
}: {
  projects: Project[];
  /**
   * Shathi Sheba partner projects. Defaults to empty so every other caller of
   * this component — and a deployment with no Sheba platform configured —
   * keeps working untouched and simply shows no product tabs.
   */
  shebaProjects?: ShebaProject[];
  /** True when the partner projects are drafted content, not live platform data. */
  shebaStale?: boolean;
  locale: Locale;
  /** Set when the upstream fetch failed so the error state can be exercised. */
  loadFailed?: boolean;
}) {
  const en = locale === "en";
  const [product, setProduct] = useState<ProductTab>("all");
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const [status, setStatus] = useState<StatusTab>("open");
  const [sort, setSort] = useState<NonNullable<ProjectQuery["sort"]>>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // No partner projects to show means no choice to offer: the tabs disappear
  // and the page is exactly what it was before Sheba existed.
  const hasSheba = shebaProjects.length > 0;
  const showInvestments = !hasSheba || product !== "sheba";
  const showSheba = hasSheba && product !== "shathi";

  const filtered = useMemo(() => {
    let rows = projects;
    if (category !== "all") rows = rows.filter((p) => p.category === category);
    if (status !== "all") {
      rows =
        status === "open"
          ? rows.filter((p) => p.status === "open" || p.status === "closing_soon")
          : rows.filter((p) => p.status === status);
    }
    return [...rows].sort((a, b) => {
      switch (sort) {
        case "return":
          return b.returnPct.max - a.returnPct.max;
        case "tenure":
          return a.tenureMonths - b.tenureMonths;
        case "closing":
          return (a.collectionEnds ?? "9999").localeCompare(b.collectionEnds ?? "9999");
        default:
          return 0;
      }
    });
  }, [projects, category, status, sort]);

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  // The three real backend categories (ids 9, 10, 11).
  const categories: (ProjectCategory | "all")[] = [
    "all",
    "agriculture_livestock",
    "artisanal",
    "environmental",
  ];
  const statuses: StatusTab[] = ["open", "upcoming", "funded", "completed"];

  function reset(next: () => void) {
    next();
    setVisible(PAGE_SIZE);
  }

  /* ------------------------------------------------------------ error -- */
  if (loadFailed) {
    return (
      <div className="mt-12 rounded-lg border border-stone-200 bg-white p-12 text-center">
        <Icon name="alert-triangle" size={30} className="mx-auto text-danger" />
        <h3 className="mt-4 font-display text-xl font-bold text-stone-900">
          {en ? "We couldn't load projects" : "প্রকল্প লোড করা যায়নি"}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[15px] text-stone-600">
          {en
            ? "The connection to our project service failed. Your investments are unaffected."
            : "আমাদের প্রকল্প সেবার সঙ্গে সংযোগ ব্যর্থ হয়েছে। আপনার বিনিয়োগে কোনো প্রভাব পড়েনি।"}
        </p>
        <Button
          className="mt-6"
          icon="refresh"
          iconPosition="left"
          onClick={() => window.location.reload()}
        >
          {en ? "Retry" : "আবার চেষ্টা করুন"}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/*
        Product switch. Rendered only when there is something to switch to, so
        a page with investments alone looks exactly as it always did.
      */}
      {hasSheba && (
        <div
          role="tablist"
          aria-label={en ? "Product" : "পণ্য"}
          className="flex flex-wrap gap-2 border-b border-stone-200 pb-4"
        >
          {(["all", "shathi", "sheba"] as const).map((key) => (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={product === key}
              onClick={() => reset(() => setProduct(key))}
              className={clsx(
                "rounded-md px-4 py-2.5 font-display text-sm font-semibold transition-colors duration-150",
                product === key
                  ? key === "sheba"
                    ? "bg-sheba-600 text-white"
                    : key === "shathi"
                      ? "bg-shathi-600 text-white"
                      : "bg-teal-800 text-white"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-800",
              )}
            >
              {key === "all"
                ? en
                  ? "All projects"
                  : "সব প্রকল্প"
                : key === "shathi"
                  ? en
                    ? "Invest · Shathi"
                    : "বিনিয়োগ · সাথী"
                  : en
                    ? "Partner · Shathi Sheba"
                    : "অংশীদার · সাথী সেবা"}
            </button>
          ))}
        </div>
      )}

      {showInvestments && (
        <>
      {/* -------------------------------------------------------- filters */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className="flex items-center justify-between rounded-md border border-stone-200 bg-white px-4 py-3 font-display text-sm font-semibold text-stone-700 md:hidden"
        >
          <span className="flex items-center gap-2">
            <Icon name="filter" size={17} />
            {en ? "Filter & sort" : "ফিল্টার ও সাজান"}
          </span>
          <Icon
            name="chevron-down"
            size={17}
            className={clsx("transition-transform duration-200", filtersOpen && "rotate-180")}
          />
        </button>

        <div className={clsx("flex-col gap-5 md:flex", filtersOpen ? "flex" : "hidden")}>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((key) => (
              <Chip
                key={key}
                active={category === key}
                onClick={() => reset(() => setCategory(key))}
              >
                {t(categoryLabel[key], locale)}
              </Chip>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div
              role="tablist"
              aria-label={en ? "Project status" : "প্রকল্পের অবস্থা"}
              className="flex flex-wrap gap-1"
            >
              {statuses.map((key) => (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  aria-selected={status === key}
                  onClick={() => reset(() => setStatus(key))}
                  className={clsx(
                    "rounded-md px-3 py-2 font-display text-sm font-semibold transition-colors duration-150",
                    status === key
                      ? "bg-brand-tint text-brand-strong"
                      : "text-stone-500 hover:text-stone-800",
                  )}
                >
                  {t(statusLabel[key === "open" ? "open" : (key as ProjectStatus)], locale)}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-sm text-stone-500">
              {en ? "Sort" : "সাজান"}
              <select
                value={sort}
                onChange={(event) =>
                  reset(() => setSort(event.target.value as NonNullable<ProjectQuery["sort"]>))
                }
                className="rounded-md border border-stone-300 bg-white px-3 py-2 font-display text-sm font-semibold text-stone-700 focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none"
              >
                {(["newest", "return", "tenure", "closing"] as const).map((key) => (
                  <option key={key} value={key}>
                    {t(sortLabel[key], locale)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- grid */}
      {shown.length > 0 ? (
        <>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} />
            ))}
          </div>

          <div className="mt-10 text-center">
            {hasMore ? (
              <Button variant="secondary" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                {en ? "Load more projects" : "আরও প্রকল্প দেখুন"}
              </Button>
            ) : (
              <p className="text-sm text-stone-400">
                {en
                  ? `That's all ${filtered.length} projects in this view.`
                  : `এই তালিকার ${filtered.length}টি প্রকল্পই দেখানো হয়েছে।`}
              </p>
            )}
          </div>
        </>
      ) : (
        <EmptyState locale={locale} onReset={() => reset(() => { setCategory("all"); setStatus("all"); })} />
      )}
        </>
      )}

      {/* ------------------------------------------- partner projects -- */}
      {showSheba && (
        <section
          data-brand="shathi-sheba"
          className={showInvestments ? "mt-16 border-t border-stone-200 pt-12" : "mt-9"}
        >
          {/* The heading only appears in the combined view. On the Sheba tab
              the tab itself already says what the list is, and a second label
              under it is just repetition. */}
          {showInvestments && (
            <div className="max-w-2xl">
              <p className="eyebrow">{en ? "Shathi Sheba" : "সাথী সেবা"}</p>
              <h3 className="mt-2 font-display text-2xl leading-tight font-bold tracking-tight text-stone-900 lg:text-3xl">
                {en ? "Partner projects for farmers" : "কৃষকদের জন্য পার্টনার প্রকল্প"}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-stone-600">
                {en
                  ? "The other side of the same cycle. A farmer joins a project, a bank lends against it, and an offtake buyer guarantees the sale — so the price risk does not sit with the household. These are applications, not investments."
                  : "একই চক্রের অন্য দিক। কৃষক প্রকল্পে যুক্ত হন, ব্যাংক ঋণ দেয়, আর ক্রেতা প্রতিষ্ঠান বিক্রি নিশ্চিত করে — দামের ঝুঁকি আর পরিবারের ঘাড়ে থাকে না। এগুলো আবেদনের প্রকল্প, বিনিয়োগের নয়।"}
              </p>
            </div>
          )}

          <div
            className={clsx(
              "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
              showInvestments ? "mt-9" : "mt-0",
            )}
          >
            {shebaProjects.map((project) => (
              <ShebaProjectCard key={project.id} project={project} locale={locale} />
            ))}
          </div>

          {/* Said plainly rather than hidden: these are real projects, but the
              copy on screen may be behind the platform. Same convention the
              Shathi side uses for a failed fetch. */}
          {shebaStale && (
            <p className="mt-5 text-xs text-stone-400">
              {en
                ? "Showing cached partner-project information — live details were unavailable just now."
                : "পার্টনার প্রকল্পের সংরক্ষিত তথ্য দেখানো হচ্ছে — এই মুহূর্তে সরাসরি তথ্য পাওয়া যায়নি।"}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "rounded-full border px-4 py-2 font-display text-sm font-semibold transition-colors duration-150",
        active
          ? "border-brand bg-brand text-on-brand"
          : "border-stone-200 bg-white text-stone-600 hover:border-brand-line hover:text-brand-strong",
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ locale, onReset }: { locale: Locale; onReset: () => void }) {
  const en = locale === "en";
  return (
    <div className="mt-10 rounded-lg border border-dashed border-stone-300 bg-white px-8 py-14 text-center">
      <Image
        src="/assets/brand/empty-state.png"
        alt=""
        width={200}
        height={200}
        className="mx-auto h-32 w-auto opacity-90"
      />
      <h3 className="mt-5 font-display text-xl font-bold text-stone-900">
        {en ? "No projects match this view" : "এই তালিকায় কোনো প্রকল্প নেই"}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-[15px] text-stone-600">
        {en
          ? "New cycles open every month. Clear the filters, or tell us what you're looking for and we'll get in touch when it opens."
          : "প্রতি মাসেই নতুন চক্র শুরু হয়। ফিল্টার মুছে দিন, অথবা কী খুঁজছেন জানান — শুরু হলেই আমরা যোগাযোগ করব।"}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={onReset}>
          {en ? "Clear filters" : "ফিল্টার মুছুন"}
        </Button>
        <ButtonLink href={locale === "en" ? routes.contact : `/bn${routes.contact}`} icon="arrow-right">
          {en ? "Get notified" : "জানিয়ে দিন"}
        </ButtonLink>
      </div>
    </div>
  );
}

/** Loading view used while the project service is being contacted. */
export function ProjectGridSkeleton() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
}
