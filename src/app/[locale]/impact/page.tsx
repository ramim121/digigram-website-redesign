import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Card, Note, StatBlock } from "@/components/ui/Primitives";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  ImpactFocusDiagram,
  TheoryOfChange,
  ReadinessPathways,
} from "@/components/sections/Diagrams";
import { SdgTiles, type GoalNumber } from "@/components/sections/Sdg";
import { CtaBand } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";
import { careStats, headlineStats, faqs } from "@/content/company";
import { shebaGapStats, shebaOutputs, shebaLenderPrinciple } from "@/content/sheba";
import { ShathiShebaLogo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { isLocale, localePath, t, type Bi, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;

  return buildMetadata({
    locale,
    path: routes.impact,
    title: locale === "en" ? "Our impact" : "আমাদের প্রভাব",
    description:
      locale === "en"
        ? "How DigiGram measures impact: eleven stated outcomes, four value drivers, a theory of change, the finance-readiness gap Shathi Sheba closes, and the methodology behind every number we publish."
        : "ডিজিগ্রাম কীভাবে প্রভাব পরিমাপ করে: এগারোটি ঘোষিত ফলাফল, চারটি মূল চালিকাশক্তি, পরিবর্তনের তত্ত্ব, সাথী সেবা যে অর্থায়ন-প্রস্তুতির ফাঁক পূরণ করে, এবং প্রকাশিত প্রতিটি সংখ্যার পেছনের পদ্ধতি।",
    image: "/assets/photos/hero/impact-producer.webp",
  });
}

export default async function ImpactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const drivers: {
    title: Bi;
    body: Bi;
    response: Bi;
    track: Bi;
    icon: IconName;
    goals: GoalNumber[];
  }[] = [
    {
      icon: "users",
      goals: [1, 2],
      title: { en: "Rural poverty", bn: "গ্রামীণ দারিদ্র্য" },
      body: {
        en: "20.5% of Bangladesh's population lives below the poverty line and 10.5% in extreme poverty (BBS 2022). 75% of the rural population — the base of the pyramid — depends on agriculture, livestock and small-scale production, held back by limited access to finance, markets, quality inputs and training.",
        bn: "বাংলাদেশের জনসংখ্যার ২০.৫% দারিদ্র্যসীমার নিচে এবং ১০.৫% চরম দারিদ্র্যে বাস করে (বিবিএস ২০২২)। গ্রামীণ জনসংখ্যার ৭৫% — পিরামিডের ভিত্তি — কৃষি, গবাদিপশু ও ক্ষুদ্র উৎপাদনের ওপর নির্ভরশীল, যাঁরা অর্থায়ন, বাজার, মানসম্পন্ন উপকরণ ও প্রশিক্ষণের সীমিত সুযোগে আটকে আছেন।",
      },
      response: {
        en: "Finance, graded inputs, training and a committed buyer for each production cycle — arranged before it starts, not chased after it ends.",
        bn: "প্রতিটি উৎপাদন চক্রের জন্য অর্থায়ন, মানসম্পন্ন উপকরণ, প্রশিক্ষণ ও নিশ্চিত ক্রেতা — চক্র শুরুর আগেই ঠিক করা, শেষ হওয়ার পরে খোঁজা নয়।",
      },
      track: {
        en: "Household income against the baseline recorded at enrolment.",
        bn: "নিবন্ধনের সময় নথিভুক্ত ভিত্তিরেখার সাপেক্ষে পারিবারিক আয়।",
      },
    },
    {
      icon: "handshake",
      goals: [5, 10],
      title: { en: "Gender gap", bn: "লিঙ্গ ব্যবধান" },
      body: {
        en: "Women are central to agriculture and the RMG industry yet face a 22% gender pay gap. Despite a 136% increase in female agricultural labour in Bangladesh, women still lack resources and face socio-cultural barriers. Closing these gaps could raise farm yields by 20–30%.",
        bn: "কৃষি ও তৈরি পোশাক শিল্পে নারীরা কেন্দ্রীয় ভূমিকায় থাকলেও ২২% মজুরি ব্যবধানের মুখোমুখি। বাংলাদেশে নারী কৃষিশ্রমিক ১৩৬% বাড়লেও নারীরা এখনো সম্পদবঞ্চিত এবং সামাজিক-সাংস্কৃতিক বাধার সম্মুখীন। এই ব্যবধান পূরণ হলে খামারের ফলন ২০–৩০% বাড়তে পারে।",
      },
      response: {
        en: "Livelihoods built around care work, advice on the phone in Bangla, and women's cooperatives that produce and distribute our feed.",
        bn: "সেবাকাজের সঙ্গে মানিয়ে গড়া জীবিকা, ফোনে বাংলায় পরামর্শ, আর আমাদের খাবার উৎপাদন ও বিতরণে নারী সমবায়।",
      },
      track: {
        en: "Share of women and caregivers among participants, recorded per project.",
        bn: "অংশগ্রহণকারীদের মধ্যে নারী ও সেবাদানকারীর হার, প্রকল্পভিত্তিক নথিভুক্ত।",
      },
    },
    {
      icon: "shield",
      goals: [11, 10],
      title: { en: "Disability", bn: "প্রতিবন্ধিতা" },
      body: {
        en: "Over 9% of Bangladesh's population lives with a disability, yet only 1 in 10 participates in the labour force. Barriers to education, employment and financial services block economic participation and financial independence.",
        bn: "বাংলাদেশের জনসংখ্যার ৯%-এর বেশি প্রতিবন্ধিতা নিয়ে বাস করে, অথচ তাঁদের মাত্র ১০ জনে ১ জন শ্রমশক্তিতে অংশ নেন। শিক্ষা, কর্মসংস্থান ও আর্থিক সেবায় বাধা তাঁদের অর্থনৈতিক অংশগ্রহণ ও আর্থিক স্বাধীনতা আটকে রাখে।",
      },
      response: {
        en: "Home-based enterprises, voice-first advice that does not depend on reading, and field officers who come to the farmer.",
        bn: "ঘরে বসে চালানোর মতো উদ্যোগ, পড়তে না জানলেও চলে এমন কণ্ঠভিত্তিক পরামর্শ, আর কৃষকের কাছে নিজে যাওয়া মাঠ কর্মকর্তা।",
      },
      track: {
        en: "Share of persons with disabilities among participants, recorded per project.",
        bn: "অংশগ্রহণকারীদের মধ্যে প্রতিবন্ধী ব্যক্তির হার, প্রকল্পভিত্তিক নথিভুক্ত।",
      },
    },
    {
      icon: "leaf",
      goals: [13, 12],
      title: { en: "Environment", bn: "পরিবেশ" },
      body: {
        en: "Inefficient waste management in the production and use of single-use plastics degrades the environment and holds back progress on climate action, while smallholder farms bear the brunt of increasingly erratic weather.",
        bn: "এককবার ব্যবহার্য প্লাস্টিকের উৎপাদন ও ব্যবহারে অদক্ষ বর্জ্য ব্যবস্থাপনা পরিবেশের ক্ষতি করছে এবং জলবায়ু পদক্ষেপের অগ্রগতি আটকে রাখছে, আর ক্রমশ অনিয়মিত আবহাওয়ার ধাক্কা সবচেয়ে বেশি লাগে ক্ষুদ্র খামারে।",
      },
      response: {
        en: "Weather alerts and climate-smart advice in Shathi Sheba, feed made close to the farms that use it, and sustainable agriculture, waste management and less single-use plastic across our projects.",
        bn: "সাথী সেবায় আবহাওয়ার সতর্কতা ও জলবায়ু-সহনশীল পরামর্শ, যে খামারে খাবার লাগে তার কাছেই তৈরি, আর আমাদের প্রকল্পজুড়ে টেকসই কৃষি, বর্জ্য ব্যবস্থাপনা ও কম একবার-ব্যবহার্য প্লাস্টিক।",
      },
      track: {
        en: "Training and advisory completion, recorded in each farmer's profile.",
        bn: "প্রশিক্ষণ ও পরামর্শ সম্পন্ন হওয়ার নথি, প্রতিটি কৃষকের প্রোফাইলে।",
      },
    },
  ];

  const reasons: { title: Bi; body: Bi; icon: IconName }[] = [
    {
      icon: "sprout",
      title: { en: "Inclusive innovation", bn: "সবাইকে নিয়ে উদ্ভাবন" },
      body: {
        en: "Gender and disability inclusion is a design constraint on every journey, not a reporting line at the end.",
        bn: "লিঙ্গ ও প্রতিবন্ধিতা অন্তর্ভুক্তি প্রতিটি প্রক্রিয়ার নকশার শর্ত, শেষের কোনো প্রতিবেদন লাইন নয়।",
      },
    },
    {
      icon: "leaf",
      title: { en: "Sustainable livelihoods", bn: "টেকসই জীবিকা" },
      body: {
        en: "Eco-friendly goods, artisanal crafts and sustainable agriculture that a household can keep running after the cycle ends.",
        bn: "পরিবেশবান্ধব পণ্য, হস্তশিল্প ও টেকসই কৃষি — যা চক্র শেষ হলেও পরিবার চালিয়ে যেতে পারে।",
      },
    },
    {
      icon: "users",
      title: { en: "Empowering communities", bn: "জনপদের ক্ষমতায়ন" },
      body: {
        en: "Producers connect directly with the funders, buyers and lenders they need, with capital, markets and training moving through one accountable channel.",
        bn: "উৎপাদকেরা সরাসরি যুক্ত হন প্রয়োজনীয় অর্থদাতা, ক্রেতা ও ঋণদাতার সঙ্গে, আর পুঁজি, বাজার ও প্রশিক্ষণ চলে একটি জবাবদিহিমূলক পথে।",
      },
    },
    {
      icon: "layers",
      title: { en: "Digital innovation", bn: "ডিজিটাল উদ্ভাবন" },
      body: {
        en: "Tools built for low-literacy users — voice, photos and Bangla — with real-time monitoring and transparency for every partner.",
        bn: "কম পড়তে-জানা মানুষের জন্য তৈরি টুল — কণ্ঠ, ছবি ও বাংলা — সঙ্গে প্রতিটি অংশীদারের জন্য রিয়েল-টাইম তদারকি ও স্বচ্ছতা।",
      },
    },
  ];

  /** Jump links for the sticky bar, in page order. */
  const anchors: { id: string; label: Bi }[] = [
    { id: "at-a-glance", label: { en: "At a glance", bn: "এক নজরে" } },
    { id: "statement", label: { en: "Outcomes", bn: "ফলাফল" } },
    { id: "impact-areas", label: { en: "Impact areas", bn: "প্রভাবের ক্ষেত্র" } },
    { id: "inclusion", label: { en: "Inclusion", bn: "অন্তর্ভুক্তি" } },
    { id: "readiness", label: { en: "Finance readiness", bn: "অর্থায়ন প্রস্তুতি" } },
    { id: "methodology", label: { en: "Methodology", bn: "পদ্ধতি" } },
    { id: "sdgs", label: { en: "SDG targets", bn: "এসডিজি লক্ষ্য" } },
    { id: "faq", label: { en: "FAQ", bn: "জিজ্ঞাসা" } },
  ];

  /**
   * How the products are built for women and persons with disabilities. Every
   * item describes shipped behaviour: Shathi Apa's voice, read-aloud and
   * gender-neutral persona; the field-officer contact the app shows while
   * verification is pending; the women's cooperatives in the feed chain.
   */
  const inclusionCommitments: { title: Bi; body: Bi; icon: IconName }[] = [
    {
      icon: "handshake",
      title: { en: "Work that fits around care", bn: "সেবাকাজের সঙ্গে মানানসই কাজ" },
      body: {
        en: "Enterprises run from the homestead — livestock, kitchen gardens, crafts — with inputs delivered and output collected through the cooperative, so nobody gives up a day at home to reach a market.",
        bn: "উদ্যোগ চলে বাড়ি থেকেই — গবাদিপশু, আঙিনার বাগান, হস্তশিল্প — আর উপকরণ পৌঁছায় ও উৎপাদন সংগ্রহ হয় সমবায়ের মাধ্যমে, তাই বাজারে যেতে কাউকে ঘরের একটি দিন ছাড়তে হয় না।",
      },
    },
    {
      icon: "play",
      title: { en: "Advice that does not depend on reading", bn: "পড়ার ওপর নির্ভর করে না এমন পরামর্শ" },
      body: {
        en: "Shathi Apa takes spoken questions, reads every answer aloud in Bangla and accepts a photo where words are hard. It is even written never to assume that a farmer is a man.",
        bn: "সাথী আপা মুখে বলা প্রশ্ন নেন, প্রতিটি উত্তর বাংলায় পড়ে শোনান, আর কথায় বোঝানো কঠিন হলে ছবি নেন। এমনকি কৃষক মানেই পুরুষ — এমন ধারণা না করতেও তাঁকে লেখা হয়েছে।",
      },
    },
    {
      icon: "users",
      title: { en: "Someone local to ask", bn: "জিজ্ঞেস করার মতো কাছের মানুষ" },
      body: {
        en: "Cooperatives and field officers onboard, verify and visit. While a farmer's verification is pending, the app shows the name and number of their area's field officer.",
        bn: "সমবায় ও মাঠ কর্মকর্তারা নিবন্ধন করান, যাচাই করেন, খামারে যান। কৃষকের যাচাই চলার সময় অ্যাপে এলাকার মাঠ কর্মকর্তার নাম ও নম্বর দেখানো থাকে।",
      },
    },
    {
      icon: "layers",
      title: { en: "Women in the value chain, not only at its end", bn: "শুধু শেষ প্রান্তে নয়, পুরো ভ্যালু চেইনে নারী" },
      body: {
        en: "Shadhin feed is produced with rural women's cooperatives and distributed through local ones such as Walia Shimul Mohila Samabaya Samity — so the jobs the chain creates go to women too.",
        bn: "স্বাধীন খাবার উৎপাদিত হয় গ্রামীণ নারী সমবায়ের সঙ্গে, আর বিতরণ হয় ওয়ালিয়া শিমুল মহিলা সমবায় সমিতির মতো স্থানীয় সমবায়ের মাধ্যমে — তাই এই শৃঙ্খলে তৈরি কাজ নারীরাও পান।",
      },
    },
  ];

  /**
   * SDG alignment at target level. Wording paraphrases the UN targets; only
   * goals already named elsewhere on the site (1, 2, 5, 10, 12, 13) are used,
   * so the homepage's "aligned with" list and this table cannot disagree.
   * Colours are the official SDG palette.
   */
  const sdgTargets: { target: string; colour: string; asks: Bi; ours: Bi }[] = [
    {
      target: "1.4",
      colour: "#E5243B",
      asks: {
        en: "Equal rights to economic resources and access to financial services, including microfinance, for the poor and vulnerable.",
        bn: "দরিদ্র ও ঝুঁকিপূর্ণ মানুষের জন্য অর্থনৈতিক সম্পদে সমান অধিকার এবং ক্ষুদ্রঋণসহ আর্থিক সেবায় প্রবেশাধিকার।",
      },
      ours: {
        en: "Verified enterprise profiles and lender-ready applications that bring thin-file farmers within reach of formal credit.",
        bn: "যাচাইকৃত উদ্যোগ প্রোফাইল ও ঋণদাতার উপযোগী আবেদন, যা স্বল্প-তথ্যের কৃষককে প্রাতিষ্ঠানিক ঋণের নাগালে আনে।",
      },
    },
    {
      target: "2.3",
      colour: "#DDA63A",
      asks: {
        en: "Double the productivity and incomes of small-scale food producers, in particular women, through access to inputs, knowledge, finance and markets.",
        bn: "ক্ষুদ্র খাদ্য উৎপাদকদের, বিশেষ করে নারীদের, উৎপাদনশীলতা ও আয় দ্বিগুণ করা — উপকরণ, জ্ঞান, অর্থায়ন ও বাজারে প্রবেশাধিকারের মাধ্যমে।",
      },
      ours: {
        en: "Graded feed and inputs, training, finance and a committed buyer for each production cycle.",
        bn: "প্রতিটি উৎপাদন চক্রের জন্য মানসম্পন্ন খাবার ও উপকরণ, প্রশিক্ষণ, অর্থায়ন ও নিশ্চিত ক্রেতা।",
      },
    },
    {
      target: "5.4",
      colour: "#FF3A21",
      asks: {
        en: "Recognise and value unpaid care and domestic work.",
        bn: "অবৈতনিক সেবা ও গৃহস্থালি কাজের স্বীকৃতি ও মূল্যায়ন।",
      },
      ours: {
        en: "Home-based livelihoods designed around care responsibilities instead of in competition with them.",
        bn: "সেবাকাজের দায়িত্বের সঙ্গে প্রতিযোগিতা নয়, তার সঙ্গে মানিয়ে গড়া ঘরভিত্তিক জীবিকা।",
      },
    },
    {
      target: "5.a",
      colour: "#FF3A21",
      asks: {
        en: "Give women equal rights to economic resources and access to financial services.",
        bn: "নারীদের অর্থনৈতিক সম্পদে সমান অধিকার ও আর্থিক সেবায় প্রবেশাধিকার দেওয়া।",
      },
      ours: {
        en: "70% women participation, and women's cooperatives that produce and distribute Shadhin feed.",
        bn: "৭০% নারীর অংশগ্রহণ, আর স্বাধীন খাবার উৎপাদন ও বিতরণে নারী সমবায়।",
      },
    },
    {
      target: "10.2",
      colour: "#DD1367",
      asks: {
        en: "Promote the economic inclusion of all, irrespective of sex, disability or economic status.",
        bn: "লিঙ্গ, প্রতিবন্ধিতা বা অর্থনৈতিক অবস্থা নির্বিশেষে সবার অর্থনৈতিক অন্তর্ভুক্তি।",
      },
      ours: {
        en: "15% of participants are persons with disabilities, and advice is spoken aloud so reading is never the barrier.",
        bn: "অংশগ্রহণকারীদের ১৫% প্রতিবন্ধী ব্যক্তি, আর পরামর্শ পড়ে শোনানো হয় — তাই পড়তে না পারা কখনো বাধা হয় না।",
      },
    },
    {
      target: "12.5",
      colour: "#BF8B2E",
      asks: {
        en: "Substantially reduce waste generation through prevention, reduction, recycling and reuse.",
        bn: "প্রতিরোধ, হ্রাস, পুনর্ব্যবহার ও পুনঃপ্রক্রিয়াকরণের মাধ্যমে বর্জ্য উৎপাদন উল্লেখযোগ্যভাবে কমানো।",
      },
      ours: {
        en: "Waste management and reduced single-use plastic across our projects.",
        bn: "আমাদের প্রকল্পজুড়ে বর্জ্য ব্যবস্থাপনা ও একবার-ব্যবহার্য প্লাস্টিক হ্রাস।",
      },
    },
    {
      target: "13.3",
      colour: "#3F7E44",
      asks: {
        en: "Improve awareness and capacity on climate adaptation, impact reduction and early warning.",
        bn: "জলবায়ু অভিযোজন, ক্ষতি হ্রাস ও আগাম সতর্কতা বিষয়ে সচেতনতা ও সক্ষমতা বাড়ানো।",
      },
      ours: {
        en: "Weather alerts and climate-smart farming advice delivered in Shathi Sheba.",
        bn: "সাথী সেবায় আবহাওয়ার সতর্কতা ও জলবায়ু-সহনশীল কৃষি পরামর্শ।",
      },
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            [
              { name: en ? "Home" : "হোম", path: routes.home },
              { name: en ? "Impact" : "প্রভাব", path: routes.impact },
            ],
            locale,
          ),
          faqSchema(faqs.map((item) => ({ q: t(item.q, locale), a: t(item.a, locale) }))),
        ]}
      />

      <PageHero
        locale={locale}
        tone="dark"
        image="/assets/photos/hero/impact-producer.webp"
        crumbs={[{ label: en ? "Impact" : "প্রভাব" }]}
        eyebrow={en ? "Our impact" : "আমাদের প্রভাব"}
        title={en ? "Impact you can check" : "যাচাই করা যায় এমন প্রভাব"}
        lead={
          en
            ? "Numbers without a mechanism are marketing. Every figure below is tied to how it is produced, how it is measured and where it came from."
            : "প্রক্রিয়াহীন সংখ্যা কেবল বিজ্ঞাপন। নিচের প্রতিটি সংখ্যা কীভাবে তৈরি হয়, কীভাবে মাপা হয় এবং কোথা থেকে এসেছে তার সঙ্গে যুক্ত।"
        }
      />

      {/* On-this-page navigation, the same pattern as the About page. A long
          impact page without one makes a reader scroll to find out whether
          what they came for is even here. */}
      <nav
        aria-label={en ? "On this page" : "এই পাতায়"}
        className="sticky top-15 z-30 border-b border-stone-200 bg-white/95 backdrop-blur lg:top-18"
      >
        <div className="container-page">
          <ul className="no-scrollbar flex gap-1 overflow-x-auto py-2">
            {anchors.map((anchor) => (
              <li key={anchor.id}>
                <a
                  href={`#${anchor.id}`}
                  className="block rounded-md px-3 py-2 font-display text-sm font-semibold whitespace-nowrap text-stone-600 transition-colors hover:bg-stone-100 hover:text-brand-strong"
                >
                  {t(anchor.label, locale)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* At a glance: reach to date, then the goals it is measured against */}
      <Section tone="page" id="at-a-glance">
        <div className="container-page">
          <p className="font-display text-xs font-bold tracking-widest text-stone-500 uppercase">
            {en ? "Reach to date" : "এ পর্যন্ত"}
          </p>
          {/* Divided rather than merely gridded: five numbers in five equal
              cells with no separators read as a table of unrelated values.
              Hairlines between them make it one band of related figures. */}
          <Card className="mt-4 grid gap-8 divide-stone-200 p-8 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:p-10">
            {headlineStats.map((stat, index) => (
              <div key={stat.label.en} className={index > 0 ? "lg:ps-6" : undefined}>
                <StatBlock value={t(stat.value, locale)} label={t(stat.label, locale)} />
                <p className="mt-2 text-[11px] leading-snug text-stone-400">{stat.source}</p>
              </div>
            ))}
          </Card>

          {/*
            THE GOALS, WITH HONEST PROGRESS.
            Only the first goal gets a bar, because it is the only one where
            "reached so far" and "the goal" measure the same thing. The pilot
            income figure is a result from pilot cohorts, not progress across
            the whole base, and drawing it as a bar toward 30% would imply a
            comparison the numbers do not support. A 2% bar is not flattering;
            it is accurate, and a goal that is visibly far away is the point of
            stating one.
          */}
          <p className="mt-12 font-display text-xs font-bold tracking-widest text-stone-500 uppercase">
            {en ? "What we are working toward" : "আমাদের লক্ষ্য"}
          </p>
          <div className="mt-4 grid gap-5 lg:grid-cols-3">
            <Card className="flex flex-col p-7">
              <p className="font-display text-3xl font-extrabold text-stone-900">{en ? "50,000" : "৫০,০০০"}</p>
              <p className="mt-1 font-display text-[15px] font-bold text-stone-900">
                {en ? "smallholder farmers reached" : "ক্ষুদ্র কৃষকের কাছে পৌঁছানো"}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                {en
                  ? "Particularly women and persons with disabilities living below or near the poverty line."
                  : "বিশেষ করে দারিদ্র্যসীমার নিচে বা কাছাকাছি থাকা নারী ও প্রতিবন্ধী ব্যক্তি।"}
              </p>
              <div className="mt-5">
                <div
                  className="h-2 overflow-hidden rounded-full bg-stone-100"
                  role="progressbar"
                  aria-valuenow={2}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={en ? "Progress toward 50,000 farmers" : "৫০,০০০ কৃষকের লক্ষ্যে অগ্রগতি"}
                >
                  <div className="h-full w-[2%] rounded-full bg-brand" />
                </div>
                <p className="mt-2 text-xs text-stone-500">
                  {en ? "1,000+ connected so far — about 2% of the goal" : "এ পর্যন্ত ১,০০০+ সংযুক্ত — লক্ষ্যের প্রায় ২%"}
                </p>
              </div>
            </Card>
            <Card className="flex flex-col p-7">
              <p className="font-display text-3xl font-extrabold text-stone-900">{en ? "20,000" : "২০,০০০"}</p>
              <p className="mt-1 font-display text-[15px] font-bold text-stone-900">
                {en ? "rural input partners by 2030" : "২০৩০ সালের মধ্যে গ্রামীণ উপকরণ অংশীদার"}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                {en
                  ? "Each with improved, sustainable livelihoods and access to markets."
                  : "প্রত্যেকের জন্য উন্নত, টেকসই জীবিকা ও বাজারে প্রবেশাধিকার।"}
              </p>
              <p className="mt-5 text-xs text-stone-500">{en ? "DigiGram 2030 commitment" : "ডিজিগ্রামের ২০৩০ অঙ্গীকার"}</p>
            </Card>
            <Card className="flex flex-col p-7">
              <p className="font-display text-3xl font-extrabold text-stone-900">{en ? "Up to 30%" : "৩০% পর্যন্ত"}</p>
              <p className="mt-1 font-display text-[15px] font-bold text-stone-900">
                {en ? "income increase from baseline" : "ভিত্তিরেখা থেকে আয় বৃদ্ধি"}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                {en
                  ? "Through fair and transparent pricing. Pilot cohorts have recorded a 20% increase so far."
                  : "ন্যায্য ও স্বচ্ছ দামের মাধ্যমে। পাইলট দলগুলোতে এ পর্যন্ত ২০% বৃদ্ধি নথিভুক্ত হয়েছে।"}
              </p>
              <p className="mt-5 text-xs text-stone-500">
                {en ? "Impact statement · pilot results, Overview Deck July 2026" : "প্রভাব বিবৃতি · পাইলট ফলাফল, জুলাই ২০২৬"}
              </p>
            </Card>
          </div>

          <Note tone="info" icon="info" className="mt-6">
            {en
              ? "Figures are as reported in DigiGram's June and July 2026 company decks. Independently verified figures will replace them as the measurement framework matures."
              : "সংখ্যাগুলো ডিজিগ্রামের জুন ও জুলাই ২০২৬-এর কোম্পানি ডেকে প্রকাশিত। পরিমাপ কাঠামো পরিণত হলে স্বাধীনভাবে যাচাইকৃত সংখ্যা এগুলোর স্থান নেবে।"}
          </Note>
        </div>
      </Section>

      {/* Impact statement */}
      <Section tone="surface" id="statement">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Impact statement" : "প্রভাব বিবৃতি"}
            title={en ? "Eleven outcomes, stated plainly" : "এগারোটি ফলাফল, স্পষ্ট ভাষায়"}
            lead={
              en
                ? "DigiGram Ventures Ltd. was established to deliver inclusive finance, quality and affordable inputs, periodic training and market access — in order to produce the following changes for 50,000 smallholder farmers, particularly women and persons with disabilities, living below or near the poverty line in rural Bangladesh."
                : "ডিজিগ্রাম ভেঞ্চারস লিমিটেড প্রতিষ্ঠিত হয়েছে সবার জন্য অর্থায়ন, মানসম্পন্ন ও সাশ্রয়ী উপকরণ, নিয়মিত প্রশিক্ষণ ও বাজারে প্রবেশাধিকার দিতে — যাতে গ্রামীণ বাংলাদেশে দারিদ্র্যসীমার নিচে বা কাছাকাছি থাকা ৫০,০০০ ক্ষুদ্র কৃষকের, বিশেষত নারী ও প্রতিবন্ধী ব্যক্তির জীবনে নিচের পরিবর্তনগুলো ঘটে।"
            }
          />
          <ImpactFocusDiagram locale={locale} />
        </div>
      </Section>

      {/* Impact areas: the challenge, our response, and what we track */}
      <Section tone="page" id="impact-areas">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Impact areas" : "প্রভাবের ক্ষেত্র"}
            title={en ? "Four problems, and what we do about each" : "চারটি সমস্যা, আর প্রতিটির জন্য আমরা যা করি"}
            lead={
              en
                ? "Each area is stated the same way: the problem as it stands in Bangladesh, the part of it our work addresses, and the indicator we record to show whether it is working."
                : "প্রতিটি ক্ষেত্র একইভাবে বলা হয়েছে: বাংলাদেশে সমস্যাটি এখন যেমন, আমাদের কাজ এর কোন অংশে হাত দেয়, আর কাজ হচ্ছে কি না তা দেখাতে আমরা কোন সূচক নথিভুক্ত করি।"
            }
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {drivers.map((driver, index) => (
              <Reveal key={driver.title.en} delay={index * 60}>
                <Card className="flex h-full flex-col p-7">
                  <div className="flex items-center gap-5">
                    <SdgTiles goals={driver.goals} locale={locale} size={64} />
                    <h3 className="font-display text-xl font-bold text-stone-900">{t(driver.title, locale)}</h3>
                  </div>
                  <dl className="mt-6 flex-1 space-y-4">
                    <div>
                      <dt className="font-display text-xs font-bold tracking-wide text-terracotta-700 uppercase">
                        {en ? "The challenge" : "চ্যালেঞ্জ"}
                      </dt>
                      <dd className="mt-1 text-[15px] leading-relaxed text-stone-700">{t(driver.body, locale)}</dd>
                    </div>
                    <div>
                      <dt className="font-display text-xs font-bold tracking-wide text-brand-strong uppercase">
                        {en ? "Our response" : "আমাদের পদক্ষেপ"}
                      </dt>
                      <dd className="mt-1 text-[15px] leading-relaxed text-stone-700">{t(driver.response, locale)}</dd>
                    </div>
                  </dl>
                  <p className="mt-6 flex items-start gap-2 border-t border-stone-100 pt-4 text-sm text-stone-600">
                    <Icon name="bar-chart" size={16} className="mt-0.5 shrink-0 text-stone-400" />
                    <span>
                      <span className="font-semibold text-stone-800">{en ? "We track: " : "আমরা মাপি: "}</span>
                      {t(driver.track, locale)}
                    </span>
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Inclusion: how the products are built for the people most often left out */}
      <Section tone="tint" id="inclusion">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="eyebrow">{en ? "Gender and disability inclusion" : "লিঙ্গ ও প্রতিবন্ধিতা অন্তর্ভুক্তি"}</p>
              <h2 className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-stone-900 lg:text-4xl">
                {en ? "Designed for the people most often left out" : "যাঁরা প্রায়ই বাদ পড়ে যান, তাঁদের কথা ভেবেই নকশা"}
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-stone-700">
                {en
                  ? "Seven in ten of the people we work with are women, and more than one in seven live with a disability. That stays true only if every product is built for the constraints they actually face — time, literacy, mobility — rather than adapted for them afterwards."
                  : "আমরা যাঁদের সঙ্গে কাজ করি তাঁদের প্রতি দশজনে সাতজন নারী, আর প্রতি সাতজনে একজনের বেশি প্রতিবন্ধিতা নিয়ে বাস করেন। এটি তখনই সত্য থাকে, যখন প্রতিটি পণ্য তাঁদের প্রকৃত সীমাবদ্ধতা — সময়, পড়ালেখা, চলাচল — মাথায় রেখে শুরু থেকেই তৈরি হয়, পরে জোড়াতালি দিয়ে নয়।"}
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-5">
                {careStats
                  .filter((stat) => stat.kind === "base")
                  .map((stat) => (
                    <div key={stat.value.en} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-stone-200">
                      <dt className="sr-only">{t(stat.label, locale)}</dt>
                      <dd>
                        <span className="block font-display text-3xl leading-none font-extrabold text-brand-strong">
                          {t(stat.value, locale)}
                        </span>
                        <span className="mt-1.5 block text-sm leading-snug text-stone-600">{t(stat.label, locale)}</span>
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>

            <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
              {inclusionCommitments.map((item, index) => (
                <Reveal key={item.title.en} delay={index * 60} as="li">
                  <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-sm ring-1 ring-stone-200">
                    <span className="flex size-10 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                      <Icon name={item.icon} size={20} />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold text-stone-900">{t(item.title, locale)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{t(item.body, locale)}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Theory of change */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Theory of change" : "পরিবর্তনের তত্ত্ব"}
            title={en ? "Input to impact" : "ইনপুট থেকে প্রভাব"}
          />
          <TheoryOfChange locale={locale} />
        </div>
      </Section>

      {/*
        Finance readiness — the Shathi Sheba half of the impact story.

        Capital mobilised and farmers connected are the outcomes this page
        already reports. They are not the whole picture: most smallholders never
        reach the point of *being able* to receive capital, and an impact page
        that only counts the ones who did skips the constraint. This section
        states the gap in figures and then shows what the platform does about
        it — including what happens to an application that fails, which is the
        question a development partner asks first.

        Wine token layer, because this is Shathi Sheba's contribution and the
        page should show that DigiGram's impact runs on two products.
      */}
      <section data-brand="shathi-sheba" className="section bg-brand-canvas" id="readiness">
        <div className="container-page">
          <div className="max-w-3xl">
            <ShathiShebaLogo locale={locale} className="h-8" />
            <h2 className="mt-6 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-stone-900 lg:text-4xl">
              {en
                ? "Most smallholders are not rejected. They are never assessed."
                : "বেশিরভাগ ক্ষুদ্র কৃষক প্রত্যাখ্যাত হন না। তাঁদের মূল্যায়নই হয় না।"}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-stone-600">
              {en
                ? "A household with land, livestock and a decade of production can still be commercially invisible: no credit record, no published price, no buyer on paper. Shathi Sheba exists to close that gap, and the gap is measurable."
                : "জমি, গবাদিপশু ও এক দশকের উৎপাদন থাকা সত্ত্বেও একটি পরিবার বাণিজ্যিকভাবে অদৃশ্য থেকে যেতে পারে — ঋণের নথি নেই, প্রকাশিত দাম নেই, কাগজে ক্রেতা নেই। সেই ফাঁক পূরণেই সাথী সেবা, আর ফাঁকটি মাপা যায়।"}
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shebaGapStats.map((stat, index) => (
              <Reveal key={stat.label.en} delay={index * 60}>
                <Card className="flex h-full flex-col p-7">
                  <span className="flex size-10 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
                    <Icon name={stat.icon} size={20} />
                  </span>
                  <p className="mt-5 font-display text-4xl leading-none font-extrabold text-brand-strong">
                    {t(stat.value, locale)}
                  </p>
                  <p className="mt-2 font-display text-[15px] font-bold text-stone-900">
                    {t(stat.label, locale)}
                  </p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                    {t(stat.body, locale)}
                  </p>
                  <p className="mt-5 border-t border-stone-100 pt-4 text-xs text-stone-400">
                    {en ? "Source: " : "সূত্র: "}
                    {stat.source}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* What the assessment returns, and the pathway a failure leads to. */}
          <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <h3 className="font-display text-2xl leading-tight font-bold tracking-tight text-stone-900">
                {en
                  ? "Every application ends with a next step"
                  : "প্রতিটি আবেদন শেষ হয় পরবর্তী পদক্ষেপ দিয়ে"}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-stone-600">
                {en
                  ? "The assessment separates credit risk from readiness, and readiness from the quality of the evidence behind it. A profile that is not yet financeable gets a development plan rather than a closed door — which is what turns a decline into a future applicant."
                  : "মূল্যায়ন আলাদা করে দেখে ঋণঝুঁকি, প্রস্তুতি এবং তার পেছনের প্রমাণের মান। যে প্রোফাইল এখনও অর্থায়নযোগ্য নয়, সে বন্ধ দরজা নয় — পায় একটি উন্নয়ন পরিকল্পনা। এভাবেই একটি প্রত্যাখ্যান হয়ে ওঠে ভবিষ্যতের আবেদন।"}
              </p>

              <dl className="mt-8 space-y-4">
                {shebaOutputs.map((output) => (
                  <div key={output.label.en} className="border-s-2 border-brand-line ps-4">
                    <dt className="font-display text-sm font-bold text-brand-strong">
                      {t(output.label, locale)}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-stone-600">
                      {t(output.value, locale)}
                    </dd>
                  </div>
                ))}
              </dl>

              <Note tone="info" icon="shield" className="mt-8">
                {t(shebaLenderPrinciple, locale)}
              </Note>

              <div className="mt-8">
                <ButtonLink
                  href={localePath(locale, routes.shathiSheba)}
                  icon="arrow-right"
                >
                  {en ? "How the assessment works" : "মূল্যায়ন যেভাবে কাজ করে"}
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ReadinessPathways locale={locale} variant="panel" />
            </div>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <Section tone="page">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Why DigiGram" : "কেন ডিজিগ্রাম"}
            title={en ? "What makes this different" : "এটি যেভাবে আলাদা"}
          />
          {/* The icon is set into a tinted corner wash rather than a small
              square chip: at this size a 44px chip reads as a bullet, and the
              section is four claims that deserve equal presence. */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {reasons.map((reason) => (
              <Card
                key={reason.title.en}
                className="group relative flex gap-5 overflow-hidden p-7 transition-transform duration-300 ease-standard hover:-translate-y-1"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-brand-tint transition-transform duration-500 ease-standard group-hover:scale-125"
                />
                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-strong text-white shadow-sm">
                  <Icon name={reason.icon} size={22} />
                </span>
                <div className="relative">
                  <h3 className="font-display text-lg font-bold text-stone-900">
                    {t(reason.title, locale)}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                    {t(reason.body, locale)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Field stories */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Field stories" : "মাঠের গল্প"}
            title={en ? "What changes for a household" : "একটি পরিবারে যা বদলায়"}
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                image: "/assets/photos/micro-enterprise-1.webp",
                title: {
                  en: "A repair shop that became collateral",
                  bn: "যে মেরামতের দোকান জামানত হয়ে উঠল",
                },
                body: {
                  en: "A rural repair business runs on cash and memory: no accounts, no statement, nothing a lender can read. Recording purchases, sales and customers turned a decade of trading into an enterprise profile — and the profile, not the shop, is what a bank could finally assess.",
                  bn: "একটি গ্রামীণ মেরামতের ব্যবসা চলে নগদ আর স্মৃতির ওপর: কোনো হিসাব নেই, স্টেটমেন্ট নেই, ঋণদাতার পড়ার মতো কিছুই নেই। ক্রয়, বিক্রয় ও ক্রেতার নথি রাখা এক দশকের ব্যবসাকে একটি উদ্যোগ প্রোফাইলে রূপ দিল — আর ব্যাংক শেষ পর্যন্ত যা মূল্যায়ন করতে পারল, তা দোকান নয়, সেই প্রোফাইল।",
                },
              },
              {
                image: "/assets/photos/micro-enterprise-2.webp",
                title: {
                  en: "Six cattle and a published price",
                  bn: "ছয়টি গরু আর একটি প্রকাশিত দাম",
                },
                body: {
                  en: "Before the cycle, the sale price was whatever the broker offered on the day. Now the per-kilogram rate — B2B price, platform fee, logistics, vet care and the net farmer rate — is on the screen before the animal leaves the shed. The negotiation ends before it starts.",
                  bn: "চক্রের আগে বিক্রয়মূল্য ছিল সেদিন দালাল যা বলতেন তাই। এখন প্রতি কেজির দর — বিটুবি দাম, প্ল্যাটফর্ম ফি, পরিবহন, পশুচিকিৎসা ও নিট কৃষক দর — পশু গোয়াল ছাড়ার আগেই পর্দায় থাকে। দর-কষাকষি শুরুর আগেই শেষ হয়ে যায়।",
                },
              },
            ].map((story) => (
              <Reveal key={story.title.en}>
                <article>
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={story.image}
                      alt=""
                      width={900}
                      height={600}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-6 font-display text-2xl leading-snug font-bold text-stone-900">
                    {t(story.title, locale)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-stone-700">
                    {t(story.body, locale)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-xs text-stone-400">
            {en
              ? "Composite accounts drawn from field observations. Named stories require the producer's consent before publication."
              : "মাঠ পর্যবেক্ষণ থেকে সংকলিত বিবরণ। নামসহ গল্প প্রকাশের আগে উৎপাদকের সম্মতি প্রয়োজন।"}
          </p>
        </div>
      </Section>

      {/* Methodology */}
      <Section tone="dark" id="methodology">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow !text-brand-accent">{en ? "Methodology" : "পদ্ধতি"}</p>
              <h2 className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-white lg:text-4xl">
                {en ? "How we measure, and what we don't claim" : "আমরা কীভাবে মাপি, আর কী দাবি করি না"}
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-white/80">
                <p>
                  {en
                    ? "Impact is measured through an Impact Monitoring and Measurement (IMM) framework covering four value drivers and eleven stated outcomes. Each project cohort has a household baseline recorded at enrolment; change is measured against that baseline, not against a national average."
                    : "প্রভাব পরিমাপ করা হয় একটি ইমপ্যাক্ট মনিটরিং অ্যান্ড মেজারমেন্ট (আইএমএম) কাঠামোর মাধ্যমে, যা চারটি চালিকাশক্তি ও এগারোটি ঘোষিত ফলাফল অন্তর্ভুক্ত করে। প্রতিটি প্রকল্প দলের জন্য নিবন্ধনের সময় পারিবারিক ভিত্তিরেখা নথিভুক্ত হয়; পরিবর্তন মাপা হয় সেই ভিত্তিরেখার সাপেক্ষে, জাতীয় গড়ের সাপেক্ষে নয়।"}
                </p>
                <ul className="space-y-2.5">
                  {[
                    {
                      en: "Participation: share of women, persons with disabilities and caregivers, recorded per project",
                      bn: "অংশগ্রহণ: প্রকল্পভিত্তিক নারী, প্রতিবন্ধী ব্যক্তি ও সেবাদানকারীর হার",
                    },
                    {
                      en: "Income: household income change against the enrolment baseline",
                      bn: "আয়: নিবন্ধনের ভিত্তিরেখার সাপেক্ষে পারিবারিক আয়ের পরিবর্তন",
                    },
                    {
                      en: "Production: yield or weight gain against the district baseline and the project SOP",
                      bn: "উৎপাদন: জেলা ভিত্তিরেখা ও প্রকল্প এসওপির সাপেক্ষে ফলন বা ওজন বৃদ্ধি",
                    },
                    {
                      en: "Price: realised sale price against the published indicative rate",
                      bn: "দাম: প্রকাশিত নির্দেশক দরের সাপেক্ষে প্রাপ্ত বিক্রয়মূল্য",
                    },
                    {
                      en: "Verification: cooperative and field-officer sign-off on every recorded value",
                      bn: "যাচাই: প্রতিটি নথিভুক্ত তথ্যে সমবায় ও মাঠ কর্মকর্তার অনুমোদন",
                    },
                  ].map((item) => (
                    <li key={item.en} className="flex gap-2.5">
                      <Icon name="check" size={17} className="mt-1 shrink-0 text-brand-accent" />
                      {t(item, locale)}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-white/60">
                  {en
                    ? "We do not claim attribution for change we cannot trace to a project cohort."
                    : "যে পরিবর্তন কোনো প্রকল্প দলের সঙ্গে যুক্ত করা যায় না, তার কৃতিত্ব আমরা দাবি করি না।"}
                </p>
              </div>
            </div>
            {/* Reporting and governance: what a funder or partner receives,
                and the rules the numbers are held to. SDG alignment has its own
                section below, at target level. */}
            <div className="lg:col-span-5">
              <div className="rounded-xl bg-white/[0.06] p-7 ring-1 ring-white/15">
                <p className="font-display text-xs font-bold tracking-widest text-white/60 uppercase">
                  {en ? "Reporting and governance" : "প্রতিবেদন ও পরিচালনা"}
                </p>
                <ul className="mt-5 space-y-5">
                  {[
                    {
                      icon: "calendar" as IconName,
                      title: { en: "Monthly project updates", bn: "মাসিক প্রকল্প হালনাগাদ" },
                      body: { en: "To funders and partners, for every active cycle.", bn: "প্রতিটি চলমান চক্রের জন্য অর্থদাতা ও অংশীদারদের কাছে।" },
                    },
                    {
                      icon: "file-text" as IconName,
                      title: { en: "Annual impact report", bn: "বার্ষিক প্রভাব প্রতিবেদন" },
                      body: { en: "Outcomes against the baselines recorded at enrolment.", bn: "নিবন্ধনের সময়ের ভিত্তিরেখার সাপেক্ষে ফলাফল।" },
                    },
                    {
                      icon: "check-circle" as IconName,
                      title: { en: "Verified at source", bn: "উৎসেই যাচাই" },
                      body: { en: "Cooperative and field-officer sign-off on every recorded value.", bn: "প্রতিটি নথিভুক্ত তথ্যে সমবায় ও মাঠ কর্মকর্তার অনুমোদন।" },
                    },
                    {
                      icon: "shield" as IconName,
                      title: { en: "Consent and privacy", bn: "সম্মতি ও গোপনীয়তা" },
                      body: {
                        en: "Named stories only with the producer's consent; personal data handled under our Privacy Policy.",
                        bn: "উৎপাদকের সম্মতি ছাড়া নামসহ কোনো গল্প নয়; ব্যক্তিগত তথ্য আমাদের গোপনীয়তা নীতি অনুযায়ী পরিচালিত।",
                      },
                    },
                  ].map((item) => (
                    <li key={item.title.en} className="flex gap-3.5">
                      <Icon name={item.icon} size={18} className="mt-0.5 shrink-0 text-brand-accent" />
                      <div>
                        <p className="font-display text-[15px] font-bold text-white">{t(item.title, locale)}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-white/70">{t(item.body, locale)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <a
                  href={localePath(locale, routes.privacy)}
                  className="mt-6 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-white hover:underline"
                >
                  {en ? "Read the Privacy Policy" : "গোপনীয়তা নীতি পড়ুন"}
                  <Icon name="arrow-right" size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SDG alignment at target level */}
      <Section tone="surface" id="sdgs">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "SDG alignment" : "এসডিজি সামঞ্জস্য"}
            title={en ? "Aligned to specific targets, not just goals" : "শুধু লক্ষ্য নয়, নির্দিষ্ট টার্গেটের সঙ্গে সামঞ্জস্য"}
            lead={
              en
                ? "Claiming a whole goal says very little. These are the seven Sustainable Development Goal targets our work contributes to, and the part of the work that does it."
                : "পুরো একটি লক্ষ্য দাবি করায় তেমন কিছু বোঝায় না। এগুলো টেকসই উন্নয়ন লক্ষ্যের সেই সাতটি নির্দিষ্ট টার্গেট, যেখানে আমাদের কাজ অবদান রাখে — আর কাজের কোন অংশ তা করে।"
            }
          />
          <div className="mt-12 overflow-hidden rounded-xl border border-stone-200">
            <div className="hidden bg-stone-50 px-6 py-3 font-display text-xs font-bold tracking-wide text-stone-500 uppercase lg:grid lg:grid-cols-12 lg:gap-6">
              <span className="lg:col-span-2">{en ? "Target" : "টার্গেট"}</span>
              <span className="lg:col-span-5">{en ? "What it asks" : "যা চাওয়া হয়েছে"}</span>
              <span className="lg:col-span-5">{en ? "Our contribution" : "আমাদের অবদান"}</span>
            </div>
            <ul className="divide-y divide-stone-200">
              {sdgTargets.map((row) => (
                <li key={row.target} className="grid gap-3 px-6 py-5 lg:grid-cols-12 lg:gap-6">
                  <div className="lg:col-span-2">
                    <span
                      className="inline-flex items-center rounded-md px-2.5 py-1 font-display text-sm font-bold text-white"
                      style={{ backgroundColor: row.colour }}
                    >
                      SDG {row.target}
                    </span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-stone-600 lg:col-span-5">{t(row.asks, locale)}</p>
                  <p className="text-[15px] leading-relaxed font-medium text-stone-900 lg:col-span-5">{t(row.ours, locale)}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            {en
              ? "Target wording paraphrased from the United Nations Sustainable Development Goals framework."
              : "টার্গেটের ভাষা জাতিসংঘের টেকসই উন্নয়ন লক্ষ্য কাঠামো থেকে সংক্ষেপে নেওয়া।"}
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="page" id="faq">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "FAQ" : "সাধারণ জিজ্ঞাসা"}
            title={en ? "Questions we get asked" : "যেসব প্রশ্ন আমরা পাই"}
          />
          <div className="mt-10 max-w-3xl">
            <Accordion>
              {faqs.map((item, index) => (
                <AccordionItem
                  key={item.q.en}
                  question={t(item.q, locale)}
                  group="impact-faq"
                  defaultOpen={index === 0}
                >
                  {t(item.a, locale)}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Section>

      <CtaBand
        locale={locale}
        title={en ? "Partner with us on impact you can measure." : "পরিমাপযোগ্য প্রভাবের জন্য আমাদের সঙ্গী হোন।"}
        lead={
          en
            ? "Development partners, lenders and buyers: talk to us about pilots, shared data and programmes designed around the indicators that matter to you."
            : "উন্নয়ন সহযোগী, ঋণদাতা ও ক্রেতা: পাইলট, তথ্য বিনিময় আর আপনার কাছে গুরুত্বপূর্ণ সূচক ঘিরে সাজানো কর্মসূচি নিয়ে কথা বলুন।"
        }
        primary={{ href: routes.contact, label: en ? "Partner with us" : "অংশীদার হোন" }}
        secondary={{ href: routes.about, label: en ? "About DigiGram" : "ডিজিগ্রাম সম্পর্কে" }}
      />
    </>
  );
}
