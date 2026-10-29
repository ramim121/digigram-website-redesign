import Image from "next/image";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { ViewAllLink } from "@/components/sections/Shared";
import { feedFacts, feedFormulas, feedPricesAsOf, type FeedFormula } from "@/content/feed";
import { formatBdt, formatDate, localePath, t, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * Shadhin Cattle Feed, at two depths.
 *
 * `FeedSection` is the homepage summary — the three formulas by purpose and
 * the production facts. `FeedRange` is the feed page's full catalogue —
 * ingredients, both nutrition bases, and the listed price with its date.
 * Both read `content/feed.ts`, which is transcribed from the same product
 * records the Shathi Sheba app sells from.
 *
 * Prices appear only on the feed page and always with the date they were
 * listed: a price on a homepage outlives the price list, and an undated one
 * reads as a promise.
 */

export function FeedSection({ locale }: { locale: Locale }) {
  const en = locale === "en";

  return (
    <Section tone="surface" id="feed">
      <div className="container-page">
        <SectionHead
          eyebrow={en ? "Shadhin Cattle Feed" : "স্বাধীন গরুর খাবার"}
          title={en ? "Feed made in the village, for the village" : "গ্রামেই তৈরি, গ্রামের জন্য খাবার"}
          lead={
            en
              ? "Compound cattle feed made to Department of Livestock Services standards at our factory in Natore, with rural women's cooperatives — and delivered to the farms that use it through cooperatives and the Shathi Sheba app."
              : "প্রাণিসম্পদ অধিদপ্তরের মান মেনে নাটোরে আমাদের কারখানায়, গ্রামীণ নারী সমবায়ের সঙ্গে তৈরি গরুর কম্পাউন্ড খাবার — যা সমবায় ও সাথী সেবা অ্যাপের মাধ্যমে পৌঁছে যায় খামারে।"
          }
          action={
            <ViewAllLink
              locale={locale}
              href={routes.shadhinFeed}
              label={en ? "The full range" : "পুরো তালিকা"}
            />
          }
        />

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {feedFormulas.map((formula, index) => (
            <Reveal key={formula.sku} delay={index * 70} as="li">
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                <div className="relative aspect-[3/2] bg-stone-100">
                  <Image
                    src={formula.image}
                    alt={en ? `${t(formula.productName, locale)} — a sack of compound feed` : t(formula.productName, locale)}
                    fill
                    sizes="(min-width: 768px) 380px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-display text-xs font-bold tracking-widest text-brand-strong uppercase">
                    {t(formula.productName, locale)}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-bold text-stone-900">
                    {t(formula.name, locale)}
                  </h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-stone-600">
                    {t(formula.purpose, locale)}
                  </p>
                  <NutritionStrip formula={formula} locale={locale} />
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <ul className="mt-10 grid gap-6 rounded-xl border border-stone-200 bg-stone-50 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
          {feedFacts.map((fact) => (
            <li key={fact.value.en} className="flex gap-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                <Icon name={fact.icon} size={19} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg leading-tight font-bold text-stone-900">
                  {t(fact.value, locale)}
                </p>
                <p className="mt-1 text-sm leading-snug text-stone-600">{t(fact.label, locale)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/** TDN and DCP on the one basis all three formulas share, plus the pack. */
function NutritionStrip({ formula, locale }: { formula: FeedFormula; locale: Locale }) {
  const en = locale === "en";
  return (
    <div className="mt-5 border-t border-stone-100 pt-4">
      <dl className="grid grid-cols-3 gap-3 text-center">
        <div>
          <dt className="text-[11px] text-stone-500">{en ? "Energy (TDN)" : "শক্তি (টিডিএন)"}</dt>
          <dd className="mt-0.5 font-display text-base font-bold text-stone-900">{formula.tdnDm}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-stone-500">{en ? "Protein (DCP)" : "প্রোটিন (ডিসিপি)"}</dt>
          <dd className="mt-0.5 font-display text-base font-bold text-stone-900">{formula.dcpDm}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-stone-500">{en ? "Pack" : "প্যাক"}</dt>
          <dd className="mt-0.5 font-display text-base font-bold text-stone-900">{t(formula.packSize, locale)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-center text-[10px] text-stone-400">
        {en ? "Nutrition on a dry-matter basis" : "পুষ্টিমান শুষ্ক পদার্থ ভিত্তিতে"}
      </p>
    </div>
  );
}

/**
 * The full catalogue for the feed page: everything a farmer, a cooperative or
 * a buyer needs to choose between the three formulas.
 */
export function FeedRange({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const asOf = formatDate(feedPricesAsOf, locale);

  return (
    <Section tone="surface" id="range">
      <div className="container-page">
        <SectionHead
          eyebrow={en ? "The range" : "খাবারের ধরন"}
          title={en ? "One feed for each stage of the animal's life" : "পশুর প্রতিটি ধাপের জন্য আলাদা খাবার"}
          lead={
            en
              ? "Three formulas, each balanced for a different job — steady growth, a strong finish before sale, or milk. Every ingredient is listed, because a farmer deciding what to feed deserves to know what is in the sack."
              : "তিনটি ফর্মুলা, প্রতিটি আলাদা কাজের জন্য সাজানো — নিয়মিত বৃদ্ধি, বিক্রির আগে ভালো ফিনিশিং, অথবা দুধ। প্রতিটি উপাদানের নাম দেওয়া আছে, কারণ কী খাওয়াবেন তা ঠিক করার আগে বস্তায় কী আছে জানার অধিকার কৃষকের আছে।"
          }
        />

        <div className="mt-12 space-y-8">
          {feedFormulas.map((formula) => (
            <Reveal key={formula.sku} as="article">
              <div className="grid overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm lg:grid-cols-12">
                <div className="relative aspect-[3/2] bg-stone-100 lg:col-span-4 lg:aspect-auto">
                  <Image
                    src={formula.image}
                    alt={en ? `${t(formula.productName, locale)} — a sack of compound feed` : t(formula.productName, locale)}
                    fill
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6 lg:col-span-8 lg:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-xs font-bold tracking-widest text-brand-strong uppercase">
                        {t(formula.productName, locale)}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-bold text-stone-900">{t(formula.name, locale)}</h3>
                      <p className="mt-1 text-[15px] text-stone-600">{t(formula.purpose, locale)}</p>
                    </div>
                    <div className="text-end">
                      <p className="font-display text-2xl leading-none font-extrabold text-stone-900">
                        {formatBdt(formula.mrpPerKg, locale)}
                        <span className="text-sm font-semibold text-stone-500"> / {en ? "kg" : "কেজি"}</span>
                      </p>
                      <p className="mt-1.5 text-[11px] text-stone-500">
                        {en ? `MRP · listed ${asOf}` : `সর্বোচ্চ খুচরা মূল্য · ${asOf}`}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-[15px] leading-relaxed text-stone-700">{t(formula.benefits, locale)}</p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="font-display text-xs font-bold tracking-wide text-stone-500 uppercase">
                        {en ? "Nutrition" : "পুষ্টিমান"}
                      </p>
                      {/*
                        The columns follow the data. Grower is recorded on a
                        dry-matter basis only, and a column of dashes beside it
                        says nothing a reader can use — so the "As fed" column
                        appears only for formulas that have one, and dry matter
                        is stated as a caption rather than as a row whose
                        dry-matter cell is 100% by definition.
                      */}
                      <table className="mt-2 w-full text-sm">
                        <thead>
                          <tr className="border-b border-stone-200 text-start text-[11px] text-stone-500">
                            <th scope="col" className="py-1.5 pe-2 text-start font-semibold">
                              <span className="sr-only">{en ? "Measure" : "পরিমাপ"}</span>
                            </th>
                            <th scope="col" className="py-1.5 pe-2 text-start font-semibold">
                              {en ? "Dry-matter basis" : "শুষ্ক পদার্থ ভিত্তিতে"}
                            </th>
                            {formula.asFed && (
                              <th scope="col" className="py-1.5 text-start font-semibold">
                                {en ? "As fed" : "খাওয়ানোর অবস্থায়"}
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="text-stone-800">
                          <tr className="border-b border-stone-100">
                            <th scope="row" className="py-1.5 pe-2 text-start font-medium text-stone-600">
                              {en ? "Energy (TDN)" : "শক্তি (টিডিএন)"}
                            </th>
                            <td className="py-1.5 pe-2 font-semibold">{formula.tdnDm}</td>
                            {formula.asFed && <td className="py-1.5">{formula.asFed.tdn}</td>}
                          </tr>
                          <tr>
                            <th scope="row" className="py-1.5 pe-2 text-start font-medium text-stone-600">
                              {en ? "Protein (DCP)" : "প্রোটিন (ডিসিপি)"}
                            </th>
                            <td className="py-1.5 pe-2 font-semibold">{formula.dcpDm}</td>
                            {formula.asFed && <td className="py-1.5">{formula.asFed.dcp}</td>}
                          </tr>
                        </tbody>
                      </table>
                      {formula.asFed && (
                        <p className="mt-2 text-xs text-stone-500">
                          {en
                            ? `Dry matter: ${formula.asFed.dm} of the feed as fed.`
                            : `শুষ্ক পদার্থ: খাওয়ানোর অবস্থায় খাবারের ${formula.asFed.dm}।`}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="font-display text-xs font-bold tracking-wide text-stone-500 uppercase">
                        {en ? "Ingredients" : "উপাদান"}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-stone-600">{t(formula.ingredients, locale)}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-stone-100 pt-5 text-sm text-stone-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="layers" size={15} className="text-stone-400" />
                      {t(formula.packSize, locale)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="truck" size={15} className="text-stone-400" />
                      {en ? "Delivered in " : "ডেলিভারি "}
                      {t(formula.deliveryWindow, locale)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="tag" size={15} className="text-stone-400" />
                      {formula.sku}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-5 rounded-xl bg-brand-canvas p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <div className="max-w-2xl">
            <p className="font-display text-lg font-bold text-stone-900">
              {en ? "Order in the Shathi Sheba app" : "সাথী সেবা অ্যাপে অর্ডার করুন"}
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-stone-600">
              {en
                ? "Each listing names the maker, the distributor and the area it delivers to, so a farmer knows before ordering whether it reaches their village."
                : "প্রতিটি তালিকায় প্রস্তুতকারক, পরিবেশক ও ডেলিভারি এলাকার নাম থাকে — তাই অর্ডারের আগেই কৃষক জানেন খাবারটি তাঁর গ্রামে পৌঁছাবে কি না।"}
            </p>
          </div>
          <ButtonLink href={localePath(locale, routes.shathiSheba)} icon="arrow-right" className="shrink-0">
            {en ? "About Shathi Sheba" : "সাথী সেবা সম্পর্কে"}
          </ButtonLink>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-stone-400">
          {en
            ? `Prices are maximum retail prices per kilogram as listed in the Shathi Sheba app on ${asOf}, and may change with input costs. Nutrition values are as declared on each product's listing.`
            : `দাম প্রতি কেজির সর্বোচ্চ খুচরা মূল্য, যা ${asOf} তারিখে সাথী সেবা অ্যাপে তালিকাভুক্ত ছিল; উপকরণের দামের সঙ্গে তা বদলাতে পারে। পুষ্টিমান প্রতিটি পণ্যের তালিকায় ঘোষিত মান অনুযায়ী।`}
        </p>
      </div>
    </Section>
  );
}
