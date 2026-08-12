import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Badge } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import {
  daysUntil,
  fundedPct,
  isInvestable,
  statusLabel,
  statusTone,
  type Project,
} from "@/lib/projects";
import { formatBdt, formatNumber, formatRange, localePath, t, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * The single most reused component on the site.
 *
 * WHAT CHANGED AND WHY
 * The card used to be a five-row list of icon + text — location, return,
 * tenure, type, partners — each row weighted identically. Everything was
 * present and nothing was findable: the return band, which is the first thing
 * an investor scans for, sat as the second of five identical lines, and the
 * funding progress was small grey text at the bottom.
 *
 * Now it has a hierarchy:
 *   image      status, and the return band as a chip over the photograph —
 *              the hook, readable before anything is read
 *   headline   project name and district together
 *   metrics    a three-up strip, scannable across cards rather than down them
 *   progress   one line: how funded, how many units left
 *
 * Projects *are* Shathi, so the card carries the Shathi token layer wherever it
 * appears — including on the teal homepage. That is an accent-level adoption
 * (price, progress, buttons), never a full purple section inside a teal page.
 *
 * Money and percentages render in Western digits even in Bangla: this is a
 * comparison surface, and investors scan it against other cards.
 */
export function ProjectCard({
  project,
  locale,
  className,
}: {
  project: Project;
  locale: Locale;
  className?: string;
}) {
  const en = locale === "en";
  const soldOut = !isInvestable(project);
  const percent = fundedPct(project);
  const href = localePath(locale, routes.project(project.slug));
  const tone = statusTone(project.status);
  const closingIn = daysUntil(project.collectionEnds);

  /*
   * Not every project has a photograph — `MainImage` is frequently null, and an
   * empty src rendered as a bare grey block. The card now leans on its image,
   * so the gap was conspicuous.
   *
   * The fallback is the house motif, deliberately, rather than a stock field
   * photograph: a generic photo attached to a specific named project implies it
   * depicts that project.
   */
  const hasPhoto = Boolean(project.coverImage);
  const cover = project.coverImage || "/assets/brand/village-motif.png";

  return (
    <article
      data-brand="shathi"
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm",
        "transition-[box-shadow,transform,border-color] duration-300 ease-standard",
        soldOut
          ? "opacity-90"
          : "hover:-translate-y-1.5 hover:border-brand-line hover:shadow-xl",
        className,
      )}
    >
      <div
        className={clsx(
          "relative aspect-[16/10] overflow-hidden",
          hasPhoto ? "bg-stone-100" : "bg-brand-canvas",
        )}
      >
        <Image
          src={cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className={clsx(
            "object-cover transition-transform duration-700 ease-standard",
            // Texture, not subject matter — but strong enough to be visible
            // through the brand gradient rather than reading as a grey block.
            !hasPhoto && "opacity-40 mix-blend-multiply",
            soldOut ? "grayscale-[0.35]" : "group-hover:scale-105",
          )}
        />

        {/* A scrim only where there is no photograph: the motif needs a panel
            behind the status badge to read as designed rather than as a missing
            image. Over a real photograph nothing is overlaid at the bottom any
            more, so no scrim is needed there. */}
        {!hasPhoto && (
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-strong via-brand-strong/70 to-transparent"
          />
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge
            tone={tone === "open" ? "open" : tone === "warn" ? "warn" : tone === "done" ? "done" : "muted"}
          >
            {t(statusLabel[project.status], locale)}
          </Badge>

          {/* Only when it is genuinely near, and never on a closed project —
              urgency on something you cannot act on is just noise. */}
          {!soldOut && closingIn !== null && closingIn > 0 && closingIn <= 14 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/95 px-2.5 py-1 font-display text-[11px] font-bold text-white">
              <Icon name="clock" size={12} />
              {en ? `${closingIn}d left` : `${closingIn} দিন বাকি`}
            </span>
          )}
        </div>

      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* THE RETURN SITS IN THE BODY, NOT OVER THE IMAGE.
            It used to be overlaid on the photograph, which assumed the image
            was a plain photograph. The real uploads are promotional banners
            with the project name, unit price and return band already printed
            into the artwork, so the overlay landed on top of baked-in text and
            the two collided.
            Any overlay is a gamble on artwork we do not control, so the figure
            moved down here where nothing can cover it. */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug font-bold text-stone-900">
            <Link href={href} className="after:absolute after:inset-0 focus:outline-none">
              {t(project.title, locale)}
            </Link>
          </h3>

          <div className="shrink-0 text-right">
            <p className="font-display text-xl leading-none font-extrabold text-brand-strong">
              {formatRange(project.returnPct.min, project.returnPct.max, locale)}
            </p>
            <p className="mt-1 font-display text-[10px] font-semibold tracking-wide text-stone-500 uppercase">
              {en ? "Est. return" : "প্রাক্কলিত"}
            </p>
          </div>
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
          <Icon name="map-pin" size={14} className="shrink-0" />
          <span className="truncate">{t(project.location, locale)}</span>
        </p>

        {/* Three metrics across, not five down. A strip is compared between
            cards at a glance; a list is read one card at a time. */}
        <dl className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-stone-50 p-3">
          <Metric
            label={en ? "Per unit" : "প্রতি ইউনিট"}
            value={formatBdt(project.unitAmountBdt, locale, { variant: "data" })}
            accent
          />
          <Metric
            label={en ? "Tenure" : "মেয়াদ"}
            value={`${formatNumber(project.tenureMonths, locale, "data")} ${en ? "mo" : "মাস"}`}
          />
          {/* The list endpoint returns no partner records, so a count of 0 here
              means "not loaded", not "nobody" — it was printing "Partners 0" on
              every card, which is simply false. The slot falls back to total
              units, which the list payload does carry. */}
          {project.partnersCount > 0 ? (
            <Metric
              label={en ? "Partners" : "অংশীদার"}
              value={formatNumber(project.partnersCount, locale, "data")}
            />
          ) : (
            <Metric
              label={en ? "Units" : "ইউনিট"}
              value={formatNumber(project.totalUnits, locale, "data")}
            />
          )}
        </dl>

        <div className="mt-4">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-display font-bold text-brand">
              {formatNumber(Math.round(percent), locale, "data")}% {en ? "funded" : "অর্থায়িত"}
            </span>
            <span className="text-stone-500">
              {project.unitsRemaining > 0
                ? en
                  ? `${project.unitsRemaining} of ${project.totalUnits} units left`
                  : `${project.totalUnits}টির মধ্যে ${project.unitsRemaining}টি বাকি`
                : en
                  ? "All units taken"
                  : "সব ইউনিট নেওয়া হয়ে গেছে"}
            </span>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100"
            role="progressbar"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t(project.title, locale)}
          >
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-700 ease-standard"
              style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
            />
          </div>
        </div>

        {/* Pinned to the bottom so the buttons line up across a row of cards
            whose bodies are different heights. */}
        <div className="mt-auto flex items-center gap-2 pt-5">
          <Link href={href} className={buttonClass({ variant: "secondary", size: "sm" })}>
            {en ? "View details" : "বিস্তারিত"}
          </Link>
          {soldOut ? (
            <span
              className={clsx(
                buttonClass({ variant: "primary", size: "sm" }),
                "pointer-events-none opacity-45",
              )}
              aria-disabled="true"
            >
              {en ? "Invest" : "বিনিয়োগ"}
            </span>
          ) : (
            <Link
              href={localePath(locale, routes.invest(project.slug))}
              className={clsx(buttonClass({ variant: "primary", size: "sm" }), "relative z-10")}
            >
              {en ? "Invest" : "বিনিয়োগ"}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="truncate text-[11px] text-stone-500">{label}</dt>
      <dd
        className={clsx(
          "mt-0.5 truncate font-display text-sm font-bold",
          accent ? "text-brand" : "text-stone-900",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
