import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Card, Note, StatBlock } from "@/components/ui/Primitives";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ImpactFocusDiagram, TheoryOfChange } from "@/components/sections/Diagrams";
import { SdgTiles, type GoalNumber } from "@/components/sections/Sdg";
import { CtaBand, SdgRow } from "@/components/sections/Shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";
import { headlineStats, faqs } from "@/content/company";
import { isLocale, t, type Bi, type Locale } from "@/lib/i18n";
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
        ? "How DigiGram measures impact: eleven stated outcomes, four value drivers, a theory of change and the methodology behind every number we publish."
        : "ডিজিগ্রাম কীভাবে প্রভাব পরিমাপ করে: এগারোটি ঘোষিত ফলাফল, চারটি মূল চালিকাশক্তি, পরিবর্তনের তত্ত্ব এবং প্রকাশিত প্রতিটি সংখ্যার পেছনের পদ্ধতি।",
    image: "/assets/photos/micro-enterprise-1.webp",
  });
}

export default async function ImpactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const en = locale === "en";

  const drivers: { title: Bi; body: Bi; icon: IconName; goals: GoalNumber[] }[] = [
    {
      icon: "users",
      goals: [1, 2],
      title: { en: "Rural poverty", bn: "গ্রামীণ দারিদ্র্য" },
      body: {
        en: "20.5% of Bangladesh's population lives below the poverty line and 10.5% in extreme poverty (BBS 2022). 75% of the rural population — the base of the pyramid — depends on agriculture, livestock and small-scale production, held back by limited access to finance, markets, quality inputs and training.",
        bn: "বাংলাদেশের জনসংখ্যার ২০.৫% দারিদ্র্যসীমার নিচে এবং ১০.৫% চরম দারিদ্র্যে বাস করে (বিবিএস ২০২২)। গ্রামীণ জনসংখ্যার ৭৫% — পিরামিডের ভিত্তি — কৃষি, পশুসম্পদ ও ক্ষুদ্র উৎপাদনের ওপর নির্ভরশীল, যাঁরা অর্থায়ন, বাজার, মানসম্পন্ন উপকরণ ও প্রশিক্ষণের সীমিত সুযোগে আটকে আছেন।",
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
    },
    {
      icon: "shield",
      goals: [11, 10],
      title: { en: "Disability", bn: "প্রতিবন্ধিতা" },
      body: {
        en: "Over 9% of Bangladesh's population lives with a disability, yet only 1 in 10 participates in the labour force. Barriers to education, employment and financial services block economic participation and financial independence.",
        bn: "বাংলাদেশের জনসংখ্যার ৯%-এর বেশি প্রতিবন্ধিতা নিয়ে বাস করে, অথচ তাঁদের মাত্র ১০ জনে ১ জন শ্রমশক্তিতে অংশ নেন। শিক্ষা, কর্মসংস্থান ও আর্থিক সেবায় বাধা তাঁদের অর্থনৈতিক অংশগ্রহণ ও আর্থিক স্বাধীনতা আটকে রাখে।",
      },
    },
    {
      icon: "leaf",
      goals: [13, 12],
      title: { en: "Environment", bn: "পরিবেশ" },
      body: {
        en: "Inefficient waste management in the production and use of single-use plastics degrades the environment and holds back progress on climate action. We promote sustainable agriculture, waste management and reduced single-use plastic across our projects.",
        bn: "এককবার ব্যবহার্য প্লাস্টিকের উৎপাদন ও ব্যবহারে অদক্ষ বর্জ্য ব্যবস্থাপনা পরিবেশের ক্ষতি করছে এবং জলবায়ু পদক্ষেপের অগ্রগতি আটকে রাখছে। আমাদের প্রকল্পজুড়ে আমরা টেকসই কৃষি, বর্জ্য ব্যবস্থাপনা ও এককবার ব্যবহার্য প্লাস্টিক হ্রাসে কাজ করি।",
      },
    },
  ];

  const reasons: { title: Bi; body: Bi; icon: IconName }[] = [
    {
      icon: "sprout",
      title: { en: "Inclusive innovation", bn: "অন্তর্ভুক্তিমূলক উদ্ভাবন" },
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
        en: "Investors connect directly with rural producers, with capital, markets and training moving through one accountable channel.",
        bn: "বিনিয়োগকারীরা সরাসরি গ্রামীণ উৎপাদকের সঙ্গে যুক্ত হন, আর পুঁজি, বাজার ও প্রশিক্ষণ চলে একটি জবাবদিহিমূলক পথে।",
      },
    },
    {
      icon: "layers",
      title: { en: "Digital innovation", bn: "ডিজিটাল উদ্ভাবন" },
      body: {
        en: "Digital literacy for Shathi partners, and real-time project monitoring and transparency for investors.",
        bn: "সাথী অংশীদারদের জন্য ডিজিটাল সাক্ষরতা, আর বিনিয়োগকারীদের জন্য রিয়েল-টাইম প্রকল্প তদারকি ও স্বচ্ছতা।",
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
        crumbs={[{ label: en ? "Impact" : "প্রভাব" }]}
        eyebrow={en ? "Our impact" : "আমাদের প্রভাব"}
        title={en ? "Impact you can check" : "যাচাই করা যায় এমন প্রভাব"}
        lead={
          en
            ? "Numbers without a mechanism are marketing. Every figure below is tied to how it is produced, how it is measured and where it came from."
            : "প্রক্রিয়াহীন সংখ্যা কেবল বিজ্ঞাপন। নিচের প্রতিটি সংখ্যা কীভাবে তৈরি হয়, কীভাবে মাপা হয় এবং কোথা থেকে এসেছে তার সঙ্গে যুক্ত।"
        }
      />

      {/* Impact numbers */}
      <Section tone="page">
        <div className="container-page">
          {/* Divided rather than merely gridded: five numbers in five equal
              cells with no separators read as a table of unrelated values.
              Hairlines between them make it one band of related figures. */}
          <Card className="grid gap-8 divide-stone-200 p-8 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:p-10">
            {headlineStats.map((stat, index) => (
              <div key={stat.label.en} className={index > 0 ? "lg:ps-6" : undefined}>
                <StatBlock value={t(stat.value, locale)} label={t(stat.label, locale)} />
                <p className="mt-2 text-[11px] leading-snug text-stone-400">{stat.source}</p>
              </div>
            ))}
          </Card>

          <Note tone="info" icon="info" className="mt-6">
            {en
              ? "Figures are as reported in the June and July 2026 investor decks. Independently verified figures will replace them as the measurement framework matures."
              : "সংখ্যাগুলো জুন ও জুলাই ২০২৬-এর বিনিয়োগকারী ডেকে প্রকাশিত। পরিমাপ কাঠামো পরিণত হলে স্বাধীনভাবে যাচাইকৃত সংখ্যা এগুলোর স্থান নেবে।"}
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
                : "ডিজিগ্রাম ভেঞ্চারস লিমিটেড প্রতিষ্ঠিত হয়েছে অন্তর্ভুক্তিমূলক অর্থায়ন, মানসম্পন্ন ও সাশ্রয়ী উপকরণ, নিয়মিত প্রশিক্ষণ ও বাজারে প্রবেশাধিকার দিতে — যাতে গ্রামীণ বাংলাদেশে দারিদ্র্যসীমার নিচে বা কাছাকাছি থাকা ৫০,০০০ ক্ষুদ্র কৃষকের, বিশেষত নারী ও প্রতিবন্ধী ব্যক্তির জীবনে নিচের পরিবর্তনগুলো ঘটে।"
            }
          />
          <ImpactFocusDiagram locale={locale} />
        </div>
      </Section>

      {/* Key value drivers */}
      <Section tone="page">
        <div className="container-page">
          <SectionHead
            eyebrow={en ? "Key value drivers" : "মূল চালিকাশক্তি"}
            title={en ? "The problems we solve" : "যে সমস্যাগুলো আমরা সমাধান করি"}
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {drivers.map((driver, index) => (
              <Reveal key={driver.title.en} delay={index * 60}>
                {/* Laid out like the existing site: the goal tiles lead, the
                    heading sits under them, the body follows. The tiles are the
                    recognisable element, so they get the top of the card rather
                    than a mono-type footnote in the corner. */}
                <Card className="flex h-full flex-col items-center p-7 text-center">
                  <SdgTiles goals={driver.goals} locale={locale} size={96} />
                  <h3 className="mt-6 font-display text-xl font-bold text-stone-900">
                    {t(driver.title, locale)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-stone-700">
                    {t(driver.body, locale)}
                  </p>
                </Card>
              </Reveal>
            ))}
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
                    ? "Reporting cadence: monthly project updates to investors, and an annual impact report. We do not claim attribution for change we cannot trace to a project cohort."
                    : "প্রতিবেদনের ছন্দ: বিনিয়োগকারীদের কাছে মাসিক প্রকল্প হালনাগাদ এবং বার্ষিক প্রভাব প্রতিবেদন। যে পরিবর্তন কোনো প্রকল্প দলের সঙ্গে যুক্ত করা যায় না, তার কৃতিত্ব আমরা দাবি করি না।"}
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <p className="mb-4 font-display text-xs font-bold tracking-widest text-white/60 uppercase">
                {en ? "Aligned with" : "সামঞ্জস্যপূর্ণ"}
              </p>
              <SdgRow locale={locale} />
            </div>
          </div>
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

      <CtaBand locale={locale} />
    </>
  );
}
