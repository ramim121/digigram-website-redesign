import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, SectionHead } from "@/components/ui/Section";
import { Card } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ShathiLogo } from "@/components/brand/Logo";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ScrollCarousel, TestimonialCarousel } from "@/components/sections/Carousels";
import {
  StatBand,
  PillarGrid,
  StakeholderGrid,
  ProductCards,
  PartnerBand,
  InvestorVoiceBand,
  AppDownloadBand,
  CtaBand,
  SdgRow,
  ViewAllLink,
} from "@/components/sections/Shared";
import { fetchProjects } from "@/lib/projects.server";
import { fetchArticles } from "@/lib/content.server";
import { BLOG_FALLBACK_IMAGE, categoryLabel, readingLabel } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { formatDate, isLocale, localePath, t, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";
import { ProcessFlow } from "@/components/sections/ProcessFlow";
import { ShebaBand } from "@/components/sections/ShebaBand";
import { HeroCarousel, type HeroSlide } from "@/components/sections/HeroCarousel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;

  return buildMetadata({
    locale,
    path: routes.home,
    title:
      locale === "en"
        ? "Invest in rural Bangladesh — DigiGram Ventures"
        : "গ্রামীণ বাংলাদেশে বিনিয়োগ করুন — ডিজিগ্রাম ভেঞ্চারস",
    description:
      locale === "en"
        ? "DigiGram finances rural micro-enterprises in Bangladesh and builds Shathi Sheba, the app they run on. Farmers get capital, quality inputs, training and a named buyer; investors get a transparent, monitored return. 1,000+ farmers connected, 70% women."
        : "ডিজিগ্রাম বাংলাদেশের গ্রামীণ ক্ষুদ্র উদ্যোগে অর্থায়ন করে এবং তারা যে অ্যাপে চলে — সাথী সেবা — সেটিও বানায়। কৃষক পান পুঁজি, মানসম্পন্ন উপকরণ, প্রশিক্ষণ ও নির্দিষ্ট ক্রেতা; বিনিয়োগকারী পান স্বচ্ছ, তদারকি করা রিটার্ন। ১,০০০+ কৃষক সংযুক্ত, ৭০% নারী।",
    keywords:
      locale === "en"
        ? [
            "invest in agriculture Bangladesh",
            "contract farming Bangladesh",
            "impact investing Bangladesh",
            "rural finance Bangladesh",
            "cattle fattening investment",
            "DigiGram Ventures",
            "Shathi",
            "Shathi Sheba",
            "rural enterprise app Bangladesh",
            "finance readiness smallholder farmers",
          ]
        : [
            "বাংলাদেশে কৃষি বিনিয়োগ",
            "চুক্তিভিত্তিক চাষ",
            "গ্রামীণ অর্থায়ন",
            "সাথী",
            "সাথী সেবা",
            "ডিজিগ্রাম",
          ],
  });
}

/**
 * Homepage hero backgrounds, in rotation order.
 *
 * Three commissioned 1536×1024 frames, in the order a visitor should meet the
 * business: the cooperative that organises a village, the advisory that reaches
 * a farmer through a phone, and the production cycle the money actually buys.
 *
 * They replaced a single 479×551 photograph that was being stretched across a
 * full-bleed hero — roughly a 4× upscale on a laptop, and the whole reason the
 * old banner looked washed out. Each is composed with its subject right of
 * centre so the left-hand scrim keeps the headline legible; see `HeroCarousel`
 * for the resolution any replacement has to meet.
 */
const heroSlides: HeroSlide[] = [
  {
    src: "/assets/photos/hero/hero-cooperative.webp",
    caption: {
      en: "A farmers' cooperative meeting on a path between paddy fields in rural Bangladesh",
      bn: "গ্রামীণ বাংলাদেশে ধানখেতের আলপথে কৃষক সমবায়ের বৈঠক",
    },
  },
  { src: "/assets/photos/hero/hero-advisory.webp" },
  { src: "/assets/photos/hero/hero-cattle.webp" },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const { data: projects } = await fetchProjects({ status: "open", limit: 6 });
  const { data: allPosts } = await fetchArticles();
  const posts = allPosts.slice(0, 3);

  return (
    <>
      {/* 1 ─ Hero ------------------------------------------------------- */}
      {/*
        The photographs rotate; the message does not. See `HeroCarousel` for
        why, and for the resolution these slides have to meet — the originals
        here are badly undersized for a full-bleed hero and that is the main
        reason it reads as soft. Replacing the files in `heroSlides` below is
        the whole fix; no markup changes.
      */}
      <section className="relative isolate flex min-h-[38rem] items-end overflow-hidden bg-teal-900 lg:min-h-[44rem]">
        <HeroCarousel slides={heroSlides} locale={locale} />
        <div className="absolute inset-0 scrim-left" aria-hidden="true" />

        <div className="relative container-page pt-32 pb-24 lg:pt-44 lg:pb-32">
          <p className="eyebrow !text-brand-accent">
            {en ? "Welcome to DigiGram Ventures" : "ডিজিগ্রাম ভেঞ্চারসে স্বাগতম"}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-5xl lg:text-7xl">
            {t(site.tagline, locale)}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 lg:text-xl">
            {/* Both sides of the model, in the first thing anyone reads. The
                previous line addressed the investor alone, which set the whole
                page up as an investment product and left the farmer-facing
                half to be discovered later, if at all. */}
            {en
              ? "We finance rural micro-enterprises in Bangladesh and build the software they run on. Farmers get capital, inputs, training and a named buyer. Investors get a transparent, monitored return."
              : "আমরা বাংলাদেশের গ্রামীণ ক্ষুদ্র উদ্যোগে অর্থায়ন করি, আর তারা যে সফটওয়্যারে চলে তাও আমরাই বানাই। কৃষক পান পুঁজি, উপকরণ, প্রশিক্ষণ ও নির্দিষ্ট ক্রেতা। বিনিয়োগকারী পান স্বচ্ছ, তদারকি করা রিটার্ন।"}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink
              href={localePath(locale, routes.projects)}
              size="lg"
              variant="inverse"
              icon="arrow-right"
            >
              {en ? "Explore projects" : "প্রকল্প দেখুন"}
            </ButtonLink>
            <ButtonLink
              href="#how-it-works"
              size="lg"
              variant="secondary"
              className="border-white/40 text-white hover:border-white/70 hover:bg-white/10"
            >
              {en ? "How it works" : "কীভাবে কাজ করে"}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 2 ─ Live stat band --------------------------------------------- */}
      <div className="bg-stone-50 pb-16 lg:pb-24">
        <StatBand locale={locale} />
      </div>

      {/* 3 ─ Who we are: the four-pillar model --------------------------- */}
      <Section tone="surface" id="model">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Who we are" : "আমরা কারা"}
            title={
              en
                ? "One rural entrepreneur, four things they are missing"
                : "একজন গ্রামীণ উদ্যোক্তা, চারটি অনুপস্থিত জিনিস"
            }
            lead={
              en
                ? "DigiGram transforms rural homes into micro-enterprises. Each pillar closes a gap that, left open, keeps a productive household poor."
                : "ডিজিগ্রাম গ্রামীণ ঘরকে ক্ষুদ্র উদ্যোগে রূপান্তর করে। প্রতিটি স্তম্ভ এমন একটি ফাঁক পূরণ করে, যা খোলা থাকলে উৎপাদনশীল পরিবারও দরিদ্র থেকে যায়।"
            }
          />
          <PillarGrid locale={locale} />
        </div>
      </Section>

      {/* 4 ─ Invest in our projects (Shathi-branded) --------------------- */}
      <section data-brand="shathi" className="section bg-brand-canvas" id="projects">
        <div className="container-page">
          <SectionHead
            eyebrow={
              <span className="inline-flex items-center gap-2">
                <ShathiLogo variant="mark" className="h-4 w-auto" />
                {en ? "Powered by Shathi" : "সাথী দ্বারা পরিচালিত"}
              </span>
            }
            title={en ? "Invest in our projects" : "আমাদের প্রকল্পে বিনিয়োগ করুন"}
            lead={
              en
                ? "Each project is one production cycle with a stated unit price, tenure and estimated return band. Capital is at risk; returns are estimated, never guaranteed."
                : "প্রতিটি প্রকল্প একটি উৎপাদন চক্র — নির্দিষ্ট ইউনিট মূল্য, মেয়াদ ও আনুমানিক রিটার্ন পরিসরসহ। বিনিয়োগ ঝুঁকিপূর্ণ; রিটার্ন আনুমানিক, নিশ্চিত নয়।"
            }
            action={<ViewAllLink locale={locale} href={routes.projects} />}
          />

          <div className="mt-12">
            <ScrollCarousel
              locale={locale}
              ariaLabel={en ? "Open projects" : "চলমান প্রকল্প"}
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="w-[19rem] shrink-0 snap-start sm:w-[21rem] lg:w-[22.5rem]"
                >
                  <ProjectCard project={project} locale={locale} />
                </div>
              ))}
            </ScrollCarousel>
          </div>
        </div>
      </section>

      {/* 5 ─ How investing works ----------------------------------------- */}
      <ProcessFlow locale={locale} />

      {/* 5b ─ Shathi Sheba (farmer side, wine token layer) ---------------- */}
      {/* Placed directly after the investment story rather than further down:
          section 4 has just shown where the money goes, and this is what it
          arrives into. Read in order, the two bands are one argument. */}
      <ShebaBand locale={locale} />

      {/* 6 ─ Our products ------------------------------------------------ */}
      <Section tone="page" id="products">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Our products" : "আমাদের পণ্য ও সেবা"}
            title={en ? "Three products, one model" : "তিনটি পণ্য, একটি মডেল"}
            lead={
              en
                ? "Shathi funds the cycle, Shadhin supplies it, and Shathi Sheba runs it — carrying the record that unlocks the next loan, the next buyer and the next cycle."
                : "সাথী চক্রে অর্থায়ন করে, স্বাধীন উপকরণ জোগায়, আর সাথী সেবা চক্রটি পরিচালনা করে — সঙ্গে রাখে সেই নথি, যা খুলে দেয় পরের ঋণ, পরের ক্রেতা ও পরের চক্রের দরজা।"
            }
            action={<ViewAllLink locale={locale} href={routes.products} label={en ? "All products" : "সব পণ্য"} />}
          />
          <ProductCards locale={locale} />
        </div>
      </Section>

      {/* 7 ─ Stakeholders ------------------------------------------------ */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Who we serve" : "আমরা যাদের সেবা দিই"}
            title={en ? "Four groups, one system" : "চারটি পক্ষ, একটি ব্যবস্থা"}
            lead={
              en
                ? "The model only works if every side gets something it cannot get elsewhere."
                : "প্রতিটি পক্ষ যদি এমন কিছু না পায় যা অন্য কোথাও মেলে না, তবে এই মডেল কাজ করে না।"
            }
          />
          <StakeholderGrid locale={locale} />
        </div>
      </Section>

      {/* 8 ─ Impact preview ---------------------------------------------- */}
      <Section tone="dark">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="eyebrow !text-brand-accent">{en ? "Our impact" : "আমাদের প্রভাব"}</p>
              <h2 className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-white lg:text-4xl">
                {en
                  ? "Empowering 20,000 Shathi input partners with improved, sustainable livelihoods and market access by 2030."
                  : "২০৩০ সালের মধ্যে ২০,০০০ সাথী উপকরণ অংশীদারকে উন্নত, টেকসই জীবিকা ও বাজারে প্রবেশাধিকার দেওয়া।"}
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-white/75">
                {en
                  ? "Reaching 50,000 smallholder farmers — particularly women and persons with disabilities — living below or near the poverty line in rural Bangladesh."
                  : "গ্রামীণ বাংলাদেশে দারিদ্র্যসীমার নিচে বা কাছাকাছি থাকা ৫০,০০০ ক্ষুদ্র কৃষকের কাছে পৌঁছানো — বিশেষত নারী ও প্রতিবন্ধী ব্যক্তি।"}
              </p>
              <div className="mt-8">
                <ButtonLink
                  href={localePath(locale, routes.impact)}
                  variant="inverse"
                  icon="arrow-right"
                >
                  {en ? "See our impact" : "আমাদের প্রভাব দেখুন"}
                </ButtonLink>
              </div>
            </div>
            <div className="lg:col-span-5">
              <p className="mb-4 font-display text-xs font-bold tracking-widest text-white/60 uppercase">
                {en ? "Aligned with" : "সামঞ্জস্যপূর্ণ"}
              </p>
              <SdgRow locale={locale} />
            </div>
          </div>
        </div>
      </Section>

      {/* 9 ─ Voices ------------------------------------------------------ */}
      <Section tone="page">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Voices" : "কণ্ঠস্বর"}
            title={en ? "Our partners, in their words" : "আমাদের অংশীদারদের নিজের ভাষায়"}
          />
          <TestimonialCarousel locale={locale} />
        </div>
      </Section>

      {/* 9b ─ Investor voices (CMS) -------------------------------------- */}
      <InvestorVoiceBand locale={locale} />

      {/* 10 ─ Partners --------------------------------------------------- */}
      <PartnerBand locale={locale} />

      {/* 11 ─ News ------------------------------------------------------- */}
      <Section tone="page">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "News & insights" : "খবর ও বিশ্লেষণ"}
            title={en ? "How the model actually works" : "মডেলটি আসলে যেভাবে কাজ করে"}
            action={
              <ViewAllLink locale={locale} href={routes.blog} label={en ? "All posts" : "সব লেখা"} />
            }
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 70}>
                <Card className="group relative flex h-full flex-col overflow-hidden" interactive>
                  <div className="relative aspect-video overflow-hidden bg-stone-100">
                    <Image
                      src={post.image ?? BLOG_FALLBACK_IMAGE}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 380px, 100vw"
                      className="object-cover transition-transform duration-500 ease-standard group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-display text-xs font-bold tracking-wide text-brand-strong uppercase">
                      {categoryLabel(post, locale)}
                    </p>
                    <h3 className="mt-2 font-display text-lg leading-snug font-bold text-stone-900">
                      <Link
                        href={localePath(locale, routes.post(post.slug))}
                        className="after:absolute after:inset-0"
                      >
                        {t(post.title, locale)}
                      </Link>
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                      {t(post.excerpt, locale)}
                    </p>
                    <p className="mt-4 text-xs text-stone-400">
                      {post.date && `${formatDate(post.date, locale)} · `}
                      {readingLabel(post, locale)}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* 12 ─ App download ----------------------------------------------- */}
      <AppDownloadBand locale={locale} />

      {/* 13 ─ Contact CTA ------------------------------------------------ */}
      <CtaBand locale={locale} />
    </>
  );
}
