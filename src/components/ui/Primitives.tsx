import clsx from "clsx";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

/* ------------------------------------------------------------------ Card -- */

export function Card({
  children,
  className,
  interactive,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={clsx(
        "rounded-lg border border-stone-200 bg-white shadow-sm",
        interactive &&
          "transition-[box-shadow,transform,border-color] duration-200 ease-standard hover:-translate-y-0.5 hover:border-brand-line hover:shadow-md",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ----------------------------------------------------------------- Badge -- */

export type BadgeTone = "brand" | "open" | "warn" | "done" | "muted" | "accent" | "danger";

const badgeTones: Record<BadgeTone, string> = {
  brand: "bg-brand-tint text-brand-strong border-brand-line",
  open: "bg-success-bg text-success border-transparent",
  warn: "bg-warning-bg text-gold-800 border-transparent",
  done: "bg-stone-100 text-stone-600 border-stone-200",
  muted: "bg-stone-100 text-stone-500 border-stone-200",
  accent: "bg-brand-accent text-on-accent border-transparent",
  danger: "bg-danger-bg text-danger border-transparent",
};

export function Badge({
  tone = "brand",
  children,
  icon,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  icon?: IconName;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-display text-xs font-semibold",
        badgeTones[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------- Fact rows -- */

/**
 * A labelled fact. Renders NOTHING when the value is null — this is the fix
 * for the current site printing "Collection Starts :" with an empty value.
 */
export function Fact({
  icon,
  label,
  value,
  emphasis,
}: {
  icon?: IconName;
  label: string;
  value: ReactNode | null | undefined;
  emphasis?: boolean;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="flex items-center gap-2 text-sm text-stone-500">
        {icon && <Icon name={icon} size={16} className="shrink-0 text-stone-400" />}
        {label}
      </span>
      <span
        className={clsx(
          "text-right text-sm font-semibold text-stone-900",
          emphasis && "text-base text-brand-strong",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------- Progress -- */

export function Progress({
  percent,
  label,
  className,
}: {
  percent: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className={className}>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-brand-tint"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500 ease-standard"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Skeleton -- */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-stone-200/70", className)}
      aria-hidden="true"
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <Skeleton className="aspect-video rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
        <Skeleton className="h-9 w-full rounded-full" />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Notes -- */

export function Note({
  tone = "info",
  icon = "info",
  children,
  className,
}: {
  tone?: "info" | "warn" | "risk";
  icon?: IconName;
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    info: "bg-info-bg/70 text-stone-700 border-info/25",
    warn: "bg-warning-bg text-stone-800 border-warning/30",
    risk: "bg-stone-100 text-stone-700 border-stone-200",
  } as const;

  return (
    <p
      className={clsx(
        "flex items-start gap-2.5 rounded-md border px-3.5 py-3 text-sm leading-relaxed",
        tones[tone],
        className,
      )}
    >
      <Icon name={icon} size={17} className="mt-0.5 shrink-0 opacity-70" />
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------------------------ Stat block -- */

export function StatBlock({
  value,
  label,
  footnote,
  invert,
  size = "md",
}: {
  value: ReactNode;
  label: ReactNode;
  footnote?: ReactNode;
  invert?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const valueSize = {
    sm: "text-2xl lg:text-3xl",
    md: "text-3xl lg:text-4xl",
    lg: "text-4xl lg:text-5xl",
  }[size];

  return (
    <div>
      <p
        className={clsx(
          "font-display font-extrabold tracking-tight",
          valueSize,
          invert ? "text-white" : "text-brand-strong",
        )}
      >
        {value}
      </p>
      <p
        className={clsx(
          "mt-1.5 text-sm leading-snug",
          invert ? "text-white/75" : "text-stone-600",
        )}
      >
        {label}
        {footnote}
      </p>
    </div>
  );
}
