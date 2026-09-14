import Image from "next/image";
import clsx from "clsx";
import { Badge } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { shebaStatusLabel, type ShebaProject } from "@/lib/sheba";
import { t, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/**
 * A Shathi Sheba partner project on the public projects page.
 *
 * WHY THIS IS NOT `ProjectCard` WITH A FLAG.
 * The two cards answer different questions. An investment card sells a number:
 * return band, unit price, how much is left. A Sheba card sells a proposition
 * to a farmer: how long, what you earn, who lends, who buys. There is no unit
 * price and no funding bar, so half of `ProjectCard` would render empty and the
 * other half would need conditionals at every line. Two components that each
 * say one thing beat one that says neither clearly.
 *
 * The layout deliberately mirrors the Shathi Sheba app's own project card —
 * status and location over the image, the model line under the title, a
 * three-up metric strip, then the lender band — so a farmer who has seen one
 * recognises the other. It carries `data-brand="shathi-sheba"`, which switches
 * the token layer to wine, the way the Shathi cards carry purple.
 */
export function ShebaProjectCard({
  project,
  locale,
  className,
}: {
  project: ShebaProject;
  locale: Locale;
  className?: string;
}) {
  const en = locale === "en";
  const isOpen = project.status === "open";

  /*
   * Same fallback reasoning as the investment card: a generic field photograph
   * attached to a specific named project implies it depicts that project, so an
   * imageless row gets the house motif instead.
   */
  const hasPhoto = Boolean(project.image);
  const cover = project.image || "/assets/brand/village-motif.png";

  const metrics = [
    { label: en ? "Duration" : "মেয়াদ", value: project.duration, icon: "clock" as const },
    { label: en ? "Income" : "আয়", value: project.income, icon: "banknote" as const },
    { label: en ? "Capacity" : "অংশগ্রহণ", value: project.capacity, icon: "users" as const },
  ].filter((metric) => metric.value !== null);

  return (
    <article
      data-brand="shathi-sheba"
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm",
        "transition-[box-shadow,transform,border-color] duration-300 ease-standard",
        "hover:-translate-y-1.5 hover:border-brand-line hover:shadow-xl",
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
            "object-cover transition-transform duration-700 ease-standard group-hover:scale-105",
            !hasPhoto && "opacity-40 mix-blend-multiply",
          )}
        />

        {!hasPhoto && (
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-strong via-brand-strong/70 to-transparent"
          />
        )}

        <div className="absolute top-3 right-3">
          <Badge tone={isOpen ? "open" : "warn"}>
            {t(shebaStatusLabel[project.status], locale)}
          </Badge>
        </div>

        {/* Over the image, as in the app: the district is what a farmer checks
            first, and it belongs with the photograph rather than in the body
            where it would compete with the model line. A pill carries its own
            background so it stays legible on any artwork. */}
        {project.location && (
          <p className="absolute bottom-3 left-3 inline-flex max-w-[85%] items-center gap-1.5 rounded-full bg-stone-950/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            <Icon name="map-pin" size={13} className="shrink-0" />
            <span className="truncate">{t(project.location, locale)}</span>
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg leading-snug font-bold text-stone-900">
          {t(project.title, locale)}
        </h3>

        {project.model && (
          <p className="mt-1 font-display text-sm font-semibold text-brand-strong">
            {t(project.model, locale)}
          </p>
        )}

        {/* Only rendered when the platform actually holds the labels. Several
            projects are entered with the name and region alone, and an empty
            three-up strip reads as a loading failure. */}
        {metrics.length > 0 && (
          <dl
            className={clsx(
              "mt-4 grid gap-3 rounded-lg bg-brand-tint p-3",
              metrics.length === 3 ? "grid-cols-3" : metrics.length === 2 ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-0 text-center">
                <dt className="flex items-center justify-center gap-1 text-[11px] text-stone-500">
                  <Icon name={metric.icon} size={12} className="shrink-0" />
                  <span className="truncate">{metric.label}</span>
                </dt>
                <dd className="mt-1 font-display text-[13px] leading-tight font-bold text-stone-900">
                  {t(metric.value!, locale)}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {project.lenders && (
          <div className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
            <p className="flex items-start gap-1.5 text-xs leading-relaxed text-stone-600">
              <Icon name="building" size={13} className="mt-0.5 shrink-0" />
              <span>{t(project.lenders, locale)}</span>
            </p>
            {project.lenderLogos.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                {project.lenderLogos.map((logo) => (
                  <Image
                    key={logo}
                    src={logo}
                    alt=""
                    width={120}
                    height={40}
                    className="h-5 w-auto max-w-[6rem] object-contain"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {project.summary && (
          <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-stone-600">
            {t(project.summary, locale)}
          </p>
        )}

        <div className="mt-auto pt-5">
          <ShebaApplyCta locale={locale} open={isOpen} />
        </div>
      </div>
    </article>
  );
}

/**
 * The call to action.
 *
 * Applying happens in the Shathi Sheba app — there is no web application flow,
 * and inventing one here would collect a farmer's details into a form that goes
 * nowhere. So the CTA points at the app.
 *
 * The app is pre-launch: `site.app.shebaPlayStore` is deliberately an empty
 * string until the listing exists, and this checks for that rather than
 * rendering a link to a store page that 404s. When the listing goes live,
 * filling that one constant in `lib/site.ts` turns every card's button into a
 * real link — nothing here changes.
 */
function ShebaApplyCta({ locale, open }: { locale: Locale; open: boolean }) {
  const en = locale === "en";
  const href = site.app.shebaPlayStore;

  if (!href) {
    return (
      <p className="flex items-center justify-center gap-1.5 rounded-md border border-dashed border-stone-300 px-3 py-2.5 text-center font-display text-[13px] font-semibold text-stone-500">
        <Icon name="clock" size={14} className="shrink-0" />
        {en ? "Applications open in the Shathi Sheba app soon" : "শীঘ্রই শাথী সেবা অ্যাপে আবেদন শুরু"}
      </p>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(buttonClass({ variant: "primary", size: "sm" }), "w-full justify-center")}
    >
      {open
        ? en
          ? "Apply in the Shathi Sheba app"
          : "শাথী সেবা অ্যাপে আবেদন করুন"
        : en
          ? "Get notified in the app"
          : "অ্যাপে জানিয়ে দিন"}
      <Icon name="external-link" size={15} />
    </a>
  );
}
