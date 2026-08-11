import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Section, SectionHead } from "@/components/ui/Section";
import { Card, Badge, Note } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ShathiShebaLogo } from "@/components/brand/Logo";
import { RailsDiagram, ReadinessPathways } from "@/components/sections/Diagrams";
import { CtaBand } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { isLocale, localePath, t, type Bi, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";
import { ProductSignIn } from "@/components/auth/ProductSignIn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;

  return buildMetadata({
    locale,
    path: routes.shathiSheba,
    title:
      locale === "en"
        ? "Shathi Sheba — a digital operating system for rural enterprises"
        : "সাথী সেবা — গ্রামীণ উদ্যোগের ডিজিটাল অপারেটিং সিস্টেম",
    description:
      locale === "en"
        ? "Shathi Sheba turns fragmented farmer information into a verified enterprise profile: digital onboarding, apply for finance, buy & sell marketplace, advisory and climate — feeding one Rural Enterprise Passport."
        : "সাথী সেবা ছড়িয়ে-ছিটিয়ে থাকা কৃষক তথ্যকে একটি যাচাইকৃত উদ্যোগ প্রোফাইলে রূপ দেয়: ডিজিটাল নিবন্ধন, অর্থায়নের আবেদন, কেনাবেচার মার্কেটপ্লেস, পরামর্শ ও আবহাওয়া — সবই একটি রুরাল এন্টারপ্রাইজ পাসপোর্টে।",
    image: "/assets/app/sheba/home.png",
  });
}

export default async function ShathiShebaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const gaps: { title: Bi; body: Bi; icon: IconName }[] = [
    {
      icon: "wallet",
      title: { en: "Finance gap", bn: "অর্থায়ন ব্যবধান" },
      body: {
        en: "Low formal credit access and heavy dependence on informal loans. Only about 15% of rural households reach a bank or MFI.",
        bn: "আনুষ্ঠানিক ঋণে সীমিত প্রবেশাধিকার এবং অনানুষ্ঠানিক ঋণের ওপর ব্যাপক নির্ভরতা। গ্রামীণ পরিবারের মাত্র ১৫% ব্যাংক বা এমএফআই পর্যন্ত পৌঁছান।",
      },
    },
    {
      icon: "store",
      title: { en: "Market gap", bn: "বাজার ব্যবধান" },
      body: {
        en: "Price loss and weak bargaining power from fragmented buyer access — up to 30% of achievable price.",
        bn: "ছড়িয়ে থাকা ক্রেতা-সম্পর্কের কারণে দাম হারানো ও দুর্বল দর-কষাকষির ক্ষমতা — অর্জনযোগ্য দামের ৩০% পর্যন্ত।",
      },
    },
    {
      icon: "message-circle",
      title: { en: "Information gap", bn: "তথ্য ব্যবধান" },
      body: {
        en: "Limited access to advisory, climate alerts and business guidance — 10–15% of rural women reach extension services against 50%+ of men.",
        bn: "পরামর্শ, আবহাওয়া সতর্কতা ও ব্যবসায়িক নির্দেশনায় সীমিত প্রবেশাধিকার — গ্রামীণ নারীদের ১০–১৫% সম্প্রসারণ সেবা পান, পুরুষদের ৫০%-এর বেশি।",
      },
    },
  ];

  const journey: Bi[] = [
    { en: "Select purpose — general loan or project-linked", bn: "উদ্দেশ্য বাছুন — সাধারণ ঋণ বা প্রকল্প-সংযুক্ত" },
    { en: "Consent + KYC — NID, phone, location, documents", bn: "সম্মতি ও কেওয়াইসি — এনআইডি, ফোন, অবস্থান, নথি" },
    { en: "Enterprise profile — farm, cattle, crops, assets", bn: "উদ্যোগ প্রোফাইল — খামার, গবাদি পশু, ফসল, সম্পদ" },
    { en: "Data capture — cash flow, debt, production, market", bn: "তথ্য সংগ্রহ — নগদ প্রবাহ, ঋণ, উৎপাদন, বাজার" },
    { en: "mPowerU behavioural assessment", bn: "এমপাওয়ারইউ আচরণগত মূল্যায়ন" },
    { en: "Verify — cooperative and field-officer checks", bn: "যাচাই — সমবায় ও মাঠ কর্মকর্তার পরীক্ষা" },
    { en: "Score — risk grade, readiness, confidence", bn: "স্কোর — ঝুঁকি গ্রেড, প্রস্তুতি, নির্ভরযোগ্যতা" },
    { en: "Route — bank, MFI, project, advisory or decline", bn: "নির্দেশনা — ব্যাংক, এমএফআই, প্রকল্প, পরামর্শ বা প্রত্যাখ্যান" },
  ];

  const rails: { title: Bi; body: Bi; image: string; alt: Bi }[] = [
    {
      title: { en: "Supply — buy from Shathi", bn: "সরবরাহ — সাথী থেকে কিনুন" },
      body: {
        en: "A verified catalogue of feed, seed, fertiliser, medicine and tools at fixed, published prices. Orders aggregate at cooperative level so a delivery does not depend on the farmer travelling to a market — and every purchase becomes input-behaviour evidence on the profile.",
        bn: "খাদ্য, বীজ, সার, ওষুধ ও যন্ত্রপাতির একটি যাচাইকৃত তালিকা, নির্দিষ্ট ও প্রকাশিত দামে। অর্ডার সমবায় পর্যায়ে একত্র হয়, ফলে সরবরাহের জন্য কৃষককে বাজারে যেতে হয় না — আর প্রতিটি ক্রয় প্রোফাইলে উপকরণ ব্যবহারের প্রমাণ হয়ে ওঠে।",
      },
      image: "/assets/app/sheba/buy-1.png",
      alt: { en: "Buy catalogue in the Shathi Sheba app", bn: "সাথী সেবা অ্যাপে ক্রয় তালিকা" },
    },
    {
      title: { en: "Grow — advisory, climate and training", bn: "প্রবৃদ্ধি — পরামর্শ, আবহাওয়া ও প্রশিক্ষণ" },
      body: {
        en: "Free content for livestock, crop, business and financial literacy; project-specific SOP tasks; live weather and climate-smart advisories; and quizzes whose completion updates finance readiness. Development is recorded as evidence, not filed as a separate training activity.",
        bn: "পশুসম্পদ, ফসল, ব্যবসা ও আর্থিক সাক্ষরতার বিনামূল্যের কনটেন্ট; প্রকল্পভিত্তিক এসওপি কাজ; সরাসরি আবহাওয়া ও জলবায়ু-সহনশীল পরামর্শ; এবং কুইজ, যার সম্পন্নতা অর্থায়ন প্রস্তুতি হালনাগাদ করে। উন্নয়ন নথিভুক্ত হয় প্রমাণ হিসেবে, আলাদা প্রশিক্ষণ কার্যক্রম হিসেবে নয়।",
      },
      image: "/assets/app/sheba/learning-1.png",
      alt: { en: "Training modules in the Shathi Sheba app", bn: "সাথী সেবা অ্যাপে প্রশিক্ষণ মডিউল" },
    },
    {
      title: { en: "Sell — list, price, settle", bn: "বিক্রয় — তালিকাভুক্তি, দাম, নিষ্পত্তি" },
      body: {
        en: "List cattle, crops or rural enterprise products and see the price broken down before committing: B2B market rate, minus platform fee, logistics, warehouse and vet care, equals the net farmer rate. Sales and settlement history then feed back into finance readiness.",
        bn: "গবাদি পশু, ফসল বা গ্রামীণ উদ্যোগের পণ্য তালিকাভুক্ত করুন এবং সম্মতির আগেই দামের বিশ্লেষণ দেখুন: বিটুবি বাজারদর, বাদ প্ল্যাটফর্ম ফি, পরিবহন, গুদাম ও পশুচিকিৎসা — সমান নিট কৃষক দর। এরপর বিক্রয় ও নিষ্পত্তির ইতিহাস অর্থায়ন প্রস্তুতিতে ফিরে আসে।",
      },
      image: "/assets/app/sheba/sale-price.png",
      alt: { en: "Price and earnings breakdown in the app", bn: "অ্যাপে দাম ও আয়ের বিশ্লেষণ" },
    },
  ];

  const roles: { who: Bi; does: Bi }[] = [
    {
      who: { en: "Farmer / entrepreneur", bn: "কৃষক / উদ্যোক্তা" },
      does: {
        en: "Applies, submits data, completes training and uses services",
        bn: "আবেদন করেন, তথ্য দেন, প্রশিক্ষণ সম্পন্ন করেন ও সেবা ব্যবহার করেন",
      },
    },
    {
      who: { en: "Cooperative / field officer", bn: "সমবায় / মাঠ কর্মকর্তা" },
      does: {
        en: "Assists onboarding, verifies the profile and monitors activity",
        bn: "নিবন্ধনে সহায়তা করেন, প্রোফাইল যাচাই করেন ও কার্যক্রম তদারকি করেন",
      },
    },
    {
      who: { en: "DigiGram platform", bn: "ডিজিগ্রাম প্ল্যাটফর্ম" },
      does: {
        en: "Maintains the workflow, score engine, dashboards and audit trail",
        bn: "কর্মপ্রবাহ, স্কোর ইঞ্জিন, ড্যাশবোর্ড ও নিরীক্ষা নথি রক্ষণাবেক্ষণ করে",
      },
    },
    {
      who: { en: "EcoDev / mPowerU", bn: "ইকোডেভ / এমপাওয়ারইউ" },
      does: {
        en: "Provides the behavioural assessment engine and model-output support",
        bn: "আচরণগত মূল্যায়ন ইঞ্জিন ও মডেল-আউটপুট সহায়তা দেয়",
      },
    },
    {
      who: { en: "Bank / MFI / partner", bn: "ব্যাংক / এমএফআই / অংশীদার" },
      does: {
        en: "Reviews the decision-support pack and makes the final credit decision",
        bn: "সিদ্ধান্ত-সহায়তা প্যাক পর্যালোচনা করে চূড়ান্ত ঋণ সিদ্ধান্ত নেয়",
      },
    },
    {
      who: { en: "B2B buyer / supplier", bn: "বিটুবি ক্রেতা / সরবরাহকারী" },
      does: {
        en: "Provides demand, input supply and transaction evidence",
        bn: "চাহিদা, উপকরণ সরবরাহ ও লেনদেনের প্রমাণ দেয়",
      },
    },
  ];

  return (
    <div data-brand="shathi-sheba">
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: en ? "Home" : "হোম", path: routes.home },
            { name: en ? "Products" : "পণ্য ও সেবা", path: routes.products },
            { name: "Shathi Sheba", path: routes.shathiSheba },
          ],
          locale,
        )}
      />

      {/* Wine hero */}
      <section className="relative isolate overflow-hidden bg-brand-deep">
        <div className="relative container-page grid items-center gap-12 pt-32 pb-16 lg:grid-cols-12 lg:pt-44 lg:pb-24">
          <div className="lg:col-span-7">
            <div>
              <ShathiShebaLogo invert locale={locale} />
            </div>
            <div className="mt-5">
              <Badge tone="accent">
                {en ? "MVP · Launching 2026" : "এমভিপি · ২০২৬-এ চালু"}
              </Badge>
            </div>
            <h1 className="mt-5 font-display text-4xl leading-tight font-extrabold tracking-tight text-balance text-white lg:text-6xl">
              {en
                ? "A digital operating system for finance-ready, market-ready rural enterprises"
                : "অর্থায়ন-প্রস্তুত ও বাজার-প্রস্তুত গ্রামীণ উদ্যোগের ডিজিটাল অপারেটিং সিস্টেম"}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              {en
                ? "Smallholder farmers and rural entrepreneurs are commercially invisible to lenders, buyers and input suppliers. Shathi Sheba turns fragmented farmer information into a verified, reusable enterprise profile."
                : "ক্ষুদ্র কৃষক ও গ্রামীণ উদ্যোক্তারা ঋণদাতা, ক্রেতা ও উপকরণ সরবরাহকারীর কাছে বাণিজ্যিকভাবে অদৃশ্য। সাথী সেবা ছড়িয়ে-ছিটিয়ে থাকা কৃষক তথ্যকে একটি যাচাইকৃত, পুনঃব্যবহারযোগ্য উদ্যোগ প্রোফাইলে রূপ দেয়।"}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#partners" variant="inverse" size="lg" icon="arrow-right">
                {en ? "Partner with us" : "অংশীদার হোন"}
              </ButtonLink>
              <ButtonLink
                href="#rails"
                variant="secondary"
                size="lg"
                className="border-white/40 text-white hover:border-white/70 hover:bg-white/10"
              >
                {en ? "See the product" : "পণ্যটি দেখুন"}
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="mx-auto w-full max-w-[17rem] overflow-hidden rounded-[2rem] ring-8 ring-white/10">
              <Image
                src="/assets/app/sheba/home.png"
                alt={en ? "The Shathi Sheba app home screen" : "সাথী সেবা অ্যাপের হোম স্ক্রিন"}
                width={1080}
                height={2340}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <Section tone="canvas">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Why Shathi Sheba" : "কেন সাথী সেবা"}
            title={en ? "Three gaps that compound" : "যে তিন ফাঁক একে অপরকে বাড়ায়"}
            lead={
              en
                ? "Each gap makes the others worse. No finance means no quality inputs; no inputs means weak output; weak output means no buyer will commit."
                : "প্রতিটি ফাঁক অন্যগুলোকে আরও গভীর করে। অর্থায়ন নেই মানে মানসম্পন্ন উপকরণ নেই; উপকরণ নেই মানে দুর্বল উৎপাদন; দুর্বল উৎপাদন মানে কোনো ক্রেতা প্রতিশ্রুতি দেবেন না।"
            }
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {gaps.map((gap, index) => (
              <Reveal key={gap.title.en} delay={index * 60}>
                <Card className="flex h-full flex-col p-7">
                  <span className="flex size-11 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                    <Icon name={gap.icon} size={22} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-stone-900">
                    {t(gap.title, locale)}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                    {t(gap.body, locale)}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Architecture */}
      <Section tone="surface" id="rails">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Product architecture" : "পণ্য কাঠামো"}
            title={en ? "One app, four service rails" : "একটি অ্যাপ, চারটি সেবা রেল"}
            lead={
              en
                ? "Farmer-facing app + field workflow + institutional dashboard + shared backend."
                : "কৃষক-মুখী অ্যাপ + মাঠ কর্মপ্রবাহ + প্রাতিষ্ঠানিক ড্যাশবোর্ড + অভিন্ন ব্যাকএন্ড।"
            }
          />
          <RailsDiagram locale={locale} />
        </div>
      </Section>

      {/* Fund rail */}
      <Section tone="canvas">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Fund rail" : "ফান্ড রেল"}
            title={
              en ? "Finance readiness, not just loan referral" : "শুধু ঋণে পাঠানো নয়, অর্থায়ন প্রস্তুতি"
            }
            lead={
              en
                ? "The product converts applications into structured, verifiable decision-support packages for lenders and projects."
                : "এই পণ্য আবেদনকে ঋণদাতা ও প্রকল্পের জন্য কাঠামোবদ্ধ, যাচাইযোগ্য সিদ্ধান্ত-সহায়তা প্যাকে রূপান্তর করে।"
            }
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: { en: "Profile", bn: "প্রোফাইল" },
                b: { en: "KYC, household, farm, business and cooperative link", bn: "কেওয়াইসি, পরিবার, খামার, ব্যবসা ও সমবায় সংযোগ" },
              },
              {
                t: { en: "Assess", bn: "মূল্যায়ন" },
                b: {
                  en: "Cash flow, existing debt, production capacity and behavioural indicators",
                  bn: "নগদ প্রবাহ, বিদ্যমান ঋণ, উৎপাদন সক্ষমতা ও আচরণগত সূচক",
                },
              },
              {
                t: { en: "Verify", bn: "যাচাই" },
                b: {
                  en: "Field and cooperative validation, documents and data-confidence checks",
                  bn: "মাঠ ও সমবায় যাচাই, নথি ও তথ্য-নির্ভরযোগ্যতা পরীক্ষা",
                },
              },
              {
                t: { en: "Recommend", bn: "সুপারিশ" },
                b: {
                  en: "Risk grade, readiness status, pathway and lender/project packet",
                  bn: "ঝুঁকি গ্রেড, প্রস্তুতির অবস্থা, পথ ও ঋণদাতা/প্রকল্প প্যাকেট",
                },
              },
            ].map((step, index) => (
              <Card key={step.t.en} className="p-6">
                <span className="font-mono text-xs font-bold text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-stone-900">
                  {t(step.t, locale)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{t(step.b, locale)}</p>
              </Card>
            ))}
          </div>

          <h3 className="mt-14 font-display text-xl font-bold text-stone-900">
            {en ? "The apply-for-funds journey" : "অর্থায়নের আবেদন যাত্রা"}
          </h3>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {journey.map((step, index) => (
              <li key={step.en} className="flex gap-3 rounded-md bg-white p-4 ring-1 ring-brand-line">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-tint font-mono text-xs font-bold text-brand-strong">
                  {index + 1}
                </span>
                <span className="text-sm leading-snug text-stone-700">{t(step, locale)}</span>
              </li>
            ))}
          </ol>

          <Note tone="warn" icon="shield" className="mt-8">
            {en
              ? "The process produces a decision-support pack. The lender remains the final approval authority."
              : "এই প্রক্রিয়া একটি সিদ্ধান্ত-সহায়তা প্যাক তৈরি করে। চূড়ান্ত অনুমোদনের কর্তৃত্ব ঋণদাতারই থাকে।"}
          </Note>

          <h3 className="mt-14 font-display text-xl font-bold text-stone-900">
            {en
              ? "Every application ends with a next step"
              : "প্রতিটি আবেদন শেষ হয় একটি পরবর্তী পদক্ষেপে"}
          </h3>
          <p className="mt-2 max-w-2xl text-[15px] text-stone-600">
            {en
              ? "Assess → explain → develop → reassess → connect. The system develops applicants instead of only rejecting them."
              : "মূল্যায়ন → ব্যাখ্যা → উন্নয়ন → পুনর্মূল্যায়ন → সংযোগ। ব্যবস্থাটি কেবল প্রত্যাখ্যান করে না, আবেদনকারীর সক্ষমতা গড়ে তোলে।"}
          </p>
          <ReadinessPathways locale={locale} />
        </div>
      </Section>

      {/* Supply / Grow / Sell rails */}
      <Section tone="surface">
        <div className="container-page">
          <div className="space-y-16 lg:space-y-24">
            {rails.map((rail, index) => (
              <Reveal key={rail.title.en}>
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                  <div className={index % 2 === 1 ? "lg:order-2 lg:col-span-7" : "lg:col-span-7"}>
                    <h3 className="font-display text-2xl leading-tight font-bold text-stone-900 lg:text-3xl">
                      {t(rail.title, locale)}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-stone-700 lg:text-base">
                      {t(rail.body, locale)}
                    </p>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1 lg:col-span-5" : "lg:col-span-5"}>
                    <div className="mx-auto w-full max-w-[15rem] overflow-hidden rounded-[1.75rem] ring-8 ring-brand-tint">
                      <Image
                        src={rail.image}
                        alt={t(rail.alt, locale)}
                        width={1080}
                        height={2340}
                        className="h-auto w-full"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Operating model */}
      <Section tone="canvas">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Operating model" : "পরিচালন মডেল"}
            title={en ? "Who does what" : "কে কী করে"}
            lead={
              en
                ? "The product requires clear role separation between data collection, verification, scoring, approval and market operations."
                : "তথ্য সংগ্রহ, যাচাই, স্কোরিং, অনুমোদন ও বাজার পরিচালনার মধ্যে স্পষ্ট ভূমিকা বিভাজন এই পণ্যের পূর্বশর্ত।"
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.who.en} className="p-6">
                <h3 className="font-display text-[15px] font-bold text-brand-strong">
                  {t(role.who, locale)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{t(role.does, locale)}</p>
              </Card>
            ))}
          </div>

          {/* Compliance-relevant statement — must appear on this page. */}
          <div className="mt-8 rounded-lg border-2 border-brand bg-white p-6">
            <p className="flex items-start gap-3 font-display text-[15px] leading-relaxed font-semibold text-stone-900 lg:text-base">
              <Icon name="shield" size={22} className="mt-0.5 shrink-0 text-brand" />
              {en
                ? "Shathi Sheba provides decision support; licensed lenders retain approval authority."
                : "সাথী সেবা সিদ্ধান্ত-সহায়তা প্রদান করে; অনুমোদনের কর্তৃত্ব লাইসেন্সপ্রাপ্ত ঋণদাতার হাতেই থাকে।"}
            </p>
          </div>
        </div>
      </Section>

      {/* Partners */}
      <Section tone="surface" id="partners">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "For partners" : "অংশীদারদের জন্য"}
            title={en ? "Work with Shathi Sheba" : "সাথী সেবার সঙ্গে কাজ করুন"}
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              {
                icon: "building" as IconName,
                title: { en: "Banks & MFIs", bn: "ব্যাংক ও এমএফআই" },
                body: {
                  en: "Lower acquisition and verification cost, thin-file visibility, structured applications with reason codes, and post-disbursement performance data.",
                  bn: "কম অধিগ্রহণ ও যাচাই ব্যয়, স্বল্প-তথ্য গ্রাহকের দৃশ্যমানতা, কারণসহ কাঠামোবদ্ধ আবেদন, এবং বিতরণ-পরবর্তী কর্মক্ষমতার তথ্য।",
                },
              },
              {
                icon: "truck" as IconName,
                title: { en: "B2B buyers & suppliers", bn: "বিটুবি ক্রেতা ও সরবরাহকারী" },
                body: {
                  en: "A verified supplier pipeline with production visibility, traceability to the producer, and a delivery performance record.",
                  bn: "উৎপাদন দৃশ্যমানতা, উৎপাদক পর্যন্ত অনুসরণযোগ্যতা ও সরবরাহ কর্মক্ষমতার নথিসহ যাচাইকৃত সরবরাহ পাইপলাইন।",
                },
              },
              {
                icon: "users" as IconName,
                title: { en: "Cooperatives & NGOs", bn: "সমবায় ও এনজিও" },
                body: {
                  en: "Member onboarding, a validation workflow, service-centre operations and a portfolio dashboard for your own membership.",
                  bn: "সদস্য নিবন্ধন, যাচাই কর্মপ্রবাহ, সেবা কেন্দ্র পরিচালনা এবং আপনার সদস্যদের জন্য পোর্টফোলিও ড্যাশবোর্ড।",
                },
              },
            ].map((partner) => (
              <Card key={partner.title.en} className="flex h-full flex-col p-7">
                <span className="flex size-11 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                  <Icon name={partner.icon} size={22} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-stone-900">
                  {t(partner.title, locale)}
                </h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-stone-600">
                  {t(partner.body, locale)}
                </p>
                <ButtonLink
                  href={`${localePath(locale, routes.contact)}?topic=partner`}
                  variant="secondary"
                  className="mt-6"
                  icon="arrow-right"
                >
                  {en ? "Start a conversation" : "আলোচনা শুরু করুন"}
                </ButtonLink>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <ProductSignIn locale={locale} product="sheba" />

      <CtaBand
        locale={locale}
        title={en ? "MVP 2026 — join the pilot" : "এমভিপি ২০২৬ — পাইলটে যোগ দিন"}
        lead={
          en
            ? "We are selecting pilot cohorts of farmers, entrepreneurs and cooperatives now."
            : "আমরা এখন কৃষক, উদ্যোক্তা ও সমবায়ের পাইলট দল নির্বাচন করছি।"
        }
        primary={{ href: routes.contact, label: en ? "Talk to the team" : "দলের সঙ্গে কথা বলুন" }}
        secondary={{ href: routes.products, label: en ? "All products" : "সব পণ্য" }}
      />
    </div>
  );
}
