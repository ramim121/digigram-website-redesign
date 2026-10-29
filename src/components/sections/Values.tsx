import Image from "next/image";
import clsx from "clsx";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ArrowLink } from "@/components/ui/Button";
import { careStats, companyPurpose, coreValues } from "@/content/company";
import { localePath, t, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * The homepage's statement of purpose, and the care-economy band.
 *
 * WHY THE HOMEPAGE NOW OPENS HERE
 * The homepage used to answer "how do I invest?" before it answered "what is
 * this company?". Investing still has its own pages; the front door now says
 * what DigiGram is for — sustainable agriculture, eco-friendly value chains and
 * the care economy, in service of rural households and of women and people with
 * disabilities in particular — and lets every product be read as a means to
 * that end.
 */

const valueIcons: Record<string, IconName> = {
  agriculture: "sprout",
  "value-chains": "leaf",
  care: "handshake",
  inclusion: "accessibility",
};

export function MissionValues({ locale }: { locale: Locale }) {
  const en = locale === "en";

  return (
    <Section tone="surface" id="who-we-are">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow">{en ? "Who we are" : "আমরা কারা"}</p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-stone-900 lg:text-4xl">
              {en
                ? "A for-profit company with a rural purpose"
                : "গ্রামীণ উদ্দেশ্য নিয়ে একটি মুনাফাভিত্তিক কোম্পানি"}
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-stone-600">
              {t(companyPurpose, locale)}
            </p>
            <div className="mt-7">
              <ArrowLink href={localePath(locale, routes.about)}>
                {en ? "Our story and team" : "আমাদের গল্প ও দল"}
              </ArrowLink>
            </div>
          </div>

          {/* The photograph is a commissioned illustration of the work, not a
              record of a specific meeting, so it carries no place or name. A
              caption naming a village would imply documentary evidence the
              image is not. */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100 shadow-lg">
              <Image
                src="/assets/photos/hero/about-cooperative.webp"
                alt={
                  en
                    ? "Members of a women's cooperative meeting in the shade of a village courtyard"
                    : "গ্রামের আঙিনার ছায়ায় একটি নারী সমবায়ের সভা"
                }
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value, index) => (
            <Reveal key={value.key} delay={index * 60} as="li">
              <div className="flex h-full flex-col rounded-lg border border-stone-200 bg-stone-50/60 p-6">
                <span className="flex size-10 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                  <Icon name={valueIcons[value.key] ?? "leaf"} size={20} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-stone-900">
                  {t(value.title, locale)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{t(value.body, locale)}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/**
 * The care economy: the gap, and who we work with.
 *
 * The figures are paired deliberately — two describing the problem, two
 * describing DigiGram's own base — and labelled as such, so a context statistic
 * is never mistaken for a claim about our own results. Each carries its source.
 */
export function CareEconomyBand({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const groups: { kind: "gap" | "base"; label: string }[] = [
    { kind: "gap", label: en ? "The gap" : "ব্যবধান" },
    { kind: "base", label: en ? "Who we work with" : "আমরা যাঁদের সঙ্গে কাজ করি" },
  ];

  return (
    <Section tone="tint" id="care-economy">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Cropped toward the subject: she stands right of centre in the
              frame, and a portrait crop centred on the image would cut her. */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-xl bg-stone-100 shadow-lg">
              <Image
                src="/assets/photos/hero/impact-producer.webp"
                alt={
                  en
                    ? "A woman farmer holding a basket of freshly picked okra in her vegetable plot"
                    : "নিজের সবজি খেতে সদ্য তোলা ঢেঁড়সের ঝুড়ি হাতে এক নারী কৃষক"
                }
                fill
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover object-[68%_center]"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="eyebrow">{en ? "The care economy" : "কেয়ার ইকোনমি"}</p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-stone-900 lg:text-4xl">
              {en
                ? "Rural women carry the work nobody pays for"
                : "যে কাজের পারিশ্রমিক কেউ দেয় না, তার ভার গ্রামের নারীর কাঁধে"}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-stone-700">
              {en
                ? "Every hour spent caring for children and elders, cooking and fetching water is an hour not available for paid work — and it falls overwhelmingly on women. A livelihood that ignores this fails the people it is meant for. Ours are built around it: work from the homestead, training on the phone, and advice that is read aloud."
                : "শিশু ও বয়স্কদের দেখাশোনা, রান্না আর পানি আনার প্রতিটি ঘণ্টা উপার্জনের কাজ থেকে কেটে নেওয়া সময় — আর এর বেশিরভাগই পড়ে নারীর ওপর। যে জীবিকা এটি উপেক্ষা করে, তা যাঁদের জন্য তৈরি তাঁদেরই কাজে আসে না। আমাদের জীবিকা এর চারপাশ ঘিরেই গড়া: বাড়ি থেকে কাজ, ফোনে প্রশিক্ষণ, আর পড়ে শোনানো পরামর্শ।"}
            </p>

            <div className="mt-9 grid gap-8 sm:grid-cols-2">
              {groups.map((group) => (
                <div key={group.kind}>
                  <p
                    className={clsx(
                      "font-display text-xs font-bold tracking-widest uppercase",
                      group.kind === "gap" ? "text-terracotta-700" : "text-brand-strong",
                    )}
                  >
                    {group.label}
                  </p>
                  <dl className="mt-4 space-y-5">
                    {careStats
                      .filter((stat) => stat.kind === group.kind)
                      .map((stat) => (
                        <div key={stat.value.en} className="border-s-2 border-stone-300 ps-4">
                          <dt className="sr-only">{t(stat.label, locale)}</dt>
                          <dd>
                            <span className="block font-display text-3xl leading-none font-extrabold text-stone-900">
                              {t(stat.value, locale)}
                            </span>
                            <span className="mt-1.5 block text-sm leading-snug text-stone-600">
                              {t(stat.label, locale)}
                            </span>
                            <span className="mt-1 block text-[11px] text-stone-400">{stat.source}</span>
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>
              ))}
            </div>

            <div className="mt-9">
              <ArrowLink href={`${localePath(locale, routes.impact)}#inclusion`}>
                {en ? "How we design for inclusion" : "অন্তর্ভুক্তির জন্য আমরা যেভাবে নকশা করি"}
              </ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
