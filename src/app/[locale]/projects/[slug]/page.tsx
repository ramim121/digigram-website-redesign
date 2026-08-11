import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, SectionHead } from "@/components/ui/Section";
import { Badge, Card, Fact, Note, Progress } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ReturnCalculator } from "@/components/projects/ReturnCalculator";
import { ShareRow } from "@/components/projects/ShareRow";
import { InvestCta, MobileInvestBar, AppFallbackLink } from "@/components/projects/InvestCta";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  fundedPct,
  isInvestable,
  projectTypeLabel,
  statusLabel,
  statusTone,
} from "@/lib/projects";
import { allProjectSlugs, fetchProject, fetchRelated } from "@/lib/projects.server";
import { absolute, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import {
  formatBdt,
  formatDate,
  formatNumber,
  formatRange,
  isLocale,
  localePath,
  t,
  type Locale,
} from "@/lib/i18n";
import { routes } from "@/lib/site";

export async function generateStaticParams() {
  // Async because the slug list now comes from the API (with a seed fallback),
  // so build time reflects the real catalogue rather than fixture data.
  const slugs = await allProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  const project = await fetchProject(slug);
  if (!project) return {};

  const title = t(project.title, locale);
  const en = locale === "en";

  return buildMetadata({
    locale,
    path: routes.project(slug),
    title,
    description: en
      ? `${title} — ${t(project.location, locale)}. ${formatBdt(project.unitAmountBdt, locale, { variant: "data" })} per unit, ${project.tenureMonths} months, estimated ${formatRange(project.returnPct.min, project.returnPct.max, locale)} return. Capital at risk.`
      : `${title} — ${t(project.location, locale)}। প্রতি ইউনিট ${formatBdt(project.unitAmountBdt, locale, { variant: "data" })}, ${project.tenureMonths} মাস, প্রাক্কলিত রিটার্ন ${formatRange(project.returnPct.min, project.returnPct.max, locale)}। পুঁজি ঝুঁকিতে।`,
    image: project.coverImage,
    type: "article",
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const project = await fetchProject(slug);
  if (!project) notFound();

  const related = await fetchRelated(slug, 3);
  const soldOut = !isInvestable(project);
  const percent = fundedPct(project);
  const title = t(project.title, locale);
  const url = absolute(localePath(locale, routes.project(slug)));
  const tone = statusTone(project.status);

  return (
    <div data-brand="shathi" className="bg-brand-canvas pb-24 lg:pb-0">
      <JsonLd
        data={[
          breadcrumbSchema(
            [
              { name: en ? "Home" : "হোম", path: routes.home },
              { name: en ? "Projects" : "প্রকল্প", path: routes.projects },
              { name: title, path: routes.project(slug) },
            ],
            locale,
          ),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: title,
            image: absolute(project.coverImage),
            description: en
              ? `A ${project.tenureMonths}-month ${project.category} production cycle in ${t(project.location, "en")}.`
              : `${t(project.location, "bn")}-এ ${project.tenureMonths} মাসের একটি উৎপাদন চক্র।`,
            brand: { "@type": "Brand", name: "Shathi" },
            offers: {
              "@type": "Offer",
              price: project.unitAmountBdt,
              priceCurrency: "BDT",
              availability: soldOut
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
              url,
            },
          },
        ]}
      />

      {/* ── Above the fold ─────────────────────────────────────────────── */}
      <div className="bg-brand-deep pt-24 pb-32 lg:pt-32 lg:pb-40">
        <div className="container-page">
          <nav
            aria-label={en ? "Breadcrumb" : "ব্রেডক্রাম্ব"}
            className="flex flex-wrap items-center gap-1.5 font-display text-xs font-semibold tracking-widest text-white/60 uppercase"
          >
            <Link href={localePath(locale, routes.home)} className="hover:text-white">
              {en ? "Home" : "হোম"}
            </Link>
            <Icon name="chevron-right" size={13} className="opacity-50" />
            <Link href={localePath(locale, routes.projects)} className="hover:text-white">
              {en ? "Projects" : "প্রকল্প"}
            </Link>
            <Icon name="chevron-right" size={13} className="opacity-50" />
            <span className="text-white">{title}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge tone={tone === "open" ? "open" : tone === "warn" ? "warn" : "done"}>
              {t(statusLabel[project.status], locale)}
            </Badge>
            <Badge tone="brand" className="!border-white/25 !bg-white/10 !text-white">
              {t(projectTypeLabel[project.projectType], locale)}
            </Badge>
          </div>

          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight font-extrabold tracking-tight text-white lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-white/75">
            <Icon name="map-pin" size={18} />
            {t(project.location, locale)}
          </p>
        </div>
      </div>

      <div className="container-page -mt-24 lg:-mt-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProjectGallery images={project.gallery} title={title} locale={locale} />
          </div>

          {/* ── Sticky fact card ─────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <Card className="p-6 lg:p-7">
                <p className="text-sm text-stone-500">{en ? "Booking unit amount" : "বুকিং ইউনিট মূল্য"}</p>
                <p className="mt-1 font-display text-3xl font-extrabold text-brand tabular">
                  {formatBdt(project.unitAmountBdt, locale, { variant: "data" })}
                </p>

                <dl className="mt-5 divide-y divide-stone-100 border-y border-stone-100">
                  <Fact
                    icon="tag"
                    label={en ? "Project type" : "প্রকল্পের ধরন"}
                    value={t(projectTypeLabel[project.projectType], locale)}
                  />
                  <Fact
                    icon="calendar"
                    label={en ? "Tenure" : "মেয়াদ"}
                    value={`${formatNumber(project.tenureMonths, locale, "data")} ${en ? "months" : "মাস"}`}
                  />
                  <Fact
                    icon="trending-up"
                    label={en ? "Expected return" : "প্রত্যাশিত রিটার্ন"}
                    value={formatRange(project.returnPct.min, project.returnPct.max, locale)}
                    emphasis
                  />
                  <Fact
                    icon="wallet"
                    label={en ? "Return amount" : "রিটার্নের পরিমাণ"}
                    value={`${formatBdt(project.returnAmountBdt.min, locale, { variant: "data" })} – ${formatBdt(project.returnAmountBdt.max, locale, { variant: "data" })}`}
                  />
                  {/* A null date renders nothing at all — no empty label. */}
                  <Fact
                    icon="clock"
                    label={en ? "Collection starts" : "সংগ্রহ শুরু"}
                    value={formatDate(project.collectionStarts, locale)}
                  />
                  <Fact
                    icon="clock"
                    label={en ? "Collection ends" : "সংগ্রহ শেষ"}
                    value={formatDate(project.collectionEnds, locale)}
                  />
                  <Fact
                    icon="users"
                    label={en ? "Shathi partners" : "সাথী অংশীদার"}
                    value={formatNumber(project.partnersCount, locale, "data")}
                  />
                </dl>

                <div className="mt-5">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-stone-500">{en ? "Units taken" : "নেওয়া ইউনিট"}</span>
                    <span className="font-display font-bold text-stone-900 tabular">
                      {formatNumber(project.totalUnits - project.unitsRemaining, locale, "data")} /{" "}
                      {formatNumber(project.totalUnits, locale, "data")}
                    </span>
                  </div>
                  <Progress percent={percent} label={title} className="mt-2" />
                  <p className="mt-2 text-xs text-stone-500">
                    {project.unitsRemaining > 0
                      ? en
                        ? `${project.unitsRemaining} units remaining`
                        : `${project.unitsRemaining}টি ইউনিট বাকি`
                      : en
                        ? "All units taken"
                        : "সব ইউনিট নেওয়া হয়ে গেছে"}
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <InvestCta slug={slug} locale={locale} soldOut={soldOut} />
                  <AppFallbackLink locale={locale} />
                </div>

                <p className="mt-4 text-xs leading-relaxed text-stone-500">
                  {en ? (
                    <>
                      Returns are estimated, not guaranteed, and your capital is at risk. See the{" "}
                      <Link href={localePath(locale, routes.terms)} className="text-brand-strong underline">
                        full terms
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      রিটার্ন প্রাক্কলিত, নিশ্চিত নয়, এবং আপনার পুঁজি ঝুঁকিতে থাকে।{" "}
                      <Link href={localePath(locale, routes.terms)} className="text-brand-strong underline">
                        সম্পূর্ণ শর্তাবলি
                      </Link>{" "}
                      দেখুন।
                    </>
                  )}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ── Below the fold ─────────────────────────────────────────────── */}
      <Section tone="canvas">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-display text-2xl font-bold tracking-tight text-stone-900">
                {en ? "About this project" : "এই প্রকল্প সম্পর্কে"}
              </h2>
              <div
                className="prose-rich mt-5 text-[15px] leading-relaxed text-stone-700"
                dangerouslySetInnerHTML={{ __html: t(project.descriptionHtml, locale) }}
              />

              <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-stone-900">
                {en ? "How your money is used" : "আপনার অর্থ যেভাবে ব্যবহৃত হয়"}
              </h2>
              <ol className="mt-6 space-y-3">
                {[
                  { en: "Capital collected from investors", bn: "বিনিয়োগকারীদের কাছ থেকে পুঁজি সংগ্রহ" },
                  { en: "Inputs & feed purchased at commercial scale", bn: "বাণিজ্যিক পরিসরে উপকরণ ও খাদ্য ক্রয়" },
                  { en: "Training & veterinary support delivered", bn: "প্রশিক্ষণ ও পশুচিকিৎসা সহায়তা প্রদান" },
                  { en: "Production monitored against the project SOP", bn: "প্রকল্প এসওপি অনুযায়ী উৎপাদন তদারকি" },
                  { en: "Output aggregated and sold to arranged buyers", bn: "উৎপাদন একত্র করে নির্ধারিত ক্রেতার কাছে বিক্রয়" },
                  { en: "Investor return paid, farmer profit share released", bn: "বিনিয়োগকারীর রিটার্ন পরিশোধ, কৃষকের মুনাফা ভাগ প্রদান" },
                ].map((step, index) => (
                  <li key={step.en} className="flex gap-4 rounded-md bg-white p-4 ring-1 ring-stone-200">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-tint font-mono text-xs font-bold text-brand-strong">
                      {index + 1}
                    </span>
                    <span className="text-[15px] leading-relaxed text-stone-700">
                      {t(step, locale)}
                    </span>
                  </li>
                ))}
              </ol>

              <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-stone-900">
                {en ? "The producers" : "উৎপাদকেরা"}
              </h2>
              <Card className="mt-5 p-6">
                <dl className="divide-y divide-stone-100">
                  {/*
                    Every value here can be null, and `Fact` renders nothing when
                    it is. That is deliberate: the API carries no cooperative name
                    and exposes no partner gender publicly, so those rows are
                    absent rather than filled with invented figures. Showing an
                    empty "Cooperative :" label is the exact defect the current
                    site has, and showing a made-up percentage would be worse.
                  */}
                  <Fact
                    icon="users"
                    label={en ? "Cooperative" : "সমবায়"}
                    value={project.producers.cooperative ? t(project.producers.cooperative, locale) : null}
                  />
                  <Fact
                    icon="map-pin"
                    label={en ? "District" : "জেলা"}
                    value={project.producers.district ? t(project.producers.district, locale) : null}
                  />
                  <Fact
                    icon="handshake"
                    label={en ? "Shathi partners" : "সাথী অংশীদার"}
                    value={
                      project.producers.partners > 0
                        ? formatNumber(project.producers.partners, locale, "data")
                        : null
                    }
                  />
                  <Fact
                    icon="star"
                    label={en ? "Women" : "নারী"}
                    value={
                      project.producers.womenSharePct !== null
                        ? `${formatNumber(project.producers.womenSharePct, locale, "data")}%`
                        : null
                    }
                  />
                  <Fact
                    icon="shield"
                    label={en ? "Persons with disabilities" : "প্রতিবন্ধী ব্যক্তি"}
                    value={
                      project.producers.pwdSharePct !== null
                        ? `${formatNumber(project.producers.pwdSharePct, locale, "data")}%`
                        : null
                    }
                  />
                </dl>
              </Card>

              <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-stone-900">
                {en ? "Timeline" : "সময়রেখা"}
              </h2>
              <ol className="mt-6 border-s-2 border-stone-200 ps-6">
                {project.milestones.map((milestone) => (
                  <li key={milestone.label.en} className="relative pb-7 last:pb-0">
                    <span
                      className={
                        milestone.state === "done"
                          ? "absolute -start-[1.9rem] mt-1 flex size-4 items-center justify-center rounded-full bg-brand text-white"
                          : milestone.state === "current"
                            ? "absolute -start-[1.9rem] mt-1 size-4 rounded-full bg-brand ring-4 ring-brand/20"
                            : "absolute -start-[1.9rem] mt-1 size-4 rounded-full border-2 border-stone-300 bg-white"
                      }
                      aria-hidden="true"
                    >
                      {milestone.state === "done" && <Icon name="check" size={10} />}
                    </span>
                    <p className="font-display text-[15px] font-bold text-stone-900">
                      {t(milestone.label, locale)}
                    </p>
                    {formatDate(milestone.date, locale) && (
                      <p className="text-sm text-stone-500">{formatDate(milestone.date, locale)}</p>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-5">
              <h2 className="font-display text-2xl font-bold tracking-tight text-stone-900">
                {en ? "Estimate your return" : "আপনার রিটার্ন হিসাব করুন"}
              </h2>
              <div className="mt-5">
                <ReturnCalculator project={project} locale={locale} />
              </div>

              <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-stone-900">
                {en ? "Questions investors ask" : "বিনিয়োগকারীদের সাধারণ প্রশ্ন"}
              </h2>
              <Accordion className="mt-3">
                {[
                  {
                    q: { en: "What exactly am I buying?", bn: "আমি আসলে কী কিনছি?" },
                    a: {
                      en: "A unit of participation in one production cycle. You are funding inputs and production, not lending at interest. The return depends on how the cycle performs and what the output sells for.",
                      bn: "একটি উৎপাদন চক্রে অংশগ্রহণের একটি ইউনিট। আপনি উপকরণ ও উৎপাদনে অর্থায়ন করছেন, সুদে ঋণ দিচ্ছেন না। রিটার্ন নির্ভর করে চক্রটি কেমন চলে এবং উৎপাদন কত দামে বিক্রি হয় তার ওপর।",
                    },
                  },
                  {
                    q: { en: "What happens if the cycle underperforms?", bn: "চক্র প্রত্যাশার নিচে গেলে কী হয়?" },
                    a: {
                      en: "Returns can land below the estimated band, and in a severe case capital can be lost. Risk is reduced through graded inputs, veterinary cover, weekly monitoring, cooperative verification and buyers arranged before the sale — but it is not removed.",
                      bn: "রিটার্ন প্রাক্কলিত পরিসরের নিচে নামতে পারে, আর গুরুতর ক্ষেত্রে পুঁজিও হারাতে পারে। গ্রেডকৃত উপকরণ, পশুচিকিৎসা, সাপ্তাহিক তদারকি, সমবায় যাচাই ও বিক্রির আগেই ক্রেতা ঠিক করার মাধ্যমে ঝুঁকি কমানো হয় — তবে তা দূর হয় না।",
                    },
                  },
                  {
                    q: { en: "Can I withdraw early?", bn: "আগেভাগে টাকা তোলা যাবে?" },
                    a: {
                      en: "Refunds are available within 15 days of the project start date. After that the capital is committed to the cycle and cannot be withdrawn until maturity.",
                      bn: "প্রকল্প শুরুর তারিখ থেকে ১৫ দিনের মধ্যে অর্থ ফেরত নেওয়া যায়। এরপর পুঁজি চক্রে প্রতিশ্রুত হয়ে যায় এবং মেয়াদপূর্তির আগে তোলা যায় না।",
                    },
                  },
                  {
                    q: { en: "How do I follow the project?", bn: "প্রকল্প কীভাবে অনুসরণ করব?" },
                    a: {
                      en: "Milestone updates, monthly financial summaries and impact data arrive in the Shathi app and by SMS through the cycle.",
                      bn: "চক্র জুড়ে মাইলফলক হালনাগাদ, মাসিক আর্থিক সারসংক্ষেপ ও প্রভাবের তথ্য সাথী অ্যাপে ও এসএমএসে পৌঁছায়।",
                    },
                  },
                  {
                    q: { en: "How is the farmer paid?", bn: "কৃষক কীভাবে অর্থ পান?" },
                    a: {
                      en: "After project costs and the investor payout, up to 50% of the remaining profit goes to the Shathi partner. The split is agreed in writing before the cycle begins.",
                      bn: "প্রকল্প ব্যয় ও বিনিয়োগকারীর পরিশোধের পর অবশিষ্ট মুনাফার ৫০% পর্যন্ত পান সাথী অংশীদার। চক্র শুরুর আগেই এই ভাগ লিখিতভাবে নির্ধারিত হয়।",
                    },
                  },
                ].map((item, index) => (
                  <AccordionItem
                    key={item.q.en}
                    question={t(item.q, locale)}
                    group="project-faq"
                    defaultOpen={index === 0}
                  >
                    {t(item.a, locale)}
                  </AccordionItem>
                ))}
              </Accordion>

              <Note tone="risk" icon="info" className="mt-8">
                {en
                  ? "DigiGram Ventures Ltd. is not a licensed lender and does not offer securities. Read the terms before investing."
                  : "ডিজিগ্রাম ভেঞ্চারস লিমিটেড কোনো লাইসেন্সপ্রাপ্ত ঋণদাতা নয় এবং সিকিউরিটিজ অফার করে না। বিনিয়োগের আগে শর্তাবলি পড়ুন।"}
              </Note>

              <div className="mt-8">
                <ShareRow url={url} title={title} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="surface">
          <div className="container-page">
            <SectionHead title={en ? "Related projects" : "সম্পর্কিত প্রকল্প"} />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} locale={locale} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <MobileInvestBar
        slug={slug}
        locale={locale}
        soldOut={soldOut}
        unitAmount={project.unitAmountBdt}
      />
    </div>
  );
}
