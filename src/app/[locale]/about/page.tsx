import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Card, StatBlock } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ArrowLink } from "@/components/ui/Button";
import { PillarGrid, PartnerBand, CtaBand } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { headlineStats, problemCards, leadership, advisors } from "@/content/company";
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
    path: routes.about,
    title: locale === "en" ? "About DigiGram Ventures" : "ডিজিগ্রাম ভেঞ্চারস সম্পর্কে",
    description:
      locale === "en"
        ? "A for-profit impact enterprise in Bangladesh turning rural homes into micro-enterprises. Our model, our team, our partners and the gaps we exist to close."
        : "বাংলাদেশের একটি মুনাফাভিত্তিক ইমপ্যাক্ট প্রতিষ্ঠান, যা গ্রামীণ ঘরকে ক্ষুদ্র উদ্যোগে রূপান্তর করে। আমাদের মডেল, দল, অংশীদার এবং যে ফাঁক পূরণে আমাদের অস্তিত্ব।",
    image: "/assets/photos/community-meeting.webp",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const anchors = [
    { id: "who-we-are", label: { en: "Who we are", bn: "আমরা কারা" } },
    { id: "problem", label: { en: "The problem", bn: "সমস্যা" } },
    { id: "mission-vision", label: { en: "Mission & vision", bn: "লক্ষ্য ও দৃষ্টিভঙ্গি" } },
    { id: "how-we-work", label: { en: "How we work", bn: "আমরা যেভাবে কাজ করি" } },
    { id: "family", label: { en: "The family", bn: "পরিবার" } },
    { id: "partners", label: { en: "Partners", bn: "অংশীদার" } },
    { id: "media", label: { en: "Media & awards", bn: "মিডিয়া ও স্বীকৃতি" } },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: en ? "Home" : "হোম", path: routes.home },
            { name: en ? "About" : "আমাদের সম্পর্কে", path: routes.about },
          ],
          locale,
        )}
      />

      <PageHero
        locale={locale}
        crumbs={[{ label: en ? "About" : "আমাদের সম্পর্কে" }]}
        eyebrow={en ? "Who we are" : "আমরা কারা"}
        title="DigiGram Ventures Ltd."
        lead={
          en
            ? "A for-profit impact enterprise transforming rural livelihoods in Bangladesh — with a deliberate emphasis on women and people facing disability-related barriers."
            : "বাংলাদেশের গ্রামীণ জীবিকা রূপান্তরে কাজ করা একটি মুনাফাভিত্তিক ইমপ্যাক্ট প্রতিষ্ঠান — নারী ও প্রতিবন্ধকতার মুখোমুখি মানুষের ওপর সচেতন গুরুত্বসহ।"
        }
        image="/assets/photos/community-meeting.webp"
      />

      {/* Sticky sub-nav */}
      <nav
        aria-label={en ? "On this page" : "এই পাতায়"}
        className="sticky top-15 z-30 border-b border-stone-200 bg-white/95 backdrop-blur lg:top-18"
      >
        <div className="container-page">
          <ul className="no-scrollbar flex gap-1 overflow-x-auto py-2">
            {anchors.map((anchor) => (
              <li key={anchor.id}>
                <a
                  href={`#${anchor.id}`}
                  className="block rounded-md px-3 py-2 font-display text-sm font-semibold whitespace-nowrap text-stone-600 transition-colors hover:bg-stone-100 hover:text-brand-strong"
                >
                  {t(anchor.label, locale)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Who we are */}
      <Section tone="surface" id="who-we-are">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow">{en ? "Who we are" : "আমরা কারা"}</p>
              <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-stone-900 lg:text-4xl">
                {en
                  ? "We turn rural homes into micro-enterprises"
                  : "আমরা গ্রামীণ ঘরকে ক্ষুদ্র উদ্যোগে রূপান্তর করি"}
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-stone-700 lg:text-base">
                <p>
                  {en
                    ? "DigiGram Ventures is a for-profit impact enterprise. We work with rural households that already produce something — cattle, crops, craft — and are held back not by capability but by four missing pieces: capital they can access, inputs they can trust, knowledge that reaches them, and a buyer who pays a fair price."
                    : "ডিজিগ্রাম ভেঞ্চারস একটি মুনাফাভিত্তিক ইমপ্যাক্ট প্রতিষ্ঠান। আমরা এমন গ্রামীণ পরিবারের সঙ্গে কাজ করি যারা ইতিমধ্যে কিছু উৎপাদন করছেন — গবাদি পশু, ফসল, হস্তশিল্প — এবং যাদের আটকে রেখেছে সক্ষমতার অভাব নয়, বরং চারটি অনুপস্থিত উপাদান: নাগালের মধ্যে পুঁজি, নির্ভরযোগ্য উপকরণ, তাঁদের কাছে পৌঁছানো জ্ঞান, এবং ন্যায্য দাম দেওয়া ক্রেতা।"}
                </p>
                <p>
                  {en
                    ? "We do not describe this as charity, and we do not frame the people we work with as beneficiaries. They are Shathi — companions. The model is commercial on both sides: investors receive a return, farmers keep up to half the profit, and the enterprise sustains itself."
                    : "আমরা একে দাতব্য বলি না, আর যাদের সঙ্গে কাজ করি তাঁদের সুবিধাভোগী হিসেবেও উপস্থাপন করি না। তাঁরা সাথী — সহযাত্রী। মডেলটি উভয় দিক থেকেই বাণিজ্যিক: বিনিয়োগকারী রিটার্ন পান, কৃষক মুনাফার অর্ধেক পর্যন্ত রাখেন, আর প্রতিষ্ঠান নিজের খরচ নিজেই চালায়।"}
                </p>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-stone-200 pt-7 sm:grid-cols-3">
                {headlineStats.slice(0, 3).map((stat) => (
                  <StatBlock
                    key={stat.label.en}
                    size="sm"
                    value={t(stat.value, locale)}
                    label={t(stat.label, locale)}
                  />
                ))}
              </dl>
            </div>

            <Reveal>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/assets/photos/field-visit.webp"
                  alt={
                    en
                      ? "A DigiGram field team meeting with rural producers"
                      : "গ্রামীণ উৎপাদকদের সঙ্গে ডিজিগ্রামের মাঠ দলের বৈঠক"
                  }
                  width={900}
                  height={700}
                  className="h-auto w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* The problem */}
      <Section tone="page" id="problem">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "The problem" : "সমস্যা"}
            title={en ? "Three gaps we exist to close" : "যে তিন ফাঁক পূরণে আমাদের অস্তিত্ব"}
            lead={
              en
                ? "These are structural, not personal. No amount of individual effort closes them."
                : "এগুলো কাঠামোগত, ব্যক্তিগত নয়। ব্যক্তিগত চেষ্টায় এগুলো পূরণ হয় না।"
            }
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {problemCards.map((card, index) => (
              <Reveal key={card.title.en} delay={index * 70}>
                <Card className="flex h-full flex-col p-7">
                  <h3 className="font-display text-xl font-bold text-terracotta-700">
                    {t(card.title, locale)}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-stone-700">
                    {t(card.body, locale)}
                  </p>
                  <p className="mt-5 border-t border-stone-100 pt-4 text-xs text-stone-400">
                    {en ? "Source: " : "সূত্র: "}
                    {t(card.source, locale)}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Mission & vision */}
      <Section tone="tint" id="mission-vision">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow">{en ? "Mission" : "লক্ষ্য"}</p>
              <p className="mt-4 font-display text-2xl leading-snug font-semibold text-balance text-stone-900 lg:text-3xl">
                {en
                  ? "Empower rural communities through inclusive, sustainable and innovative solutions that foster economic independence and resilience."
                  : "অন্তর্ভুক্তিমূলক, টেকসই ও উদ্ভাবনী সমাধানের মাধ্যমে গ্রামীণ জনগোষ্ঠীকে ক্ষমতায়িত করা, যা অর্থনৈতিক স্বাধীনতা ও সহনশীলতা গড়ে তোলে।"}
              </p>
            </div>
            <div>
              <p className="eyebrow">{en ? "Vision" : "দৃষ্টিভঙ্গি"}</p>
              <p className="mt-4 font-display text-2xl leading-snug font-semibold text-balance text-stone-900 lg:text-3xl">
                {en
                  ? "Transform rural livelihoods through digital innovation, with a strong emphasis on gender and disability inclusivity."
                  : "ডিজিটাল উদ্ভাবনের মাধ্যমে গ্রামীণ জীবিকার রূপান্তর, লিঙ্গ ও প্রতিবন্ধিতা অন্তর্ভুক্তির ওপর জোরালো গুরুত্বসহ।"}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* How we work */}
      <Section tone="surface" id="how-we-work">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "How we work" : "আমরা যেভাবে কাজ করি"}
            title={en ? "The four-pillar model" : "চার-স্তম্ভ মডেল"}
            lead={
              en
                ? "Each pillar is a service we actually run, with a real example from the field."
                : "প্রতিটি স্তম্ভ আমাদের বাস্তবে পরিচালিত একটি সেবা, মাঠের প্রকৃত উদাহরণসহ।"
            }
          />
          <PillarGrid locale={locale} detailed />
        </div>
      </Section>

      {/* The family */}
      <Section tone="page" id="family">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "The DigiGram family" : "ডিজিগ্রাম পরিবার"}
            title={en ? "Who runs this" : "যাঁরা পরিচালনা করেন"}
            lead={
              en
                ? "A team with operating experience in supply chain, livestock and technology — not only in development programmes."
                : "সরবরাহ চেইন, পশুসম্পদ ও প্রযুক্তিতে বাস্তব অভিজ্ঞতাসম্পন্ন একটি দল — কেবল উন্নয়ন কর্মসূচিতে নয়।"
            }
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((member, index) => (
              <Reveal key={member.name.en} delay={index * 50}>
                <Card className="flex h-full flex-col p-6">
                  <div className="flex size-14 items-center justify-center rounded-full bg-brand-tint font-display text-lg font-bold text-brand-strong">
                    {t(member.name, "en")
                      .replace(/^(Md\.|AQM)\s*/i, "")
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-stone-900">
                    {t(member.name, locale)}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600">{t(member.role, locale)}</p>
                  {member.years && (
                    <p className="mt-3 text-xs text-stone-400">
                      {member.years} {en ? "experience" : "অভিজ্ঞতা"}
                    </p>
                  )}
                </Card>
              </Reveal>
            ))}
          </div>

          <h3 className="mt-14 font-display text-xl font-bold text-stone-900">
            {en ? "Advisors" : "উপদেষ্টা"}
          </h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {advisors.map((advisor) => (
              <Card key={advisor.name.en} className="flex items-start gap-4 p-6">
                <Icon name="star" size={20} className="mt-1 shrink-0 text-gold-600" />
                <div>
                  <p className="font-display text-[15px] font-bold text-stone-900">
                    {t(advisor.name, locale)}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">{t(advisor.role, locale)}</p>
                </div>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-xs text-stone-400">
            {en
              ? "Team portraits pending consistent-crop photography."
              : "দলের ছবি একই মাপে তোলা বাকি আছে।"}
          </p>
        </div>
      </Section>

      <PartnerBand locale={locale} />

      {/* Media & awards */}
      <Section tone="page" id="media">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Media & awards" : "মিডিয়া ও স্বীকৃতি"}
            title={en ? "Recognition" : "স্বীকৃতি"}
          />
          <Card className="mt-10 p-10 text-center">
            <Icon name="file-text" size={28} className="mx-auto text-stone-300" />
            <p className="mt-4 text-[15px] text-stone-600">
              {en
                ? "Confirmed press coverage and awards will be listed here with outlet, headline, date and an outbound link."
                : "নিশ্চিতকৃত সংবাদ প্রতিবেদন ও স্বীকৃতি এখানে থাকবে — প্রকাশনা, শিরোনাম, তারিখ ও লিংকসহ।"}
            </p>
            <p className="mt-2 text-xs text-stone-400">
              {en
                ? "Awaiting the client's confirmed and publishable list."
                : "প্রকাশযোগ্য নিশ্চিত তালিকার অপেক্ষায়।"}
            </p>
          </Card>
        </div>
      </Section>

      {/* Careers teaser */}
      <Section tone="surface" compact>
        <div className="container-page">
          <Card className="flex flex-col items-start justify-between gap-6 p-8 lg:flex-row lg:items-center lg:p-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-stone-900">
                {en ? "Work with us" : "আমাদের সঙ্গে কাজ করুন"}
              </h2>
              <p className="mt-2 max-w-xl text-[15px] text-stone-600">
                {en
                  ? "Field operations, supply chain, engineering and impact roles across Dhaka and Chattogram."
                  : "ঢাকা ও চট্টগ্রামজুড়ে মাঠ পরিচালনা, সরবরাহ চেইন, প্রকৌশল ও ইমপ্যাক্ট বিভাগে পদ।"}
              </p>
            </div>
            <ArrowLink href={localePath(locale, routes.careers)}>
              {en ? "See open roles" : "খোলা পদ দেখুন"}
            </ArrowLink>
          </Card>
        </div>
      </Section>

      <CtaBand locale={locale} />
    </>
  );
}
