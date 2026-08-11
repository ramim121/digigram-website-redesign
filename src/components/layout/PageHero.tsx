import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { localePath, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * Breadcrumb hero for inner pages — the current site's best structural idea,
 * kept and fixed: real type scale, a proper scrim so white text passes contrast
 * over any photograph, and no fixed height, because a Bangla headline runs up
 * to 30% taller than its English source.
 */
export function PageHero({
  locale,
  eyebrow,
  title,
  lead,
  image,
  imageAlt = "",
  crumbs,
  children,
  tone = "brand",
}: {
  locale: Locale;
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  image?: string;
  imageAlt?: string;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  /** `brand` uses the current token layer; `dark` forces deep teal. */
  tone?: "brand" | "dark";
}) {
  return (
    <section
      className={clsx(
        "relative isolate overflow-hidden",
        tone === "dark" ? "bg-teal-900" : "bg-brand-deep",
      )}
    >
      {image && (
        <>
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 scrim-left" aria-hidden="true" />
        </>
      )}

      <div className="relative container-page pt-28 pb-14 lg:pt-40 lg:pb-20">
        <nav
          aria-label={locale === "en" ? "Breadcrumb" : "ব্রেডক্রাম্ব"}
          className="mb-5 flex flex-wrap items-center gap-1.5 font-display text-xs font-semibold tracking-widest text-white/65 uppercase"
        >
          <Link href={localePath(locale, routes.home)} className="hover:text-white">
            {locale === "en" ? "Home" : "হোম"}
          </Link>
          {crumbs?.map((crumb) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              <Icon name="chevron-right" size={13} className="opacity-50" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {eyebrow && <p className="eyebrow mb-3 !text-brand-accent">{eyebrow}</p>}

        <h1 className="max-w-3xl font-display text-4xl leading-tight font-extrabold tracking-tight text-balance text-white lg:text-6xl">
          {title}
        </h1>

        {lead && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{lead}</p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
