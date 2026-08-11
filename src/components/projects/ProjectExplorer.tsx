"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { ProjectCard } from "@/components/projects/ProjectCard";
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
 */

type StatusTab = "open" | "upcoming" | "funded" | "completed" | "all";

const PAGE_SIZE = 9;

export function ProjectExplorer({
  projects,
  locale,
  loadFailed = false,
}: {
  projects: Project[];
  locale: Locale;
  /** Set when the upstream fetch failed so the error state can be exercised. */
  loadFailed?: boolean;
}) {
  const en = locale === "en";
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const [status, setStatus] = useState<StatusTab>("open");
  const [sort, setSort] = useState<NonNullable<ProjectQuery["sort"]>>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
