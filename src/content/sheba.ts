import type { Bi } from "@/lib/i18n";
import type { IconName } from "@/components/ui/Icon";

/**
 * Shathi Sheba content, shared across the site.
 *
 * WHY THIS FILE EXISTS
 * Shathi Sheba content used to live entirely inside
 * `app/[locale]/products/shathi-sheba/page.tsx`. That page was thorough, and it
 * was also the only place on the site where the product appeared in any depth —
 * so a visitor who never clicked into it came away thinking DigiGram is Shathi
 * and nothing else. Pulling the material out here lets the homepage, the
 * products hub and the impact page each carry a real piece of it without any
 * two of them drifting into different numbers or different wording.
 *
 * SOURCING
 * Every figure traces to `DigiGram Shathi Sheba — Product Deck v0.1` (July
 * 2026). `source` records the deck section, matching the convention in
 * `company.ts`, so a number can always be checked rather than taken on trust.
 * Nothing here is estimated or rounded up for effect.
 */

/* --------------------------------------------------------- service rails -- */

export type ShebaRail = {
    key: "fund" | "supply" | "grow" | "sell";
    title: Bi;
    /** One line, for compact surfaces like the homepage band. */
    line: Bi;
    /** The rail's actual outputs, from the product-architecture slide. */
    detail: Bi;
    icon: IconName;
};

/**
 * The four service rails.
 *
 * Deliberately the same four words as the company's Fund / Supply / Grow / Sell
 * pillars in `company.ts`, because they are the same four things — Shathi Sheba
 * is the software layer under the model, not a second model. `RailsDiagram` on
 * the product page renders its own fuller copy; this is the short form.
 */
export const shebaRails: ShebaRail[] = [
    {
        key: "fund",
        icon: "wallet",
        title: { en: "Fund", bn: "ফান্ড" },
        line: {
            en: "Finance readiness, not just a loan referral",
            bn: "শুধু ঋণের সুপারিশ নয়, অর্থায়নের প্রস্তুতি",
        },
        detail: {
            en: "Applications, risk grades, readiness status and lender packs.",
            bn: "আবেদন, ঝুঁকি গ্রেড, প্রস্তুতির অবস্থা ও ঋণদাতার প্যাক।",
        },
    },
    {
        key: "supply",
        icon: "truck",
        title: { en: "Supply", bn: "সরবরাহ" },
        line: {
            en: "Quality inputs, delivered to the last mile",
            bn: "মানসম্পন্ন উপকরণ, শেষ প্রান্ত পর্যন্ত",
        },
        detail: {
            en: "Input catalogue, order aggregation and cooperative-level distribution.",
            bn: "উপকরণ তালিকা, অর্ডার একত্রীকরণ ও সমবায় পর্যায়ে বিতরণ।",
        },
    },
    {
        key: "grow",
        icon: "graduation-cap",
        title: { en: "Grow", bn: "প্রবৃদ্ধি" },
        line: {
            en: "Advisory, climate alerts and training that counts",
            bn: "পরামর্শ, আবহাওয়া সতর্কতা ও যে প্রশিক্ষণ হিসাবে ধরা হয়",
        },
        detail: {
            en: "Development plans and quizzes, recorded as evidence rather than filed away.",
            bn: "উন্নয়ন পরিকল্পনা ও কুইজ — আলাদা করে না রেখে প্রমাণ হিসেবে নথিভুক্ত।",
        },
    },
    {
        key: "sell",
        icon: "store",
        title: { en: "Sell", bn: "বিক্রয়" },
        line: {
            en: "Published rates and a named buyer",
            bn: "প্রকাশিত দর ও নির্দিষ্ট ক্রেতা",
        },
        detail: {
            en: "Product listing, buyer rates, B2B matching and settlement evidence.",
            bn: "পণ্য তালিকা, ক্রেতার দর, বিটুবি সংযোগ ও নিষ্পত্তির প্রমাণ।",
        },
    },
];

/* ------------------------------------------------------- the market gaps -- */

export type ShebaGapStat = {
    value: Bi;
    label: Bi;
    body: Bi;
    icon: IconName;
    source: string;
};

/**
 * The rural market gap, in figures.
 *
 * These are the numbers that justify the product existing at all, and they are
 * the part most worth repeating outside the product page — a reader who only
 * sees "we built an app" has not been told why.
 */
export const shebaGapStats: ShebaGapStat[] = [
    {
        icon: "wallet",
        value: { en: "15%", bn: "১৫%" },
        label: { en: "have formal credit access", bn: "প্রাতিষ্ঠানিক ঋণ পান" },
        body: {
            en: "The other 85% depend on costly informal loans.",
            bn: "বাকি ৮৫% নির্ভর করেন ব্যয়বহুল অনানুষ্ঠানিক ঋণের উপর।",
        },
        source: "Shathi Sheba Product Deck v0.1 — Barriers",
    },
    {
        icon: "store",
        value: { en: "30%", bn: "৩০%" },
        label: { en: "price loss at the farm gate", bn: "খামারের দরজায় দাম হারানো" },
        body: {
            en: "70% face mobility limits, so the buyer sets the price.",
            bn: "৭০% চলাচলে সীমাবদ্ধ, তাই দাম ঠিক করেন ক্রেতা।",
        },
        source: "Shathi Sheba Product Deck v0.1 — Barriers",
    },
    {
        icon: "info",
        value: { en: "10–15%", bn: "১০–১৫%" },
        label: { en: "of women reach agri advice", bn: "নারী কৃষি পরামর্শ পান" },
        body: {
            en: "Against more than 50% of men — the same extension services.",
            bn: "পুরুষদের ক্ষেত্রে যা ৫০%-এর বেশি — একই সম্প্রসারণ সেবা।",
        },
        source: "Shathi Sheba Product Deck v0.1 — Barriers",
    },
    {
        icon: "building",
        value: { en: "60%", bn: "৬০%" },
        label: { en: "of rural cattle sheds sit idle", bn: "গ্রামীণ গোয়ালঘর অব্যবহৃত" },
        body: {
            en: "Capacity is there; capital and skills are not.",
            bn: "সামর্থ্য আছে; পুঁজি ও দক্ষতা নেই।",
        },
        source: "Shathi Sheba Product Deck v0.1 — Barriers",
    },
];

/* ----------------------------------------------------- readiness outcome -- */

/**
 * What the assessment produces.
 *
 * The point worth carrying to a general audience is the last one: an
 * application that fails still ends with a route forward. That is the
 * difference between a scoring tool and a development one, and it is the part
 * a lender or a development partner asks about first.
 */
export const shebaOutputs: { label: Bi; value: Bi }[] = [
    {
        label: { en: "Risk grade", bn: "ঝুঁকি গ্রেড" },
        value: { en: "A to D, low to unacceptable", bn: "এ থেকে ডি, কম থেকে অগ্রহণযোগ্য" },
    },
    {
        label: { en: "Readiness", bn: "প্রস্তুতি" },
        value: {
            en: "Bank Ready, Conditional, Project Ready or Development Required",
            bn: "ব্যাংক-প্রস্তুত, শর্তসাপেক্ষ, প্রকল্প-প্রস্তুত বা উন্নয়ন প্রয়োজন",
        },
    },
    {
        label: { en: "Data confidence", bn: "তথ্যের নির্ভরযোগ্যতা" },
        value: { en: "High, medium or low evidence quality", bn: "উচ্চ, মাঝারি বা নিম্ন প্রমাণমান" },
    },
    {
        label: { en: "Next action", bn: "পরবর্তী পদক্ষেপ" },
        value: {
            en: "Lender submission, project-linked finance, advisory — or a decline with reasons",
            bn: "ঋণদাতার কাছে জমা, প্রকল্প-সংযুক্ত অর্থায়ন, পরামর্শ — বা কারণসহ প্রত্যাখ্যান",
        },
    },
];

/**
 * The boundary the product does not cross, stated the way the deck states it.
 *
 * Load-bearing on a public website: describing a scoring engine without this
 * line reads as though DigiGram is lending, which it is not and is not licensed
 * to do. It belongs anywhere the Fund rail is described.
 */
export const shebaLenderPrinciple: Bi = {
    en: "Shathi Sheba provides decision support. Licensed lenders keep approval authority.",
    bn: "সাথী সেবা সিদ্ধান্ত-সহায়তা দেয়। অনুমোদনের এখতিয়ার থাকে লাইসেন্সধারী ঋণদাতার হাতেই।",
};

/* --------------------------------------------------------- what it is now -- */

export type ShebaCapability = { title: Bi; body: Bi; icon: IconName };

/**
 * What a farmer can actually do in the app today.
 *
 * Written in the present tense on purpose. The rails above describe the
 * architecture; this describes the shipped product, which is the thing a
 * sceptical reader wants evidence of.
 */
export const shebaCapabilities: ShebaCapability[] = [
    {
        icon: "handshake",
        title: { en: "Join a partner project", bn: "পার্টনার প্রকল্পে যুক্ত হোন" },
        body: {
            en: "Browse projects open in your upazila, see the term, the expected income and the bank behind it, and apply from the phone.",
            bn: "আপনার উপজেলায় চলমান প্রকল্প দেখুন, মেয়াদ, প্রত্যাশিত আয় ও পেছনের ব্যাংক জানুন, আর ফোন থেকেই আবেদন করুন।",
        },
    },
    {
        icon: "store",
        title: { en: "Buy inputs at a published price", bn: "প্রকাশিত দামে উপকরণ কিনুন" },
        body: {
            en: "Feed, seed and veterinary goods with the manufacturer, the distributor and the delivery area named on every listing.",
            bn: "ফিড, বীজ ও পশু চিকিৎসার পণ্য — প্রতিটি তালিকায় প্রস্তুতকারক, পরিবেশক ও ডেলিভারি এলাকা উল্লেখসহ।",
        },
    },
    {
        icon: "banknote",
        title: { en: "See the price before you sell", bn: "বিক্রির আগেই দাম দেখুন" },
        body: {
            en: "List cattle or produce and the app shows the B2B rate, every deduction and the net price per kilogram before anything is agreed.",
            bn: "গবাদিপশু বা ফসল তালিকাভুক্ত করুন — চুক্তির আগেই অ্যাপ দেখায় বিটুবি দর, প্রতিটি কর্তন ও প্রতি কেজির নিট দাম।",
        },
    },
    {
        icon: "check-circle",
        title: { en: "Follow it to payment", bn: "পেমেন্ট পর্যন্ত অনুসরণ করুন" },
        body: {
            en: "Six tracked steps from submission through field verification to settlement, with the assigned officer's number on screen.",
            bn: "জমা থেকে মাঠ যাচাই হয়ে নিষ্পত্তি — ছয়টি ধাপ, সঙ্গে নির্ধারিত কর্মকর্তার নম্বর স্ক্রিনেই।",
        },
    },
    {
        icon: "graduation-cap",
        title: { en: "Learn, and have it count", bn: "শিখুন, আর তা হিসাবে ধরা হোক" },
        body: {
            en: "Livestock, crop and financial-literacy modules with quizzes; completion feeds the readiness score rather than sitting in a separate file.",
            bn: "পশুপালন, ফসল ও আর্থিক শিক্ষার মডিউল ও কুইজ; সম্পন্ন করা আলাদা ফাইলে না থেকে প্রস্তুতির স্কোরে যোগ হয়।",
        },
    },
    {
        icon: "cloud-sun",
        title: { en: "Get the warning in time", bn: "সময়মতো সতর্কতা পান" },
        body: {
            en: "Weather and climate-smart advisories for the district, plus a community feed and field officers you can call.",
            bn: "জেলাভিত্তিক আবহাওয়া ও জলবায়ু-সহনশীল পরামর্শ, সঙ্গে কমিউনিটি ফিড ও ফোন করার মতো মাঠ কর্মকর্তা।",
        },
    },
];

/* ------------------------------------------------------------- who it serves -- */

/**
 * Role separation across the platform.
 *
 * Kept short. The full six-role table lives on the product page; this is the
 * version that fits a homepage band without turning into an org chart.
 */
export const shebaAudiences: { title: Bi; body: Bi; icon: IconName }[] = [
    {
        icon: "sprout",
        title: { en: "Farmers and rural entrepreneurs", bn: "কৃষক ও গ্রামীণ উদ্যোক্তা" },
        body: {
            en: "Apply, buy, sell, learn — and build a profile that a bank will read.",
            bn: "আবেদন করুন, কিনুন, বিক্রি করুন, শিখুন — আর গড়ুন এমন প্রোফাইল যা ব্যাংক পড়বে।",
        },
    },
    {
        icon: "users",
        title: { en: "Cooperatives and field officers", bn: "সমবায় ও মাঠ কর্মকর্তা" },
        body: {
            en: "Assist onboarding, verify profiles on the ground and monitor utilisation.",
            bn: "নিবন্ধনে সহায়তা করুন, মাঠে প্রোফাইল যাচাই করুন ও ব্যবহারের তদারকি করুন।",
        },
    },
    {
        icon: "building",
        title: { en: "Banks and MFIs", bn: "ব্যাংক ও ক্ষুদ্রঋণ প্রতিষ্ঠান" },
        body: {
            en: "Receive a structured decision-support pack instead of a thin file.",
            bn: "স্বল্প-তথ্যের ফাইলের বদলে পান কাঠামোবদ্ধ সিদ্ধান্ত-সহায়ক প্যাক।",
        },
    },
    {
        icon: "truck",
        title: { en: "B2B buyers and suppliers", bn: "বিটুবি ক্রেতা ও সরবরাহকারী" },
        body: {
            en: "Traceable supply, aggregated at cooperative level, with settlement records.",
            bn: "সমবায় পর্যায়ে একত্রিত, নিষ্পত্তির নথিসহ সন্ধানযোগ্য সরবরাহ।",
        },
    },
];
