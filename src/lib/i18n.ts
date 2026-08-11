/**
 * Bilingual core.
 *
 * Content is authored as inline EN/BN pairs (`Bi`) rather than as two parallel
 * dictionary files. Keeping both languages adjacent is what makes the Bangla
 * pass reviewable — a translator sees the English it must match, and a missing
 * Bangla string is a type error, not a silent English fallback.
 */

export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** A string that exists in both languages. */
export type Bi = { en: string; bn: string };
/** An array that exists in both languages. */
export type BiList = { en: string[]; bn: string[] };

export function t(value: Bi, locale: Locale): string {
  return value[locale];
}

export function tList(value: BiList, locale: Locale): string[] {
  return value[locale];
}

/**
 * English lives at the root (`/about`); Bangla is prefixed (`/bn/about`).
 * Middleware rewrites the root form to the `/en` segment internally, so this
 * is the only place that knows about the asymmetry.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean === "" ? "/" : clean;
  return `/bn${clean}`;
}

/** Strips the locale prefix from a pathname, for the language switcher. */
export function stripLocale(pathname: string): string {
  if (pathname === "/bn") return "/";
  if (pathname.startsWith("/bn/")) return pathname.slice(3);
  return pathname;
}

export const localeLabel: Record<Locale, string> = {
  en: "English",
  bn: "বাংলা",
};

/** The short label shown in the toggle — always the *other* language. */
export const localeShort: Record<Locale, string> = {
  en: "EN",
  bn: "বাং",
};

export const htmlLang: Record<Locale, string> = {
  en: "en-BD",
  bn: "bn-BD",
};

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Converts ASCII digits to Bangla numerals. Mirrors the app's `bn()` helper. */
export function toBnDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Indian/Bangladeshi lakh-crore grouping: 1,00,000 not 100,000.
 * `Intl` with the en-IN locale produces exactly this grouping.
 */
export function groupBdt(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

/**
 * Currency for *narrative and stat* surfaces.
 *
 * Client decision: Bangla numerals in prose and stat bands; Western digits in
 * project fact tables, the return calculator and every form input, so investors
 * can scan and compare returns. `variant: "data"` opts into the Western form.
 */
export function formatBdt(
  value: number,
  locale: Locale,
  opts: { variant?: "prose" | "data"; symbol?: "৳" | "BDT" } = {},
): string {
  const { variant = "prose", symbol = "৳" } = opts;
  const grouped = groupBdt(value);
  const digits = locale === "bn" && variant === "prose" ? toBnDigits(grouped) : grouped;
  return symbol === "BDT" ? `BDT ${digits}` : `৳ ${digits}`;
}

/** Numbers in prose/stat contexts (counts, percentages, years). */
export function formatNumber(
  value: number | string,
  locale: Locale,
  variant: "prose" | "data" = "prose",
): string {
  const base = typeof value === "number" ? groupBdt(value) : value;
  return locale === "bn" && variant === "prose" ? toBnDigits(base) : base;
}

/** `20–22%` with an en dash, per brief §12. */
export function formatRange(
  min: number,
  max: number,
  locale: Locale,
  suffix = "%",
  variant: "prose" | "data" = "data",
): string {
  if (min === max) return `${formatNumber(min, locale, variant)}${suffix}`;
  return `${formatNumber(min, locale, variant)}–${formatNumber(max, locale, variant)}${suffix}`;
}

const BN_MONTHS = [
  "জানু",
  "ফেব",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্ট",
  "অক্টো",
  "নভে",
  "ডিসে",
];

const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** ISO date → `12 Sep 2026` / `১২ সেপ্ট ২০২৬`. Never renders an empty label. */
export function formatDate(iso: string | null | undefined, locale: Locale): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const day = d.getUTCDate();
  const month = (locale === "bn" ? BN_MONTHS : EN_MONTHS)[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const dayStr = locale === "bn" ? toBnDigits(day) : String(day);
  const yearStr = locale === "bn" ? toBnDigits(year) : String(year);
  return `${dayStr} ${month} ${yearStr}`;
}
