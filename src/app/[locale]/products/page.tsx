import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { ProductCards, CtaBand, AppDownloadBand } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { pillars } from "@/content/company";
import { shebaRails, shebaLenderPrinciple } from "@/content/sheba";
import { Reveal } from "@/components/ui/Reveal";
import { ShathiShebaLogo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { isLocale, localePath, t, type Locale } from "@/lib/i18n";
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
    path: routes.products,
    title: locale === "en" ? "Products" : "পণ্য ও সেবা",
    description:
      locale === "en"
        ? "Shathi funds the production cycle, Shadhin Cattle Feed supplies it, Shathi Sheba records it. Three products, one rural enterprise model."
        : "সাথী উৎপাদন চক্রে অর্থায়ন করে, স্বাধীন গরুর খাবার উপকরণ জোগায়, সাথী সেবা নথিভুক্ত করে। তিনটি পণ্য, একটি গ্রামীণ উদ্যোগ মডেল।",
  });
}

/** Which product covers which pillar — the comparison strip from brief §16.1. */
const coverage: Record<string, { shathi: boolean; sheba: boolean; feed: boolean }> = {
  fund: { shathi: true, sheba: true, feed: false },
  supply: { shathi: true, sheba: true, feed: true },
  grow: { shathi: true, sheba: true, feed: false },
  sell: { shathi: true, sheba: true, feed: true },
};

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: en ? "Home" : "হোম", path: routes.home },
            { name: en ? "Products" : "পণ্য ও সেবা", path: routes.products },
          ],
          locale,
        )}
      />

      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Products" : "পণ্য ও সেবা" }]}
        eyebrow={en ? "Products" : "পণ্য ও সেবা"}
        title={en ? "Three products, one model" : "তিনটি পণ্য, একটি মডেল"}
        lead={
          en
            ? "Each product does one job in the Fund / Supply / Grow / Sell model — and each one leaves behind a record that makes the next cycle easier to finance."
            : "ফান্ড / সরবরাহ / প্রবৃদ্ধি / বিক্রয় মডেলে প্রতিটি পণ্যের একটি নির্দিষ্ট কাজ — আর প্রতিটিই এমন নথি রেখে যায় যা পরের চক্রে অর্থায়ন সহজ করে।"
        }
        image="/assets/photos/hero/products-inputs.webp"
      />

      <Section tone="page">
        <div className="container-page">
          <ProductCards locale={locale} />
        </div>
      </Section>

      <Section tone="surface">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Coverage" : "পরিধি"}
            title={en ? "Where each product sits in the model" : "মডেলে প্রতিটি পণ্যের অবস্থান"}
          />

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-start">
              <caption className="sr-only">
                {en
                  ? "Which product covers which pillar of the Fund, Supply, Grow, Sell model"
                  : "ফান্ড, সরবরাহ, প্রবৃদ্ধি, বিক্রয় মডেলের কোন স্তম্ভ কোন পণ্য পূরণ করে"}
              </caption>
              <thead>
                <tr className="border-b border-stone-200">
                  <th scope="col" className="py-4 pe-4 text-start font-display text-sm font-bold text-stone-500">
                    {en ? "Pillar" : "স্তম্ভ"}
                  </th>
                  <th scope="col" className="px-4 py-4 text-start font-display text-sm font-bold text-shathi-600">
                    {en ? "Shathi" : "সাথী"}
                  </th>
                  <th scope="col" className="px-4 py-4 text-start font-display text-sm font-bold text-sheba-600">
                    {en ? "Shathi Sheba" : "সাথী সেবা"}
                  </th>
                  <th scope="col" className="px-4 py-4 text-start font-display text-sm font-bold text-teal-700">
                    {en ? "Shadhin Feed" : "স্বাধীন ফিড"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pillars.map((pillar) => (
                  <tr key={pillar.key} className="border-b border-stone-100">
                    <th scope="row" className="py-4 pe-4 text-start">
                      <span className="font-display text-[15px] font-bold text-stone-900">
                        {t(pillar.title, locale)}
                      </span>
                      <span className="mt-0.5 block text-sm font-normal text-stone-500">
                        {t(pillar.line, locale)}
                      </span>
                    </th>
                    {(["shathi", "sheba", "feed"] as const).map((product) => (
                      <td key={product} className="px-4 py-4">
                        {coverage[pillar.key][product] ? (
                          <Icon
                            name="check-circle"
                            size={20}
                            className="text-success"
                            aria-label={en ? "Covered" : "অন্তর্ভুক্ত"}
                          />
                        ) : (
                          <span className="text-stone-300" aria-label={en ? "Not covered" : "অন্তর্ভুক্ত নয়"}>
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/*
        A Shathi Sheba strip, in wine, between the comparison table and the CTA.

        The table above marks Shathi Sheba present on all four pillars with a
        tick, which is accurate and says nothing — a tick is the same width for
        a product that ships and one that is a slide. Shathi Sheba is the newest
        and least familiar of the three, so it gets the space to be concrete
        here rather than being left as a row in a grid.
      */}
      <section data-brand="shathi-sheba" className="section bg-brand-canvas">
        <div className="container-page">
          <div className="max-w-3xl">
            <ShathiShebaLogo locale={locale} className="h-8" />
            <h2 className="mt-6 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-stone-900 lg:text-4xl">
              {en
                ? "One app, four service rails"
                : "একটি অ্যাপ, চারটি সেবা রেল"}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-stone-600">
              {en
                ? "Better market access for farmers. Better traceable sourcing for buyers. Better risk visibility for finance partners. Each rail produces data that improves the next application."
                : "কৃষকের জন্য ভালো বাজার, ক্রেতার জন্য সন্ধানযোগ্য সরবরাহ, অর্থায়ন অংশীদারের জন্য স্পষ্ট ঝুঁকিচিত্র। প্রতিটি রেল এমন তথ্য তৈরি করে, যা পরের আবেদনটিকে আরও শক্ত করে।"}
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shebaRails.map((rail, index) => (
              <Reveal key={rail.key} delay={index * 60}>
                <div className="flex h-full flex-col rounded-lg border border-brand-line bg-white p-6">
                  <span className="flex size-10 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                    <Icon name={rail.icon} size={20} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-brand-strong">
                    {t(rail.title, locale)}
                  </h3>
                  <p className="mt-1.5 text-[13px] font-semibold text-stone-700">
                    {t(rail.line, locale)}
                  </p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                    {t(rail.detail, locale)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* The boundary, stated wherever the Fund rail is. Describing a
              scoring engine without it reads as though DigiGram lends. */}
          <div className="mt-8 flex flex-col gap-5 rounded-lg border border-brand-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2.5 text-[15px] leading-relaxed text-stone-700">
              <Icon name="shield" size={18} className="mt-0.5 shrink-0 text-brand-strong" />
              {t(shebaLenderPrinciple, locale)}
            </p>
            <ButtonLink
              href={localePath(locale, routes.shathiSheba)}
              icon="arrow-right"
              className="shrink-0"
            >
              {en ? "Explore Shathi Sheba" : "সাথী সেবা দেখুন"}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Both apps side by side. This band used to close the homepage; the
          products hub is where comparing the two apps is the point. */}
      <AppDownloadBand locale={locale} />

      <CtaBand locale={locale} />
    </>
  );
}
