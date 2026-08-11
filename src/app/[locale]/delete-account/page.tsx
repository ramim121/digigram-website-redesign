import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Card, Note } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { buildMetadata } from "@/lib/seo";
import { isLocale, t, type Bi, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";

/**
 * Account deletion.
 *
 * Google Play requires a publicly reachable, non-authenticated deletion route
 * for any app that creates accounts — the Shathi and Shathi Sheba apps both
 * do. This page is that route: it must stay linked from the footer and must
 * not sit behind login.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  return buildMetadata({
    locale,
    path: routes.deleteAccount,
    title: locale === "en" ? "Delete your account" : "অ্যাকাউন্ট মুছে ফেলুন",
    description:
      locale === "en"
        ? "How to request deletion of your DigiGram, Shathi or Shathi Sheba account and the data held against it."
        : "আপনার ডিজিগ্রাম, সাথী বা সাথী সেবা অ্যাকাউন্ট এবং তার সঙ্গে রাখা তথ্য মুছে ফেলার অনুরোধ কীভাবে করবেন।",
  });
}

export default async function DeleteAccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const steps: Bi[] = [
    {
      en: "Email info@digigramventures.com from the address on your account, or call the helpline, with the subject \"Delete my account\".",
      bn: "আপনার অ্যাকাউন্টে থাকা ঠিকানা থেকে info@digigramventures.com-এ ইমেইল করুন, অথবা হেল্পলাইনে কল করুন — বিষয় লিখুন \"আমার অ্যাকাউন্ট মুছুন\"।",
    },
    {
      en: "Include the mobile number registered on the account so we can verify the request. We will send a confirmation code to that number.",
      bn: "অ্যাকাউন্টে নিবন্ধিত মোবাইল নম্বরটি উল্লেখ করুন, যাতে আমরা অনুরোধটি যাচাই করতে পারি। ওই নম্বরে একটি নিশ্চিতকরণ কোড পাঠানো হবে।",
    },
    {
      en: "Once verified, we delete your profile, preferences, contact details and saved documents within 30 days.",
      bn: "যাচাই সম্পন্ন হলে ৩০ দিনের মধ্যে আমরা আপনার প্রোফাইল, পছন্দ, যোগাযোগের তথ্য ও সংরক্ষিত নথি মুছে ফেলি।",
    },
  ];

  const retained: Bi[] = [
    {
      en: "Transaction records for an investment or order you have already placed, for as long as accounting and tax law requires.",
      bn: "ইতিমধ্যে করা কোনো বিনিয়োগ বা অর্ডারের লেনদেন নথি, হিসাব ও কর আইনে যতদিন প্রয়োজন।",
    },
    {
      en: "Records a partner lender is separately required to keep under its own regulatory obligations.",
      bn: "কোনো অংশীদার ঋণদাতা নিজস্ব নিয়ন্ত্রক বাধ্যবাধকতায় আলাদাভাবে যে নথি রাখতে বাধ্য।",
    },
    {
      en: "Anonymised, aggregated statistics that cannot be traced back to you.",
      bn: "বেনামি, সমষ্টিগত পরিসংখ্যান যা আপনার পরিচয় পর্যন্ত পৌঁছায় না।",
    },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Delete account" : "অ্যাকাউন্ট মুছুন" }]}
        title={en ? "Delete your account" : "অ্যাকাউন্ট মুছে ফেলুন"}
        lead={
          en
            ? "You can ask us to delete your account and the personal data held against it at any time. You do not need to be logged in to make the request."
            : "যেকোনো সময় আপনি আপনার অ্যাকাউন্ট ও তার সঙ্গে রাখা ব্যক্তিগত তথ্য মুছে ফেলতে বলতে পারেন। অনুরোধ করতে লগ ইন করার প্রয়োজন নেই।"
        }
      />

      <Section tone="page">
        <div className="container-prose">
          <h2 className="font-display text-xl font-bold text-stone-900">
            {en ? "How to request deletion" : "মুছে ফেলার অনুরোধ যেভাবে করবেন"}
          </h2>
          <ol className="mt-5 space-y-3">
            {steps.map((step, index) => (
              <li key={step.en} className="flex gap-4 rounded-md bg-white p-4 ring-1 ring-stone-200">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-tint font-mono text-xs font-bold text-brand-strong">
                  {index + 1}
                </span>
                <span className="text-[15px] leading-relaxed text-stone-700">{t(step, locale)}</span>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 font-display text-xl font-bold text-stone-900">
            {en ? "What we keep, and why" : "আমরা কী রাখি, আর কেন"}
          </h2>
          <ul className="mt-5 space-y-3">
            {retained.map((item) => (
              <li key={item.en} className="flex gap-3 text-[15px] leading-relaxed text-stone-700">
                <Icon name="info" size={18} className="mt-0.5 shrink-0 text-stone-400" />
                {t(item, locale)}
              </li>
            ))}
          </ul>

          <Note tone="warn" icon="alert-triangle" className="mt-8">
            {en
              ? "Deleting your account does not cancel an investment already committed to a running production cycle. Contact us first if you have an active project."
              : "চলমান কোনো উৎপাদন চক্রে ইতিমধ্যে প্রতিশ্রুত বিনিয়োগ অ্যাকাউন্ট মুছলেই বাতিল হয় না। আপনার সক্রিয় প্রকল্প থাকলে আগে আমাদের সঙ্গে যোগাযোগ করুন।"}
          </Note>

          <Card className="mt-10 p-7">
            <h3 className="font-display text-lg font-bold text-stone-900">
              {en ? "Send the request" : "অনুরোধ পাঠান"}
            </h3>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink
                href={`mailto:${site.email}?subject=${encodeURIComponent(en ? "Delete my account" : "আমার অ্যাকাউন্ট মুছুন")}`}
                external
                icon="mail"
                iconPosition="left"
              >
                {site.email}
              </ButtonLink>
              <ButtonLink href={site.helplineHref} external variant="secondary" icon="phone" iconPosition="left">
                {site.helpline}
              </ButtonLink>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
