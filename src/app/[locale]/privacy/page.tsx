import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/layout/LegalPage";
import { privacySections } from "@/content/legal";
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
    path: routes.privacy,
    title: locale === "en" ? "Privacy Policy" : "গোপনীয়তা নীতি",
    description:
      locale === "en"
        ? "What personal data DigiGram Ventures collects, why, who it is shared with and how to have it corrected or deleted."
        : "ডিজিগ্রাম ভেঞ্চারস কী ব্যক্তিগত তথ্য সংগ্রহ করে, কেন, কার সঙ্গে ভাগ করে এবং কীভাবে তা সংশোধন বা মুছে ফেলা যায়।",
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  return (
    <LegalPage
      locale={locale}
      crumb={en ? "Privacy" : "গোপনীয়তা"}
      title={en ? "Privacy Policy" : "গোপনীয়তা নীতি"}
      intro={
        en
          ? "What we collect, why we collect it, and what you can ask us to do with it."
          : "আমরা কী সংগ্রহ করি, কেন করি, এবং তা নিয়ে আপনি আমাদের কী করতে বলতে পারেন।"
      }
      sections={privacySections}
    />
  );
}
