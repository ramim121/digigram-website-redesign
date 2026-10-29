import type { Bi } from "@/lib/i18n";
import type { IconName } from "@/components/ui/Icon";

/**
 * Shadhin Cattle Feed — the range, and the facts behind it.
 *
 * SOURCING
 * The three formulas are transcribed from the Shathi Sheba platform's
 * `products` table (SKUs DG-FEED-GROWER, DG-FEED-FINISHER, DG-FEED-DAIRY) —
 * the same records the app prints on each product page, so the website and
 * the app cannot drift into describing two different products. The production
 * facts come from the July 2026 product overview; the maker and factory from
 * the platform's `manufacturers` record.
 *
 * WHY THE NUTRITION IS SHOWN ON A DRY-MATTER BASIS
 * The platform stores Finisher and Dairy both "as fed" and on a dry-matter
 * basis, but Grower only on a dry-matter basis (its listing reads DM 100%,
 * which is only true of a dry-matter figure). Comparing an as-fed number for
 * one formula with a dry-matter number for another would make the formulas
 * look further apart than they are, so every comparison here uses the one
 * basis all three share. The as-fed values are kept for the detail table.
 *
 * PRICES
 * `mrpPerKg` is the maximum retail price per kilogram listed in the app as of
 * `feedPricesAsOf`. Prices move with input costs, so anything that prints one
 * must print the date beside it.
 */

export const feedPricesAsOf = "2026-09-11";

export type FeedFormula = {
  sku: string;
  stage: "grower" | "finisher" | "dairy";
  /** Short stage name: "Grower". */
  name: Bi;
  /** Full product name as listed: "DigiGram Cattle Feed Grower". */
  productName: Bi;
  purpose: Bi;
  benefits: Bi;
  ingredients: Bi;
  image: string;
  packSize: Bi;
  mrpPerKg: number;
  deliveryWindow: Bi;
  /** Dry-matter basis — comparable across all three formulas. */
  tdnDm: string;
  dcpDm: string;
  /** As fed, where the platform records it. */
  asFed: { dm: string; tdn: string; dcp: string } | null;
};

export const feedFormulas: FeedFormula[] = [
  {
    sku: "DG-FEED-GROWER",
    stage: "grower",
    name: { en: "Grower", bn: "গ্রোয়ার" },
    productName: { en: "DigiGram Cattle Feed Grower", bn: "ডিজিগ্রাম ক্যাটল ফিড গ্রোয়ার" },
    purpose: {
      en: "Steady growth and body development in growing cattle.",
      bn: "বর্ধনশীল গরুর নিয়মিত বৃদ্ধি ও শারীরিক গঠনের জন্য।",
    },
    benefits: {
      en: "Meets the daily energy and protein needs of growing cattle. Regular use keeps body condition, digestion and natural growth on track, and its price keeps a farm's feed cost under control.",
      bn: "বর্ধনশীল গরুর প্রতিদিনের শক্তি ও প্রোটিনের চাহিদা পূরণ করে। নিয়মিত খাওয়ালে শরীরের গঠন, হজম ও স্বাভাবিক বৃদ্ধি ঠিক থাকে, আর দাম কম হওয়ায় খামারের খাদ্য খরচ নিয়ন্ত্রণে থাকে।",
    },
    ingredients: {
      en: "Maize powder, maize bran, DORB, rice polish, wheat bran, molasses (chitagur), local rice bran, soybean meal, mustard oil cake and lentil bran.",
      bn: "ভুট্টা গুঁড়া, মেইজ ব্রান, ডিওআরবি, রাইস পলিশিং, গমের ভুষি, মোলাসেস (চিটাগুড়), দেশি চালের কুঁড়া, সয়াবিন মিল, সরিষার খৈল ও মসুরের ভুষি।",
    },
    image: "/assets/feed/grower.webp",
    packSize: { en: "40 kg sack", bn: "৪০ কেজির বস্তা" },
    mrpPerKg: 40,
    deliveryWindow: { en: "2–3 days", bn: "২–৩ দিন" },
    tdnDm: "79%",
    dcpDm: "14%",
    asFed: null,
  },
  {
    sku: "DG-FEED-FINISHER",
    stage: "finisher",
    name: { en: "Finisher", bn: "ফিনিশার" },
    productName: { en: "DigiGram Cattle Feed Finisher", bn: "ডিজিগ্রাম ক্যাটল ফিড ফিনিশার" },
    purpose: {
      en: "Finishing and market readiness in the final stage before sale.",
      bn: "বিক্রির আগে শেষ ধাপে গরুর ভালো ফিনিশিং ও বাজার-উপযোগিতার জন্য।",
    },
    benefits: {
      en: "Supports final-stage growth, body finishing and meat condition. Maize, wheat, rice polish and molasses meet the energy demand; soybean meal, mustard cake, khesari and lentil bran carry the protein.",
      bn: "শেষ ধাপের বৃদ্ধি, শরীরের ফিনিশিং ও মাংসের মান ভালো রাখে। ভুট্টা, গম, রাইস পলিশিং ও মোলাসেস শক্তির চাহিদা মেটায়; সয়াবিন মিল, সরিষার খৈল, খেসারি ও মসুরের ভুষি জোগায় প্রোটিন।",
    },
    ingredients: {
      en: "Maize powder, crushed wheat, wheat bran, DORB, rice polish, molasses (chitagur), soybean meal, khesari bran, mustard oil cake and lentil bran.",
      bn: "ভুট্টা গুঁড়া, গম ভাঙা, গমের ভুষি, ডিওআরবি, রাইস পলিশিং, মোলাসেস (চিটাগুড়), সয়াবিন মিল, খেসারি ভুষি, সরিষার খৈল ও মসুরের ভুষি।",
    },
    image: "/assets/feed/finisher.webp",
    packSize: { en: "40 kg sack", bn: "৪০ কেজির বস্তা" },
    mrpPerKg: 50,
    deliveryWindow: { en: "2–3 days", bn: "২–৩ দিন" },
    tdnDm: "86.1%",
    dcpDm: "17.2%",
    asFed: { dm: "85%", tdn: "73.2%", dcp: "15%" },
  },
  {
    sku: "DG-FEED-DAIRY",
    stage: "dairy",
    name: { en: "Dairy", bn: "ডেইরি" },
    productName: { en: "DigiGram Cattle Feed Dairy", bn: "ডিজিগ্রাম ক্যাটল ফিড ডেইরি" },
    purpose: {
      en: "Health, strength and milk production in milking cows.",
      bn: "দুধ দেওয়া গাভীর স্বাস্থ্য, শক্তি ও দুধ উৎপাদনের জন্য।",
    },
    benefits: {
      en: "Sustains milk output and body condition. Its protein covers the higher daily requirement of a milking cow; fibre and digestive aids keep the rumen steady, and the mineral package supports long-term herd health.",
      bn: "দুধের উৎপাদন ও গাভীর শরীরের অবস্থা ধরে রাখে। এর প্রোটিন দুধ দেওয়া গাভীর বাড়তি দৈনিক চাহিদা মেটায়; আঁশ ও হজম-সহায়ক উপাদান রুমেন ঠিক রাখে, আর মিনারেল দীর্ঘমেয়াদি স্বাস্থ্য ভালো রাখে।",
    },
    ingredients: {
      en: "Maize powder, maize bran, crushed wheat, wheat bran, DDGS, rice polish, molasses (chitagur), khesari bran, soybean meal, lentil bran, mustard oil cake, angkush bran and sesame cake.",
      bn: "ভুট্টা গুঁড়া, মেইজ ব্রান, গম ভাঙা, গমের ভুষি, ডিডিজিএস, রাইস পলিশিং, মোলাসেস (চিটাগুড়), খেসারি ভুষি, সয়াবিন মিল, মসুরের ভুষি, সরিষার খৈল, আংকুশ ভুষি ও তিলের খৈল।",
    },
    image: "/assets/feed/dairy.webp",
    packSize: { en: "40 kg sack", bn: "৪০ কেজির বস্তা" },
    mrpPerKg: 55,
    deliveryWindow: { en: "2–3 days", bn: "২–৩ দিন" },
    tdnDm: "87%",
    dcpDm: "21%",
    asFed: { dm: "86%", tdn: "74%", dcp: "18%" },
  },
];

/**
 * The production facts, each with its source.
 *
 * "DLS" is Bangladesh's Department of Livestock Services; "ADG" is average
 * daily gain, the standard measure of how fast a fattening animal puts on
 * weight. Both are spelled out where a general reader meets them.
 */
export const feedFacts: { value: Bi; label: Bi; icon: IconName; source: string }[] = [
  {
    icon: "shield",
    value: { en: "DLS-compliant", bn: "ডিএলএস-অনুমোদিত মান" },
    label: {
      en: "Compound feed formulated to Department of Livestock Services standards",
      bn: "প্রাণিসম্পদ অধিদপ্তরের মান অনুযায়ী তৈরি কম্পাউন্ড ফিড",
    },
    source: "Shathi Sheba Product Deck v0.1 — Current products",
  },
  {
    icon: "trending-up",
    value: { en: "900 g/day", bn: "দিনে ৯০০ গ্রাম" },
    label: {
      en: "Average daily weight gain, validated in fattening cycles",
      bn: "মোটাতাজাকরণ চক্রে যাচাই করা গড় দৈনিক ওজন বৃদ্ধি",
    },
    source: "Shathi Sheba Product Deck v0.1 — Current products",
  },
  {
    icon: "layers",
    value: { en: "100 t/month", bn: "মাসে ১০০ টন" },
    label: {
      en: "Production capacity today, scalable to 500 tonnes a month",
      bn: "বর্তমান উৎপাদন সক্ষমতা, যা মাসে ৫০০ টন পর্যন্ত বাড়ানো যায়",
    },
    source: "Shathi Sheba Product Deck v0.1 — Current products",
  },
  {
    icon: "users",
    value: { en: "Women-made", bn: "নারীদের হাতে তৈরি" },
    label: {
      en: "Produced with rural women's cooperatives at our Natore factory",
      bn: "নাটোরে আমাদের কারখানায় গ্রামীণ নারী সমবায়ের সঙ্গে উৎপাদিত",
    },
    source: "Shathi Sheba platform — manufacturer record",
  },
];

/** The maker, as the platform records it. */
export const feedMaker = {
  name: { en: "DigiGram Ventures Ltd.", bn: "ডিজিগ্রাম ভেঞ্চারস লিমিটেড" } as Bi,
  factory: {
    en: "Kalikapur, Bonpara Bypass, Baraigram, Natore",
    bn: "কালিকাপুর, বনপাড়া বাইপাস, বড়াইগ্রাম, নাটোর",
  } as Bi,
};

/**
 * The surveyed gap the feed exists to close.
 *
 * Kept with the feed rather than in a general stats file because it is the
 * reason this product exists: a farmer who can only buy ungraded feed from one
 * market has no way to know what they are feeding.
 */
export const feedGap: { value: Bi; label: Bi; source: string } = {
  value: { en: "67%", bn: "৬৭%" },
  label: {
    en: "of the farmers we surveyed buy ungraded feed from a single nearby market",
    bn: "জরিপ করা কৃষকের মধ্যে এতজন একটিমাত্র কাছের বাজার থেকে মানহীন খাদ্য কেনেন",
  },
  source: "Shathi Sheba Product Deck v0.1 — Current products",
};
