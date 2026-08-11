import type { Project } from "@/lib/projects";

/**
 * SEED DATA — the ten projects that exist on digigramventures.com today,
 * re-typed into the API contract from brief §12.
 *
 * Figures (unit price, return band, tenure, location, partner counts) are
 * copied from the live site's project cards and the Project Cattle 1 detail
 * page. Fields the live site never published — collection windows, unit counts,
 * cooperative names, women/PWD share, milestone dates — are marked below and
 * MUST be replaced with real values before launch. They are shaped to exercise
 * every UI state (open, closing soon, fully funded, upcoming, completed).
 *
 * Statuses and dates are relative to an August 2026 reference. Once the API is
 * connected this file is deleted.
 */

const RANGUNIA = {
  en: "Rangunia, Chattogram",
  bn: "রাঙ্গুনিয়া, চট্টগ্রাম",
};

const BANSHKHALI = {
  en: "Banshkhali, Chattogram",
  bn: "বাঁশখালী, চট্টগ্রাম",
};

const cattleBody = {
  en: `<p>Livestock is a crucial part of rural livelihoods in Bangladesh — it provides meat, dairy, manure and farm power, and it is one of the few assets a rural household can build up and sell when it needs to. For many rural women, cattle rearing is the most direct route to an income of their own.</p>
<h2>What this project funds</h2>
<p>Investor capital buys the animals and the feed, and pays for the veterinary support and training that the cycle needs. Shathi partners rear the animals under a written contract-farming agreement with a fixed input plan and a monitored growth standard.</p>
<h2>How the return is generated</h2>
<p>Return comes from the weight the animals gain over the cycle and the price the herd fetches at organised sale — B2B buyers and the seasonal market — not from interest on a loan. After project costs and investor payouts, the Shathi partner keeps up to 50% of the profit.</p>
<h2>What we monitor</h2>
<ul><li>Weekly weight and growth against the project SOP</li><li>Feed delivery and consumption per animal</li><li>Veterinary visits and treatment records</li><li>Cooperative-level field verification</li></ul>`,
  bn: `<p>বাংলাদেশের গ্রামীণ জীবিকায় পশুসম্পদ অত্যন্ত গুরুত্বপূর্ণ — এটি মাংস, দুধ, জৈব সার ও কৃষিকাজের শক্তি জোগায়, আবার প্রয়োজনে বিক্রি করা যায় এমন সম্পদও তৈরি করে। গ্রামীণ নারীদের অনেকের জন্য গবাদি পশু পালনই নিজের আয়ের সবচেয়ে সরাসরি পথ।</p>
<h2>এই প্রকল্প কী অর্থায়ন করে</h2>
<p>বিনিয়োগের অর্থে পশু ও খাদ্য কেনা হয় এবং চক্রটির জন্য প্রয়োজনীয় পশুচিকিৎসা সহায়তা ও প্রশিক্ষণের ব্যয় মেটানো হয়। সাথী অংশীদাররা লিখিত চুক্তিভিত্তিক চাষ চুক্তির আওতায়, নির্দিষ্ট উপকরণ পরিকল্পনা ও তদারকিকৃত বৃদ্ধির মান অনুসরণ করে পশু পালন করেন।</p>
<h2>রিটার্ন কীভাবে তৈরি হয়</h2>
<p>রিটার্ন আসে চক্র জুড়ে পশুর ওজন বৃদ্ধি এবং সংগঠিত বিক্রয়ে — বিটুবি ক্রেতা ও মৌসুমি বাজারে — পাওয়া দাম থেকে, ঋণের সুদ থেকে নয়। প্রকল্প ব্যয় ও বিনিয়োগকারীর অর্থ পরিশোধের পর মুনাফার ৫০% পর্যন্ত পান সাথী অংশীদার।</p>
<h2>আমরা যা পর্যবেক্ষণ করি</h2>
<ul><li>প্রকল্প এসওপি অনুযায়ী সাপ্তাহিক ওজন ও বৃদ্ধি</li><li>প্রতিটি পশুর খাদ্য সরবরাহ ও গ্রহণ</li><li>পশুচিকিৎসকের পরিদর্শন ও চিকিৎসার নথি</li><li>সমবায় পর্যায়ে মাঠ যাচাই</li></ul>`,
};

const goatBody = {
  en: `<p>Goat rearing suits households with little land and limited mobility — the animals are small, they browse rather than graze, and a cycle turns faster than cattle. That makes it one of the most accessible enterprises for women and for people with disabilities.</p>
<h2>What this project funds</h2>
<p>Capital covers breeding stock, feed, deworming and vaccination, and the training a first-time rearer needs. Animals are tagged and recorded against the household that keeps them.</p>
<h2>How the return is generated</h2>
<p>Return comes from herd growth and organised sale at the end of the cycle. Buyers are arranged before the cycle closes rather than left to a local broker on the day.</p>
<h2>What we monitor</h2>
<ul><li>Tagged animal register per household</li><li>Vaccination and deworming schedule</li><li>Monthly weight sampling</li><li>Sale price against the published indicative rate</li></ul>`,
  bn: `<p>ছাগল পালন সেই পরিবারগুলোর জন্য উপযুক্ত যাদের জমি কম ও চলাফেরার সুযোগ সীমিত — পশুগুলো ছোট, চারণের বদলে পাতা-লতা খায় এবং গরুর তুলনায় চক্র দ্রুত শেষ হয়। এ কারণেই এটি নারী ও প্রতিবন্ধী ব্যক্তিদের জন্য সবচেয়ে সহজলভ্য উদ্যোগগুলোর একটি।</p>
<h2>এই প্রকল্প কী অর্থায়ন করে</h2>
<p>বিনিয়োগে প্রজনন উপযোগী পশু, খাদ্য, কৃমিনাশক ও টিকা এবং নতুন পালনকারীর প্রয়োজনীয় প্রশিক্ষণের ব্যয় বহন করা হয়। প্রতিটি পশুকে ট্যাগ দিয়ে সংশ্লিষ্ট পরিবারের নামে নথিভুক্ত করা হয়।</p>
<h2>রিটার্ন কীভাবে তৈরি হয়</h2>
<p>রিটার্ন আসে পাল বৃদ্ধি এবং চক্র শেষে সংগঠিত বিক্রয় থেকে। চক্র শেষ হওয়ার আগেই ক্রেতা ঠিক করা হয় — বিক্রির দিন স্থানীয় দালালের ওপর ছেড়ে দেওয়া হয় না।</p>
<h2>আমরা যা পর্যবেক্ষণ করি</h2>
<ul><li>পরিবারভিত্তিক ট্যাগকৃত পশুর নিবন্ধন</li><li>টিকা ও কৃমিনাশকের সময়সূচি</li><li>মাসিক ওজন নমুনা</li><li>প্রকাশিত নির্দেশক দরের সঙ্গে বিক্রয়মূল্যের তুলনা</li></ul>`,
};

const cropBody = {
  en: `<p>Smallholder crop cycles fail commercially far more often than they fail agronomically. Farmers grow well and sell badly: seed and fertiliser are bought retail at the worst moment, and the harvest is sold at the bottom of the price curve to whoever shows up.</p>
<h2>What this project funds</h2>
<p>Capital covers seed, fertiliser, crop protection and the labour peaks of the cycle, purchased through DigiGram's dealer network rather than at retail. Growers follow a published SOP and record their applications.</p>
<h2>How the return is generated</h2>
<p>Return comes from two places — a lower input cost per decimal of land, and a better realised price because the output is aggregated and sold to buyers arranged in advance.</p>
<h2>What we monitor</h2>
<ul><li>Input delivery against the approved plan</li><li>Field visits at sowing, mid-cycle and harvest</li><li>Yield per decimal against the district baseline</li><li>Sale weight, grade and settlement</li></ul>`,
  bn: `<p>ক্ষুদ্র কৃষকের ফসল চক্র কৃষিগত কারণে যতটা ব্যর্থ হয়, বাণিজ্যিক কারণে ব্যর্থ হয় তার চেয়ে অনেক বেশি। কৃষক ভালো ফলান, কিন্তু বিক্রি করেন খারাপভাবে: বীজ ও সার সবচেয়ে খারাপ সময়ে খুচরা দরে কেনা হয়, আর ফসল বিক্রি হয় দামের সর্বনিম্ন পর্যায়ে, যিনি আসেন তাঁর কাছেই।</p>
<h2>এই প্রকল্প কী অর্থায়ন করে</h2>
<p>বিনিয়োগে বীজ, সার, ফসল সুরক্ষা এবং চক্রের ব্যস্ত সময়ের শ্রম ব্যয় বহন করা হয় — খুচরা বাজারের বদলে ডিজিগ্রামের ডিলার নেটওয়ার্কের মাধ্যমে। চাষিরা প্রকাশিত এসওপি মেনে চলেন এবং প্রয়োগের নথি রাখেন।</p>
<h2>রিটার্ন কীভাবে তৈরি হয়</h2>
<p>রিটার্ন আসে দুই জায়গা থেকে — প্রতি শতকে কম উপকরণ ব্যয়, এবং উৎপাদন একত্র করে আগেই ঠিক করা ক্রেতার কাছে বিক্রির ফলে ভালো প্রাপ্ত দাম।</p>
<h2>আমরা যা পর্যবেক্ষণ করি</h2>
<ul><li>অনুমোদিত পরিকল্পনা অনুযায়ী উপকরণ সরবরাহ</li><li>বপন, মধ্য-চক্র ও ফসল তোলার সময় মাঠ পরিদর্শন</li><li>জেলা ভিত্তিরেখার সঙ্গে প্রতি শতকে ফলনের তুলনা</li><li>বিক্রয় ওজন, গ্রেড ও নিষ্পত্তি</li></ul>`,
};

const M = {
  collection: { en: "Collection window", bn: "সংগ্রহের সময়" },
  start: { en: "Project starts", bn: "প্রকল্প শুরু" },
  mid: { en: "Mid-cycle update", bn: "মধ্য-চক্র হালনাগাদ" },
  harvest: { en: "Harvest & sale", bn: "ফসল ও বিক্রয়" },
  payout: { en: "Return payout", bn: "রিটার্ন পরিশোধ" },
};

const cooperative = {
  en: "Rangunia Women's Producer Cooperative",
  bn: "রাঙ্গুনিয়া নারী উৎপাদক সমবায়",
};

const cooperativeB = {
  en: "Banshkhali Farmers' Group",
  bn: "বাঁশখালী কৃষক দল",
};

export const projectSeed: Project[] = [
  {
    id: "prj_1041",
    slug: "project-cattle-01",
    title: { en: "Project Cattle 01", bn: "প্রকল্প ক্যাটল ০১" },
    category: "agriculture_livestock",
    status: "open",
    coverImage: "/assets/projects/cattle-grazing.jpg",
    gallery: [
      "/assets/projects/cattle-grazing.jpg",
      "/assets/projects/cattle-shed.jpg",
      "/assets/projects/cattle-pair.jpg",
      "/assets/projects/cattle-close.jpg",
    ],
    location: RANGUNIA,
    projectType: "sustainable_return",
    tenureMonths: 12,
    unitAmountBdt: 100000,
    returnPct: { min: 18, max: 20 },
    returnAmountBdt: { min: 118000, max: 120000 },
    collectionStarts: "2026-08-01",
    collectionEnds: "2026-09-30",
    totalUnits: 23,
    unitsRemaining: 9,
    partnersCount: 55,
    descriptionHtml: cattleBody,
    producers: { cooperative, district: RANGUNIA, partners: 55, womenSharePct: 72, pwdSharePct: 16 },
    milestones: [
      { label: M.collection, date: "2026-08-01", state: "current" },
      { label: M.start, date: "2026-10-01", state: "upcoming" },
      { label: M.mid, date: "2027-04-01", state: "upcoming" },
      { label: M.harvest, date: "2027-09-15", state: "upcoming" },
      { label: M.payout, date: "2027-10-15", state: "upcoming" },
    ],
  },
  {
    id: "prj_1042",
    slug: "project-cattle-02",
    title: { en: "Project Cattle 02", bn: "প্রকল্প ক্যাটল ০২" },
    category: "agriculture_livestock",
    status: "open",
    coverImage: "/assets/projects/cattle-shed.jpg",
    gallery: ["/assets/projects/cattle-shed.jpg", "/assets/projects/cattle-close.jpg"],
    location: RANGUNIA,
    projectType: "fast_return",
    tenureMonths: 4,
    unitAmountBdt: 100000,
    returnPct: { min: 8, max: 10 },
    returnAmountBdt: { min: 108000, max: 110000 },
    collectionStarts: "2026-08-05",
    collectionEnds: "2026-08-14",
    totalUnits: 18,
    unitsRemaining: 4,
    partnersCount: 55,
    descriptionHtml: cattleBody,
    producers: { cooperative, district: RANGUNIA, partners: 55, womenSharePct: 70, pwdSharePct: 15 },
    milestones: [
      { label: M.collection, date: "2026-08-05", state: "current" },
      { label: M.start, date: "2026-08-20", state: "upcoming" },
      { label: M.mid, date: "2026-10-20", state: "upcoming" },
      { label: M.harvest, date: "2026-12-15", state: "upcoming" },
      { label: M.payout, date: "2027-01-10", state: "upcoming" },
    ],
  },
  {
    id: "prj_1043",
    slug: "project-cattle-03",
    title: { en: "Project Cattle 03", bn: "প্রকল্প ক্যাটল ০৩" },
    category: "agriculture_livestock",
    status: "open",
    coverImage: "/assets/projects/cattle-project.jpg",
    gallery: ["/assets/projects/cattle-project.jpg", "/assets/projects/cattle-pair.jpg"],
    location: RANGUNIA,
    projectType: "fast_return",
    tenureMonths: 4,
    unitAmountBdt: 50000,
    returnPct: { min: 6, max: 7 },
    returnAmountBdt: { min: 53000, max: 53500 },
    collectionStarts: "2026-08-01",
    collectionEnds: "2026-09-15",
    totalUnits: 30,
    unitsRemaining: 0,
    partnersCount: 19,
    descriptionHtml: cattleBody,
    producers: { cooperative, district: RANGUNIA, partners: 19, womenSharePct: 68, pwdSharePct: 11 },
    milestones: [
      { label: M.collection, date: "2026-08-01", state: "done" },
      { label: M.start, date: "2026-09-20", state: "current" },
      { label: M.mid, date: "2026-11-20", state: "upcoming" },
      { label: M.harvest, date: "2027-01-15", state: "upcoming" },
      { label: M.payout, date: "2027-02-10", state: "upcoming" },
    ],
  },
  {
    id: "prj_1044",
    slug: "project-cattle-04",
    title: { en: "Project Cattle 04", bn: "প্রকল্প ক্যাটল ০৪" },
    category: "agriculture_livestock",
    status: "upcoming",
    coverImage: "/assets/projects/cattle-close.jpg",
    gallery: ["/assets/projects/cattle-close.jpg", "/assets/projects/cattle-grazing.jpg"],
    location: RANGUNIA,
    projectType: "sustainable_return",
    tenureMonths: 12,
    unitAmountBdt: 100000,
    returnPct: { min: 20, max: 22 },
    returnAmountBdt: { min: 120000, max: 122000 },
    collectionStarts: "2026-10-01",
    collectionEnds: "2026-10-31",
    totalUnits: 10,
    unitsRemaining: 10,
    partnersCount: 55,
    descriptionHtml: cattleBody,
    producers: { cooperative, district: RANGUNIA, partners: 55, womenSharePct: 74, pwdSharePct: 18 },
    milestones: [
      { label: M.collection, date: "2026-10-01", state: "upcoming" },
      { label: M.start, date: "2026-11-05", state: "upcoming" },
      { label: M.mid, date: "2027-05-05", state: "upcoming" },
      { label: M.harvest, date: "2027-10-20", state: "upcoming" },
      { label: M.payout, date: "2027-11-15", state: "upcoming" },
    ],
  },
  {
    id: "prj_1051",
    slug: "project-goat-01",
    title: { en: "Project Goat 01", bn: "প্রকল্প ছাগল ০১" },
    category: "agriculture_livestock",
    status: "open",
    coverImage: "/assets/projects/goat-standing.jpg",
    gallery: [
      "/assets/projects/goat-standing.jpg",
      "/assets/projects/goat-herd.jpg",
      "/assets/projects/goat-close.jpg",
    ],
    location: RANGUNIA,
    projectType: "sustainable_return",
    tenureMonths: 12,
    unitAmountBdt: 45000,
    returnPct: { min: 18, max: 20 },
    returnAmountBdt: { min: 53100, max: 54000 },
    collectionStarts: "2026-08-01",
    collectionEnds: "2026-09-25",
    totalUnits: 26,
    unitsRemaining: 11,
    partnersCount: 26,
    descriptionHtml: goatBody,
    producers: { cooperative, district: RANGUNIA, partners: 26, womenSharePct: 81, pwdSharePct: 19 },
    milestones: [
      { label: M.collection, date: "2026-08-01", state: "current" },
      { label: M.start, date: "2026-10-01", state: "upcoming" },
      { label: M.mid, date: "2027-04-01", state: "upcoming" },
      { label: M.harvest, date: "2027-09-10", state: "upcoming" },
      { label: M.payout, date: "2027-10-05", state: "upcoming" },
    ],
  },
  {
    id: "prj_1061",
    slug: "project-ginger-01",
    title: { en: "Project Ginger 01", bn: "প্রকল্প আদা ০১" },
    category: "agriculture_livestock",
    status: "completed",
    coverImage: "/assets/projects/ginger.jpg",
    gallery: ["/assets/projects/ginger.jpg"],
    location: RANGUNIA,
    projectType: "fast_return",
    tenureMonths: 4,
    unitAmountBdt: 24000,
    returnPct: { min: 14, max: 15 },
    returnAmountBdt: { min: 27360, max: 27600 },
    collectionStarts: "2025-11-01",
    collectionEnds: "2025-11-30",
    totalUnits: 12,
    unitsRemaining: 0,
    partnersCount: 2,
    descriptionHtml: cropBody,
    producers: { cooperative, district: RANGUNIA, partners: 2, womenSharePct: 100, pwdSharePct: 0 },
    milestones: [
      { label: M.collection, date: "2025-11-01", state: "done" },
      { label: M.start, date: "2025-12-05", state: "done" },
      { label: M.mid, date: "2026-02-01", state: "done" },
      { label: M.harvest, date: "2026-03-20", state: "done" },
      { label: M.payout, date: "2026-04-15", state: "done" },
    ],
  },
  {
    id: "prj_1062",
    slug: "project-ginger-02",
    title: { en: "Project Ginger 02", bn: "প্রকল্প আদা ০২" },
    category: "agriculture_livestock",
    status: "open",
    coverImage: "/assets/projects/ginger.jpg",
    gallery: ["/assets/projects/ginger.jpg"],
    location: RANGUNIA,
    projectType: "sustainable_return",
    tenureMonths: 8,
    unitAmountBdt: 10000,
    returnPct: { min: 15, max: 18 },
    returnAmountBdt: { min: 11500, max: 11800 },
    collectionStarts: "2026-08-10",
    collectionEnds: "2026-09-20",
    totalUnits: 40,
    unitsRemaining: 22,
    partnersCount: 10,
    descriptionHtml: cropBody,
    producers: { cooperative, district: RANGUNIA, partners: 10, womenSharePct: 76, pwdSharePct: 12 },
    milestones: [
      { label: M.collection, date: "2026-08-10", state: "current" },
      { label: M.start, date: "2026-10-01", state: "upcoming" },
      { label: M.mid, date: "2027-01-15", state: "upcoming" },
      { label: M.harvest, date: "2027-05-01", state: "upcoming" },
      { label: M.payout, date: "2027-06-01", state: "upcoming" },
    ],
  },
  {
    id: "prj_1071",
    slug: "project-turmeric-01",
    title: { en: "Project Turmeric 01", bn: "প্রকল্প হলুদ ০১" },
    category: "agriculture_livestock",
    status: "open",
    coverImage: "/assets/projects/turmeric.jpg",
    gallery: ["/assets/projects/turmeric.jpg"],
    location: BANSHKHALI,
    projectType: "fast_return",
    tenureMonths: 4,
    unitAmountBdt: 27000,
    returnPct: { min: 14, max: 15 },
    returnAmountBdt: { min: 30780, max: 31050 },
    collectionStarts: "2026-08-01",
    collectionEnds: "2026-09-10",
    totalUnits: 20,
    unitsRemaining: 13,
    partnersCount: 5,
    descriptionHtml: cropBody,
    producers: {
      cooperative: cooperativeB,
      district: BANSHKHALI,
      partners: 5,
      womenSharePct: 60,
      pwdSharePct: 20,
    },
    milestones: [
      { label: M.collection, date: "2026-08-01", state: "current" },
      { label: M.start, date: "2026-09-20", state: "upcoming" },
      { label: M.mid, date: "2026-11-10", state: "upcoming" },
      { label: M.harvest, date: "2027-01-20", state: "upcoming" },
      { label: M.payout, date: "2027-02-15", state: "upcoming" },
    ],
  },
  {
    id: "prj_1081",
    slug: "project-potato-01",
    title: { en: "Project Potato 01", bn: "প্রকল্প আলু ০১" },
    category: "agriculture_livestock",
    status: "open",
    coverImage: "/assets/projects/vegetables.jpg",
    gallery: ["/assets/projects/vegetables.jpg"],
    location: BANSHKHALI,
    projectType: "fast_return",
    tenureMonths: 4,
    unitAmountBdt: 130000,
    returnPct: { min: 15, max: 18 },
    returnAmountBdt: { min: 149500, max: 153400 },
    collectionStarts: "2026-08-15",
    collectionEnds: "2026-10-05",
    totalUnits: 8,
    unitsRemaining: 5,
    partnersCount: 8,
    descriptionHtml: cropBody,
    producers: {
      cooperative: cooperativeB,
      district: BANSHKHALI,
      partners: 8,
      womenSharePct: 55,
      pwdSharePct: 12,
    },
    milestones: [
      { label: M.collection, date: "2026-08-15", state: "current" },
      { label: M.start, date: "2026-10-15", state: "upcoming" },
      { label: M.mid, date: "2026-12-01", state: "upcoming" },
      { label: M.harvest, date: "2027-02-10", state: "upcoming" },
      { label: M.payout, date: "2027-03-05", state: "upcoming" },
    ],
  },
  {
    id: "prj_1091",
    slug: "combined-vegetable-farm",
    title: { en: "Combined Vegetable Farm", bn: "সমন্বিত সবজি খামার" },
    category: "agriculture_livestock",
    status: "open",
    coverImage: "/assets/projects/vegetables.jpg",
    gallery: ["/assets/projects/vegetables.jpg"],
    location: RANGUNIA,
    projectType: "fast_return",
    tenureMonths: 4,
    unitAmountBdt: 15000,
    returnPct: { min: 6, max: 7 },
    returnAmountBdt: { min: 15900, max: 16050 },
    collectionStarts: "2026-08-01",
    collectionEnds: "2026-09-30",
    totalUnits: 50,
    unitsRemaining: 31,
    partnersCount: 5,
    descriptionHtml: cropBody,
    producers: { cooperative, district: RANGUNIA, partners: 5, womenSharePct: 80, pwdSharePct: 20 },
    milestones: [
      { label: M.collection, date: "2026-08-01", state: "current" },
      { label: M.start, date: "2026-10-05", state: "upcoming" },
      { label: M.mid, date: "2026-11-20", state: "upcoming" },
      { label: M.harvest, date: "2027-01-25", state: "upcoming" },
      { label: M.payout, date: "2027-02-20", state: "upcoming" },
    ],
  },
];
