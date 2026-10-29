import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, SectionHead } from "@/components/ui/Section";
import { Card } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialCarousel } from "@/components/sections/Carousels";
import {
  StatBand,
  PillarGrid,
  StakeholderGrid,
  PartnerBand,
  CtaBand,
  SdgRow,
  ViewAllLink,
} from "@/components/sections/Shared";
import { MissionValues, CareEconomyBand } from "@/components/sections/Values";
import { ShebaBand } from "@/components/sections/ShebaBand";
import { ApaSection } from "@/components/sections/ApaSection";
import { FeedSection } from "@/components/sections/FeedSection";
import { HeroCarousel, type HeroSlide } from "@/components/sections/HeroCarousel";
import { fetchArticles } from "@/lib/content.server";
import { BLOG_FALLBACK_IMAGE, categoryLabel, readingLabel } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { formatDate, isLocale, localePath, t, type Locale } from "@/lib/i18n";
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
    path: routes.home,
    title:
      locale === "en"
        ? "DigiGram Ventures — sustainable agriculture and rural enterprise in Bangladesh"
        : "ডিজিগ্রাম ভেঞ্চারস — বাংলাদেশে টেকসই কৃষি ও গ্রামীণ উদ্যোগ",
    description:
      locale === "en"
        ? "A for-profit impact company using sustainable agriculture, eco-friendly value chains and the care economy to raise rural incomes in Bangladesh — especially for women and people with disabilities. Home of Shathi Sheba, Shathi Apa and Shadhin Cattle Feed. 1,000+ farmers connected, 70% women."
        : "টেকসই কৃষি, পরিবেশবান্ধব ভ্যালু চেইন ও কেয়ার ইকোনমির মাধ্যমে গ্রামীণ বাংলাদেশের আয় বাড়ানো একটি মুনাফাভিত্তিক ইমপ্যাক্ট কোম্পানি — বিশেষ করে নারী ও প্রতিবন্ধী ব্যক্তিদের জন্য। সাথী সেবা, সাথী আপা ও স্বাধীন গরুর খাবারের নির্মাতা। ১,০০০+ কৃষক সংযুক্ত, ৭০% নারী।",
    keywords:
      locale === "en"
        ? [
            "sustainable agriculture Bangladesh",
            "rural livelihoods Bangladesh",
            "women farmers Bangladesh",
            "care economy",
            "disability inclusion livelihoods",
            "smallholder farmers app",
            "Bangla AI farming assistant",
            "cattle feed Bangladesh",
            "DigiGram Ventures",
            "Shathi Sheba",
            "Shathi Apa",
          ]
        : [
            "টেকসই কৃষি",
            "গ্রামীণ জীবিকা",
            "নারী কৃষক",
            "কেয়ার ইকোনমি",
            "কৃষি অ্যাপ",
            "গরুর খাবার",
            "সাথী সেবা",
            "সাথী আপা",
            "ডিজিগ্রাম",
          ],
  });
}

/**
 * Homepage hero backgrounds, in rotation order.
 *
 * Three commissioned 1536×1024 frames, in the order a visitor should meet the
 * work: the cooperative that organises a village, the advice that reaches a
 * farmer through a phone, and the production the whole system exists to grow.
 * Each is composed with its subject right of centre so the left-hand scrim
 * keeps the headline legible; see `HeroCarousel` for the resolution any
 * replacement has to meet.
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

/*
 * WHAT THIS PAGE IS FOR
 *
 * The homepage used to be an investment funnel: a projects carousel, a
 * four-step "how investing works", investor testimonials and an app download
 * for the investor app. It now says what the company is — a for-profit impact
 * company working through sustainable agriculture, eco-friendly value chains
 * and the care economy — and shows the products that do that work for rural
 * households: Shathi Sheba, its assistant Shathi Apa, and Shadhin Cattle Feed.
 *
 * Nothing about investing was deleted from the site. Projects, the Shathi
 * product page and the booking flow are all where they were, and reachable
 * from the navigation; they are simply no longer the first thing a visitor is
 * asked to do.
 *
 * The order is an argument, top to bottom: who we are, why women and the care
 * economy, the model, the flagship platform, the adviser inside it, the feed
 * it delivers, who it all serves, and what it has achieved so far.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const { data: allPosts } = await fetchArticles();
  /*
   * Investing posts stay on the blog, not on the homepage. Without this the
   * newest-three rule put "Where a contract-farming return comes from" in the
   * news row, quietly reintroducing the investment pitch this page no longer
   * leads with. CMS posts carry no category and are always eligible.
   */
  const posts = allPosts.filter((post) => post.category?.en !== "Investing").slice(0, 3);

  return (
    <>
      {/* 1 ─ Hero ------------------------------------------------------- */}
      <section className="relative isolate flex min-h-[38rem] items-end overflow-hidden bg-teal-900 lg:min-h-[44rem]">
        <HeroCarousel slides={heroSlides} locale={locale} />
        <div className="absolute inset-0 scrim-left" aria-hidden="true" />

        <div className="relative container-page pt-32 pb-24 lg:pt-44 lg:pb-32">
          <p className="eyebrow !text-brand-accent">
            {en ? "A for-profit impact company · Bangladesh" : "মুনাফাভিত্তিক ইমপ্যাক্ট কোম্পানি · বাংলাদেশ"}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
            {t(site.tagline, locale)}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 lg:text-xl">
            {en
              ? "Sustainable agriculture, eco-friendly value chains and the care economy — working for rural households in Bangladesh, and above all for women and people with disabilities."
              : "টেকসই কৃষি, পরিবেশবান্ধব ভ্যালু চেইন ও কেয়ার ইকোনমি — গ্রামীণ বাংলাদেশের পরিবারের জন্য, বিশেষ করে নারী ও প্রতিবন্ধী ব্যক্তিদের জন্য।"}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink
              href={localePath(locale, routes.shathiSheba)}
              size="lg"
              variant="inverse"
              icon="arrow-right"
            >
              {en ? "Discover Shathi Sheba" : "সাথী সেবা দেখুন"}
            </ButtonLink>
            <ButtonLink
              href={localePath(locale, routes.impact)}
              size="lg"
              variant="secondary"
              className="border-white/40 text-white hover:border-white/70 hover:bg-white/10"
            >
              {en ? "Our impact" : "আমাদের প্রভাব"}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 2 ─ Traction --------------------------------------------------- */}
      <div className="bg-stone-50 pb-16 lg:pb-24">
        <StatBand locale={locale} />
      </div>

      {/* 3 ─ Who we are: purpose and the four commitments ---------------- */}
      <MissionValues locale={locale} />

      {/* 4 ─ The care economy: why women, and what we build around -------- */}
      <CareEconomyBand locale={locale} />

      {/* 5 ─ How we work: the four-pillar model --------------------------- */}
      <Section tone="page" id="model">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "How we work" : "আমরা যেভাবে কাজ করি"}
            title={
              en
                ? "One rural entrepreneur, four things they are missing"
                : "একজন গ্রামীণ উদ্যোক্তা, চারটি অনুপস্থিত জিনিস"
            }
            lead={
              en
                ? "DigiGram turns rural homes into micro-enterprises. Each pillar closes a gap that, left open, keeps a productive household poor."
                : "ডিজিগ্রাম গ্রামের ঘরকে ক্ষুদ্র উদ্যোগে রূপ দেয়। প্রতিটি স্তম্ভ এমন একটি ফাঁক পূরণ করে, যা খোলা থাকলে উৎপাদনশীল পরিবারও দরিদ্র থেকে যায়।"
            }
          />
          <PillarGrid locale={locale} />
        </div>
      </Section>

      {/* 6 ─ Shathi Sheba: the flagship platform (wine) ------------------- */}
      <ShebaBand locale={locale} />

      {/* 7 ─ Shathi Apa: the adviser inside it ----------------------------- */}
      <ApaSection locale={locale} variant="home" />

      {/* 8 ─ Shadhin Cattle Feed -------------------------------------------- */}
      <FeedSection locale={locale} />

      {/* 9 ─ Who we work with --------------------------------------------- */}
      <Section tone="page" id="who-we-serve">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Who we work with" : "আমরা যাঁদের সঙ্গে কাজ করি"}
            title={en ? "Everyone the model has to work for" : "যাঁদের সবার জন্য মডেলটিকে কাজ করতে হয়"}
            lead={
              en
                ? "It only works if every side gets something it cannot get anywhere else."
                : "প্রতিটি পক্ষ যদি এমন কিছু না পায় যা অন্য কোথাও মেলে না, তবে এই মডেল কাজ করে না।"
            }
          />
          <StakeholderGrid locale={locale} />
        </div>
      </Section>

      {/* 10 ─ Impact preview ---------------------------------------------- */}
      <Section tone="dark">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="eyebrow !text-brand-accent">{en ? "Our impact" : "আমাদের প্রভাব"}</p>
              <h2 className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-white lg:text-4xl">
                {en
                  ? "Empowering 20,000 rural input partners with improved, sustainable livelihoods and market access by 2030."
                  : "২০৩০ সালের মধ্যে ২০,০০০ গ্রামীণ উপকরণ অংশীদারকে উন্নত, টেকসই জীবিকা ও বাজারে প্রবেশাধিকার দেওয়া।"}
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-white/75">
                {en
                  ? "Reaching 50,000 smallholder farmers — particularly women and persons with disabilities — living below or near the poverty line in rural Bangladesh."
                  : "গ্রামীণ বাংলাদেশে দারিদ্র্যসীমার নিচে বা কাছাকাছি থাকা ৫০,০০০ ক্ষুদ্র কৃষকের কাছে পৌঁছানো — বিশেষ করে নারী ও প্রতিবন্ধী ব্যক্তি।"}
              </p>
              <div className="mt-8">
                <ButtonLink href={localePath(locale, routes.impact)} variant="inverse" icon="arrow-right">
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

      {/* 11 ─ Voices from the field ---------------------------------------- */}
      <Section tone="page">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Voices" : "কণ্ঠস্বর"}
            title={en ? "Our partners, in their words" : "আমাদের অংশীদারদের নিজের ভাষায়"}
          />
          <TestimonialCarousel locale={locale} />
        </div>
      </Section>

      {/* 12 ─ Partners ----------------------------------------------------- */}
      <PartnerBand locale={locale} />

      {/* 13 ─ News --------------------------------------------------------- */}
      <Section tone="page">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "News & insights" : "খবর ও বিশ্লেষণ"}
            title={en ? "How the model actually works" : "মডেলটি আসলে যেভাবে কাজ করে"}
            action={<ViewAllLink locale={locale} href={routes.blog} label={en ? "All posts" : "সব লেখা"} />}
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
                      <Link href={localePath(locale, routes.post(post.slug))} className="after:absolute after:inset-0">
                        {t(post.title, locale)}
                      </Link>
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{t(post.excerpt, locale)}</p>
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

      {/* 14 ─ Partnership call to action ------------------------------------ */}
      <CtaBand
        locale={locale}
        title={
          en
            ? "Reach the rural households the market has missed."
            : "বাজার যে গ্রামীণ পরিবারগুলোকে পেছনে ফেলে গেছে, তাঁদের কাছে পৌঁছান।"
        }
        lead={
          en
            ? "Lenders, buyers, development partners and cooperatives: if you want to work with women-led rural enterprises at scale, we would like to talk."
            : "ঋণদাতা, ক্রেতা, উন্নয়ন সহযোগী ও সমবায়: নারী-নেতৃত্বাধীন গ্রামীণ উদ্যোগের সঙ্গে বড় পরিসরে কাজ করতে চাইলে, আমরা কথা বলতে আগ্রহী।"
        }
        primary={{ href: routes.contact, label: en ? "Partner with us" : "অংশীদার হোন" }}
        secondary={{ href: routes.impact, label: en ? "See our impact" : "আমাদের প্রভাব দেখুন" }}
      />
    </>
  );
}
