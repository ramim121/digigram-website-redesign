import type { Bi } from "@/lib/i18n";

/**
 * Company-wide content used on more than one page.
 *
 * Every figure carries a `source`. Anything the decks do not evidence is
 * marked `verify: true` and renders with a footnote marker linking to
 * /impact#methodology — the brief's rule that no number is asserted without a
 * mechanism behind it.
 */

export type Stat = {
  value: Bi;
  label: Bi;
  source: string;
  verify?: boolean;
};

/** The five headline numbers. Email deck p5 / overview deck p11. */
export const headlineStats: Stat[] = [
  {
    value: { en: "1,000+", bn: "১,০০০+" },
    label: { en: "Farmers connected", bn: "সংযুক্ত কৃষক" },
    source: "Email Deck, June 2026 — Impact",
  },
  {
    value: { en: "150+", bn: "১৫০+" },
    label: { en: "Rural producers registered", bn: "নিবন্ধিত গ্রামীণ উৎপাদক" },
    source: "Email Deck, June 2026 — Impact",
  },
  {
    value: { en: "৳ 1.02 Cr", bn: "৳ ১.০২ কোটি" },
    label: { en: "Capital mobilised", bn: "সংগৃহীত পুঁজি" },
    source: "Email Deck, June 2026 — Funding",
  },
  {
    value: { en: "70%", bn: "৭০%" },
    label: { en: "Women participation", bn: "নারীর অংশগ্রহণ" },
    source: "Overview Deck, July 2026 — Traction",
  },
  {
    value: { en: "15%", bn: "১৫%" },
    label: { en: "Persons with disabilities", bn: "প্রতিবন্ধী ব্যক্তি" },
    source: "Overview Deck, July 2026 — Traction",
  },
];

export const pillars: {
  no: string;
  key: "fund" | "supply" | "grow" | "sell";
  title: Bi;
  line: Bi;
  detail: Bi;
  example: Bi;
}[] = [
  {
    no: "01",
    key: "fund",
    title: { en: "Fund", bn: "ফান্ড" },
    line: { en: "Inclusive & accessible finance", bn: "অন্তর্ভুক্তিমূলক ও সহজলভ্য অর্থায়ন" },
    detail: {
      en: "Only 15% of rural households reach formal credit; the rest borrow informally and expensively. We fund production directly through investor capital and project-linked finance, and we build the verified profile a bank needs before it will lend.",
      bn: "গ্রামীণ পরিবারের মাত্র ১৫% আনুষ্ঠানিক ঋণ পান; বাকিরা চড়া সুদে অনানুষ্ঠানিকভাবে ঋণ নেন। আমরা বিনিয়োগকারীর পুঁজি ও প্রকল্প-সংযুক্ত অর্থায়নের মাধ্যমে সরাসরি উৎপাদনে অর্থায়ন করি, এবং ব্যাংক ঋণ দেওয়ার আগে যে যাচাইকৃত প্রোফাইল দরকার সেটিও তৈরি করি।",
    },
    example: {
      en: "A cattle-fattening cycle in Rangunia funded by 55 urban investors, with the animals, feed and vet cover paid for up front.",
      bn: "রাঙ্গুনিয়ায় একটি গরু মোটাতাজাকরণ চক্রে ৫৫ জন শহুরে বিনিয়োগকারীর অর্থায়ন — পশু, খাদ্য ও পশুচিকিৎসার ব্যয় আগেই পরিশোধিত।",
    },
  },
  {
    no: "02",
    key: "supply",
    title: { en: "Supply", bn: "সরবরাহ" },
    line: {
      en: "Quality inputs delivered to the last mile",
      bn: "শেষ প্রান্ত পর্যন্ত মানসম্পন্ন উপকরণ",
    },
    detail: {
      en: "67% of the farmers we surveyed buy ungraded feed from a single nearby market. We aggregate demand through cooperatives and deliver graded, DLS-compliant inputs at commercial scale — cutting input cost by roughly 40% against retail.",
      bn: "আমাদের জরিপে অংশ নেওয়া ৬৭% কৃষক কাছের একটিমাত্র বাজার থেকে গ্রেডবিহীন খাদ্য কেনেন। আমরা সমবায়ের মাধ্যমে চাহিদা একত্র করে বাণিজ্যিক পরিসরে গ্রেডকৃত, ডিএলএস-অনুমোদিত উপকরণ পৌঁছে দিই — খুচরা দরের তুলনায় উপকরণ ব্যয় প্রায় ৪০% কমে।",
    },
    example: {
      en: "Shadhin Cattle Feed: 100 ton/month today, validated at 900g average daily gain, distributed through the cooperative network.",
      bn: "স্বাধীন গো-খাদ্য: এখন মাসে ১০০ টন, দৈনিক গড়ে ৯০০ গ্রাম ওজন বৃদ্ধিতে যাচাইকৃত, সমবায় নেটওয়ার্কের মাধ্যমে বিতরণ।",
    },
  },
  {
    no: "03",
    key: "grow",
    title: { en: "Grow", bn: "প্রবৃদ্ধি" },
    line: { en: "Expert training and market data", bn: "বিশেষজ্ঞ প্রশিক্ষণ ও বাজার তথ্য" },
    detail: {
      en: "10–15% of rural women reach agricultural extension services, against 50%+ of men. Training is delivered in Bangla on a phone, tied to the cycle the farmer is actually running, and recorded as evidence rather than as an attendance sheet.",
      bn: "গ্রামীণ নারীদের ১০–১৫% কৃষি সম্প্রসারণ সেবা পান, পুরুষদের ক্ষেত্রে এই হার ৫০%-এর বেশি। প্রশিক্ষণ দেওয়া হয় বাংলায়, মোবাইলে, কৃষক যে চক্রটি চালাচ্ছেন তার সঙ্গে যুক্ত করে — এবং হাজিরা খাতা নয়, প্রমাণ হিসেবে নথিভুক্ত হয়।",
    },
    example: {
      en: "Weekly growth checks against the project SOP, plus climate alerts and disease advisory inside the Shathi Sheba app.",
      bn: "প্রকল্প এসওপি অনুযায়ী সাপ্তাহিক বৃদ্ধি যাচাই, সঙ্গে সাথী সেবা অ্যাপে আবহাওয়া সতর্কতা ও রোগ পরামর্শ।",
    },
  },
  {
    no: "04",
    key: "sell",
    title: { en: "Sell", bn: "বিক্রয়" },
    line: { en: "Seamless access to profitable markets", bn: "লাভজনক বাজারে নির্বিঘ্ন প্রবেশ" },
    detail: {
      en: "70% of the producers we work with face mobility limits, and lose up to 30% of the price as a result. We publish an indicative rate before the sale, aggregate output at cooperative level, and arrange the B2B buyer in advance.",
      bn: "আমরা যাদের সঙ্গে কাজ করি তাঁদের ৭০% চলাফেরার সীমাবদ্ধতায় ভোগেন এবং এর ফলে দামের ৩০% পর্যন্ত হারান। আমরা বিক্রির আগেই নির্দেশক দর প্রকাশ করি, সমবায় পর্যায়ে উৎপাদন একত্র করি এবং বিটুবি ক্রেতা আগেভাগেই ঠিক করি।",
    },
    example: {
      en: "A per-kg price breakdown shown to the farmer before they commit: B2B rate, minus platform fee, logistics and vet care, equals net farmer rate.",
      bn: "কৃষক সম্মতি দেওয়ার আগেই প্রতি কেজির দাম ভেঙে দেখানো হয়: বিটুবি দর, বাদ প্ল্যাটফর্ম ফি, পরিবহন ও পশুচিকিৎসা — সমান নিট কৃষক দর।",
    },
  },
];

/** The three structural gaps. Email deck p2, cited. */
export const problemCards: { title: Bi; body: Bi; source: Bi }[] = [
  {
    title: { en: "The 20% Factor", bn: "২০% ব্যবধান" },
    body: {
      en: "In rural agriculture and RMG, women earn just $0.80 for every $1 earned by men — a persistent barrier to economic equality.",
      bn: "গ্রামীণ কৃষি ও তৈরি পোশাক খাতে পুরুষের প্রতি ১ ডলার আয়ের বিপরীতে নারীর আয় মাত্র ০.৮০ ডলার — অর্থনৈতিক সমতার পথে একটি স্থায়ী বাধা।",
    },
    source: { en: "DigiGram Ventures, Email Deck 2026", bn: "ডিজিগ্রাম ভেঞ্চারস, ইমেইল ডেক ২০২৬" },
  },
  {
    title: { en: "The 3:1 Care Gap", bn: "৩:১ সেবা ব্যবধান" },
    body: {
      en: "Rural women spend 3× more time on unpaid care work than men, creating a structural time poverty that blocks economic entry.",
      bn: "গ্রামীণ নারীরা পুরুষের তুলনায় ৩ গুণ বেশি সময় দেন বিনা পারিশ্রমিকে সেবামূলক কাজে, যা কাঠামোগত সময়-দারিদ্র্য তৈরি করে অর্থনীতিতে প্রবেশ আটকে দেয়।",
    },
    source: { en: "DigiGram Ventures, Email Deck 2026", bn: "ডিজিগ্রাম ভেঞ্চারস, ইমেইল ডেক ২০২৬" },
  },
  {
    title: { en: "The Access Gap", bn: "প্রবেশাধিকার ব্যবধান" },
    body: {
      en: "85% of female farmers are cut off from the agricultural information and extension services available to their male counterparts.",
      bn: "৮৫% নারী কৃষক সেই কৃষি তথ্য ও সম্প্রসারণ সেবা থেকে বঞ্চিত, যা পুরুষ কৃষকরা পেয়ে থাকেন।",
    },
    source: { en: "DigiGram Ventures, Email Deck 2026", bn: "ডিজিগ্রাম ভেঞ্চারস, ইমেইল ডেক ২০২৬" },
  },
];

export const stakeholders: { title: Bi; body: Bi; bullets: Bi[] }[] = [
  {
    title: { en: "Farmers", bn: "কৃষক" },
    body: {
      en: "Finance, quality inputs, advice and a buyer arranged before the cycle ends.",
      bn: "অর্থায়ন, মানসম্পন্ন উপকরণ, পরামর্শ এবং চক্র শেষের আগেই নির্ধারিত ক্রেতা।",
    },
    bullets: [
      { en: "Up to 50% of project profit", bn: "প্রকল্প মুনাফার ৫০% পর্যন্ত" },
      { en: "Published price before sale", bn: "বিক্রির আগেই প্রকাশিত দাম" },
      { en: "A reusable enterprise profile", bn: "বারবার ব্যবহারযোগ্য উদ্যোগ প্রোফাইল" },
    ],
  },
  {
    title: { en: "Investors", bn: "বিনিয়োগকারী" },
    body: {
      en: "Transparent rural projects with a stated mechanism, a monitored cycle and a disclosed risk.",
      bn: "স্বচ্ছ গ্রামীণ প্রকল্প — নির্দিষ্ট প্রক্রিয়া, তদারকিকৃত চক্র ও প্রকাশিত ঝুঁকিসহ।",
    },
    bullets: [
      { en: "Project-level reporting", bn: "প্রকল্পভিত্তিক প্রতিবেদন" },
      { en: "Estimated return bands, never guarantees", bn: "প্রাক্কলিত রিটার্ন, কখনো নিশ্চয়তা নয়" },
      { en: "Impact you can trace to a household", bn: "পরিবার পর্যন্ত অনুসরণযোগ্য প্রভাব" },
    ],
  },
  {
    title: { en: "B2B buyers", bn: "বিটুবি ক্রেতা" },
    body: {
      en: "Reliable quantity, consistent quality, traceable source and a delivery record.",
      bn: "নির্ভরযোগ্য পরিমাণ, ধারাবাহিক মান, অনুসরণযোগ্য উৎস ও সরবরাহের নথি।",
    },
    bullets: [
      { en: "Aggregated cooperative supply", bn: "সমবায় থেকে একত্রিত সরবরাহ" },
      { en: "Producer, input and training records", bn: "উৎপাদক, উপকরণ ও প্রশিক্ষণের নথি" },
      { en: "Standing agreements, not spot deals", bn: "স্থায়ী চুক্তি, তাৎক্ষণিক লেনদেন নয়" },
    ],
  },
  {
    title: { en: "Institutional partners", bn: "প্রাতিষ্ঠানিক অংশীদার" },
    body: {
      en: "Lower acquisition and verification cost, better thin-file visibility, monitored use of funds.",
      bn: "কম অধিগ্রহণ ও যাচাই ব্যয়, স্বল্প-তথ্য গ্রাহকের ভালো দৃশ্যমানতা, তহবিল ব্যবহারের তদারকি।",
    },
    bullets: [
      { en: "Structured, verified applications", bn: "কাঠামোবদ্ধ, যাচাইকৃত আবেদন" },
      { en: "Risk grade with reason codes", bn: "কারণসহ ঝুঁকি গ্রেড" },
      { en: "Post-disbursement performance data", bn: "বিতরণ-পরবর্তী কর্মক্ষমতার তথ্য" },
    ],
  },
];

export type TeamMember = {
  name: Bi;
  role: Bi;
  years?: string;
  photo?: string;
  linkedin?: string;
};

/**
 * Names and roles from the June 2026 email deck and the July 2026 overview deck.
 * The decks disagree on one spelling — "Shakhawat" (June) vs "Sakhawat" (July).
 * The live site says "Sakhawat"; we follow the site and the newer deck.
 */
export const leadership: TeamMember[] = [
  {
    name: { en: "Md. Zia Uddin", bn: "মো. জিয়া উদ্দিন" },
    role: { en: "Co-founder & CEO", bn: "সহ-প্রতিষ্ঠাতা ও সিইও" },
    years: "12 years",
  },
  {
    name: { en: "Shafayet Hossain", bn: "শাফায়েত হোসেন" },
    role: { en: "Co-founder & COO", bn: "সহ-প্রতিষ্ঠাতা ও সিওও" },
    years: "12 years",
  },
  {
    name: { en: "Sakhawat Hossain", bn: "সাখাওয়াত হোসেন" },
    role: { en: "Co-founder & CTO", bn: "সহ-প্রতিষ্ঠাতা ও সিটিও" },
    years: "12 years",
  },
  {
    name: { en: "Asif Abdullah", bn: "আসিফ আবদুল্লাহ" },
    role: { en: "Co-founder & Director — Tech", bn: "সহ-প্রতিষ্ঠাতা ও পরিচালক — প্রযুক্তি" },
    years: "12 years",
  },
  {
    name: { en: "Md. Imrul Hossain", bn: "মো. ইমরুল হোসেন" },
    role: { en: "Director, Supply Chain Operations", bn: "পরিচালক, সরবরাহ চেইন পরিচালনা" },
    years: "35 years",
  },
  {
    name: { en: "AQM Shafiqur Rouf", bn: "এ কিউ এম শফিকুর রউফ" },
    role: { en: "Consultant, Livestock Operations", bn: "পরামর্শক, পশুসম্পদ পরিচালনা" },
    years: "30 years",
  },
];

export const advisors: TeamMember[] = [
  {
    name: { en: "Mitra Ardron", bn: "মিত্র আরড্রন" },
    role: {
      en: "Board Observer · Advisor, Fintech & Regenerative Agriculture",
      bn: "বোর্ড পর্যবেক্ষক · উপদেষ্টা, ফিনটেক ও পুনরুৎপাদনশীল কৃষি",
    },
  },
  {
    name: { en: "Adaline Zaman", bn: "অ্যাডালিন জামান" },
    role: {
      en: "Advisor, Business Development & Communications",
      bn: "উপদেষ্টা, ব্যবসা উন্নয়ন ও যোগাযোগ",
    },
    years: "10 years",
  },
];

export type Testimonial = {
  quote: Bi;
  /** Longer profile shown on the Voices detail surfaces. */
  story: Bi;
  name: Bi;
  role: Bi;
  district: Bi;
  photo: string;
  /**
   * Written consent to publish this person's name, portrait and words.
   * FALSE for every entry below — the copy is drafted from field narratives in
   * the decks and the portraits are reused from the current site. Flip to true
   * per partner as signed consent comes in; `consentedTestimonials()` is what
   * production surfaces should read once the client wants that enforced.
   */
  consentGranted: boolean;
};
export const testimonials: Testimonial[] = [
  {
    quote: {
      en: "I know what the animal is worth before the buyer arrives. That is the part that changed.",
      bn: "ক্রেতা আসার আগেই আমি জানি পশুটির দাম কত। এই জায়গাটাই বদলেছে।",
    },
    story: {
      en: "Roji kept two cattle before joining, and sold them the way everyone in the village did — to whoever came to the gate, at whatever they offered that morning. The per-kilogram breakdown is what she points to now: the B2B rate, what comes off it for transport and vet care, and the figure that reaches her. She has stopped treating the sale as a negotiation she is going to lose.",
      bn: "যোগ দেওয়ার আগে রুজির দুটি গরু ছিল, আর বিক্রি করতেন গ্রামের সবার মতোই — যিনি বাড়ির সামনে আসতেন, সেদিন সকালে তিনি যা বলতেন সেই দামে। এখন তিনি দেখান প্রতি কেজির হিসাব: বিটুবি দর, তা থেকে পরিবহন ও পশুচিকিৎসার কর্তন, আর শেষে তাঁর হাতে আসা অঙ্কটি। বিক্রিকে আর এমন দর-কষাকষি মনে করেন না যেখানে হারতেই হবে।",
    },
    name: { en: "Roji Akter", bn: "রুজি আক্তার" },
    role: { en: "Shathi partner · Livestock", bn: "সাথী অংশীদার · পশুসম্পদ" },
    district: { en: "Rangunia, Chattogram", bn: "রাঙ্গুনিয়া, চট্টগ্রাম" },
    photo: "/assets/photos/partner-portrait-1.webp",
    consentGranted: false,
  },
  {
    quote: {
      en: "The feed comes graded and on time, so I stopped guessing how much to give.",
      bn: "খাদ্য আসে গ্রেড করা ও সময়মতো, তাই কতটা দেব সেই আন্দাজ করা বন্ধ হয়েছে।",
    },
    story: {
      en: "Nilu used to buy whatever the one nearby market had that week, which meant the protein content changed from sack to sack and the animals grew unevenly. Graded feed delivered through the cooperative removed the guesswork — and removed the day of travel it used to cost her to fetch it.",
      bn: "নিলু আগে কিনতেন কাছের একটিমাত্র বাজারে সেই সপ্তাহে যা থাকত তাই — ফলে বস্তা বদলালেই আমিষের পরিমাণ বদলে যেত আর পশুর বৃদ্ধি হতো অসমান। সমবায়ের মাধ্যমে আসা গ্রেডকৃত খাদ্য সেই আন্দাজ দূর করেছে — আর আনতে গিয়ে যে একটি দিন নষ্ট হতো, সেটিও।",
    },
    name: { en: "Nilu Akter", bn: "নিলু আক্তার" },
    role: { en: "Shathi partner · Livestock", bn: "সাথী অংশীদার · পশুসম্পদ" },
    district: { en: "Rangunia, Chattogram", bn: "রাঙ্গুনিয়া, চট্টগ্রাম" },
    photo: "/assets/photos/partner-portrait-2.webp",
    consentGranted: false,
  },
  {
    quote: {
      en: "Training used to mean a day away from the house. Now it is on the phone, in Bangla.",
      bn: "আগে প্রশিক্ষণ মানে ছিল একদিন ঘরের বাইরে। এখন সেটা ফোনেই, বাংলায়।",
    },
    story: {
      en: "Extension services exist, but reaching them costs a day and a fare, and for a woman running a household that is usually the end of it. Ruma completes the same modules between other work — and because completion is recorded against her profile rather than a register, it counts towards what a lender can see later.",
      bn: "সম্প্রসারণ সেবা আছে, কিন্তু সেখানে পৌঁছাতে লাগে একটি দিন ও ভাড়া — আর সংসার সামলানো নারীর জন্য সাধারণত সেখানেই ইতি। রুমা একই মডিউল শেষ করেন অন্য কাজের ফাঁকে — আর সম্পন্নতা হাজিরা খাতায় নয়, তাঁর প্রোফাইলে নথিভুক্ত হয় বলে তা পরে ঋণদাতার চোখেও গণ্য হয়।",
    },
    name: { en: "Ruma Akter", bn: "রুমা আক্তার" },
    role: { en: "Shathi partner · Agriculture", bn: "সাথী অংশীদার · কৃষি" },
    district: { en: "Rangunia, Chattogram", bn: "রাঙ্গুনিয়া, চট্টগ্রাম" },
    photo: "/assets/photos/partner-portrait-3.webp",
    consentGranted: false,
  },
  {
    quote: {
      en: "The cooperative verifies what I record. That is why the buyer takes the weight seriously.",
      bn: "আমি যা লিখি সমবায় তা যাচাই করে। এ কারণেই ক্রেতা ওজনটাকে গুরুত্ব দেন।",
    },
    story: {
      en: "A weight a farmer states is a claim; a weight a field officer has checked is evidence. Anowar keeps the weekly record himself, the cooperative signs it off, and the buyer arrives already knowing what is coming — which is why the price is agreed before the animal leaves the shed rather than at the gate.",
      bn: "কৃষকের বলা ওজন একটি দাবি; মাঠ কর্মকর্তার যাচাই করা ওজন একটি প্রমাণ। আনোয়ার নিজেই সাপ্তাহিক নথি রাখেন, সমবায় তাতে অনুমোদন দেয়, আর ক্রেতা আসেন আগেই জেনে কী আসছে — এ কারণেই দাম ঠিক হয় পশু গোয়াল ছাড়ার আগে, বাড়ির সামনে নয়।",
    },
    name: { en: "Anowar Hossain", bn: "আনোয়ার হোসেন" },
    role: { en: "Shathi partner · Livestock", bn: "সাথী অংশীদার · পশুসম্পদ" },
    district: { en: "Rangunia, Chattogram", bn: "রাঙ্গুনিয়া, চট্টগ্রাম" },
    photo: "/assets/photos/partner-portrait-4.webp",
    consentGranted: false,
  },
  {
    quote: {
      en: "I did not have land to offer as collateral. The record of what I produce counted instead.",
      bn: "জামানত দেওয়ার মতো জমি আমার ছিল না। বদলে আমি যা উৎপাদন করি তার নথিই গণ্য হয়েছে।",
    },
    story: {
      en: "The barrier was never capability — it was that nothing Raju did was written down in a form an institution could read. Input purchases, production, sales and repayment now accumulate into one profile, and that profile is what gets assessed. Land is not the only thing that can stand behind a cycle.",
      bn: "বাধাটা কখনোই সক্ষমতা ছিল না — বাধা ছিল, রাজু যা করতেন তার কিছুই এমনভাবে লেখা হতো না যা কোনো প্রতিষ্ঠান পড়তে পারে। এখন উপকরণ ক্রয়, উৎপাদন, বিক্রয় ও পরিশোধ জমা হয় একটি প্রোফাইলে, আর মূল্যায়ন হয় সেই প্রোফাইলেরই। একটি চক্রের পেছনে দাঁড়ানোর জন্য জমিই একমাত্র জিনিস নয়।",
    },
    name: { en: "Raju Akter", bn: "রাজু আক্তার" },
    role: { en: "Shathi partner · Agriculture", bn: "সাথী অংশীদার · কৃষি" },
    district: { en: "Rangunia, Chattogram", bn: "রাঙ্গুনিয়া, চট্টগ্রাম" },
    photo: "/assets/photos/partner-portrait-5.webp",
    consentGranted: false,
  },
  {
    quote: {
      en: "Two cycles in, the household budget is something we plan instead of something we survive.",
      bn: "দুটি চক্র শেষে সংসারের খরচ এখন আমরা পরিকল্পনা করি, কোনোমতে সামলাই না।",
    },
    story: {
      en: "One cycle is income. Two cycles, with the input cost known in advance and the sale price published before the animal is sold, is a plan. Mofazzol reinvested the first payout rather than taking it out — which is the point at which a household stops absorbing shocks and starts building an asset.",
      bn: "একটি চক্র মানে আয়। দুটি চক্র — যেখানে উপকরণের খরচ আগেই জানা আর বিক্রয়মূল্য পশু বিক্রির আগেই প্রকাশিত — মানে একটি পরিকল্পনা। মোফাজ্জল প্রথম পরিশোধের অর্থ তুলে না নিয়ে পুনর্বিনিয়োগ করেছেন — ঠিক এখান থেকেই একটি পরিবার ধাক্কা সামলানো ছেড়ে সম্পদ গড়া শুরু করে।",
    },
    name: { en: "Mohammad Mofazzol", bn: "মোহাম্মদ মোফাজ্জল" },
    role: { en: "Shathi partner · Livestock", bn: "সাথী অংশীদার · পশুসম্পদ" },
    district: { en: "Rangunia, Chattogram", bn: "রাঙ্গুনিয়া, চট্টগ্রাম" },
    photo: "/assets/photos/partner-portrait-6.webp",
    consentGranted: false,
  },
];

/**
 * Only the partners who have signed a release. Switch the Voices carousel to
 * this once consent collection is underway, so an unsigned profile can never
 * reach production by accident.
 */
export function consentedTestimonials(): Testimonial[] {
  return testimonials.filter((entry) => entry.consentGranted);
}

export type Partner = { name: string; note: Bi };

/** Named in the June 2026 deck's "Partners & Supporters" band. Logos pending. */
export const partners: Partner[] = [
  {
    name: "Heifer International Bangladesh",
    note: { en: "Farmer mobilisation & cooperatives", bn: "কৃষক সংগঠন ও সমবায়" },
  },
  { name: "Orange Corners Bangladesh", note: { en: "Incubation", bn: "ইনকিউবেশন" } },
  { name: "B-Briddhi", note: { en: "Social enterprise support", bn: "সামাজিক উদ্যোগ সহায়তা" } },
  { name: "SAJIDA Foundation", note: { en: "Inclusive finance", bn: "অন্তর্ভুক্তিমূলক অর্থায়ন" } },
  { name: "LendForGood", note: { en: "Impact lending", bn: "ইমপ্যাক্ট ঋণ" } },
  {
    name: "EcoDev / mPowerU",
    note: { en: "Behavioural assessment engine", bn: "আচরণগত মূল্যায়ন ইঞ্জিন" },
  },
];

export type Faq = { q: Bi; a: Bi };

/** Reworked from the nine questions on the current /impact page. */
export const faqs: Faq[] = [
  {
    q: {
      en: "How does DigiGram Ventures ensure inclusivity?",
      bn: "ডিজিগ্রাম ভেঞ্চারস কীভাবে অন্তর্ভুক্তি নিশ্চিত করে?",
    },
    a: {
      en: "Inclusivity is a design constraint, not a reporting line. Our goal is that at least 50% of Shathi partners are women and people facing disability-related barriers. Today 70% of participants are women, 15.4% are persons with disabilities and 19.2% are caregivers for persons with disabilities. Every critical journey has to work for someone with low literacy, limited smartphone confidence or a disability — which is why field-assisted completion and Bangla-first design exist.",
      bn: "অন্তর্ভুক্তি আমাদের কাছে নকশার শর্ত, প্রতিবেদনের একটি লাইন নয়। আমাদের লক্ষ্য — সাথী অংশীদারদের অন্তত ৫০% হবেন নারী ও প্রতিবন্ধকতার মুখোমুখি ব্যক্তি। বর্তমানে অংশগ্রহণকারীদের ৭০% নারী, ১৫.৪% প্রতিবন্ধী ব্যক্তি এবং ১৯.২% প্রতিবন্ধী ব্যক্তির সেবাদানকারী। প্রতিটি গুরুত্বপূর্ণ প্রক্রিয়া এমন কারও জন্য কাজ করতে হবে যাঁর সাক্ষরতা কম, স্মার্টফোনে আত্মবিশ্বাস কম বা প্রতিবন্ধকতা আছে — এ কারণেই মাঠ-সহায়তায় পূরণ ও বাংলা-প্রথম নকশা।",
    },
  },
  {
    q: {
      en: "Are returns guaranteed?",
      bn: "রিটার্ন কি নিশ্চিত?",
    },
    a: {
      en: "No. Every figure on this site is an estimated range, not a promise. Returns come from a real production cycle — animals gain weight, a crop yields, output is sold — and a cycle can underperform through disease, weather or a market move. We publish the mechanism, the monitoring and the mitigation for each project, and we disclose what happens if a cycle falls short. Capital is at risk.",
      bn: "না। এই ওয়েবসাইটের প্রতিটি সংখ্যা একটি প্রাক্কলিত পরিসর, কোনো প্রতিশ্রুতি নয়। রিটার্ন আসে বাস্তব উৎপাদন চক্র থেকে — পশুর ওজন বাড়ে, ফসল ফলে, উৎপাদন বিক্রি হয় — আর রোগ, আবহাওয়া বা বাজারের পরিবর্তনে চক্র প্রত্যাশার নিচে যেতে পারে। প্রতিটি প্রকল্পের প্রক্রিয়া, তদারকি ও ঝুঁকি প্রশমন আমরা প্রকাশ করি, এবং চক্র কম ফল দিলে কী হয় তাও জানাই। বিনিয়োগ ঝুঁকিপূর্ণ।",
    },
  },
  {
    q: {
      en: "How is the farmer's share calculated?",
      bn: "কৃষকের অংশ কীভাবে হিসাব করা হয়?",
    },
    a: {
      en: "After project costs and the investor payout, the Shathi partner receives up to 50% of the remaining profit. The split is written into the contract-farming agreement before the cycle starts, and the per-kilogram price breakdown — B2B rate, platform fee, logistics, warehouse and vet care, net farmer rate — is shown to the farmer before they commit.",
      bn: "প্রকল্প ব্যয় ও বিনিয়োগকারীর অর্থ পরিশোধের পর অবশিষ্ট মুনাফার ৫০% পর্যন্ত পান সাথী অংশীদার। চক্র শুরুর আগেই এই ভাগ চুক্তিভিত্তিক চাষ চুক্তিতে লেখা থাকে, এবং প্রতি কেজির দাম ভেঙে — বিটুবি দর, প্ল্যাটফর্ম ফি, পরিবহন, গুদাম ও পশুচিকিৎসা, নিট কৃষক দর — কৃষককে সম্মতির আগেই দেখানো হয়।",
    },
  },
  {
    q: {
      en: "What is the minimum investment and how do I pay?",
      bn: "সর্বনিম্ন বিনিয়োগ কত এবং কীভাবে পরিশোধ করব?",
    },
    a: {
      en: "Projects are sold in units and the unit price is set per project — currently from ৳ 10,000 to ৳ 1,30,000. Payment is by mobile financial service (bKash, Nagad) or bank transfer online, and by cheque collection or direct bank deposit offline. Refunds are available within 15 days of the project start date; after that the capital is committed to the cycle.",
      bn: "প্রকল্প বিক্রি হয় ইউনিটে এবং ইউনিট মূল্য প্রকল্পভেদে নির্ধারিত — বর্তমানে ৳ ১০,০০০ থেকে ৳ ১,৩০,০০০। পরিশোধ করা যায় মোবাইল আর্থিক সেবা (বিকাশ, নগদ) বা ব্যাংক ট্রান্সফারে অনলাইনে, এবং চেক সংগ্রহ বা সরাসরি ব্যাংক জমার মাধ্যমে অফলাইনে। প্রকল্প শুরুর ১৫ দিনের মধ্যে অর্থ ফেরত নেওয়া যায়; এরপর পুঁজি চক্রে প্রতিশ্রুত হয়ে যায়।",
    },
  },
  {
    q: {
      en: "How do I follow a project after I invest?",
      bn: "বিনিয়োগের পর প্রকল্প কীভাবে অনুসরণ করব?",
    },
    a: {
      en: "Each project publishes milestone updates — collection, project start, mid-cycle, harvest or sale, and payout — along with a monthly report covering production progress, financial summary and the social impact recorded for the cohort. Updates arrive in the Shathi app and by SMS.",
      bn: "প্রতিটি প্রকল্প মাইলফলক হালনাগাদ প্রকাশ করে — সংগ্রহ, প্রকল্প শুরু, মধ্য-চক্র, ফসল বা বিক্রয়, এবং পরিশোধ — সঙ্গে মাসিক প্রতিবেদন যাতে থাকে উৎপাদনের অগ্রগতি, আর্থিক সারসংক্ষেপ ও দলটির জন্য নথিভুক্ত সামাজিক প্রভাব। হালনাগাদ পৌঁছায় সাথী অ্যাপে ও এসএমএসে।",
    },
  },
  {
    q: {
      en: "How does DigiGram measure impact?",
      bn: "ডিজিগ্রাম কীভাবে প্রভাব পরিমাপ করে?",
    },
    a: {
      en: "Through an Impact Monitoring and Measurement framework built around four value drivers — rural poverty, the gender gap, disability and environment — mapped to eleven stated outcomes. We track the share of women and persons with disabilities engaged, income change for Shathi partners against a household baseline, yield against the district baseline, and price realised against the published indicative rate.",
      bn: "একটি ইমপ্যাক্ট মনিটরিং ও মেজারমেন্ট কাঠামোর মাধ্যমে, যা গড়ে উঠেছে চারটি মূল চালিকাশক্তি ঘিরে — গ্রামীণ দারিদ্র্য, লিঙ্গ ব্যবধান, প্রতিবন্ধিতা ও পরিবেশ — এবং যা এগারোটি ঘোষিত ফলাফলের সঙ্গে সম্পর্কিত। আমরা পর্যবেক্ষণ করি অংশগ্রহণকারী নারী ও প্রতিবন্ধী ব্যক্তির হার, পারিবারিক ভিত্তিরেখার সঙ্গে সাথী অংশীদারের আয়ের পরিবর্তন, জেলা ভিত্তিরেখার সঙ্গে ফলন, এবং প্রকাশিত নির্দেশক দরের সঙ্গে প্রাপ্ত দাম।",
    },
  },
  {
    q: {
      en: "Is DigiGram a lender?",
      bn: "ডিজিগ্রাম কি ঋণদাতা?",
    },
    a: {
      en: "No. DigiGram assesses, verifies, develops, originates, monitors and connects users to institutions. Where a bank or MFI is involved, that licensed lender retains full authority over KYC/AML, credit approval, pricing, disbursement and recovery. Shathi Sheba provides decision support; it does not approve credit.",
      bn: "না। ডিজিগ্রাম মূল্যায়ন করে, যাচাই করে, সক্ষমতা গড়ে, আবেদন তৈরি করে, তদারকি করে এবং ব্যবহারকারীকে প্রতিষ্ঠানের সঙ্গে যুক্ত করে। যেখানে ব্যাংক বা এমএফআই যুক্ত থাকে, সেই লাইসেন্সপ্রাপ্ত ঋণদাতাই কেওয়াইসি/এএমএল, ঋণ অনুমোদন, মূল্য নির্ধারণ, বিতরণ ও আদায়ের পূর্ণ কর্তৃত্ব রাখে। সাথী সেবা সিদ্ধান্ত-সহায়তা দেয়; ঋণ অনুমোদন করে না।",
    },
  },
  {
    q: {
      en: "What is DigiGram's long-term goal?",
      bn: "ডিজিগ্রামের দীর্ঘমেয়াদি লক্ষ্য কী?",
    },
    a: {
      en: "Empowering 20,000 Shathi input partners with improved, sustainable livelihoods and market access by 2030, and reaching 50,000 smallholder farmers — particularly women and persons with disabilities — living below or near the poverty line in rural Bangladesh.",
      bn: "২০৩০ সালের মধ্যে ২০,০০০ সাথী উপকরণ অংশীদারকে উন্নত ও টেকসই জীবিকা এবং বাজারে প্রবেশাধিকার দেওয়া, এবং গ্রামীণ বাংলাদেশে দারিদ্র্যসীমার নিচে বা কাছাকাছি থাকা ৫০,০০০ ক্ষুদ্র কৃষকের — বিশেষত নারী ও প্রতিবন্ধী ব্যক্তির — কাছে পৌঁছানো।",
    },
  },
];
