import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { CtaBand } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/content/company";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";
import { isLocale, t, type Locale } from "@/lib/i18n";
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
    path: routes.faq,
    title: locale === "en" ? "Frequently asked questions" : "সাধারণ জিজ্ঞাসা",
    description:
      locale === "en"
        ? "Are returns guaranteed? How is the farmer's share calculated? What is the minimum investment? Answers to the questions investors and partners ask most."
        : "রিটার্ন কি নিশ্চিত? কৃষকের অংশ কীভাবে হিসাব হয়? সর্বনিম্ন বিনিয়োগ কত? বিনিয়োগকারী ও অংশীদারদের সবচেয়ে সাধারণ প্রশ্নের উত্তর।",
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            [
              { name: en ? "Home" : "হোম", path: routes.home },
              { name: "FAQ", path: routes.faq },
            ],
            locale,
          ),
          faqSchema(faqs.map((item) => ({ q: t(item.q, locale), a: t(item.a, locale) }))),
        ]}
      />

      <PageHero
        locale={locale}
        crumbs={[{ label: "FAQ" }]}
        eyebrow="FAQ"
        title={en ? "Questions we get asked" : "যেসব প্রশ্ন আমরা পাই"}
        lead={
          en
            ? "If something here is unclear, ask us directly — we would rather answer than have you guess."
            : "এখানে কিছু অস্পষ্ট মনে হলে সরাসরি জিজ্ঞাসা করুন — আপনি আন্দাজ করার চেয়ে আমাদের উত্তর দেওয়াই ভালো।"
        }
      />

      <Section tone="page">
        <div className="container-prose">
          <Accordion>
            {faqs.map((item, index) => (
              <AccordionItem
                key={item.q.en}
                question={t(item.q, locale)}
                group="site-faq"
                defaultOpen={index === 0}
              >
                {t(item.a, locale)}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <CtaBand
        locale={locale}
        title={en ? "Still have a question?" : "এখনো কোনো প্রশ্ন আছে?"}
        primary={{ href: routes.contact, label: en ? "Contact us" : "যোগাযোগ করুন" }}
        secondary={{ href: routes.projects, label: en ? "See projects" : "প্রকল্প দেখুন" }}
      />
    </>
  );
}
