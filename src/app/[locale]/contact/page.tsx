import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Card, Skeleton } from "@/components/ui/Primitives";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { isLocale, t, type Bi, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;

  return buildMetadata({
    locale,
    path: routes.contact,
    title: locale === "en" ? "Contact us" : "যোগাযোগ",
    description:
      locale === "en"
        ? "Talk to DigiGram Ventures — investors, banks and MFIs, farmers, B2B buyers and press. Dhanmondi, Dhaka. Helpline +880 1761 720 230."
        : "ডিজিগ্রাম ভেঞ্চারসের সঙ্গে কথা বলুন — বিনিয়োগকারী, ব্যাংক ও এমএফআই, কৃষক, বিটুবি ক্রেতা ও সংবাদমাধ্যম। ধানমন্ডি, ঢাকা। হেল্পলাইন +৮৮০ ১৭৬১ ৭২০ ২৩০।",
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const routesList: { title: Bi; body: Bi; icon: IconName; topic: string }[] = [
    {
      icon: "wallet",
      topic: "investor",
      title: { en: "Investors", bn: "বিনিয়োগকারী" },
      body: {
        en: "Project selection, minimum ticket, payment methods and reporting.",
        bn: "প্রকল্প বাছাই, সর্বনিম্ন অঙ্ক, পরিশোধ পদ্ধতি ও প্রতিবেদন।",
      },
    },
    {
      icon: "building",
      topic: "partner",
      title: { en: "Banks, MFIs & partners", bn: "ব্যাংক, এমএফআই ও অংশীদার" },
      body: {
        en: "Decision-support packs, pilot cohorts and data-sharing terms.",
        bn: "সিদ্ধান্ত-সহায়তা প্যাক, পাইলট দল ও তথ্য-বিনিময়ের শর্ত।",
      },
    },
    {
      icon: "sprout",
      topic: "farmer",
      title: { en: "Farmers & producers", bn: "কৃষক ও উৎপাদক" },
      body: {
        en: "Joining as a Shathi partner, input orders and project availability in your area.",
        bn: "সাথী অংশীদার হওয়া, উপকরণ অর্ডার ও আপনার এলাকায় প্রকল্পের সুযোগ।",
      },
    },
    {
      icon: "message-circle",
      topic: "press",
      title: { en: "Press & media", bn: "সংবাদমাধ্যম" },
      body: {
        en: "Interviews, data requests and brand assets.",
        bn: "সাক্ষাৎকার, তথ্যের অনুরোধ ও ব্র্যান্ড অ্যাসেট।",
      },
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: en ? "Home" : "হোম", path: routes.home },
            { name: en ? "Contact" : "যোগাযোগ", path: routes.contact },
          ],
          locale,
        )}
      />

      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "Contact" : "যোগাযোগ" }]}
        eyebrow={en ? "Contact" : "যোগাযোগ"}
        title={en ? "Talk to us" : "আমাদের সঙ্গে কথা বলুন"}
        lead={
          en
            ? "Tell us which of these you are and we will route your message to the right person rather than a shared inbox."
            : "আপনি কোন পক্ষ জানান — আমরা আপনার বার্তা সাধারণ ইনবক্সে নয়, সঠিক ব্যক্তির কাছে পাঠাব।"
        }
      />

      <Section tone="page">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left: details */}
            <div className="lg:col-span-5">
              <Card className="p-7">
                <h2 className="font-display text-xl font-bold text-stone-900">
                  {en ? "DigiGram Ventures Ltd." : "ডিজিগ্রাম ভেঞ্চারস লিমিটেড"}
                </h2>
                <address className="mt-5 space-y-4 text-[15px] not-italic text-stone-700">
                  <p className="flex gap-3">
                    <Icon name="map-pin" size={18} className="mt-0.5 shrink-0 text-brand" />
                    <span>
                      {site.address.street}
                      <br />
                      {site.address.locality}, {site.address.region}-{site.address.postalCode}
                      <br />
                      Bangladesh
                    </span>
                  </p>
                  <p className="flex gap-3">
                    <Icon name="phone" size={18} className="mt-0.5 shrink-0 text-brand" />
                    <a href={site.helplineHref} className="hover:text-brand-strong">
                      {site.helpline}
                    </a>
                  </p>
                  <p className="flex gap-3">
                    <Icon name="mail" size={18} className="mt-0.5 shrink-0 text-brand" />
                    <a href={`mailto:${site.email}`} className="hover:text-brand-strong">
                      {site.email}
                    </a>
                  </p>
                  <p className="flex gap-3">
                    <Icon name="clock" size={18} className="mt-0.5 shrink-0 text-brand" />
                    <span>{t(site.officeHours, locale)}</span>
                  </p>
                </address>
              </Card>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {routesList.map((item) => (
                  <Card key={item.title.en} className="flex gap-4 p-5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                      <Icon name={item.icon} size={19} />
                    </span>
                    <div>
                      <h3 className="font-display text-[15px] font-bold text-stone-900">
                        {t(item.title, locale)}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-stone-600">
                        {t(item.body, locale)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-5 overflow-hidden rounded-lg border border-stone-200">
                <iframe
                  title={en ? "DigiGram Ventures office location" : "ডিজিগ্রাম ভেঞ্চারস কার্যালয়ের অবস্থান"}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=90.372%2C23.740%2C90.386%2C23.752&layer=mapnik&marker=23.746%2C90.379"
                  className="h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-7">
              <Suspense fallback={<Skeleton className="h-[42rem] w-full rounded-lg" />}>
                <ContactForm locale={locale} />
              </Suspense>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
