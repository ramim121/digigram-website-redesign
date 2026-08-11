import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OtpForm } from "@/components/auth/OtpForm";
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
    path: routes.otp,
    title: locale === "en" ? "Verify your number" : "নম্বর যাচাই করুন",
    description:
      locale === "en" ? "Enter the 6-digit code we sent by SMS." : "এসএমএসে পাঠানো ৬ সংখ্যার কোড দিন।",
    noindex: true,
  });
}

export default async function OtpPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const { next } = await searchParams;
  return <OtpForm locale={raw as Locale} returnTo={safeReturnTo(next)} />;
}
