import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { Section, SectionHead } from "@/components/ui/Section";
import { Card, StatBlock, Badge } from "@/components/ui/Primitives";
import { ButtonLink, ArrowLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { BrandDot } from "@/components/brand/Logo";
import { headlineStats, pillars, stakeholders, partners as seedPartners } from "@/content/company";
import { fetchPartners, fetchInvestorVoices } from "@/lib/content.server";
import { localePath, t, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";

/* ------------------------------------------------------------ stat band -- */

/**
 * Raised stat card that overlaps the hero's bottom edge.
 * Each figure carries a footnote marker linking to the methodology section —
 * the brief's rule that no number is asserted without a mechanism behind it.
 */
export function StatBand({ locale, overlap = true }: { locale: Locale; overlap?: boolean }) {
  return (
    <div className={clsx("relative z-10 container-page", overlap && "-mt-14 lg:-mt-20")}>
      <Reveal>
        <div className="grid gap-8 rounded-lg border border-stone-200 bg-white p-8 shadow-lg sm:grid-cols-2 lg:grid-cols-5 lg:p-10">
          {headlineStats.map((stat) => (
            <StatBlock
              key={stat.label.en}
              /* `sm` keeps "৳ ১.০২ কোটি" on one line in a five-column band —
                 at the larger size the Bangla figure wraps and knocks the row
                 of labels out of alignment. */
              size="sm"
              value={t(stat.value, locale)}
              label={t(stat.label, locale)}
              footnote={
                <Link
                  href={`${localePath(locale, routes.impact)}#methodology`}
                  className="ms-1 align-super text-[10px] font-bold text-brand-strong hover:underline"
                  aria-label={locale === "en" ? "See methodology" : "পদ্ধতি দেখুন"}
                  title={stat.source}
                >
                  †
                </Link>
              }
            />
          ))}
        </div>
      </Reveal>
    </div>
  );
}

/* -------------------------------------------------------------- pillars -- */

const pillarIcons: Record<string, IconName> = {
  fund: "wallet",
  supply: "truck",
  grow: "graduation-cap",
  sell: "store",
};

export function PillarGrid({
  locale,
  detailed = false,
}: {
  locale: Locale;
  detailed?: boolean;
}) {
  if (detailed) {
    return (
      <div className="mt-12 space-y-5">
        {pillars.map((pillar, index) => (
          <Reveal key={pillar.key} delay={index * 60}>
            <Card className="grid gap-6 p-7 lg:grid-cols-12 lg:p-9">
              <div className="lg:col-span-3">
                <span className="font-mono text-sm font-semibold text-stone-400">{pillar.no}</span>
                <h3 className="mt-2 flex items-center gap-2.5 font-display text-2xl font-bold text-brand-strong">
                  <Icon name={pillarIcons[pillar.key]} size={22} />
                  {t(pillar.title, locale)}
                </h3>
                <p className="mt-1.5 text-sm text-stone-500">{t(pillar.line, locale)}</p>
              </div>
              <div className="lg:col-span-9">
                <p className="text-[15px] leading-relaxed text-stone-700">
                  {t(pillar.detail, locale)}
                </p>
                <p className="mt-4 border-s-2 border-brand-line ps-4 text-sm leading-relaxed text-stone-500 italic">
                  {t(pillar.example, locale)}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    /*
     * Four steps of one model, so the cards are joined by a rule that runs
     * behind them on desktop — they were four separate boxes with no sign that
     * they belong to a sequence. The oversized number is the ordering cue and
     * doubles as the card's only decoration; the icon sits on it rather than
     * beside it, which removes a whole row of vertical stacking.
     */
    <div className="relative mt-12">
      <span
        aria-hidden
        className="absolute inset-x-0 top-[4.25rem] hidden border-t-2 border-dashed border-brand-line lg:block"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, index) => (
          <Reveal key={pillar.key} delay={index * 60}>
            <Card
              className="group relative flex h-full flex-col overflow-hidden p-7 transition-transform duration-300 ease-standard hover:-translate-y-1.5"
              interactive
            >
              {/* Watermark number. Large, very low contrast, clipped by the
                  card — presence without competing with the heading. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-3 -right-1 font-display text-[5.5rem] leading-none font-extrabold text-brand-tint transition-colors duration-300 group-hover:text-brand-line"
              >
                {pillar.no}
              </span>

              <span className="relative flex size-12 items-center justify-center rounded-xl bg-brand-strong text-white shadow-sm">
                <Icon name={pillarIcons[pillar.key]} size={22} />
              </span>
              <h3 className="relative mt-5 font-display text-xl font-bold text-stone-900">
                {t(pillar.title, locale)}
              </h3>
              <p className="relative mt-2 text-[15px] leading-relaxed text-stone-600">
                {t(pillar.line, locale)}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- stakeholders -- */

export function StakeholderGrid({ locale }: { locale: Locale }) {
  const icons: IconName[] = ["sprout", "wallet", "truck", "users"];
  return (
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stakeholders.map((group, index) => (
        <Reveal key={group.title.en} delay={index * 60}>
          {/* Distinguished from the pillar cards on purpose: these are four
              audiences, not four steps, so they get a coloured top edge and a
              side-by-side header instead of a numbered stack. Two card shapes
              doing two jobs reads as structure; one shape doing both reads as
              a template. */}
          <Card
            className="group relative flex h-full flex-col overflow-hidden p-7 transition-transform duration-300 ease-standard hover:-translate-y-1.5"
            interactive
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-standard group-hover:scale-x-100"
            />
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-strong transition-colors duration-300 group-hover:bg-brand-strong group-hover:text-white">
                <Icon name={icons[index]} size={22} />
              </span>
              <h3 className="font-display text-lg leading-tight font-bold text-stone-900">
                {t(group.title, locale)}
              </h3>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-stone-600">
              {t(group.body, locale)}
            </p>
            <ul className="mt-auto space-y-2 border-t border-stone-100 pt-4">
              {group.bullets.map((bullet) => (
                <li key={bullet.en} className="flex gap-2 text-sm text-stone-600">
                  <Icon name="check" size={15} className="mt-0.5 shrink-0 text-brand" />
                  {t(bullet, locale)}
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

/* -------------------------------------------------------- product cards -- */

export function ProductCards({ locale }: { locale: Locale }) {
  const products = [
    {
      brand: "shathi" as const,
      href: routes.shathi,
      name: { en: "Shathi", bn: "সাথী" },
      line: {
        en: "Investment and contract farming",
        bn: "বিনিয়োগ ও চুক্তিভিত্তিক চাষ",
      },
      bullets: [
        { en: "Urban investors fund rural projects", bn: "শহুরে বিনিয়োগকারীরা গ্রামীণ প্রকল্পে অর্থায়ন করেন" },
        { en: "Farmers get finance, inputs, training and a buyer", bn: "কৃষক পান অর্থ, উপকরণ, প্রশিক্ষণ ও ক্রেতা" },
        { en: "Up to 50% of profit to the Shathi partner", bn: "মুনাফার ৫০% পর্যন্ত সাথী অংশীদারের" },
      ],
      accent: "text-shathi-600",
      bar: "bg-shathi-600",
    },
    {
      brand: "shathi-sheba" as const,
      href: routes.shathiSheba,
      name: { en: "Shathi Sheba", bn: "সাথী সেবা" },
      line: {
        en: "The rural enterprise operating system",
        bn: "গ্রামীণ উদ্যোগের অপারেটিং সিস্টেম",
      },
      bullets: [
        { en: "Digital onboarding and apply-for-finance", bn: "ডিজিটাল নিবন্ধন ও অর্থায়নের আবেদন" },
        { en: "Buy & sell marketplace with published prices", bn: "প্রকাশিত দামে কেনাবেচার মার্কেটপ্লেস" },
        { en: "Advisory, climate alerts and training", bn: "পরামর্শ, আবহাওয়া সতর্কতা ও প্রশিক্ষণ" },
      ],
      accent: "text-sheba-600",
      bar: "bg-sheba-600",
    },
    {
      brand: "digigram" as const,
      href: routes.shadhinFeed,
      name: { en: "Shadhin Cattle Feed", bn: "স্বাধীন গো-খাদ্য" },
      line: { en: "Quality input distribution", bn: "মানসম্পন্ন উপকরণ বিতরণ" },
      bullets: [
        { en: "DLS-compliant compound feed", bn: "ডিএলএস-অনুমোদিত কম্পাউন্ড ফিড" },
        { en: "Validated at 900g average daily gain", bn: "দৈনিক গড়ে ৯০০ গ্রাম বৃদ্ধিতে যাচাইকৃত" },
        { en: "100 ton/month, scalable to 500", bn: "মাসে ১০০ টন, ৫০০ টন পর্যন্ত সম্প্রসারণযোগ্য" },
      ],
      accent: "text-teal-700",
      bar: "bg-teal-600",
    },
  ];

  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-3">
      {products.map((product, index) => (
        <Reveal key={product.href} delay={index * 70}>
          <Card className="flex h-full flex-col overflow-hidden" interactive>
            <span className={clsx("block h-1.5 w-full", product.bar)} aria-hidden="true" />
            <div className="flex flex-1 flex-col p-7">
              <span className="flex items-center gap-2">
                <BrandDot brand={product.brand} />
                <h3 className={clsx("font-display text-xl font-bold", product.accent)}>
                  {t(product.name, locale)}
                </h3>
              </span>
              <p className="mt-2 text-[15px] text-stone-600">{t(product.line, locale)}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {product.bullets.map((bullet) => (
                  <li key={bullet.en} className="flex gap-2 text-sm leading-relaxed text-stone-600">
                    <Icon name="check" size={15} className={clsx("mt-1 shrink-0", product.accent)} />
                    {t(bullet, locale)}
                  </li>
                ))}
              </ul>
              <Link
                href={localePath(locale, product.href)}
                className={clsx(
                  "group mt-6 inline-flex items-center gap-1.5 font-display text-sm font-semibold",
                  product.accent,
                )}
              >
                {locale === "en" ? "Learn more" : "আরও জানুন"}
                <Icon
                  name="arrow-right"
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

/* --------------------------------------------------- investor testimonials -- */

/**
 * Investor testimonials from the admin's panel.
 *
 * Deliberately separate from `TestimonialCarousel`, which carries **Shathi
 * partner** stories gated behind written consent. These are investors who
 * submitted a testimonial through the product; conflating the two would put
 * partner-consent rules on investor copy and vice versa.
 *
 * Renders nothing when the CMS has no rows — an empty band is worse than none.
 */
export async function InvestorVoiceBand({ locale }: { locale: Locale }) {
  const voices = await fetchInvestorVoices();
  if (voices.length === 0) return null;

  const en = locale === "en";

  return (
    <Section tone="surface">
      <div className="container-page">
        <SectionHead
          eyebrow={en ? "Investors" : "বিনিয়োগকারী"}
          title={en ? "Why they funded a cycle" : "তাঁরা কেন একটি চক্রে অর্থ দিলেন"}
        />
        <ul className="mt-10 grid gap-5 lg:grid-cols-2">
          {voices.map((voice) => (
            <li key={voice.id}>
              <Card className="flex h-full gap-5 p-6">
                {voice.photo && (
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-stone-100">
                    <Image src={voice.photo} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                )}
                <div className="flex flex-col">
                  <blockquote className="text-[15px] leading-relaxed text-stone-700">
                    “{t(voice.quote, locale)}”
                  </blockquote>
                  <p className="mt-4 font-display text-sm font-bold text-stone-900">
                    {t(voice.name, locale)}
                  </p>
                  {voice.rating !== null && (
                    <p
                      className="text-xs text-stone-400"
                      /* The stars are decoration; the number is the accessible value. */
                      aria-label={
                        en
                          ? `Rated ${voice.rating} out of 5`
                          : `৫-এর মধ্যে ${voice.rating} রেটিং`
                      }
                    >
                      <span aria-hidden>{"★".repeat(Math.round(voice.rating))}</span>{" "}
                      {voice.rating.toFixed(1)}/5
                    </p>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- partners -- */

/**
 * One logo in the marquee.
 *
 * The name is a tooltip and screen-reader text rather than a printed caption:
 * a row of captions under a moving band is unreadable, and the marks are what
 * carry recognition. It fades in on hover for anyone who wants to check.
 */
function PartnerLogoItem({ name, logo }: { name: string; logo: string | null }) {
  return (
    <span className="group relative mx-8 flex shrink-0 flex-col items-center lg:mx-12" title={name}>
      {logo ? (
        /*
          Constrained by HEIGHT, not by a fixed box.

          With a fixed width and `object-contain`, a wide wordmark fills the
          width and ends up visually tiny, while a square mark fills the height
          and towers over it — the row looked like a set of unrelated sizes. A
          common height with width left to flex is what makes a logo strip read
          as one band. `max-w` only catches the extreme outliers.
        */
        <Image
          src={logo}
          alt=""
          width={320}
          height={120}
          sizes="200px"
          className="h-10 w-auto max-w-[11rem] object-contain opacity-70 mix-blend-multiply grayscale transition duration-500 ease-standard group-hover:opacity-100 group-hover:grayscale-0 lg:h-12 lg:max-w-[13rem]"
        />
      ) : (
        <span className="flex h-10 items-center justify-center lg:h-12">
          <span className="font-display text-base font-bold text-stone-400">{name}</span>
        </span>
      )}
      <span className="pointer-events-none absolute -bottom-5 font-display text-xs font-semibold text-stone-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {name}
      </span>
      <span className="sr-only">{name}</span>
    </span>
  );
}

/**
 * Partner band, from the admin's Partnerships panel.
 *
 * Async server component: it fetches its own data so both callers (home and
 * about) stay unchanged. Logos come from the CMS, so the "logos pending" note
 * only appears when the fetch failed and the drafted, logo-less list is what is
 * on screen.
 *
 * The drafted list carried a one-line note per partner ("Incubation", "Impact
 * lending"); the API has no such column, so live rows render as the logo and
 * name alone rather than having a role attributed to them.
 */
export async function PartnerBand({ locale }: { locale: Locale }) {
  const { data: partnerRows, stale } = await fetchPartners();
  const noteBySeedName = new Map(seedPartners.map((p) => [p.name, p.note] as const));

  return (
    <Section tone="surface" id="partners">
      <div className="container-page">
        <SectionHead
          eyebrow={locale === "en" ? "Partners & supporters" : "অংশীদার ও সহযোগী"}
          title={
            locale === "en"
              ? "We do not do this alone"
              : "এই কাজ আমরা একা করি না"
          }
          lead={
            locale === "en"
              ? "Cooperatives mobilise and verify. Development partners fund and challenge us. Lenders decide credit. Our job is to make each of those handoffs work."
              : "সমবায় সংগঠিত ও যাচাই করে। উন্নয়ন সহযোগীরা অর্থায়ন করেন এবং প্রশ্ন তোলেন। ঋণদাতারা ঋণের সিদ্ধান্ত নেন। আমাদের কাজ এই প্রতিটি হস্তান্তর কার্যকর করা।"
          }
        />
        {/*
          One continuous line that never wraps, rather than a grid of tiles.

          The list is rendered twice inside the track: the CSS slides it by
          exactly -50%, so the second copy arrives where the first started and
          the loop is seamless. It pauses on hover and on keyboard focus.

          Names are not printed under the logos — a row of captions competes
          with the marks themselves. Each logo carries its name as a tooltip and
          as screen-reader text, and it surfaces visually on hover.
          `aria-hidden` on the duplicate keeps assistive technology from reading
          the whole list twice.

          The duration scales with the number of logos so the band always moves
          at roughly the same speed, however many partners the CMS holds.
        */}
        <div
          className="marquee mt-12"
          style={
            { "--marquee-duration": `${Math.max(24, partnerRows.length * 7)}s` } as CSSProperties
          }
        >
          <ul className="marquee__track items-center">
            {[0, 1].map((copy) => (
              <li key={copy} aria-hidden={copy === 1} className="contents">
                {partnerRows.map((partner) => (
                  <PartnerLogoItem
                    key={`${copy}-${partner.id}`}
                    name={t(partner.name, locale)}
                    logo={partner.logo}
                  />
                ))}
              </li>
            ))}
          </ul>
        </div>
        {stale && (
          <p className="mt-5 text-xs text-stone-400">
            {locale === "en"
              ? "Showing a cached partner list — logos unavailable right now."
              : "অংশীদারদের সংরক্ষিত তালিকা দেখানো হচ্ছে — লোগো এই মুহূর্তে পাওয়া যাচ্ছে না।"}
          </p>
        )}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------- app / CTA band -- */

export function AppDownloadBand({ locale }: { locale: Locale }) {
  return (
    <Section tone="surface">
      <div className="container-page">
        <div
          data-brand="shathi"
          className="grid items-center gap-10 overflow-hidden rounded-xl bg-brand-canvas p-8 lg:grid-cols-2 lg:p-14"
        >
          <div>
            <p className="eyebrow">{locale === "en" ? "The Shathi app" : "সাথী অ্যাপ"}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-stone-900 lg:text-4xl">
              {locale === "en"
                ? "Track every project from your phone"
                : "প্রতিটি প্রকল্প দেখুন আপনার ফোনেই"}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-stone-600">
              {locale === "en"
                ? "Browse open projects, fund a unit, and follow milestones, financial summaries and impact updates through the cycle."
                : "চলমান প্রকল্প দেখুন, ইউনিট কিনুন, আর চক্র জুড়ে মাইলফলক, আর্থিক সারসংক্ষেপ ও প্রভাবের হালনাগাদ অনুসরণ করুন।"}
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
          <div className="relative mx-auto w-full max-w-md">
            <Image
              src="/assets/app/shathi-mockup-1.webp"
              alt={
                locale === "en"
                  ? "The Shathi app showing the open projects list"
                  : "সাথী অ্যাপে চলমান প্রকল্পের তালিকা"
              }
              width={900}
              height={780}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

export function CtaBand({
  locale,
  title,
  lead,
  primary,
  secondary,
}: {
  locale: Locale;
  title?: ReactNode;
  lead?: ReactNode;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <Section tone="dark" compact>
      <div className="container-page">
        <div className="flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl leading-tight font-bold text-balance text-white lg:text-3xl">
              {title ??
                (locale === "en"
                  ? "Invest in people, empower communities, shape a sustainable future."
                  : "মানুষে বিনিয়োগ করুন, জনপদকে শক্তি দিন, টেকসই আগামী গড়ুন।")}
            </h2>
            {lead && <p className="mt-3 text-white/75">{lead}</p>}
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink
              href={localePath(locale, primary?.href ?? routes.projects)}
              variant="inverse"
              icon="arrow-right"
              size="lg"
            >
              {primary?.label ?? (locale === "en" ? "Explore projects" : "প্রকল্প দেখুন")}
            </ButtonLink>
            <ButtonLink
              href={localePath(locale, secondary?.href ?? routes.contact)}
              variant="secondary"
              size="lg"
              className="border-white/35 text-white hover:bg-white/10 hover:border-white/60"
            >
              {secondary?.label ?? (locale === "en" ? "Contact us" : "যোগাযোগ করুন")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- misc -- */

export function SdgRow({ locale }: { locale: Locale }) {
  const goals = [
    { n: 1, en: "No poverty", bn: "দারিদ্র্যমুক্তি" },
    { n: 2, en: "Zero hunger", bn: "ক্ষুধামুক্তি" },
    { n: 5, en: "Gender equality", bn: "লিঙ্গ সমতা" },
    { n: 10, en: "Reduced inequalities", bn: "বৈষম্য হ্রাস" },
    { n: 12, en: "Responsible consumption", bn: "দায়িত্বশীল ভোগ" },
    { n: 13, en: "Climate action", bn: "জলবায়ু পদক্ষেপ" },
  ];

  return (
    <ul className="flex flex-wrap gap-3">
      {goals.map((goal) => (
        <li key={goal.n}>
          <Badge tone="brand" className="!border-white/25 !bg-white/10 !text-white">
            SDG {goal.n} · {locale === "en" ? goal.en : goal.bn}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

export function ViewAllLink({ locale, href, label }: { locale: Locale; href: string; label?: string }) {
  return (
    <ArrowLink href={localePath(locale, href)}>
      {label ?? (locale === "en" ? "View all projects" : "সব প্রকল্প দেখুন")}
    </ArrowLink>
  );
}
