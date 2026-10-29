import Image from "next/image";
import clsx from "clsx";
import { Badge } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ArrowLink } from "@/components/ui/Button";
import { apaAccess, apaCapabilities, apaPrinciples } from "@/content/apa";
import { localePath, t, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * Shathi Apa, the agricultural assistant inside Shathi Sheba.
 *
 * TWO DEPTHS, ONE SOURCE
 * `variant="home"` is the homepage summary: four capabilities, one principle,
 * a hand-off. `variant="full"` is the product page: every capability, every
 * principle, and how access works. Both read from `content/apa.ts`, so the two
 * pages cannot describe different assistants — and they deliberately do not
 * print the same text, so the product page is worth the click.
 *
 * WHY THE PRINCIPLES GET SO MUCH ROOM
 * "AI assistant" is a phrase a farmer, a lender and a donor have all learned to
 * distrust. What makes this one different is what it refuses to do: it will
 * not state a price, a dose or a date it did not fetch, and it will not
 * diagnose with certainty. Those refusals are the product, so they are shown
 * as prominently as the features.
 */
export function ApaSection({
  locale,
  variant = "home",
  tone = "canvas",
}: {
  locale: Locale;
  variant?: "home" | "full";
  /**
   * Background. Canvas (the brand tint) on the homepage, where it follows the
   * dark Shathi Sheba band; white on the product page, where it sits between a
   * neutral section and a canvas one and has to alternate with both.
   */
  tone?: "canvas" | "surface";
}) {
  const en = locale === "en";
  const full = variant === "full";
  const capabilities = full ? apaCapabilities : apaCapabilities.slice(0, 4);

  return (
    <section
      data-brand="shathi-sheba"
      id="shathi-apa"
      className={clsx("section", tone === "canvas" ? "bg-brand-canvas" : "bg-white")}
    >
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ------------------------------------------------------ copy -- */}
          <div className={full ? "lg:col-span-7" : "lg:col-span-6"}>
            <p className="eyebrow inline-flex items-center gap-2">
              <Icon name="message-circle" size={14} />
              {en ? "Shathi Apa · AI farm assistant" : "সাথী আপা · এআই কৃষি সহায়ক"}
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-stone-900 lg:text-4xl">
              {full
                ? en
                  ? "The adviser in every farmer's pocket"
                  : "প্রত্যেক কৃষকের পকেটে একজন পরামর্শক"
                : en
                  ? "An adviser who speaks Bangla — and admits what she doesn't know"
                  : "বাংলায় কথা বলা এক পরামর্শক — যিনি না জানলে সেটাও বলেন"}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-stone-700">
              {en
                ? "Shathi Apa answers questions on crops, livestock, poultry, fish, farm weather, markets and money — by voice, text or photo — and reads every answer aloud. Apa means elder sister in Bangla: someone you can ask without embarrassment."
                : "সাথী আপা ফসল, গবাদিপশু, হাঁস-মুরগি, মাছ, কৃষির আবহাওয়া, বাজার আর টাকাপয়সা নিয়ে প্রশ্নের উত্তর দেন — কণ্ঠে, লিখে বা ছবিতে — আর প্রতিটি উত্তর পড়ে শোনান। আপা মানে বড় বোন: যাঁকে নির্দ্বিধায় জিজ্ঞেস করা যায়।"}
            </p>

            <ul className={clsx("mt-9 grid gap-x-8 gap-y-6", full ? "sm:grid-cols-2" : "")}>
              {capabilities.map((capability, index) => (
                <Reveal key={capability.title.en} delay={index * 50} as="li">
                  <div className="flex gap-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-strong shadow-sm ring-1 ring-brand-line">
                      <Icon name={capability.icon} size={18} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="flex flex-wrap items-center gap-2 font-display text-[15px] font-bold text-stone-900">
                        {t(capability.title, locale)}
                        {capability.status === "rolling-out" && (
                          <Badge tone="muted">{en ? "Rolling out" : "চালু হচ্ছে"}</Badge>
                        )}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-stone-600">
                        {t(capability.body, locale)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>

            {!full && (
              <>
                {/* One principle, quoted, on the homepage: the one that most
                    separates this from a generic chatbot. */}
                <blockquote className="mt-9 border-s-4 border-brand ps-5">
                  <p className="font-display text-lg leading-snug font-bold text-stone-900">
                    {t(apaPrinciples[0].title, locale)}
                  </p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-stone-600">
                    {t(apaPrinciples[0].body, locale)}
                  </p>
                </blockquote>
                <div className="mt-8">
                  <ArrowLink href={`${localePath(locale, routes.shathiSheba)}#shathi-apa`}>
                    {en ? "Meet Shathi Apa" : "সাথী আপার সঙ্গে পরিচিত হোন"}
                  </ArrowLink>
                </div>
              </>
            )}

            {full && (
              <p className="mt-9 flex items-start gap-2.5 rounded-lg border border-brand-line bg-white p-5 text-[15px] leading-relaxed text-stone-700">
                <Icon name="info" size={18} className="mt-0.5 shrink-0 text-brand-strong" />
                <span>{t(apaAccess, locale)}</span>
              </p>
            )}
          </div>

          {/* ------------------------------------------------ conversation -- */}
          <div className={full ? "lg:col-span-5" : "lg:col-span-6"}>
            <div className="lg:sticky lg:top-28">
              <ApaConversation locale={locale} />
            </div>
          </div>
        </div>

        {full && (
          <div className="mt-16 border-t border-brand-line pt-14">
            <h3 className="font-display text-2xl font-bold tracking-tight text-stone-900">
              {en ? "The rules she answers by" : "যে নিয়মে তিনি উত্তর দেন"}
            </h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-stone-600">
              {en
                ? "Taken from Shathi Apa's own instructions. An assistant that will say \"I couldn't fetch that\" is the only kind worth trusting with a price or a sick animal."
                : "সাথী আপার নিজস্ব নির্দেশনা থেকে নেওয়া। যে সহায়ক \"তথ্যটি আনতে পারিনি\" বলতে পারে, দাম বা অসুস্থ পশুর ব্যাপারে কেবল তার ওপরই ভরসা করা যায়।"}
            </p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {apaPrinciples.map((principle, index) => (
                <Reveal key={principle.title.en} delay={index * 60} as="li">
                  <div className="flex h-full flex-col rounded-lg border border-brand-line bg-white p-6">
                    <span className="font-mono text-sm font-semibold text-brand/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mt-2 font-display text-[17px] font-bold text-stone-900">
                      {t(principle.title, locale)}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      {t(principle.body, locale)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * An illustrative exchange, labelled as one.
 *
 * Built in markup rather than as a screenshot so it renders in the reader's
 * language and stays sharp at any size. The two turns are chosen to show the
 * two behaviours that matter: an answer that leans on live data and cites it,
 * and a photo estimate that says plainly it is an estimate. Nothing in it gives
 * a dose or a diagnosis — Apa would not, so the example does not either.
 */
function ApaConversation({ locale }: { locale: Locale }) {
  const en = locale === "en";

  return (
    <figure>
      <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-xl">
        {/* header */}
        <div className="flex items-center gap-3 border-b border-stone-100 bg-brand-strong px-5 py-3.5 text-white">
          <span className="flex size-9 items-center justify-center rounded-full bg-white">
            <Image src="/assets/brand/shathi-sheba-mark.svg" alt="" width={137} height={174} className="h-6 w-auto" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold">{en ? "Shathi Apa" : "সাথী আপা"}</p>
            <p className="text-xs text-white/70">{en ? "Answers in Bangla · reads aloud" : "বাংলায় উত্তর · পড়ে শোনান"}</p>
          </div>
        </div>

        <div className="space-y-4 bg-stone-50 px-4 py-5 sm:px-5">
          {/* turn 1 — a voice question that needs live weather */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-ee-sm bg-brand px-4 py-3 text-on-brand">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold opacity-80">
                <Icon name="phone" size={12} />
                {en ? "Voice question · 0:06" : "কণ্ঠে প্রশ্ন · ০:০৬"}
              </p>
              <p className="mt-1 text-[15px] leading-snug">
                {en ? "Can I spread fertiliser on the paddy today?" : "আজ কি ধানখেতে সার দেওয়া যাবে?"}
              </p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[88%] rounded-2xl rounded-es-sm bg-white px-4 py-3 shadow-sm ring-1 ring-stone-200">
              <p className="text-[15px] leading-snug text-stone-800">
                {en
                  ? "Better to wait. Rain is likely this afternoon and would wash it off. Spread it tomorrow morning, once the field has drained."
                  : "আজ না দেওয়াই ভালো। বিকেলে বৃষ্টির সম্ভাবনা আছে, সার ধুয়ে যাবে। কাল সকালে খেতের পানি নামলে দিন।"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800 ring-1 ring-sky-100">
                  <Icon name="cloud-sun" size={12} />
                  {en ? "Live weather · Natore" : "সরাসরি আবহাওয়া · নাটোর"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-semibold text-brand-strong">
                  <Icon name="play" size={11} />
                  {en ? "Listen" : "শুনুন"}
                  <Waveform />
                </span>
              </div>
            </div>
          </div>

          {/* turn 2 — a photo estimate that says it is one */}
          <div className="flex justify-end">
            <div className="max-w-[85%] overflow-hidden rounded-2xl rounded-ee-sm bg-brand text-on-brand">
              <div className="relative h-28 w-56 max-w-full">
                <Image
                  src="/assets/photos/hero/hero-cattle.webp"
                  alt=""
                  fill
                  sizes="224px"
                  className="object-cover object-[32%_62%]"
                />
              </div>
              <p className="px-4 py-2.5 text-[15px] leading-snug">
                {en ? "How heavy is this one?" : "এই গরুটার ওজন কত হবে?"}
              </p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[88%] rounded-2xl rounded-es-sm bg-white px-4 py-3 shadow-sm ring-1 ring-stone-200">
              <div className="flex flex-wrap gap-1.5">
                {(en
                  ? ["≈ 310 kg", "≈ 24 months", "Crossbred"]
                  : ["≈ ৩১০ কেজি", "≈ ২৪ মাস", "শংকর জাত"]
                ).map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md bg-stone-100 px-2 py-1 font-display text-[13px] font-bold text-stone-900"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <p className="mt-2.5 text-[13px] leading-snug text-stone-600">
                {en
                  ? "An estimate from the photo — your field officer confirms the weight on a scale."
                  : "ছবি থেকে আনুমানিক হিসাব — মাঠ কর্মকর্তা স্কেলে ওজন নিশ্চিত করবেন।"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-stone-500">
        {en
          ? "Illustrative conversation. Weather, prices and dates come only from live data."
          : "উদাহরণমূলক কথোপকথন। আবহাওয়া, দাম ও তারিখ আসে কেবল সরাসরি তথ্য থেকে।"}
      </figcaption>
    </figure>
  );
}

/** A static, decorative waveform for the read-aloud chip. */
function Waveform() {
  const bars = [5, 9, 6, 11, 7, 10, 4, 8];
  return (
    <span aria-hidden="true" className="ms-0.5 inline-flex items-center gap-[2px]">
      {bars.map((height, index) => (
        <span key={index} className="w-[2px] rounded-full bg-current opacity-70" style={{ height }} />
      ))}
    </span>
  );
}
