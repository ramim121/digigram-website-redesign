import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhoneForm } from "@/components/auth/PhoneForm";
import { safeReturnTo } from "@/lib/auth/returnTo";
import { buildMetadata } from "@/lib/seo";
import { isLocale, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  return buildMetadata({
    locale,
    path: routes.login,
    title: locale === "en" ? "Log in" : "লগ ইন",
    description:
      locale === "en"
        ? "Log in with your mobile number. No password required."
        : "মোবাইল নম্বর দিয়ে লগ ইন করুন। পাসওয়ার্ড লাগবে না।",
    noindex: true,
  });
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  // Validated here rather than trusted: an unchecked value would make this an
  // open redirect. See lib/auth/returnTo.
  const { next } = await searchParams;
  return <PhoneForm locale={raw as Locale} returnTo={safeReturnTo(next)} />;
}
