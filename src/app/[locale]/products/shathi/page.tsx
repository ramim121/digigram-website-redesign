import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Section, SectionHead } from "@/components/ui/Section";
import { Card, Note } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ShathiLogo } from "@/components/brand/Logo";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ScrollCarousel } from "@/components/sections/Carousels";
import { CtaBand, ViewAllLink } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchProjects } from "@/lib/projects.server";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { isLocale, localePath, t, type Bi, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";
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
    path: routes.shathi,
    title: locale === "en" ? "Shathi — investment with impact" : "সাথী — প্রভাবসহ বিনিয়োগ",
    description:
      locale === "en"
        ? "Shathi connects urban impact investors with rural producers in Bangladesh. Fund a contract-farming cycle; the farmer gets finance, inputs, training and a buyer, and keeps up to 50% of the profit."
        : "সাথী শহুরে ইমপ্যাক্ট বিনিয়োগকারীদের বাংলাদেশের গ্রামীণ উৎপাদকের সঙ্গে যুক্ত করে। একটি চুক্তিভিত্তিক চাষ চক্রে অর্থায়ন করুন; কৃষক পান অর্থ, উপকরণ, প্রশিক্ষণ ও ক্রেতা, আর রাখেন মুনাফার ৫০% পর্যন্ত।",
    image: "/assets/app/shathi-mockup-1.webp",
  });
}

export default async function ShathiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const { data: projects } = await fetchProjects({ status: "open", limit: 6 });

  const values: { title: Bi; body: Bi; icon: IconName }[] = [
    {
      icon: "sprout",
      title: { en: "Inclusive innovation", bn: "অন্তর্ভুক্তিমূলক উদ্ভাবন" },
      body: {
        en: "Gender and disability inclusion designed into the journey — 70% of participants are women, 15% are persons with disabilities.",
        bn: "লিঙ্গ ও প্রতিবন্ধিতা অন্তর্ভুক্তি প্রক্রিয়ার নকশাতেই — অংশগ্রহণকারীদের ৭০% নারী, ১৫% প্রতিবন্ধী ব্যক্তি।",
      },
    },
    {
      icon: "leaf",
      title: { en: "Sustainable livelihoods", bn: "টেকসই জীবিকা" },
      body: {
        en: "Eco-friendly practice, sustainable agriculture and craft that a household can keep running after the cycle ends.",
        bn: "পরিবেশবান্ধব চর্চা, টেকসই কৃষি ও হস্তশিল্প — যা চক্র শেষেও পরিবার চালিয়ে যেতে পারে।",
      },
    },
    {
      icon: "users",
      title: { en: "Empowering communities", bn: "জনপদের ক্ষমতায়ন" },
      body: {
        en: "Capital, markets and tailored training reach the producer through one accountable channel, not five intermediaries.",
        bn: "পুঁজি, বাজার ও উপযোগী প্রশিক্ষণ উৎপাদকের কাছে পৌঁছায় একটি জবাবদিহিমূলক পথে, পাঁচটি মধ্যস্বত্বভোগীর মাধ্যমে নয়।",
      },
    },
    {
      icon: "layers",
      title: { en: "Digital innovation", bn: "ডিজিটাল উদ্ভাবন" },
      body: {
        en: "Producers manage operations on a phone; investors see project monitoring and reporting in the same app.",
        bn: "উৎপাদক ফোনেই কার্যক্রম পরিচালনা করেন; বিনিয়োগকারী একই অ্যাপে প্রকল্প তদারকি ও প্রতিবেদন দেখেন।",
      },
    },
    {
      icon: "shield",
      title: { en: "Environmental sustainability", bn: "পরিবেশগত টেকসইতা" },
      body: {
        en: "Zero-waste input distribution, reduced single-use plastic, and production standards that protect the land being farmed.",
        bn: "শূন্য-অপচয় উপকরণ বিতরণ, এককবার ব্যবহার্য প্লাস্টিক হ্রাস, এবং চাষের জমি রক্ষাকারী উৎপাদন মান।",
      },
    },
  ];

  const cycle: Bi[] = [
    { en: "Inclusive project design & market creation", bn: "অন্তর্ভুক্তিমূলক প্রকল্প নকশা ও বাজার সৃষ্টি" },
    { en: "Partnership with rural producers (Shathi)", bn: "গ্রামীণ উৎপাদকের (সাথী) সঙ্গে অংশীদারিত্ব" },
    { en: "Investors fund the cycle", bn: "বিনিয়োগকারীরা চক্রে অর্থায়ন করেন" },
    { en: "Purchase & zero-waste input distribution", bn: "ক্রয় ও শূন্য-অপচয় উপকরণ বিতরণ" },
    { en: "Shathi manages the project", bn: "সাথী প্রকল্প পরিচালনা করেন" },
    { en: "Input tracking & quality control", bn: "উপকরণ ট্র্যাকিং ও মান নিয়ন্ত্রণ" },
    { en: "Output sale — local market and B2B", bn: "উৎপাদন বিক্রয় — স্থানীয় বাজার ও বিটুবি" },
    { en: "Investor return, then profit share to Shathi", bn: "বিনিয়োগকারীর রিটার্ন, এরপর সাথীর মুনাফা ভাগ" },
  ];

  return (
    <div data-brand="shathi">
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: en ? "Home" : "হোম", path: routes.home },
            { name: en ? "Products" : "পণ্য ও সেবা", path: routes.products },
            { name: "Shathi", path: routes.shathi },
          ],
          locale,
        )}
      />

      {/* Purple hero */}
      <section className="relative isolate overflow-hidden bg-brand-deep">
        <div className="relative container-page grid items-center gap-12 pt-32 pb-16 lg:grid-cols-2 lg:pt-44 lg:pb-24">
          <div>
            <ShathiLogo variant="white" className="h-8 w-auto" />
            <h1 className="mt-7 font-display text-4xl leading-tight font-extrabold tracking-tight text-balance text-white lg:text-6xl">
              {en ? "Discover investment with impact" : "প্রভাবসহ বিনিয়োগ আবিষ্কার করুন"}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              {en
                ? "Shathi means companion. Urban investors fund a rural production cycle; the producer gets finance, inputs, training and a buyer, and keeps up to half the profit."
                : "সাথী মানে সহযাত্রী। শহুরে বিনিয়োগকারীরা একটি গ্রামীণ উৎপাদন চক্রে অর্থায়ন করেন; উৎপাদক পান অর্থ, উপকরণ, প্রশিক্ষণ ও ক্রেতা, আর রাখেন মুনাফার অর্ধেক পর্যন্ত।"}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={localePath(locale, routes.projects)}
                variant="inverse"
                size="lg"
                icon="arrow-right"
              >
                {en ? "Explore projects" : "প্রকল্প দেখুন"}
              </ButtonLink>
              <ButtonLink
                href={site.app.playStore}
                external
                variant="secondary"
                size="lg"
                icon="download"
                iconPosition="left"
                className="border-white/40 text-white hover:border-white/70 hover:bg-white/10"
              >
                {en ? "Get the app" : "অ্যাপ নিন"}
              </ButtonLink>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <Image
              src="/assets/app/shathi-mockup-4.webp"
              alt={en ? "The Shathi app on two phones" : "দুটি ফোনে সাথী অ্যাপ"}
              width={1000}
              height={870}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Why invest */}
      <Section tone="canvas">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Why invest in Shathi" : "কেন সাথীতে বিনিয়োগ"}
            title={en ? "Purpose and return, not one or the other" : "উদ্দেশ্য ও রিটার্ন — একটির বদলে অন্যটি নয়"}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <Reveal key={value.title.en} delay={index * 60}>
                <Card className="flex h-full flex-col p-7" interactive>
                  <span className="flex size-11 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                    <Icon name={value.icon} size={22} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-stone-900">
                    {t(value.title, locale)}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                    {t(value.body, locale)}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Live projects */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Live projects" : "চলমান প্রকল্প"}
            title={en ? "Open right now" : "এখনই খোলা"}
            action={<ViewAllLink locale={locale} href={routes.projects} />}
          />
          <div className="mt-12">
            <ScrollCarousel locale={locale} ariaLabel={en ? "Open projects" : "চলমান প্রকল্প"}>
              {projects.map((project) => (
                <div key={project.id} className="w-[19rem] shrink-0 snap-start sm:w-[21rem] lg:w-[22.5rem]">
                  <ProjectCard project={project} locale={locale} />
                </div>
              ))}
            </ScrollCarousel>
          </div>
        </div>
      </Section>

      {/* Contract farming cycle */}
      <Section tone="canvas">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "The cycle" : "চক্র"}
            title={en ? "Contract farming, stage by stage" : "চুক্তিভিত্তিক চাষ, ধাপে ধাপে"}
            lead={
              en
                ? "Eight stages, each with an owner and a record. The loop is what makes the next cycle cheaper to run and easier to finance."
                : "আটটি ধাপ, প্রতিটির একজন দায়িত্বশীল ও একটি নথি। এই চক্রই পরের চক্রকে সাশ্রয়ী ও অর্থায়নের জন্য সহজ করে তোলে।"
            }
          />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cycle.map((stage, index) => (
              <li key={stage.en} className="rounded-lg border border-brand-line bg-white p-6">
                <span className="font-mono text-xs font-bold text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-[15px] leading-snug font-semibold text-stone-800">
                  {t(stage, locale)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Returns & risk */}
      <Section tone="surface">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHead
                eyebrow={en ? "Returns & risk" : "রিটার্ন ও ঝুঁকি"}
                title={en ? "What can go wrong, and what we do about it" : "কী ভুল হতে পারে, আর আমরা কী করি"}
              />
              <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-stone-700">
                <p>
                  {en
                    ? "Return is generated by production, not by interest. That means it is exposed to production risk: disease and mortality in livestock, weather and pest pressure in crops, and price movement in the market at the point of sale."
                    : "রিটার্ন তৈরি হয় উৎপাদন থেকে, সুদ থেকে নয়। অর্থাৎ এটি উৎপাদন ঝুঁকির মুখোমুখি: পশুসম্পদে রোগ ও মৃত্যু, ফসলে আবহাওয়া ও পোকার চাপ, এবং বিক্রয়ের সময় বাজারদরের ওঠানামা।"}
                </p>
                <p>
                  {en
                    ? "If a cycle underperforms, the return lands below the estimated band. In a severe case — a disease outbreak or a total crop failure — capital can be lost. We do not offer a guarantee, and no honest agricultural platform can."
                    : "চক্র প্রত্যাশার নিচে গেলে রিটার্ন প্রাক্কলিত পরিসরের নিচে নামে। গুরুতর ক্ষেত্রে — রোগের প্রাদুর্ভাব বা সম্পূর্ণ ফসলহানি — পুঁজিও হারাতে পারে। আমরা কোনো নিশ্চয়তা দিই না, আর কোনো সৎ কৃষি প্ল্যাটফর্মই তা দিতে পারে না।"}
                </p>
              </div>

              <h3 className="mt-10 font-display text-xl font-bold text-stone-900">
                {en ? "How risk is reduced" : "ঝুঁকি যেভাবে কমানো হয়"}
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  {
                    en: "Graded, DLS-compliant inputs instead of whatever the local market has",
                    bn: "স্থানীয় বাজারে যা মেলে তার বদলে গ্রেডকৃত, ডিএলএস-অনুমোদিত উপকরণ",
                  },
                  {
                    en: "Veterinary and agronomy cover built into the project cost",
                    bn: "প্রকল্প ব্যয়ের মধ্যেই পশুচিকিৎসা ও কৃষি পরামর্শ",
                  },
                  {
                    en: "Weekly monitoring against a written project SOP",
                    bn: "লিখিত প্রকল্প এসওপির বিপরীতে সাপ্তাহিক তদারকি",
                  },
                  {
                    en: "Cooperative-level field verification of every recorded value",
                    bn: "প্রতিটি নথিভুক্ত তথ্যের সমবায় পর্যায়ে মাঠ যাচাই",
                  },
                  {
                    en: "B2B buyers arranged before the cycle closes, not on sale day",
                    bn: "বিক্রির দিন নয়, চক্র শেষের আগেই বিটুবি ক্রেতা নির্ধারণ",
                  },
                  {
                    en: "Diversification across cycles, species and districts",
                    bn: "চক্র, প্রজাতি ও জেলা জুড়ে বৈচিত্র্য",
                  },
                ].map((item) => (
                  <li key={item.en} className="flex gap-2.5 text-[15px] text-stone-700">
                    <Icon name="check-circle" size={18} className="mt-0.5 shrink-0 text-brand" />
                    {t(item, locale)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <Card className="p-7">
                <h3 className="font-display text-lg font-bold text-stone-900">
                  {en ? "Before you invest" : "বিনিয়োগের আগে"}
                </h3>
                <Accordion className="mt-3">
                  {[
                    {
                      q: { en: "Is this a loan?", bn: "এটি কি ঋণ?" },
                      a: {
                        en: "No. You are funding a production cycle and sharing in its outcome. There is no interest, and no fixed repayment obligation on the producer.",
                        bn: "না। আপনি একটি উৎপাদন চক্রে অর্থায়ন করছেন এবং এর ফলাফলে অংশ নিচ্ছেন। কোনো সুদ নেই, উৎপাদকের ওপর নির্দিষ্ট পরিশোধের বাধ্যবাধকতাও নেই।",
                      },
                    },
                    {
                      q: { en: "What is the minimum?", bn: "সর্বনিম্ন কত?" },
                      a: {
                        en: "It is set per project. Units currently range from ৳ 10,000 to ৳ 1,30,000.",
                        bn: "প্রকল্পভেদে নির্ধারিত। বর্তমানে ইউনিট মূল্য ৳ ১০,০০০ থেকে ৳ ১,৩০,০০০।",
                      },
                    },
                    {
                      q: { en: "How do I get paid?", bn: "আমি কীভাবে অর্থ পাব?" },
                      a: {
                        en: "At maturity, to your linked bank account or mobile wallet. You can also roll the return into the next cycle.",
                        bn: "মেয়াদপূর্তিতে, আপনার সংযুক্ত ব্যাংক হিসাব বা মোবাইল ওয়ালেটে। চাইলে রিটার্ন পরের চক্রে পুনর্বিনিয়োগও করতে পারেন।",
                      },
                    },
                  ].map((item) => (
                    <AccordionItem key={item.q.en} question={t(item.q, locale)} group="shathi-faq">
                      {t(item.a, locale)}
                    </AccordionItem>
                  ))}
                </Accordion>

                <Note tone="risk" icon="alert-triangle" className="mt-6">
                  {en
                    ? "Returns are estimated, not guaranteed. Capital is at risk. This page is not financial advice."
                    : "রিটার্ন প্রাক্কলিত, নিশ্চিত নয়। পুঁজি ঝুঁকিতে থাকে। এই পাতা কোনো আর্থিক পরামর্শ নয়।"}
                </Note>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* App band */}
      <Section tone="canvas">
        <div className="container-page">
          <div className="grid items-center gap-10 rounded-xl bg-white p-8 ring-1 ring-brand-line lg:grid-cols-2 lg:p-14">
            <div>
              <ShathiLogo className="h-7 w-auto" />
              <h2 className="mt-5 font-display text-3xl leading-tight font-bold tracking-tight text-stone-900 lg:text-4xl">
                {en ? "Everything, on the phone in your hand" : "সবকিছুই আপনার হাতের ফোনে"}
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-stone-600">
                {en
                  ? "Browse projects, fund a unit, follow milestones, read the monthly report and take your return — in English or Bangla."
                  : "প্রকল্প দেখুন, ইউনিট কিনুন, মাইলফলক অনুসরণ করুন, মাসিক প্রতিবেদন পড়ুন ও রিটার্ন নিন — বাংলা বা ইংরেজিতে।"}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href={site.app.playStore} external icon="download" iconPosition="left">
                  Google Play
                </ButtonLink>
                <ButtonLink
                  href={site.app.appStore}
                  external
                  variant="secondary"
                  icon="download"
                  iconPosition="left"
                >
                  App Store
                </ButtonLink>
              </div>
            </div>
            <Image
              src="/assets/app/shathi-mockup-2.webp"
              alt=""
              width={1000}
              height={870}
              className="h-auto w-full"
            />
          </div>
        </div>
      </Section>

      <ProductSignIn locale={locale} product="shathi" />

      <CtaBand
        locale={locale}
        title={en ? "Invest now, shape tomorrow." : "আজই বিনিয়োগ করুন, আগামী গড়ুন।"}
        primary={{ href: routes.projects, label: en ? "Explore projects" : "প্রকল্প দেখুন" }}
      />
    </div>
  );
}
