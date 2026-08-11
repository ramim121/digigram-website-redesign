import type { Bi } from "@/lib/i18n";

/**
 * News & insights.
 *
 * Blog is the site's main organic-search surface: these are the pages that can
 * rank for "contract farming Bangladesh", "invest in agriculture Bangladesh",
 * "cattle fattening return" and similar queries that the corporate pages will
 * never win. Each post is long-form, answers one question, and links inward.
 *
 * The three posts below are written from the decks and are ready to publish,
 * but should be reviewed by the client before launch. Replace `author` with a
 * real byline.
 */

export type Post = {
  slug: string;
  title: Bi;
  excerpt: Bi;
  body: Bi;
  date: string;
  author: Bi;
  category: Bi;
  image: string;
  readingMinutes: number;
};

export const posts: Post[] = [
  {
    slug: "how-contract-farming-returns-are-generated",
    date: "2026-07-28",
    author: { en: "DigiGram Ventures", bn: "ডিজিগ্রাম ভেঞ্চারস" },
    category: { en: "Investing", bn: "বিনিয়োগ" },
    image: "/assets/projects/cattle-grazing.jpg",
    readingMinutes: 6,
    title: {
      en: "Where a contract-farming return actually comes from",
      bn: "চুক্তিভিত্তিক চাষের রিটার্ন আসলে কোথা থেকে আসে",
    },
    excerpt: {
      en: "A 20% return on a cattle cycle is not interest. It is weight gained, cost avoided and a price negotiated before the sale. Here is the arithmetic.",
      bn: "গরুর একটি চক্রে ২০% রিটার্ন কোনো সুদ নয়। এটি অর্জিত ওজন, সাশ্রয়ী ব্যয় এবং বিক্রির আগেই নির্ধারিত দাম। হিসাবটা এখানে।",
    },
    body: {
      en: `<p>When an investor sees "18–20% expected return, 12 months" on a project card, the reasonable first question is: return on what? Nothing about rural Bangladesh generates 20% by itself. The number has to come from somewhere specific, and if a platform cannot tell you where, you should not fund it.</p>
<h2>Three sources, not one</h2>
<p>A contract-farming cycle produces value in three places, and only the first is obvious.</p>
<h3>1. Biological growth</h3>
<p>An animal entering a fattening cycle at 200kg and gaining 900g per day on graded feed leaves the cycle materially heavier. That weight is the raw material of the return. It is also the part most exposed to risk: disease, heat stress and feed interruption all show up here first, which is why weekly weight monitoring against the project SOP is not paperwork.</p>
<h3>2. Cost avoided on the way in</h3>
<p>A smallholder buying feed retail from one nearby market pays a price set by the absence of alternatives. Buying the same nutrition at commercial scale through a dealer network removes roughly 40% of that input cost. No production improvement is needed for this to show up in the margin — it is procurement, not agronomy.</p>
<h3>3. Price realised on the way out</h3>
<p>This is the one that gets ignored. A producer with mobility limits — and 70% of the producers we work with have them — sells to whoever arrives at the gate. That single fact costs up to 30% of the achievable price. Aggregating output at cooperative level and arranging the B2B buyer before the cycle closes recovers most of it.</p>
<h2>Where the money goes</h2>
<p>After the cycle sells, project costs come out first, then the investor payout, and up to 50% of what remains goes to the Shathi partner who did the work. The split is written into the contract before the cycle starts, not decided at the end.</p>
<h2>What can go wrong</h2>
<p>Cycles underperform. An animal can fall ill, a monsoon can arrive early, a market can move against the harvest window. Returns on this site are stated as ranges and described as estimated, because that is what they are. Read the risk note on any project you are considering, and treat any platform promising a guaranteed agricultural return with suspicion.</p>`,
      bn: `<p>একজন বিনিয়োগকারী যখন প্রকল্প কার্ডে দেখেন "প্রত্যাশিত রিটার্ন ১৮–২০%, ১২ মাস", তখন প্রথম যুক্তিসংগত প্রশ্নটি হলো: কিসের ওপর রিটার্ন? গ্রামীণ বাংলাদেশে এমনি এমনি ২০% তৈরি হয় না। সংখ্যাটি নির্দিষ্ট কোনো জায়গা থেকে আসতে হবে, আর কোনো প্ল্যাটফর্ম যদি সেটি বলতে না পারে, তাহলে সেখানে অর্থ দেওয়া উচিত নয়।</p>
<h2>একটি নয়, তিনটি উৎস</h2>
<p>চুক্তিভিত্তিক চাষের একটি চক্র তিন জায়গায় মূল্য তৈরি করে, এবং কেবল প্রথমটিই চোখে পড়ে।</p>
<h3>১. জৈবিক বৃদ্ধি</h3>
<p>২০০ কেজি ওজনে চক্রে ঢোকা একটি পশু গ্রেডকৃত খাদ্যে দৈনিক ৯০০ গ্রাম করে বাড়লে চক্র শেষে উল্লেখযোগ্যভাবে ভারী হয়। এই ওজনই রিটার্নের কাঁচামাল। এটিই আবার সবচেয়ে ঝুঁকিপূর্ণ অংশ: রোগ, তাপচাপ ও খাদ্য সরবরাহে বিঘ্ন — সব এখানেই আগে ধরা পড়ে। এ কারণেই প্রকল্প এসওপি অনুযায়ী সাপ্তাহিক ওজন পর্যবেক্ষণ নিছক কাগুজে কাজ নয়।</p>
<h3>২. প্রবেশপথে সাশ্রয়</h3>
<p>কাছের একটিমাত্র বাজার থেকে খুচরা দরে খাদ্য কেনা ক্ষুদ্র কৃষক এমন দাম দেন যা বিকল্পের অভাবেই নির্ধারিত। একই পুষ্টিমান ডিলার নেটওয়ার্কের মাধ্যমে বাণিজ্যিক পরিসরে কিনলে সেই উপকরণ ব্যয়ের প্রায় ৪০% কমে যায়। এর জন্য উৎপাদনে কোনো উন্নতি লাগে না — এটি ক্রয়ব্যবস্থার বিষয়, কৃষিবিজ্ঞানের নয়।</p>
<h3>৩. বেরোনোর পথে প্রাপ্ত দাম</h3>
<p>এই অংশটিই সবচেয়ে বেশি উপেক্ষিত হয়। চলাফেরায় সীমাবদ্ধ একজন উৎপাদক — এবং আমরা যাদের সঙ্গে কাজ করি তাঁদের ৭০%-এরই তা আছে — যিনি বাড়ির সামনে আসেন তাঁর কাছেই বিক্রি করেন। এই একটি বাস্তবতাই অর্জনযোগ্য দামের ৩০% পর্যন্ত কেড়ে নেয়। সমবায় পর্যায়ে উৎপাদন একত্র করে এবং চক্র শেষ হওয়ার আগেই বিটুবি ক্রেতা ঠিক করে এর বড় অংশ ফিরিয়ে আনা যায়।</p>
<h2>টাকা কোথায় যায়</h2>
<p>চক্র বিক্রি হওয়ার পর প্রথমে প্রকল্প ব্যয়, তারপর বিনিয়োগকারীর পরিশোধ, এবং অবশিষ্টের ৫০% পর্যন্ত পান সেই সাথী অংশীদার যিনি কাজটি করেছেন। এই ভাগ চক্র শুরুর আগেই চুক্তিতে লেখা থাকে, শেষে ঠিক করা হয় না।</p>
<h2>কী ভুল হতে পারে</h2>
<p>চক্র প্রত্যাশার নিচে যেতে পারে। পশু অসুস্থ হতে পারে, বর্ষা আগেভাগে আসতে পারে, ফসল তোলার সময়ের বিপরীতে বাজার নড়তে পারে। এই সাইটে রিটার্ন পরিসর আকারে দেওয়া হয় এবং প্রাক্কলিত বলে উল্লেখ করা হয়, কারণ সেটাই বাস্তবতা। যে প্রকল্পে আগ্রহী, তার ঝুঁকি নোটটি পড়ুন — আর কৃষিতে নিশ্চিত রিটার্নের প্রতিশ্রুতি দেওয়া যেকোনো প্ল্যাটফর্মকে সন্দেহের চোখে দেখুন।</p>`,
    },
  },
  {
    slug: "why-thin-file-farmers-cannot-borrow",
    date: "2026-07-14",
    author: { en: "DigiGram Ventures", bn: "ডিজিগ্রাম ভেঞ্চারস" },
    category: { en: "Rural finance", bn: "গ্রামীণ অর্থায়ন" },
    image: "/assets/photos/community-meeting.webp",
    readingMinutes: 7,
    title: {
      en: "Why a productive farmer still cannot borrow — and what fixes it",
      bn: "উৎপাদনশীল কৃষকও কেন ঋণ পান না — আর এর সমাধান কী",
    },
    excerpt: {
      en: "85% of rural borrowing in Bangladesh is informal. The barrier is rarely the farmer's economics. It is that nobody has written those economics down in a form a lender can act on.",
      bn: "বাংলাদেশে গ্রামীণ ঋণের ৮৫% অনানুষ্ঠানিক। বাধাটি খুব কমই কৃষকের অর্থনীতি। বাধা হলো, সেই অর্থনীতি কেউ এমনভাবে লিখে রাখেনি যা দেখে ঋণদাতা সিদ্ধান্ত নিতে পারেন।",
    },
    body: {
      en: `<p>Only about 15% of rural households in Bangladesh reach formal credit. The other 85% borrow informally, at rates that quietly consume the margin of whatever they were borrowing to produce.</p>
<h2>The problem is evidence, not creditworthiness</h2>
<p>A woman running six cattle and selling into two local markets has a cash flow. She has repayment capacity. What she does not have is any of it written down in a form a bank's credit committee can act on: no filed accounts, no bank statement showing the trade, no collateral registry entry, and no third party willing to attest that the business exists.</p>
<p>Lenders are not being unreasonable when they decline. They are being asked to price a risk they cannot see.</p>
<h2>What a verified profile changes</h2>
<p>The Rural Enterprise Passport is the record that closes that gap: identity and household, the enterprise and its assets, production history, input purchases, sales and buyer relationships, training completed, and cooperative verification of all of it. Each value carries its source, its date, its verifier and a confidence level.</p>
<p>That record does not make a bad borrower good. It makes a real borrower legible.</p>
<h2>Four outputs, deliberately kept apart</h2>
<p>The assessment produces four separate things, and collapsing them into one score is where most credit-scoring products go wrong:</p>
<ul>
<li><strong>Risk grade (A–D)</strong> — the estimated inherent risk on current evidence.</li>
<li><strong>Finance readiness</strong> — Bank Ready, Conditionally Ready, Project Ready, Development Required or Currently Ineligible.</li>
<li><strong>Data confidence</strong> — high, medium or low, based on how much has been independently verified.</li>
<li><strong>Recommended pathway</strong> — what should actually happen next.</li>
</ul>
<p>A farmer can be a B grade with low data confidence, which is a verification problem. Or an A grade that is Project Ready rather than Bank Ready because the lender's programme does not cover their district. Those are different situations that deserve different next steps.</p>
<h2>Develop, do not just decline</h2>
<p>The point of separating the outputs is that "no" stops being the end of the conversation. A Development Required result comes with the specific tasks — documents to supply, records to keep, training to complete, a debt to regularise — that move the profile, and the user reapplies. Assess, explain, develop, reassess, connect.</p>
<h2>Who decides</h2>
<p>Not us. Shathi Sheba produces decision support. The licensed lender retains KYC/AML, credit approval, pricing, disbursement and recovery. Any platform blurring that line is describing a regulatory problem, not a product.</p>`,
      bn: `<p>বাংলাদেশে গ্রামীণ পরিবারের মাত্র ১৫% আনুষ্ঠানিক ঋণ পান। বাকি ৮৫% অনানুষ্ঠানিকভাবে ঋণ নেন, এমন সুদে যা তাঁরা যা উৎপাদন করতে ঋণ নিচ্ছেন তার মুনাফাই নীরবে খেয়ে ফেলে।</p>
<h2>সমস্যা প্রমাণের, ঋণযোগ্যতার নয়</h2>
<p>ছয়টি গরু পালন করে দুটি স্থানীয় বাজারে বিক্রি করেন এমন একজন নারীর নগদ প্রবাহ আছে। ঋণ শোধের সক্ষমতাও আছে। যা নেই তা হলো — এসবের কিছুই এমনভাবে লিপিবদ্ধ নয় যা দেখে ব্যাংকের ঋণ কমিটি সিদ্ধান্ত নিতে পারে: কোনো দাখিলকৃত হিসাব নেই, লেনদেন দেখায় এমন ব্যাংক স্টেটমেন্ট নেই, জামানত নিবন্ধনে কোনো এন্ট্রি নেই, আর ব্যবসাটি আছে বলে সাক্ষ্য দেওয়ার মতো তৃতীয় পক্ষও নেই।</p>
<p>ঋণদাতারা প্রত্যাখ্যান করে অযৌক্তিক কিছু করছেন না। তাঁদের এমন ঝুঁকির দাম নির্ধারণ করতে বলা হচ্ছে যা তাঁরা দেখতেই পাচ্ছেন না।</p>
<h2>যাচাইকৃত প্রোফাইল যা বদলায়</h2>
<p>রুরাল এন্টারপ্রাইজ পাসপোর্ট সেই ফাঁক পূরণ করে: পরিচয় ও পরিবার, উদ্যোগ ও তার সম্পদ, উৎপাদনের ইতিহাস, উপকরণ ক্রয়, বিক্রয় ও ক্রেতা সম্পর্ক, সম্পন্ন প্রশিক্ষণ, এবং এসবের সমবায় যাচাই। প্রতিটি তথ্যের সঙ্গে থাকে তার উৎস, তারিখ, যাচাইকারী ও নির্ভরযোগ্যতার মাত্রা।</p>
<p>এই নথি খারাপ ঋণগ্রহীতাকে ভালো বানায় না। এটি প্রকৃত ঋণগ্রহীতাকে দৃশ্যমান করে।</p>
<h2>চারটি ফলাফল, ইচ্ছাকৃতভাবেই আলাদা</h2>
<p>মূল্যায়ন চারটি আলাদা জিনিস তৈরি করে, আর এগুলোকে একটিমাত্র স্কোরে মিশিয়ে ফেলাই বেশিরভাগ ক্রেডিট-স্কোরিং পণ্যের ভুল:</p>
<ul>
<li><strong>ঝুঁকি গ্রেড (A–D)</strong> — বর্তমান প্রমাণের ভিত্তিতে প্রাক্কলিত অন্তর্নিহিত ঝুঁকি।</li>
<li><strong>অর্থায়ন প্রস্তুতি</strong> — ব্যাংক রেডি, শর্তসাপেক্ষে প্রস্তুত, প্রকল্প রেডি, উন্নয়ন প্রয়োজন বা বর্তমানে অযোগ্য।</li>
<li><strong>তথ্য নির্ভরযোগ্যতা</strong> — উচ্চ, মাঝারি বা নিম্ন, কতটা স্বাধীনভাবে যাচাই হয়েছে তার ভিত্তিতে।</li>
<li><strong>প্রস্তাবিত পথ</strong> — এরপর আসলে কী হওয়া উচিত।</li>
</ul>
<p>একজন কৃষক B গ্রেড পেয়েও নিম্ন তথ্য-নির্ভরযোগ্যতায় থাকতে পারেন — এটি যাচাইয়ের সমস্যা। আবার A গ্রেড পেয়েও ব্যাংক রেডির বদলে প্রকল্প রেডি হতে পারেন, কারণ ঋণদাতার কর্মসূচি তাঁর জেলায় নেই। এগুলো ভিন্ন পরিস্থিতি, ভিন্ন পরবর্তী পদক্ষেপ দাবি করে।</p>
<h2>প্রত্যাখ্যান নয়, সক্ষমতা গড়া</h2>
<p>ফলাফল আলাদা রাখার উদ্দেশ্য হলো — "না" আর আলোচনার শেষ কথা থাকে না। "উন্নয়ন প্রয়োজন" ফলাফলের সঙ্গে আসে নির্দিষ্ট কাজ — কোন কাগজ দিতে হবে, কী নথি রাখতে হবে, কোন প্রশিক্ষণ শেষ করতে হবে, কোন ঋণ নিয়মিত করতে হবে — যা প্রোফাইল বদলায়, এবং ব্যবহারকারী আবার আবেদন করেন। মূল্যায়ন, ব্যাখ্যা, উন্নয়ন, পুনর্মূল্যায়ন, সংযোগ।</p>
<h2>সিদ্ধান্ত কে নেয়</h2>
<p>আমরা নই। সাথী সেবা সিদ্ধান্ত-সহায়তা তৈরি করে। কেওয়াইসি/এএমএল, ঋণ অনুমোদন, মূল্য নির্ধারণ, বিতরণ ও আদায় — সবই লাইসেন্সপ্রাপ্ত ঋণদাতার হাতে থাকে। যে প্ল্যাটফর্ম এই সীমারেখা ঝাপসা করে, সে একটি নিয়ন্ত্রক সমস্যার বর্ণনা দিচ্ছে, পণ্যের নয়।</p>`,
    },
  },
  {
    slug: "what-900g-adg-means-for-a-farmer",
    date: "2026-06-30",
    author: { en: "DigiGram Ventures", bn: "ডিজিগ্রাম ভেঞ্চারস" },
    category: { en: "Inputs", bn: "উপকরণ" },
    image: "/assets/projects/cattle-shed.jpg",
    readingMinutes: 5,
    title: {
      en: "What 900g average daily gain actually means for a household",
      bn: "দৈনিক ৯০০ গ্রাম গড় ওজন বৃদ্ধি একটি পরিবারের জন্য আসলে কী",
    },
    excerpt: {
      en: "Feed specifications are written for buyers, not for the person doing the feeding. Here is the same number translated into weeks, taka and risk.",
      bn: "ফিডের স্পেসিফিকেশন লেখা হয় ক্রেতার জন্য, যিনি খাওয়ান তাঁর জন্য নয়। একই সংখ্যাকে সপ্তাহ, টাকা ও ঝুঁকির ভাষায় অনুবাদ করা হলো।",
    },
    body: {
      en: `<p>"DLS-compliant compound feed, validated at 900g ADG" is a sentence written for a procurement officer. For the household actually filling the trough twice a day, it needs translating.</p>
<h2>What the number is</h2>
<p>Average daily gain is how much weight an animal puts on per day across the cycle. At 900g a day, an animal gains roughly 6.3kg a week, or about 27kg a month. Over a 12-month fattening cycle that is the difference between an animal you can sell and an animal you are still feeding.</p>
<h2>Why ungraded feed costs more than it saves</h2>
<p>67% of the farmers we surveyed buy ungraded feed from a single nearby market. Ungraded means the protein and energy content is whatever the batch happened to contain. The animal still eats the same volume; it simply converts less of it. The saving on the sack is paid back with interest in extra weeks of feeding.</p>
<h2>Three things that hold the number down</h2>
<ul>
<li><strong>Interruption.</strong> A week without feed does not cost a week of growth — the animal loses condition and takes longer than that to recover it.</li>
<li><strong>Water.</strong> Intake collapses without clean water available all day, and so does conversion.</li>
<li><strong>Untreated parasites.</strong> Deworming on schedule is the cheapest weight you will ever buy.</li>
</ul>
<h2>What we do about it</h2>
<p>Shadhin Cattle Feed is produced to DLS specification at 100 tons a month, scalable to 500, and distributed through the cooperative network so a delivery does not depend on a farmer travelling to a market. Growth is checked weekly against the project SOP, and the record of that feeding is not just husbandry — it becomes production evidence on the household's enterprise profile, which is what a lender reads later.</p>`,
      bn: `<p>"ডিএলএস-অনুমোদিত কম্পাউন্ড ফিড, দৈনিক ৯০০ গ্রাম ওজন বৃদ্ধিতে যাচাইকৃত" — এই বাক্যটি লেখা হয়েছে একজন ক্রয় কর্মকর্তার জন্য। যে পরিবার দিনে দুবার গামলা ভরে খাবার দেয়, তাদের জন্য এটি অনুবাদ করা দরকার।</p>
<h2>সংখ্যাটি আসলে কী</h2>
<p>গড় দৈনিক বৃদ্ধি মানে চক্র জুড়ে একটি পশু প্রতিদিন কতটা ওজন বাড়ায়। দিনে ৯০০ গ্রাম হারে একটি পশু সপ্তাহে প্রায় ৬.৩ কেজি, মাসে প্রায় ২৭ কেজি বাড়ে। ১২ মাসের একটি মোটাতাজাকরণ চক্রে এটিই ঠিক করে দেয় — পশুটি বিক্রির উপযুক্ত হবে, নাকি আপনি তখনো খাওয়াতেই থাকবেন।</p>
<h2>গ্রেডবিহীন খাদ্য যত সাশ্রয় করে, তার চেয়ে বেশি খরচ করায়</h2>
<p>আমাদের জরিপে অংশ নেওয়া ৬৭% কৃষক কাছের একটিমাত্র বাজার থেকে গ্রেডবিহীন খাদ্য কেনেন। গ্রেডবিহীন মানে আমিষ ও শক্তির পরিমাণ যা ব্যাচে ছিল তাই। পশু একই পরিমাণ খায়, কেবল কম রূপান্তর করে। বস্তায় যে সাশ্রয়, তা অতিরিক্ত কয়েক সপ্তাহ খাওয়ানোর মাধ্যমে সুদসহ ফেরত দিতে হয়।</p>
<h2>যে তিনটি জিনিস সংখ্যাটি নামিয়ে দেয়</h2>
<ul>
<li><strong>বিঘ্ন।</strong> এক সপ্তাহ খাবার না পাওয়ার খরচ এক সপ্তাহের বৃদ্ধি নয় — পশু শারীরিক অবস্থা হারায় এবং তা ফিরে পেতে আরও বেশি সময় নেয়।</li>
<li><strong>পানি।</strong> সারাদিন পরিষ্কার পানি না থাকলে খাদ্য গ্রহণ কমে যায়, রূপান্তরও।</li>
<li><strong>অচিকিৎসিত কৃমি।</strong> সময়মতো কৃমিনাশক দেওয়াই সবচেয়ে সস্তা ওজন।</li>
</ul>
<h2>আমরা কী করি</h2>
<p>স্বাধীন গো-খাদ্য ডিএলএস স্পেসিফিকেশনে মাসে ১০০ টন উৎপাদিত হয়, যা ৫০০ টন পর্যন্ত বাড়ানো যায়, এবং সমবায় নেটওয়ার্কের মাধ্যমে বিতরণ করা হয় — যাতে সরবরাহের জন্য কৃষককে বাজারে যেতে না হয়। প্রকল্প এসওপি অনুযায়ী সাপ্তাহিক বৃদ্ধি যাচাই করা হয়, আর সেই খাওয়ানোর নথি কেবল পালনের হিসাব নয় — এটি পরিবারের উদ্যোগ প্রোফাইলে উৎপাদনের প্রমাণ হয়ে ওঠে, যা পরে ঋণদাতা পড়েন।</p>`,
    },
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function sortedPosts(): Post[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}
