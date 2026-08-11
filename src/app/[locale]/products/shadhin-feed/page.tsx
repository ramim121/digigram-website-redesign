import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Card, Note, StatBlock } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { CtaBand } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { isLocale, localePath, t, type Bi, type Locale } from "@/lib/i18n";
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
    path: routes.shadhinFeed,
    title:
      locale === "en"
        ? "Shadhin Cattle Feed — DLS-compliant compound feed"
        : "স্বাধীন গো-খাদ্য — ডিএলএস-অনুমোদিত কম্পাউন্ড ফিড",
    description:
      locale === "en"
        ? "DLS-compliant compound cattle feed validated at 900g average daily gain. 100 tons a month, scalable to 500, distributed through cooperative and B2B channels."
        : "ডিএলএস-অনুমোদিত কম্পাউন্ড গো-খাদ্য, দৈনিক গড়ে ৯০০ গ্রাম ওজন বৃদ্ধিতে যাচাইকৃত। মাসে ১০০ টন, ৫০০ টন পর্যন্ত সম্প্রসারণযোগ্য, সমবায় ও বিটুবি চ্যানেলে বিতরণ।",
    image: "/assets/projects/cattle-shed.jpg",
  });
}

export default async function ShadhinFeedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const proof: { value: Bi; label: Bi; icon: IconName }[] = [
    {
      icon: "shield",
      value: { en: "DLS-compliant", bn: "ডিএলএস-অনুমোদিত" },
      label: {
        en: "Formulated to Department of Livestock Services specification",
        bn: "প্রাণিসম্পদ অধিদপ্তরের স্পেসিফিকেশন অনুযায়ী প্রণীত",
      },
    },
    {
      icon: "trending-up",
      value: { en: "900g ADG", bn: "৯০০ গ্রাম এডিজি" },
      label: {
        en: "Average daily gain, validated in trial — about 27kg a month",
        bn: "ট্রায়ালে যাচাইকৃত গড় দৈনিক ওজন বৃদ্ধি — মাসে প্রায় ২৭ কেজি",
      },
    },
    {
      icon: "truck",
      value: { en: "100 → 500 t/mo", bn: "১০০ → ৫০০ টন/মাস" },
      label: {
        en: "Current production capacity, scalable fivefold",
        bn: "বর্তমান উৎপাদন সক্ষমতা, পাঁচ গুণ পর্যন্ত সম্প্রসারণযোগ্য",
      },
    },
    {
      icon: "bar-chart",
      value: { en: "67%", bn: "৬৭%" },
      label: {
        en: "of surveyed farmers buy ungraded feed from a single market",
        bn: "জরিপকৃত কৃষক একটিমাত্র বাজার থেকে গ্রেডবিহীন খাদ্য কেনেন",
      },
    },
  ];

  const channels: { title: Bi; body: Bi; icon: IconName }[] = [
    {
      icon: "users",
      title: { en: "Cooperative network", bn: "সমবায় নেটওয়ার্ক" },
      body: {
        en: "Orders aggregate at cooperative level and are delivered locally, so a farmer does not lose a working day travelling to a market for a sack of feed.",
        bn: "অর্ডার সমবায় পর্যায়ে একত্র হয়ে স্থানীয়ভাবে পৌঁছে যায়, ফলে এক বস্তা খাদ্যের জন্য কৃষকের একটি কর্মদিবস নষ্ট হয় না।",
      },
    },
    {
      icon: "building",
      title: { en: "B2B cattle farms", bn: "বিটুবি গবাদি খামার" },
      body: {
        en: "Standing supply agreements for commercial fattening operations, with consistent formulation batch to batch.",
        bn: "বাণিজ্যিক মোটাতাজাকরণ খামারের জন্য স্থায়ী সরবরাহ চুক্তি, ব্যাচ থেকে ব্যাচে অভিন্ন ফর্মুলেশনসহ।",
      },
    },
    {
      icon: "store",
      title: { en: "Shathi Sheba marketplace", bn: "সাথী সেবা মার্কেটপ্লেস" },
      body: {
        en: "Listed in the app's Buy catalogue at a fixed, published price, with the purchase recorded against the farmer's enterprise profile.",
        bn: "অ্যাপের ক্রয় তালিকায় নির্দিষ্ট, প্রকাশিত দামে তালিকাভুক্ত, এবং প্রতিটি ক্রয় কৃষকের উদ্যোগ প্রোফাইলে নথিভুক্ত।",
      },
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            [
              { name: en ? "Home" : "হোম", path: routes.home },
              { name: en ? "Products" : "পণ্য ও সেবা", path: routes.products },
              { name: "Shadhin Cattle Feed", path: routes.shadhinFeed },
            ],
            locale,
          ),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Shadhin Cattle Feed",
            category: "Animal Feed",
            brand: { "@type": "Brand", name: "DigiGram Ventures" },
            description:
              "DLS-compliant compound cattle feed validated at 900g average daily gain, produced at 100 tons per month.",
          },
        ]}
      />

      <PageHero
        locale={locale}
        crumbs={[
          { label: en ? "Products" : "পণ্য ও সেবা", href: localePath(locale, routes.products) },
          { label: en ? "Shadhin Cattle Feed" : "স্বাধীন গো-খাদ্য" },
        ]}
        eyebrow={en ? "Shadhin Cattle Feed" : "স্বাধীন গো-খাদ্য"}
        title={
          en
            ? "Quality feed a farmer can actually get hold of"
            : "মানসম্পন্ন খাদ্য, যা কৃষক সত্যিই হাতে পান"
        }
        lead={
          en
            ? "Ungraded feed is not cheap — it is paid back in extra weeks of feeding. Shadhin is a DLS-compliant compound feed, produced at commercial scale and delivered through the cooperative network."
            : "গ্রেডবিহীন খাদ্য সস্তা নয় — এর দাম শোধ করতে হয় অতিরিক্ত কয়েক সপ্তাহ খাইয়ে। স্বাধীন একটি ডিএলএস-অনুমোদিত কম্পাউন্ড ফিড, বাণিজ্যিক পরিসরে উৎপাদিত এবং সমবায় নেটওয়ার্কে সরবরাহকৃত।"
        }
        image="/assets/projects/cattle-shed.jpg"
      />

      <Section tone="page">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {proof.map((item) => (
              <Card key={item.value.en} className="p-7">
                <span className="flex size-11 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                  <Icon name={item.icon} size={22} />
                </span>
                <div className="mt-4">
                  <StatBlock size="sm" value={t(item.value, locale)} label={t(item.label, locale)} />
                </div>
              </Card>
            ))}
          </div>

          <Note tone="info" icon="info" className="mt-6">
            {en
              ? "900g ADG is a validated trial figure, not a guarantee for every animal. Actual gain depends on breed, starting condition, water availability, parasite control and consistency of feeding."
              : "৯০০ গ্রাম এডিজি একটি যাচাইকৃত ট্রায়াল ফলাফল, প্রতিটি পশুর জন্য নিশ্চয়তা নয়। প্রকৃত বৃদ্ধি নির্ভর করে জাত, প্রাথমিক অবস্থা, পানির সহজলভ্যতা, কৃমি নিয়ন্ত্রণ ও খাওয়ানোর ধারাবাহিকতার ওপর।"}
          </Note>
        </div>
      </Section>

      <Section tone="surface">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHead
                eyebrow={en ? "Why it matters" : "কেন এটি গুরুত্বপূর্ণ"}
                title={
                  en ? "The saving on the sack is not the saving" : "বস্তায় যে সাশ্রয়, সেটিই আসল সাশ্রয় নয়"
                }
              />
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-stone-700">
                <p>
                  {en
                    ? "Ungraded feed means the protein and energy content is whatever the batch happened to contain. The animal eats the same volume and converts less of it, so the cycle runs longer and the margin goes with it."
                    : "গ্রেডবিহীন খাদ্য মানে আমিষ ও শক্তির পরিমাণ যা ব্যাচে ছিল তাই। পশু একই পরিমাণ খায় কিন্তু কম রূপান্তর করে, ফলে চক্র দীর্ঘ হয় এবং মুনাফাও কমে যায়।"}
                </p>
                <p>
                  {en
                    ? "Buying at commercial scale through the DigiGram dealer network removes roughly 40% of input cost against retail. Combined with consistent formulation, that is where the 25% production improvement and 20% cost reduction in our pilot data come from."
                    : "ডিজিগ্রামের ডিলার নেটওয়ার্কের মাধ্যমে বাণিজ্যিক পরিসরে কেনায় খুচরা দরের তুলনায় উপকরণ ব্যয় প্রায় ৪০% কমে। অভিন্ন ফর্মুলেশনের সঙ্গে মিলে এখান থেকেই আসে আমাদের পাইলট তথ্যের ২৫% উৎপাদন উন্নতি ও ২০% ব্যয় হ্রাস।"}
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg">
              <Image
                src="/assets/projects/cattle-grazing.jpg"
                alt={
                  en
                    ? "Cattle grazing at a Shathi partner's holding"
                    : "একজন সাথী অংশীদারের খামারে চরছে গবাদি পশু"
                }
                width={900}
                height={900}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
          <p className="mt-6 text-xs text-stone-400">
            {en
              ? "Product and packaging photography pending."
              : "পণ্য ও প্যাকেজিংয়ের ছবি বাকি আছে।"}
          </p>
        </div>
      </Section>

      <Section tone="page">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Distribution" : "বিতরণ"}
            title={en ? "Three channels to the shed" : "গোয়াল পর্যন্ত তিনটি চ্যানেল"}
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {channels.map((channel) => (
              <Card key={channel.title.en} className="flex h-full flex-col p-7">
                <span className="flex size-11 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                  <Icon name={channel.icon} size={22} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-stone-900">
                  {t(channel.title, locale)}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                  {t(channel.body, locale)}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink
              href={`${localePath(locale, routes.contact)}?topic=feed`}
              size="lg"
              icon="arrow-right"
            >
              {en ? "Enquire or order" : "জিজ্ঞাসা বা অর্ডার"}
            </ButtonLink>
            <ButtonLink href={localePath(locale, routes.shathiSheba)} variant="secondary" size="lg">
              {en ? "See it in Shathi Sheba" : "সাথী সেবায় দেখুন"}
            </ButtonLink>
          </div>
        </div>
      </Section>

      <CtaBand locale={locale} />
    </>
  );
}
