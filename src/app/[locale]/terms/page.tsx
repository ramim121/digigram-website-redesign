import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/layout/LegalPage";
import { termsSections } from "@/content/legal";
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
    path: routes.terms,
    title: locale === "en" ? "Terms & Conditions" : "শর্তাবলি",
    description:
      locale === "en"
        ? "The terms that apply to using digigramventures.com and investing in a DigiGram project."
        : "digigramventures.com ব্যবহার ও ডিজিগ্রাম প্রকল্পে বিনিয়োগে প্রযোজ্য শর্তাবলি।",
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  return (
    <LegalPage
      locale={locale}
      crumb={en ? "Terms" : "শর্তাবলি"}
      title={en ? "Terms & Conditions" : "শর্তাবলি"}
      intro={
        en
          ? "What you agree to when you use this website or take part in a project."
          : "এই ওয়েবসাইট ব্যবহার বা কোনো প্রকল্পে অংশ নেওয়ার সময় আপনি যা মেনে নিচ্ছেন।"
      }
      sections={termsSections}
    />
  );
}
