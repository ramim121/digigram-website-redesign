import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Page rhythm primitive.
 *
 * `tone` alternates the background so sections breathe without anyone having
 * to remember hex values: stone → white → tint, with `dark` reserved for the
 * single brand band a page is allowed per the brief (§7.3).
 */
export type SectionTone = "page" | "surface" | "tint" | "dark" | "canvas";

const tones: Record<SectionTone, string> = {
  page: "bg-stone-50 text-stone-900",
  surface: "bg-white text-stone-900",
  tint: "bg-brand-tint text-stone-900",
  canvas: "bg-brand-canvas text-stone-900",
  dark: "bg-brand-deep text-white",
};

export function Section({
  tone = "page",
  id,
  className,
  children,
  compact,
}: {
  tone?: SectionTone;
  id?: string;
  className?: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <section
      id={id}
      className={clsx(
        tones[tone],
        compact ? "py-12 lg:py-16" : "section",
        "scroll-mt-24",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  invert,
  action,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center",
        className,
      )}
    >
      <div className={clsx("max-w-2xl", align === "center" && "text-center")}>
        {eyebrow && (
          <p className={clsx("eyebrow mb-3", invert && "!text-brand-accent")}>{eyebrow}</p>
        )}
        <h2
          className={clsx(
            "font-display text-3xl leading-tight font-bold tracking-tight text-balance lg:text-4xl",
            invert ? "text-white" : "text-stone-900",
          )}
        >
          {title}
        </h2>
        {lead && (
          <p
            className={clsx(
              "mt-4 text-lg leading-relaxed",
              invert ? "text-white/80" : "text-stone-600",
            )}
          >
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
