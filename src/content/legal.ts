import type { Bi } from "@/lib/i18n";

/**
 * Terms of Service and Privacy Policy.
 *
 * PROVENANCE
 * This replaces an earlier placeholder draft. The substance now comes from the
 * documents DigiGram actually publishes — `terms.html` and `privacy.html` on
 * digigramventures.com — restructured, translated, and extended to cover the
 * mobile apps, which the originals did not mention at all.
 *
 * WHY THE EXTENSION WAS NECESSARY
 * `/privacy` is the URL submitted to Google Play for the Shathi app. A Play
 * Store privacy policy has to disclose, specifically, every category of data
 * the app handles and how each is used, shared, retained and deleted. The
 * original policy described a website that collects "name, email address,
 * mailing address, phone number" — it says nothing about NID images, bank
 * account details, push tokens or Google/Apple sign-in identifiers, all of
 * which the app genuinely collects. A policy that under-discloses is a review
 * rejection, and worse, it is inaccurate.
 *
 * Every disclosure below was checked against what the backend actually stores:
 * `User` (phone, email, dateOfBirth, gender, profileImage, nidNumber,
 * nidImageFront, nidImageBack), `UserBank`, `AppFcmToken`, and the
 * `auth/google` / `auth/apple` handlers.
 *
 * HAVE COUNSEL READ THE ADDITIONS. The risk, refund, AML, tax and arbitration
 * wording is the client's own. The data-protection detail is new and describes
 * real system behaviour, but it has not been through legal review.
 */

/** ISO date shown as "Last updated" on the Terms page. */
export const legalUpdated = "2026-09-14";

/**
 * ISO date shown as "Last updated" on the Privacy Policy.
 *
 * Separate from the Terms date because the two change independently. The
 * policy last changed on 2026-11-17, when the sentences presenting an NID as
 * a condition of confirming an investment were removed — an approved NID
 * stopped being required to book that week. `/privacy` is the URL submitted to
 * Google Play, so a stale date here is the one a reviewer sees.
 */
export const privacyUpdated = "2026-11-17";

export type LegalSection = { heading: Bi; body: Bi[] };

/* ------------------------------------------------------------------ terms -- */

export const termsSections: LegalSection[] = [
  {
    heading: { en: "1. Introduction", bn: "১. ভূমিকা" },
    body: [
      {
        en: 'These Terms set out the agreement between you and DigiGram Ventures Ltd. ("DigiGram", "the Company", "we", "us"), a company registered in Bangladesh with its office at Level 4, 27 Shaptak Square, Road 27 (old) / 16 (new), Dhanmondi, Dhaka-1205.',
        bn: 'এই শর্তাবলি আপনার এবং ডিজিগ্রাম ভেঞ্চারস লিমিটেড ("ডিজিগ্রাম", "কোম্পানি", "আমরা") — বাংলাদেশে নিবন্ধিত একটি কোম্পানি, কার্যালয় লেভেল ৪, ২৭ সপ্তক স্কয়ার, রোড ২৭ (পুরোনো) / ১৬ (নতুন), ধানমন্ডি, ঢাকা-১২০৫ — এর মধ্যে চুক্তি নির্ধারণ করে।',
      },
      {
        en: "They apply to this website and to our mobile applications, Shathi and Shathi Sheba. Please read them carefully. We strongly recommend taking independent advice before making any funding decision. DigiGram does not provide financial advice or recommendations.",
        bn: "এগুলো এই ওয়েবসাইট এবং আমাদের মোবাইল অ্যাপ — সাথী ও সাথী সেবা — উভয়ের ক্ষেত্রেই প্রযোজ্য। অনুগ্রহ করে মনোযোগ দিয়ে পড়ুন। অর্থায়নের সিদ্ধান্ত নেওয়ার আগে স্বাধীন পরামর্শ নেওয়ার জন্য আমরা জোরালোভাবে অনুরোধ করি। ডিজিগ্রাম কোনো আর্থিক পরামর্শ বা সুপারিশ দেয় না।",
      },
      {
        en: "By registering on the platform, or by continuing to use it, you agree to these Terms and to our Privacy Policy, and you agree to transact with us electronically.",
        bn: "প্ল্যাটফর্মে নিবন্ধন করে, বা এর ব্যবহার চালিয়ে গিয়ে, আপনি এই শর্তাবলি ও আমাদের গোপনীয়তা নীতিতে সম্মত হচ্ছেন এবং ইলেকট্রনিক মাধ্যমে আমাদের সঙ্গে লেনদেনে সম্মতি দিচ্ছেন।",
      },
    ],
  },
  {
    heading: { en: "2. What the platform is, and is not", bn: "২. প্ল্যাটফর্ম কী, আর কী নয়" },
    body: [
      {
        en: "The platform lets you fund specific projects applied for by rural producers. It is your responsibility to decide whether it meets your needs. Accepting these Terms does not mean we have assessed the platform's suitability for you, and any decision to fund is entirely at your own risk.",
        bn: "এই প্ল্যাটফর্ম আপনাকে গ্রামীণ উৎপাদকদের আবেদন করা নির্দিষ্ট প্রকল্পে অর্থায়নের সুযোগ দেয়। এটি আপনার প্রয়োজন মেটায় কি না, তা বিবেচনার দায়িত্ব আপনার। এই শর্তাবলি গ্রহণের অর্থ এই নয় যে আমরা আপনার জন্য প্ল্যাটফর্মের উপযুক্ততা যাচাই করেছি; অর্থায়নের যেকোনো সিদ্ধান্ত সম্পূর্ণ আপনার নিজ ঝুঁকিতে।",
      },
      {
        en: "DigiGram Ventures Ltd. is not a licensed lender, a deposit-taking institution or a securities issuer. Where a bank, MFI or other licensed lender takes part in a project, that lender keeps sole authority over credit approval, pricing, disbursement and recovery. Shathi Sheba provides decision support only.",
        bn: "ডিজিগ্রাম ভেঞ্চারস লিমিটেড কোনো লাইসেন্সপ্রাপ্ত ঋণদাতা, আমানত গ্রহণকারী প্রতিষ্ঠান বা সিকিউরিটিজ ইস্যুকারী নয়। কোনো প্রকল্পে ব্যাংক, এমএফআই বা অন্য লাইসেন্সপ্রাপ্ত ঋণদাতা যুক্ত থাকলে ঋণ অনুমোদন, মূল্য নির্ধারণ, বিতরণ ও আদায়ের একচ্ছত্র কর্তৃত্ব সেই ঋণদাতারই। সাথী সেবা কেবল সিদ্ধান্ত-সহায়তা দেয়।",
      },
      {
        en: "All services are provided in accordance with the laws and regulations of Bangladesh.",
        bn: "সব সেবা বাংলাদেশের আইন ও বিধি অনুসারে প্রদান করা হয়।",
      },
    ],
  },
  {
    heading: { en: "3. Funded projects", bn: "৩. অর্থায়নকৃত প্রকল্প" },
    body: [
      {
        en: "Your funding supports specific projects — cattle and goat fattening, crop cycles and other sustainable initiatives. Funded activities are carried out by our trained Shathi Partners under our Standard Operating Procedures.",
        bn: "আপনার অর্থায়ন নির্দিষ্ট প্রকল্পে যায় — গরু ও ছাগল মোটাতাজাকরণ, ফসল চক্র এবং অন্যান্য টেকসই উদ্যোগ। অর্থায়নকৃত কার্যক্রম পরিচালনা করেন আমাদের প্রশিক্ষিত সাথী অংশীদাররা, আমাদের স্ট্যান্ডার্ড অপারেটিং প্রসিডিওর অনুসারে।",
      },
    ],
  },
  {
    heading: { en: "4. Funding terms", bn: "৪. অর্থায়নের শর্ত" },
    body: [
      {
        en: "At the start of a project cycle you fund costs such as livestock, feed, healthcare, operational maintenance and supervision. All of these are included in your contribution.",
        bn: "প্রকল্প চক্রের শুরুতে আপনি পশু, খাদ্য, স্বাস্থ্যসেবা, পরিচালন রক্ষণাবেক্ষণ ও তদারকির খরচ বহন করেন। এগুলো সবই আপনার অবদানের মধ্যে অন্তর্ভুক্ত।",
      },
      {
        en: "Your funding is locked for the whole project cycle and cannot be withdrawn until the project completes. You receive an acknowledgment of payment once the funding criteria are met.",
        bn: "আপনার অর্থায়ন পুরো প্রকল্প চক্রের জন্য আবদ্ধ থাকে এবং প্রকল্প শেষ না হওয়া পর্যন্ত তোলা যায় না। অর্থায়নের শর্ত পূরণ হলে আপনি পরিশোধের স্বীকৃতিপত্র পাবেন।",
      },
      {
        en: "On successful completion, profits are remitted to your registered bank account. You may then reinvest in a new project or withdraw.",
        bn: "সফলভাবে সম্পন্ন হলে মুনাফা আপনার নিবন্ধিত ব্যাংক হিসাবে পাঠানো হয়। এরপর আপনি নতুন প্রকল্পে পুনঃবিনিয়োগ করতে বা টাকা তুলে নিতে পারেন।",
      },
    ],
  },
  {
    heading: { en: "5. Returns and risk", bn: "৫. রিটার্ন ও ঝুঁকি" },
    body: [
      {
        en: "Returns shown on the platform are estimated ranges based on a project's production plan and expected sale price. They are not guaranteed. Returns come from real agricultural production and are exposed to disease, mortality, weather, pest pressure, interrupted input supply and market price movement.",
        bn: "প্ল্যাটফর্মে দেখানো রিটার্ন প্রকল্পের উৎপাদন পরিকল্পনা ও প্রত্যাশিত বিক্রয়মূল্যের ভিত্তিতে আনুমানিক পরিসর। এগুলো নিশ্চিত নয়। রিটার্ন আসে বাস্তব কৃষি উৎপাদন থেকে, যা রোগ, মৃত্যু, আবহাওয়া, পোকার আক্রমণ, উপকরণ সরবরাহে বিঘ্ন ও বাজারদরের ওঠানামার ঝুঁকিতে থাকে।",
      },
      {
        en: "A cycle may return less than the stated range, and in a severe case some or all of the capital committed may be lost. Past project performance does not predict future results.",
        bn: "কোনো চক্র উল্লিখিত পরিসরের চেয়ে কম রিটার্ন দিতে পারে, আর গুরুতর ক্ষেত্রে প্রদত্ত পুঁজির কিছু বা পুরোটাই হারাতে পারে। অতীতের ফলাফল ভবিষ্যতের ইঙ্গিত দেয় না।",
      },
    ],
  },
  {
    heading: { en: "6. Your account", bn: "৬. আপনার অ্যাকাউন্ট" },
    body: [
      {
        en: "Accounts are created with a mobile number and a one-time code sent by SMS, or by signing in with Google or Apple. We do not create, store or ask for a password. Keep access to your mobile number and sign-in account secure, and tell us promptly if either is lost or transferred.",
        bn: "অ্যাকাউন্ট তৈরি হয় মোবাইল নম্বর ও এসএমএসে পাঠানো এককালীন কোড দিয়ে, অথবা গুগল বা অ্যাপল দিয়ে সাইন ইন করে। আমরা কোনো পাসওয়ার্ড তৈরি, সংরক্ষণ বা চাই না। আপনার মোবাইল নম্বর ও সাইন-ইন অ্যাকাউন্টের নিরাপত্তা বজায় রাখুন, আর কোনোটি হারিয়ে গেলে বা হস্তান্তর হলে দ্রুত আমাদের জানান।",
      },
      {
        en: "You are responsible for the security of your credentials. Unauthorised use of the platform is prohibited. We may restrict access during maintenance, or where we see activity we reasonably believe to be suspicious.",
        bn: "আপনার পরিচয়-তথ্যের নিরাপত্তার দায়িত্ব আপনার। প্ল্যাটফর্মের অননুমোদিত ব্যবহার নিষিদ্ধ। রক্ষণাবেক্ষণের সময়, বা যুক্তিসঙ্গতভাবে সন্দেহজনক মনে হওয়া কার্যকলাপ দেখলে আমরা প্রবেশাধিকার সীমিত করতে পারি।",
      },
    ],
  },
  {
    heading: { en: "7. Eligibility and your warranties", bn: "৭. যোগ্যতা ও আপনার নিশ্চয়তা" },
    body: [
      {
        en: "By using the platform you confirm that you are over 18 and legally able to enter a contract; that the personal information you give us is accurate; that you have considered the risks and are funding with your own lawfully acquired money; and that you comply with all applicable laws.",
        bn: "প্ল্যাটফর্ম ব্যবহার করে আপনি নিশ্চিত করছেন যে আপনার বয়স ১৮ বছরের বেশি এবং আপনি আইনত চুক্তি করতে সক্ষম; আপনার দেওয়া ব্যক্তিগত তথ্য সঠিক; আপনি ঝুঁকি বিবেচনা করেছেন এবং নিজের বৈধভাবে অর্জিত অর্থ দিয়ে অর্থায়ন করছেন; এবং আপনি সব প্রযোজ্য আইন মেনে চলছেন।",
      },
    ],
  },
  {
    heading: { en: "8. Anti-money laundering", bn: "৮. মানি লন্ডারিং প্রতিরোধ" },
    body: [
      {
        en: "The platform must not be used for money laundering or any other illegal activity. We are obliged to report suspicious transactions to the relevant authorities.",
        bn: "এই প্ল্যাটফর্ম মানি লন্ডারিং বা অন্য কোনো অবৈধ কাজে ব্যবহার করা যাবে না। সন্দেহজনক লেনদেন সংশ্লিষ্ট কর্তৃপক্ষকে জানাতে আমরা বাধ্য।",
      },
    ],
  },
  {
    heading: { en: "9. Refunds", bn: "৯. ফেরত" },
    body: [
      {
        en: "A refund request for a project that has not yet started must be submitted within 5 working days of payment confirmation. Processing takes up to 10 working days and is subject to a 2.5% transaction fee. Refunds are made by bank transfer only, to the account registered on your profile.",
        bn: "এখনও শুরু হয়নি এমন প্রকল্পের ফেরতের আবেদন পরিশোধ নিশ্চিত হওয়ার ৫ কার্যদিবসের মধ্যে জমা দিতে হবে। প্রক্রিয়াকরণে ১০ কার্যদিবস পর্যন্ত সময় লাগে এবং ২.৫% লেনদেন ফি প্রযোজ্য। ফেরত কেবল ব্যাংক ট্রান্সফারে, আপনার প্রোফাইলে নিবন্ধিত হিসাবে পাঠানো হয়।",
      },
      {
        en: "Once a cycle has begun, funding is committed to live production and cannot be refunded.",
        bn: "চক্র শুরু হয়ে গেলে অর্থায়ন চলমান উৎপাদনে যুক্ত হয়ে যায় এবং তা ফেরতযোগ্য নয়।",
      },
    ],
  },
  {
    heading: { en: "10. Death or incapacity", bn: "১০. মৃত্যু বা অক্ষমতা" },
    body: [
      {
        en: "If a funder dies or becomes legally incapable, earnings from completed projects are transferred to the nominee or legal successors named at registration, on production of proper documentation.",
        bn: "কোনো অর্থায়নকারীর মৃত্যু হলে বা তিনি আইনত অক্ষম হলে, সম্পন্ন প্রকল্পের আয় যথাযথ কাগজপত্র দাখিল সাপেক্ষে নিবন্ধনের সময় উল্লিখিত নমিনি বা বৈধ উত্তরাধিকারীর কাছে হস্তান্তর করা হয়।",
      },
    ],
  },
  {
    heading: { en: "11. Tax", bn: "১১. কর" },
    body: [
      {
        en: "Unless the law says otherwise, all tax on earnings is the funder's responsibility. DigiGram does not deduct tax on your behalf.",
        bn: "আইনে ভিন্ন কিছু বলা না থাকলে, আয়ের ওপর সব কর অর্থায়নকারীর দায়। ডিজিগ্রাম আপনার পক্ষে কোনো কর কর্তন করে না।",
      },
    ],
  },
  {
    heading: { en: "12. Project visits", bn: "১২. প্রকল্প পরিদর্শন" },
    body: [
      {
        en: "Requests to visit a project must be made in writing and follow our visit guidelines. Transport and accommodation are at your own expense, and visitors must respect local etiquette and on-site safety rules.",
        bn: "প্রকল্প পরিদর্শনের অনুরোধ লিখিতভাবে করতে হবে এবং আমাদের পরিদর্শন নির্দেশিকা মানতে হবে। যাতায়াত ও থাকার খরচ আপনার নিজের, আর পরিদর্শনকারীদের স্থানীয় রীতি ও ঘটনাস্থলের নিরাপত্তাবিধি মানতে হবে।",
      },
    ],
  },
  {
    heading: { en: "13. Content and intellectual property", bn: "১৩. কনটেন্ট ও মেধাস্বত্ব" },
    body: [
      {
        en: "The text, images, data, software and branding on this platform belong to DigiGram Ventures Ltd. or its licensors. You may read and share them for personal, non-commercial use with attribution. You may not republish them commercially, or present our project data as your own, without written permission.",
        bn: "এই প্ল্যাটফর্মের লেখা, ছবি, তথ্য, সফটওয়্যার ও ব্র্যান্ডিং ডিজিগ্রাম ভেঞ্চারস লিমিটেড বা তার লাইসেন্সদাতাদের সম্পত্তি। ব্যক্তিগত, অবাণিজ্যিক ব্যবহারে সূত্র উল্লেখ করে আপনি তা পড়তে ও ভাগ করতে পারেন। লিখিত অনুমতি ছাড়া বাণিজ্যিকভাবে পুনঃপ্রকাশ বা আমাদের প্রকল্প-তথ্য নিজের বলে উপস্থাপন করা যাবে না।",
      },
    ],
  },
  {
    heading: { en: "14. Indemnity", bn: "১৪. ক্ষতিপূরণ" },
    body: [
      {
        en: "You agree to indemnify DigiGram, its partners and representatives against liabilities arising from your use of the platform, including your own negligence or breach of these Terms.",
        bn: "প্ল্যাটফর্ম ব্যবহারের কারণে উদ্ভূত দায় — আপনার নিজের অবহেলা বা এই শর্তাবলি লঙ্ঘনসহ — থেকে ডিজিগ্রাম, এর অংশীদার ও প্রতিনিধিদের ক্ষতিপূরণ দিতে আপনি সম্মত হচ্ছেন।",
      },
    ],
  },
  {
    heading: { en: "15. Term and termination", bn: "১৫. মেয়াদ ও সমাপ্তি" },
    body: [
      {
        en: "This agreement stays in force for as long as you have active projects. Either party may end it once no obligations or active funding cycles remain. You can close your account at any time — see the Privacy Policy for what happens to your data.",
        bn: "আপনার চলমান প্রকল্প থাকা পর্যন্ত এই চুক্তি বহাল থাকে। কোনো দায় বা চলমান অর্থায়ন চক্র না থাকলে যেকোনো পক্ষ এটি শেষ করতে পারে। আপনি যেকোনো সময় অ্যাকাউন্ট বন্ধ করতে পারেন — আপনার তথ্যের কী হবে তা গোপনীয়তা নীতিতে দেখুন।",
      },
    ],
  },
  {
    heading: { en: "16. Changes to these Terms", bn: "১৬. শর্তাবলির পরিবর্তন" },
    body: [
      {
        en: "We will give 14 days' notice of any amendment to these Terms. We may refuse any action that breaches them or applicable law.",
        bn: "এই শর্তাবলির যেকোনো সংশোধনের ১৪ দিন আগে আমরা জানাব। এগুলো বা প্রযোজ্য আইন লঙ্ঘন করে এমন যেকোনো কাজ আমরা প্রত্যাখ্যান করতে পারি।",
      },
    ],
  },
  {
    heading: { en: "17. Governing law and disputes", bn: "১৭. প্রযোজ্য আইন ও বিরোধ" },
    body: [
      {
        en: "This agreement is governed by the laws of Bangladesh. Disputes will be settled amicably where possible, and otherwise by arbitration under the Arbitration Act, 2001.",
        bn: "এই চুক্তি বাংলাদেশের আইন দ্বারা পরিচালিত। বিরোধ যথাসম্ভব সমঝোতায় নিষ্পত্তি হবে, নতুবা সালিশ আইন, ২০০১ অনুযায়ী সালিশের মাধ্যমে।",
      },
    ],
  },
  {
    heading: { en: "18. Contact", bn: "১৮. যোগাযোগ" },
    body: [
      {
        en: "DigiGram Ventures Ltd., Level 4, 27 Shaptak Square, Road 27 (old) / 16 (new), Dhanmondi, Dhaka-1205, Bangladesh. Email info@digigramventures.com, telephone +880 1761 720 230.",
        bn: "ডিজিগ্রাম ভেঞ্চারস লিমিটেড, লেভেল ৪, ২৭ সপ্তক স্কয়ার, রোড ২৭ (পুরোনো) / ১৬ (নতুন), ধানমন্ডি, ঢাকা-১২০৫, বাংলাদেশ। ইমেইল info@digigramventures.com, ফোন +৮৮০ ১৭৬১ ৭২০ ২৩০।",
      },
    ],
  },
];

/* ---------------------------------------------------------------- privacy -- */

export const privacySections: LegalSection[] = [
  {
    heading: { en: "1. About this policy", bn: "১. এই নীতি সম্পর্কে" },
    body: [
      {
        en: 'This policy explains how DigiGram Ventures Ltd. ("DigiGram", "we", "us") collects, uses, stores, shares and deletes personal information. It covers digigramventures.com and our mobile applications — Shathi (for investors) and Shathi Sheba (for farmers and rural entrepreneurs) — together referred to as the platform.',
        bn: 'এই নীতিতে ব্যাখ্যা করা হয়েছে ডিজিগ্রাম ভেঞ্চারস লিমিটেড ("ডিজিগ্রাম", "আমরা") কীভাবে ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার, সংরক্ষণ, ভাগ ও মুছে ফেলে। এটি digigramventures.com এবং আমাদের মোবাইল অ্যাপ — সাথী (বিনিয়োগকারীদের জন্য) ও সাথী সেবা (কৃষক ও গ্রামীণ উদ্যোক্তাদের জন্য) — সবকিছুর ক্ষেত্রে প্রযোজ্য, যাদের একসঙ্গে "প্ল্যাটফর্ম" বলা হয়েছে।',
      },
      {
        en: "DigiGram Ventures Ltd. is the data controller. You can browse the public parts of the website without giving us any personal information; an account is needed only to invest, to apply to a project, or to buy and sell.",
        bn: "ডিজিগ্রাম ভেঞ্চারস লিমিটেড তথ্য নিয়ন্ত্রক। ওয়েবসাইটের উন্মুক্ত অংশ কোনো ব্যক্তিগত তথ্য না দিয়েই দেখা যায়; অ্যাকাউন্ট কেবল বিনিয়োগ, প্রকল্পে আবেদন, বা কেনাবেচার জন্য প্রয়োজন।",
      },
    ],
  },
  {
    heading: { en: "2. Information we collect", bn: "২. আমরা যে তথ্য সংগ্রহ করি" },
    body: [
      {
        en: "Account and profile — your name, mobile number, email address, date of birth, gender and profile photograph. Your mobile number is verified with a one-time SMS code; an email address verified through Google sign-in is recorded as verified.",
        bn: "অ্যাকাউন্ট ও প্রোফাইল — আপনার নাম, মোবাইল নম্বর, ইমেইল ঠিকানা, জন্মতারিখ, লিঙ্গ ও প্রোফাইল ছবি। আপনার মোবাইল নম্বর এসএমএসে পাঠানো এককালীন কোড দিয়ে যাচাই হয়; গুগল সাইন-ইনের মাধ্যমে যাচাইকৃত ইমেইল ঠিকানা যাচাইকৃত হিসেবে নথিভুক্ত হয়।",
      },
      {
        en: "Identity verification — your National ID number and photographs of the front and back of your NID card. These are reviewed by our verification team.",
        bn: "পরিচয় যাচাই — আপনার জাতীয় পরিচয়পত্র নম্বর এবং এনআইডি কার্ডের সামনে ও পেছনের ছবি। আমাদের যাচাইকারী দল এগুলো পরীক্ষা করে।",
      },
      {
        en: "Financial — the bank name, branch and account number you register for payouts, and any payment receipt or proof of transfer you upload against a booking.",
        bn: "আর্থিক — পরিশোধের জন্য আপনার নিবন্ধিত ব্যাংকের নাম, শাখা ও হিসাব নম্বর, এবং কোনো বুকিংয়ের বিপরীতে আপনার আপলোড করা পরিশোধের রসিদ বা প্রমাণ।",
      },
      {
        en: "Activity — the projects you fund or apply to, your bookings, units held, applications, listings, orders, training progress and messages you send us.",
        bn: "কার্যক্রম — আপনি যেসব প্রকল্পে অর্থায়ন বা আবেদন করেন, আপনার বুকিং, ধারণকৃত ইউনিট, আবেদন, বিক্রয় তালিকা, অর্ডার, প্রশিক্ষণের অগ্রগতি এবং আমাদের পাঠানো বার্তা।",
      },
      {
        en: "Location — the division, district and upazila on your profile, used to show projects and services available in your area. We do not collect continuous or background GPS location.",
        bn: "অবস্থান — আপনার প্রোফাইলে থাকা বিভাগ, জেলা ও উপজেলা, যা দিয়ে আপনার এলাকায় পাওয়া প্রকল্প ও সেবা দেখানো হয়। আমরা ধারাবাহিক বা পটভূমিতে জিপিএস অবস্থান সংগ্রহ করি না।",
      },
      {
        en: "Device and technical — device model, operating system, app version, IP address, a push-notification token for sending you alerts, and non-identifying analytics about how pages and screens are used.",
        bn: "ডিভাইস ও কারিগরি — ডিভাইস মডেল, অপারেটিং সিস্টেম, অ্যাপ সংস্করণ, আইপি ঠিকানা, সতর্কবার্তা পাঠানোর জন্য একটি পুশ-নোটিফিকেশন টোকেন, এবং পৃষ্ঠা ও স্ক্রিন কীভাবে ব্যবহৃত হয় সে সম্পর্কে পরিচয়হীন বিশ্লেষণী তথ্য।",
      },
      {
        en: "Sign-in identifiers — where you sign in with Google or Apple, we receive the account identifier, and the name, email address and avatar those services release to us. We never receive your Google or Apple password.",
        bn: "সাইন-ইন শনাক্তকারী — গুগল বা অ্যাপল দিয়ে সাইন ইন করলে আমরা অ্যাকাউন্ট শনাক্তকারী এবং ওই সেবাগুলো যে নাম, ইমেইল ও অবতার আমাদের দেয় তা পাই। আপনার গুগল বা অ্যাপল পাসওয়ার্ড আমরা কখনোই পাই না।",
      },
    ],
  },
  {
    heading: { en: "3. How we use it", bn: "৩. আমরা কীভাবে ব্যবহার করি" },
    body: [
      {
        en: "To create and secure your account and sign you in; to verify your identity; to process bookings, payments and payouts; to show you the projects and services relevant to your area; to send transactional messages such as one-time codes, booking confirmations and project updates; to answer your enquiries; to meet legal, tax and anti-money-laundering obligations; and to keep the platform working, secure and free of abuse.",
        bn: "আপনার অ্যাকাউন্ট তৈরি ও সুরক্ষিত করতে এবং সাইন ইন করাতে; আপনার পরিচয় যাচাই করতে; বুকিং, পরিশোধ ও অর্থ প্রেরণ প্রক্রিয়া করতে; আপনার এলাকার উপযোগী প্রকল্প ও সেবা দেখাতে; এককালীন কোড, বুকিং নিশ্চিতকরণ ও প্রকল্পের হালনাগাদের মতো লেনদেন-সংক্রান্ত বার্তা পাঠাতে; আপনার জিজ্ঞাসার উত্তর দিতে; আইনি, কর ও মানি লন্ডারিং প্রতিরোধের বাধ্যবাধকতা পূরণ করতে; এবং প্ল্যাটফর্ম সচল, নিরাপদ ও অপব্যবহারমুক্ত রাখতে।",
      },
      {
        en: "In Shathi Sheba, the information you provide also produces your readiness assessment — a risk grade, a readiness status and a recommended next step. This is decision support shared with a lender only when you apply. It is not an automated credit decision: a licensed lender makes that.",
        bn: "সাথী সেবায় আপনার দেওয়া তথ্য থেকে আপনার প্রস্তুতির মূল্যায়নও তৈরি হয় — একটি ঝুঁকি গ্রেড, প্রস্তুতির অবস্থা ও পরবর্তী পদক্ষেপের সুপারিশ। এটি সিদ্ধান্ত-সহায়তা, যা কেবল আপনি আবেদন করলেই ঋণদাতার সঙ্গে ভাগ করা হয়। এটি স্বয়ংক্রিয় ঋণ-সিদ্ধান্ত নয়: সেই সিদ্ধান্ত নেন লাইসেন্সপ্রাপ্ত ঋণদাতা।",
      },
    ],
  },
  {
    heading: { en: "4. Who we share it with", bn: "৪. আমরা কার সঙ্গে ভাগ করি" },
    body: [
      {
        en: "Service providers who act on our instructions only: Amazon Web Services (hosting, file storage and email delivery), Google Firebase (push notifications), BulkSMSBD (one-time codes and SMS alerts), and Google and Apple for the sign-in you choose to use.",
        bn: "কেবল আমাদের নির্দেশে কাজ করা সেবাদাতারা: অ্যামাজন ওয়েব সার্ভিসেস (হোস্টিং, ফাইল সংরক্ষণ ও ইমেইল প্রেরণ), গুগল ফায়ারবেজ (পুশ নোটিফিকেশন), বাল্কএসএমএসবিডি (এককালীন কোড ও এসএমএস সতর্কতা), এবং আপনি যে সাইন-ইন বেছে নেন তার জন্য গুগল ও অ্যাপল।",
      },
      {
        en: "Banks, MFIs and other licensed lenders — only the application pack for a project you have chosen to apply to, and only when you apply.",
        bn: "ব্যাংক, এমএফআই ও অন্যান্য লাইসেন্সপ্রাপ্ত ঋণদাতা — কেবল আপনি যে প্রকল্পে আবেদন করতে বেছে নিয়েছেন তার আবেদনপত্র, এবং কেবল আপনি আবেদন করলেই।",
      },
      {
        en: "Cooperatives and field officers who verify profiles and monitor projects on the ground, limited to what they need to do that work.",
        bn: "সমবায় ও মাঠ কর্মকর্তা, যাঁরা মাঠপর্যায়ে প্রোফাইল যাচাই ও প্রকল্প তদারকি করেন — কেবল সেই কাজের জন্য প্রয়োজনীয় তথ্যটুকুতেই সীমিত।",
      },
      {
        en: "Authorities, where the law or a valid legal process requires it, or to protect our rights or someone's safety. We will tell you where we are legally permitted to.",
        bn: "কর্তৃপক্ষ, যেখানে আইন বা বৈধ আইনি প্রক্রিয়ার প্রয়োজন, অথবা আমাদের অধিকার বা কারও নিরাপত্তা রক্ষার জন্য। আইনত অনুমোদিত হলে আমরা আপনাকে জানাব।",
      },
      {
        en: "We do not sell, rent or trade your personal information, and we do not share it with advertising networks or data brokers. Where we publish anything about an investor's participation for promotional purposes, we ask that investor's permission first.",
        bn: "আমরা আপনার ব্যক্তিগত তথ্য বিক্রি, ভাড়া বা বিনিময় করি না, এবং বিজ্ঞাপন নেটওয়ার্ক বা ডেটা ব্রোকারের সঙ্গে ভাগ করি না। প্রচারের উদ্দেশ্যে কোনো বিনিয়োগকারীর অংশগ্রহণ সম্পর্কে কিছু প্রকাশ করলে আমরা আগে সেই বিনিয়োগকারীর অনুমতি নিই।",
      },
    ],
  },
  {
    heading: { en: "5. Deleting your account and data", bn: "৫. অ্যাকাউন্ট ও তথ্য মুছে ফেলা" },
    body: [
      {
        en: "You can request deletion of your account and personal data at any time — from Menu → Delete account inside the app, at digigramventures.com/delete-account, or by emailing tech@digigramventures.com from your registered address. We confirm the request with a code sent to your registered mobile number or email.",
        bn: "আপনি যেকোনো সময় আপনার অ্যাকাউন্ট ও ব্যক্তিগত তথ্য মুছে ফেলার অনুরোধ করতে পারেন — অ্যাপে মেনু → অ্যাকাউন্ট মুছুন থেকে, digigramventures.com/delete-account ঠিকানায়, অথবা আপনার নিবন্ধিত ঠিকানা থেকে tech@digigramventures.com-এ ইমেইল করে। নিবন্ধিত মোবাইল নম্বর বা ইমেইলে পাঠানো কোড দিয়ে আমরা অনুরোধটি নিশ্চিত করি।",
      },
      {
        en: "On deletion we remove your profile, your NID images and number, your profile photograph, your bank details and your push-notification token. Your account can no longer be signed into.",
        bn: "মুছে ফেলার সময় আমরা আপনার প্রোফাইল, এনআইডির ছবি ও নম্বর, প্রোফাইল ছবি, ব্যাংক তথ্য ও পুশ-নোটিফিকেশন টোকেন সরিয়ে ফেলি। এরপর আপনার অ্যাকাউন্টে আর সাইন ইন করা যায় না।",
      },
      {
        en: "Two things we must keep. Records of completed financial transactions are retained for the period Bangladesh's tax, accounting and anti-money-laundering rules require. Where you have an active funding cycle, the account cannot be deleted until that cycle closes and any balance is settled — we will tell you if this applies and delete the account once it does not.",
        bn: "দুটি জিনিস আমাদের রাখতেই হয়। সম্পন্ন আর্থিক লেনদেনের নথি বাংলাদেশের কর, হিসাবরক্ষণ ও মানি লন্ডারিং প্রতিরোধ বিধি অনুযায়ী নির্ধারিত সময় পর্যন্ত সংরক্ষণ করা হয়। আপনার কোনো চলমান অর্থায়ন চক্র থাকলে সেটি শেষ ও পাওনা নিষ্পত্তি না হওয়া পর্যন্ত অ্যাকাউন্ট মোছা যায় না — এমন হলে আমরা আপনাকে জানাব এবং শর্ত পূরণ হলেই মুছে দেব।",
      },
    ],
  },
  {
    heading: { en: "6. How long we keep it", bn: "৬. কতদিন রাখি" },
    body: [
      {
        en: "We keep your information for as long as your account is active, and afterwards only for as long as we need it to meet legal, tax, accounting or regulatory obligations, or to resolve a dispute. Analytics data is kept in aggregate and is not linked back to you.",
        bn: "আপনার অ্যাকাউন্ট সক্রিয় থাকা পর্যন্ত আমরা আপনার তথ্য রাখি, আর তারপর কেবল আইনি, কর, হিসাবরক্ষণ বা নিয়ন্ত্রক বাধ্যবাধকতা পূরণ কিংবা কোনো বিরোধ নিষ্পত্তির জন্য যতদিন প্রয়োজন ততদিন। বিশ্লেষণী তথ্য সমষ্টিগতভাবে রাখা হয় এবং তা আপনার সঙ্গে যুক্ত করা হয় না।",
      },
    ],
  },
  {
    heading: { en: "7. How we protect it", bn: "৭. আমরা কীভাবে সুরক্ষা দিই" },
    body: [
      {
        en: "Traffic between your device and our servers is encrypted in transit. Sessions use a signed token rather than a stored password — we never hold your password, because we never create one. Access to identity documents and bank details is limited to the staff whose work requires it.",
        bn: "আপনার ডিভাইস ও আমাদের সার্ভারের মধ্যে তথ্য আদান-প্রদান পরিবহনকালে এনক্রিপ্ট করা থাকে। সেশনে সংরক্ষিত পাসওয়ার্ডের বদলে স্বাক্ষরিত টোকেন ব্যবহার হয় — আমরা কখনো আপনার পাসওয়ার্ড রাখি না, কারণ আমরা কখনো তা তৈরিই করি না। পরিচয়পত্র ও ব্যাংক তথ্যে প্রবেশাধিকার কেবল সেইসব কর্মীর, যাঁদের কাজে তা প্রয়োজন।",
      },
      {
        en: "No system is perfectly secure. If a breach affects your personal information we will notify you and the relevant authorities without undue delay.",
        bn: "কোনো ব্যবস্থাই শতভাগ নিরাপদ নয়। কোনো নিরাপত্তা লঙ্ঘনে আপনার ব্যক্তিগত তথ্য ক্ষতিগ্রস্ত হলে আমরা অযথা বিলম্ব না করে আপনাকে ও সংশ্লিষ্ট কর্তৃপক্ষকে জানাব।",
      },
    ],
  },
  {
    heading: { en: "8. Your rights", bn: "৮. আপনার অধিকার" },
    body: [
      {
        en: "You can ask us for a copy of the personal information we hold about you, ask us to correct anything inaccurate, ask us to delete your account, or object to a particular use. Most profile details can be corrected yourself in the app or on the website. Write to tech@digigramventures.com and we will respond within 30 days.",
        bn: "আপনি আমাদের কাছে থাকা আপনার ব্যক্তিগত তথ্যের অনুলিপি চাইতে পারেন, ভুল কিছু সংশোধন করতে বলতে পারেন, অ্যাকাউন্ট মুছে ফেলতে বলতে পারেন, অথবা নির্দিষ্ট কোনো ব্যবহারে আপত্তি জানাতে পারেন। প্রোফাইলের বেশিরভাগ তথ্য আপনি নিজেই অ্যাপে বা ওয়েবসাইটে সংশোধন করতে পারেন। tech@digigramventures.com-এ লিখুন, আমরা ৩০ দিনের মধ্যে উত্তর দেব।",
      },
      {
        en: "You can turn off push notifications in your device settings, and unsubscribe from our newsletters using the link in any of them. Transactional messages — one-time codes, booking confirmations — continue, because they are part of the service.",
        bn: "ডিভাইস সেটিংস থেকে পুশ নোটিফিকেশন বন্ধ করতে পারেন, আর যেকোনো নিউজলেটারের লিঙ্ক দিয়ে সেটি বন্ধ করতে পারেন। লেনদেন-সংক্রান্ত বার্তা — এককালীন কোড, বুকিং নিশ্চিতকরণ — চালু থাকবে, কারণ সেগুলো সেবারই অংশ।",
      },
    ],
  },
  {
    heading: { en: "9. Children", bn: "৯. শিশু" },
    body: [
      {
        en: "The platform is not intended for anyone under 18 and we do not knowingly collect information from children. If you believe a child has given us personal information, write to tech@digigramventures.com and we will delete it.",
        bn: "এই প্ল্যাটফর্ম ১৮ বছরের কম বয়সীদের জন্য নয় এবং আমরা জেনেশুনে শিশুদের কাছ থেকে তথ্য সংগ্রহ করি না। কোনো শিশু আমাদের ব্যক্তিগত তথ্য দিয়েছে বলে মনে করলে tech@digigramventures.com-এ লিখুন, আমরা তা মুছে দেব।",
      },
    ],
  },
  {
    heading: { en: "10. Cookies and analytics", bn: "১০. কুকি ও অ্যানালিটিক্স" },
    body: [
      {
        en: "The website uses a small number of cookies: one to keep you signed in, one to remember your language, and Google Analytics to count visits and see which pages are read. Analytics runs only on the production site. You can refuse cookies in your browser, though the signed-in area will not work without the session cookie.",
        bn: "ওয়েবসাইটে অল্প কয়েকটি কুকি ব্যবহৃত হয়: একটি আপনাকে সাইন ইন রাখতে, একটি আপনার ভাষা মনে রাখতে, আর গুগল অ্যানালিটিক্স ভিজিট গণনা ও কোন পৃষ্ঠা পড়া হচ্ছে তা দেখতে। অ্যানালিটিক্স কেবল প্রোডাকশন সাইটে চলে। ব্রাউজারে কুকি বন্ধ করতে পারেন, তবে সেশন কুকি ছাড়া সাইন-ইন করা অংশ কাজ করবে না।",
      },
      {
        en: "The session cookie is httpOnly, so no script on the page can read it.",
        bn: "সেশন কুকি httpOnly, তাই পৃষ্ঠার কোনো স্ক্রিপ্ট তা পড়তে পারে না।",
      },
    ],
  },
  {
    heading: { en: "11. Third-party links", bn: "১১. তৃতীয় পক্ষের লিঙ্ক" },
    body: [
      {
        en: "The platform links to sites we do not control, including app stores and partner websites. Those sites have their own privacy policies and we are not responsible for their practices.",
        bn: "প্ল্যাটফর্মে এমন সাইটের লিঙ্ক আছে যেগুলো আমাদের নিয়ন্ত্রণে নয়, যেমন অ্যাপ স্টোর ও অংশীদারদের ওয়েবসাইট। ওই সাইটগুলোর নিজস্ব গোপনীয়তা নীতি আছে এবং তাদের কর্মপদ্ধতির দায় আমাদের নয়।",
      },
    ],
  },
  {
    heading: { en: "12. Changes to this policy", bn: "১২. এই নীতির পরিবর্তন" },
    body: [
      {
        en: "We may update this policy from time to time. The current version is always published here with the date it was last changed. Where a change materially affects how we use your information, we will tell you in the app or by email before it takes effect.",
        bn: "আমরা সময়ে সময়ে এই নীতি হালনাগাদ করতে পারি। সর্বশেষ সংস্করণ সবসময় এখানে, পরিবর্তনের তারিখসহ প্রকাশিত থাকে। কোনো পরিবর্তন আপনার তথ্য ব্যবহারে উল্লেখযোগ্য প্রভাব ফেললে তা কার্যকর হওয়ার আগে আমরা অ্যাপে বা ইমেইলে জানাব।",
      },
    ],
  },
  {
    heading: { en: "13. Contact us", bn: "১৩. যোগাযোগ" },
    body: [
      {
        en: "DigiGram Ventures Ltd., Level 4, 27 Shaptak Square, Road 27 (old) / 16 (new), Dhanmondi, Dhaka-1205, Bangladesh. Privacy and data requests: tech@digigramventures.com. General enquiries: info@digigramventures.com, telephone +880 1761 720 230.",
        bn: "ডিজিগ্রাম ভেঞ্চারস লিমিটেড, লেভেল ৪, ২৭ সপ্তক স্কয়ার, রোড ২৭ (পুরোনো) / ১৬ (নতুন), ধানমন্ডি, ঢাকা-১২০৫, বাংলাদেশ। গোপনীয়তা ও তথ্য-সংক্রান্ত অনুরোধ: tech@digigramventures.com। সাধারণ জিজ্ঞাসা: info@digigramventures.com, ফোন +৮৮০ ১৭৬১ ৭২০ ২৩০।",
      },
    ],
  },
];
