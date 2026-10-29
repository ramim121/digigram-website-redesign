import type { Bi } from "@/lib/i18n";
import type { IconName } from "@/components/ui/Icon";

/**
 * Shathi Apa — the agricultural assistant inside the Shathi Sheba app.
 *
 * "Apa" is Bangla for elder sister: someone who knows, and who you can ask
 * without embarrassment. The name is the product's whole stance.
 *
 * SOURCING — every line here traces to shipped code, not to a pitch:
 *   - Capabilities: the feature flags in `ShathiShebaAdmin/lib/apa/entitlement.ts`
 *     (ask_text, ask_voice, ask_photo, read_aloud, live) and the app's
 *     `src/ai/apa.ts` (cattle photo analysis, listing descriptions).
 *   - Principles: Apa's persona and scope prompts in `lib/apa/config.ts`.
 *   - Access: the tier resolution in `entitlement.ts` — a trial allowance of
 *     free questions at registration, full access free of charge once a
 *     farmer's KYC is verified, live conversation verified-only and still
 *     behind two rollout flags. That last point is why live is described as
 *     rolling out rather than available: promising it would be promising a
 *     switch nobody has flipped.
 *
 * If the persona or the feature set changes, change this file with it. The
 * principles in particular are promises made to farmers in public.
 */

export type ApaCapability = { icon: IconName; title: Bi; body: Bi; status?: "rolling-out" };

export const apaCapabilities: ApaCapability[] = [
  {
    icon: "message-circle",
    title: { en: "Ask in your own words", bn: "নিজের ভাষায় জিজ্ঞেস করুন" },
    body: {
      en: "Speak or type a question in everyday Bangla — no menus, no forms. English works too.",
      bn: "প্রতিদিনের বাংলায় বলুন বা লিখুন — কোনো মেনু বা ফর্ম লাগে না। ইংরেজিতেও চলে।",
    },
  },
  {
    icon: "play",
    title: { en: "Hear every answer", bn: "প্রতিটি উত্তর শুনুন" },
    body: {
      en: "Answers are read aloud in a Bangla voice, so reading is never the barrier to good advice.",
      bn: "উত্তর বাংলা কণ্ঠে পড়ে শোনানো হয় — তাই পড়তে না পারা কখনো ভালো পরামর্শের বাধা হয় না।",
    },
  },
  {
    icon: "search",
    title: { en: "Show, don't describe", bn: "বর্ণনা নয়, ছবি দেখান" },
    body: {
      en: "Send a photo of a leaf, an animal or a feed label and ask about it directly.",
      bn: "পাতা, পশু বা খাদ্যের লেবেলের ছবি পাঠিয়ে সরাসরি প্রশ্ন করুন।",
    },
  },
  {
    icon: "bar-chart",
    title: { en: "A cattle check from one photo", bn: "এক ছবিতেই গরুর হিসাব" },
    body: {
      en: "An estimate of weight, age and breed with a short health note — before a field officer confirms the weight on a scale.",
      bn: "ওজন, বয়স ও জাতের আনুমানিক হিসাব, সঙ্গে স্বাস্থ্যের ছোট নোট — মাঠ কর্মকর্তা স্কেলে ওজন নিশ্চিত করার আগেই।",
    },
  },
  {
    icon: "file-text",
    title: { en: "Writes your sale listing", bn: "বিক্রির বিবরণ লিখে দেয়" },
    body: {
      en: "Add photos of the animal and Apa drafts the description — the farmer edits, approves and posts.",
      bn: "পশুর ছবি দিলেই আপা বিবরণ লিখে দেয় — কৃষক নিজে দেখে, ঠিক করে, তারপর দেন।",
    },
  },
  {
    icon: "phone",
    title: { en: "Talk it through, live", bn: "সরাসরি কথা বলুন" },
    body: {
      en: "A back-and-forth voice conversation for verified farmers, with a monthly allowance of minutes.",
      bn: "যাচাইকৃত কৃষকদের জন্য সরাসরি কণ্ঠে কথোপকথন, মাসিক নির্দিষ্ট মিনিটসহ।",
    },
    status: "rolling-out",
  },
];

/**
 * The rules Apa answers by — taken from its persona and scope instructions.
 *
 * These are the part a lender, a development partner or a sceptical farmer
 * should read first: an assistant that admits what it does not know is the
 * only kind worth trusting with a price or a sick animal.
 */
export const apaPrinciples: { title: Bi; body: Bi }[] = [
  {
    title: { en: "Never guesses a number", bn: "কখনো সংখ্যা আন্দাজ করে না" },
    body: {
      en: "No price, weather, dose or date unless live data supplied it. If it could not fetch it, Apa says so plainly.",
      bn: "সরাসরি তথ্য না পেলে কোনো দাম, আবহাওয়া, ডোজ বা তারিখ বলে না। তথ্য আনতে না পারলে সোজাসুজি তা জানায়।",
    },
  },
  {
    title: { en: "Never diagnoses with certainty", bn: "নিশ্চিত রোগনির্ণয় করে না" },
    body: {
      en: "It names a likely cause and the next sensible step — and points to a vet or field officer when it matters.",
      bn: "সম্ভাব্য কারণ ও পরবর্তী করণীয় বলে — আর প্রয়োজনে পশুচিকিৎসক বা মাঠ কর্মকর্তার কাছে যেতে বলে।",
    },
  },
  {
    title: { en: "Action first, reason second", bn: "আগে করণীয়, পরে কারণ" },
    body: {
      en: "What to do today comes first. When a question is unclear, it asks one question back instead of guessing.",
      bn: "আজ কী করবেন তা আগে আসে। প্রশ্ন অস্পষ্ট হলে আন্দাজ না করে একটি প্রশ্ন ফিরে জিজ্ঞেস করে।",
    },
  },
  {
    title: { en: "Farming only", bn: "শুধু কৃষি" },
    body: {
      en: "Crops, livestock, poultry, fish, farm weather, markets and money — and the app. Anything else is declined politely.",
      bn: "ফসল, গবাদিপশু, হাঁস-মুরগি, মাছ, কৃষির আবহাওয়া, বাজার ও টাকাপয়সা — আর অ্যাপ। অন্য কিছু ভদ্রভাবে এড়িয়ে যায়।",
    },
  },
];

/** How a farmer gets access — from the entitlement rules, stated plainly. */
export const apaAccess: Bi = {
  en: "Every new farmer gets a set of free questions at registration. Once their profile is verified, Shathi Apa stays free — and while verification is pending, the app shows the name and number of their area's field officer.",
  bn: "নতুন প্রত্যেক কৃষক নিবন্ধনের সময় কিছু ফ্রি প্রশ্ন পান। প্রোফাইল যাচাই হলে সাথী আপা বিনামূল্যেই চালু থাকে — আর যাচাই চলার সময় অ্যাপে এলাকার মাঠ কর্মকর্তার নাম ও নম্বর দেখানো থাকে।",
};
