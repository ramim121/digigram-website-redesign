"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { localeLabel, stripLocale, type Locale } from "@/lib/i18n";

/**
 * Two-state pill, not a dropdown — there are exactly two languages.
 *
 * The link points at the *same page* in the other language, so switching never
 * dumps the visitor back to the homepage. Choice is persisted in a cookie that
 * a future middleware read can use for first-visit routing.
 */
export function LanguageToggle({
  locale,
  invert,
  className,
}: {
  locale: Locale;
  invert?: boolean;
  className?: string;
}) {
  const pathname = usePathname() || "/";
  const bare = stripLocale(pathname);

  function remember(next: Locale) {
    document.cookie = `digigram_locale=${next}; path=/; max-age=31536000; samesite=lax`;
  }

  const options: { code: Locale; short: string; href: string }[] = [
    { code: "en", short: "EN", href: bare },
    { code: "bn", short: "বাং", href: bare === "/" ? "/bn" : `/bn${bare}` },
  ];

  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full border p-0.5",
        invert ? "border-white/25 bg-white/10" : "border-stone-200 bg-stone-50",
        className,
      )}
      role="group"
      aria-label={locale === "en" ? "Change language" : "ভাষা পরিবর্তন করুন"}
    >
      {options.map((option) => {
        const active = option.code === locale;
        return (
          <Link
            key={option.code}
            href={option.href}
            hrefLang={option.code}
            lang={option.code}
            aria-current={active ? "true" : undefined}
            aria-label={
              locale === "en"
                ? `Switch to ${localeLabel[option.code]}`
                : `${localeLabel[option.code]}-তে দেখুন`
            }
            onClick={() => remember(option.code)}
            className={clsx(
              "rounded-full px-2.5 py-1 font-display text-xs font-bold transition-colors duration-150",
              active
                ? invert
                  ? "bg-white text-teal-800"
                  : "bg-brand text-on-brand"
                : invert
                  ? "text-white/70 hover:text-white"
                  : "text-stone-500 hover:text-brand-strong",
            )}
          >
            {option.short}
          </Link>
        );
      })}
    </div>
  );
}
