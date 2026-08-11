import clsx from "clsx";
import { Icon, type IconName } from "@/components/ui/Icon";
import { t, type Bi, type Locale } from "@/lib/i18n";

/**
 * Diagrams are drawn as inline SVG or CSS, never as flattened images from the
 * deck: they must stay legible in Bangla, scale to a 390px screen, and be
 * readable by a screen reader. Every diagram here ships with a text
 * alternative that is the primary content on mobile — not a squashed picture.
 */

/* ----------------------------------------------- Impact focus area (11) -- */

const focusAreas: { title: Bi; outcomes: number[] }[] = [
  {
    title: { en: "Increased volume of inclusive finance", bn: "অন্তর্ভুক্তিমূলক অর্থায়নের পরিমাণ বৃদ্ধি" },
    outcomes: [5, 6],
  },
  {
    title: { en: "Quality & affordable inputs", bn: "মানসম্পন্ন ও সাশ্রয়ী উপকরণ" },
    outcomes: [8],
  },
  {
    title: { en: "Effectiveness of training", bn: "প্রশিক্ষণের কার্যকারিতা" },
    outcomes: [7, 10],
  },
  {
    title: { en: "Increased market access", bn: "বাজারে প্রবেশাধিকার বৃদ্ধি" },
    outcomes: [9, 11],
  },
];

const outcomes: Record<number, Bi> = {
  1: { en: "Increased volume of inclusive finance", bn: "অন্তর্ভুক্তিমূলক অর্থায়নের পরিমাণ বৃদ্ধি" },
  2: { en: "Quality and affordable inputs", bn: "মানসম্পন্ন ও সাশ্রয়ী উপকরণ" },
  3: { en: "Effectiveness of training", bn: "প্রশিক্ষণের কার্যকারিতা" },
  4: { en: "Increased market access", bn: "বাজারে প্রবেশাধিকার বৃদ্ধি" },
  5: { en: "Improved financial resilience", bn: "উন্নত আর্থিক সহনশীলতা" },
  6: { en: "Increased household savings", bn: "পারিবারিক সঞ্চয় বৃদ্ধি" },
  7: { en: "Improved micro-entrepreneurial skills", bn: "ক্ষুদ্র উদ্যোক্তা দক্ষতার উন্নয়ন" },
  8: { en: "Improved production yield", bn: "উৎপাদন ফলনের উন্নতি" },
  9: { en: "Fair and transparent pricing", bn: "ন্যায্য ও স্বচ্ছ মূল্য" },
  10: {
    en: "Increased economic agency for rural women producers",
    bn: "গ্রামীণ নারী উৎপাদকের অর্থনৈতিক ক্ষমতা বৃদ্ধি",
  },
  11: { en: "Increased income of smallholder farmers", bn: "ক্ষুদ্র কৃষকের আয় বৃদ্ধি" },
};

export function ImpactFocusDiagram({ locale }: { locale: Locale }) {
  const en = locale === "en";

  return (
    <div>
      {/* Diagram — hidden from assistive tech; the list below is the content. */}
      <div className="hidden lg:block" aria-hidden="true">
        <svg viewBox="0 0 760 480" className="h-auto w-full" role="presentation">
          <defs>
            <radialGradient id="focus-a" cx="50%" cy="50%">
              <stop offset="0%" stopColor="var(--color-teal-500)" stopOpacity="0.20" />
              <stop offset="100%" stopColor="var(--color-teal-500)" stopOpacity="0.06" />
            </radialGradient>
          </defs>

          {[
            { cx: 300, cy: 180, label: focusAreas[0], anchor: [120, 96] },
            { cx: 460, cy: 180, label: focusAreas[1], anchor: [640, 96] },
            { cx: 300, cy: 300, label: focusAreas[2], anchor: [120, 400] },
            { cx: 460, cy: 300, label: focusAreas[3], anchor: [640, 400] },
          ].map((circle, index) => (
            <g key={index}>
              <circle
                cx={circle.cx}
                cy={circle.cy}
                r={135}
                fill="url(#focus-a)"
                stroke="var(--color-teal-500)"
                strokeOpacity="0.45"
                strokeWidth="1.5"
              />
              <text
                x={circle.anchor[0]}
                y={circle.anchor[1]}
                textAnchor={circle.anchor[0] < 380 ? "end" : "start"}
                className="fill-stone-600"
                style={{ font: "600 13px var(--font-family-display)" }}
              >
                {t(circle.label.title, locale)
                  .split(" ")
                  .reduce<string[][]>(
                    (lines, word) => {
                      const last = lines[lines.length - 1];
                      if (last.join(" ").length + word.length > 24) lines.push([word]);
                      else last.push(word);
                      return lines;
                    },
                    [[]],
                  )
                  .map((line, lineIndex) => (
                    <tspan
                      key={lineIndex}
                      x={circle.anchor[0]}
                      dy={lineIndex === 0 ? 0 : 16}
                    >
                      {line.join(" ")}
                    </tspan>
                  ))}
              </text>
            </g>
          ))}

          {/* The eleven outcomes, plotted where their drivers overlap. */}
          {[
            { n: 1, x: 300, y: 130 },
            { n: 2, x: 460, y: 130 },
            { n: 3, x: 300, y: 352 },
            { n: 4, x: 460, y: 352 },
            { n: 5, x: 258, y: 205 },
            { n: 6, x: 258, y: 262 },
            { n: 7, x: 380, y: 128 },
            { n: 8, x: 502, y: 205 },
            { n: 9, x: 502, y: 262 },
            { n: 10, x: 380, y: 352 },
            { n: 11, x: 380, y: 240 },
          ].map((dot) => (
            <g key={dot.n}>
              <circle
                cx={dot.x}
                cy={dot.y}
                r={dot.n === 11 ? 22 : 16}
                fill={dot.n === 11 ? "var(--color-teal-700)" : "#ffffff"}
                stroke="var(--color-teal-600)"
                strokeWidth="1.5"
              />
              <text
                x={dot.x}
                y={dot.y + 4}
                textAnchor="middle"
                fill={dot.n === 11 ? "#ffffff" : "var(--color-teal-800)"}
                style={{ font: "700 12px var(--font-family-mono)" }}
              >
                {dot.n}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Text alternative — the only version on mobile, always in the DOM. */}
      <ol className="mt-8 grid gap-3 sm:grid-cols-2">
        {Object.entries(outcomes).map(([number, label]) => (
          <li
            key={number}
            className="flex items-start gap-3 rounded-md border border-stone-200 bg-white px-4 py-3"
          >
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-tint font-mono text-xs font-bold text-brand-strong">
              {number}
            </span>
            <span className="text-[15px] leading-snug text-stone-700">{t(label, locale)}</span>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-xs text-stone-400">
        {en
          ? "Outcomes 1–4 are the delivery mechanisms; 5–11 are the changes they are intended to produce."
          : "১–৪ নম্বর হলো বাস্তবায়নের প্রক্রিয়া; ৫–১১ নম্বর সেই পরিবর্তন যা তারা ঘটাতে চায়।"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------ Theory of change -- */

export function TheoryOfChange({ locale }: { locale: Locale }) {
  const steps: { title: Bi; body: Bi; icon: IconName }[] = [
    {
      icon: "wallet",
      title: { en: "Input", bn: "ইনপুট" },
      body: {
        en: "Digital tools, capital and market access through partnerships; investment raised for rural producers and operations.",
        bn: "অংশীদারিত্বের মাধ্যমে ডিজিটাল সরঞ্জাম, পুঁজি ও বাজারে প্রবেশাধিকার; গ্রামীণ উৎপাদক ও পরিচালনার জন্য সংগৃহীত বিনিয়োগ।",
      },
    },
    {
      icon: "layers",
      title: { en: "Activity", bn: "কার্যক্রম" },
      body: {
        en: "Inclusive projects in agriculture, livestock, crafts and eco-friendly goods; SOPs for risk mitigation; partnerships for market expansion.",
        bn: "কৃষি, পশুসম্পদ, হস্তশিল্প ও পরিবেশবান্ধব পণ্যে অন্তর্ভুক্তিমূলক প্রকল্প; ঝুঁকি প্রশমনে এসওপি; বাজার সম্প্রসারণে অংশীদারিত্ব।",
      },
    },
    {
      icon: "sprout",
      title: { en: "Output", bn: "ফলাফল" },
      body: {
        en: "Empowered rural producers, increased digital literacy, and expanded market access for their products.",
        bn: "ক্ষমতায়িত গ্রামীণ উৎপাদক, বর্ধিত ডিজিটাল সাক্ষরতা এবং তাঁদের পণ্যের জন্য প্রসারিত বাজার।",
      },
    },
    {
      icon: "trending-up",
      title: { en: "Outcome", bn: "পরিণতি" },
      body: {
        en: "Improved financial independence, reduced poverty and greater environmental sustainability for rural communities.",
        bn: "উন্নত আর্থিক স্বাধীনতা, দারিদ্র্য হ্রাস এবং গ্রামীণ জনগোষ্ঠীর জন্য বৃহত্তর পরিবেশগত টেকসইতা।",
      },
    },
    {
      icon: "target",
      title: { en: "Impact", bn: "প্রভাব" },
      body: {
        en: "Rural economies transformed — poverty reduced, gender equality advanced, sustainable growth aligned with the SDGs.",
        bn: "গ্রামীণ অর্থনীতির রূপান্তর — দারিদ্র্য হ্রাস, লিঙ্গ সমতার অগ্রগতি, এসডিজি-সঙ্গতিপূর্ণ টেকসই প্রবৃদ্ধি।",
      },
    },
  ];

  return (
    /*
     * Input → Impact, drawn as one path rather than five boxes with chevrons
     * wedged between them.
     *
     * A dashed rail runs through numbered nodes — horizontal on desktop,
     * vertical on mobile — so the progression is a line you follow instead of a
     * sequence you infer. The nodes deepen in tint from left to right, which
     * gives the row a direction even at a glance, before any label is read.
     *
     * The rail and the nodes are decorative; the ordered list carries the order.
     */
    <div className="relative mt-12">
      <span
        aria-hidden
        className="absolute start-6 top-0 bottom-0 hidden w-px border-s-2 border-dashed border-brand-line max-lg:block"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-6 hidden border-t-2 border-dashed border-brand-line lg:block"
      />

      <ol className="grid gap-8 lg:grid-cols-5 lg:gap-4">
        {steps.map((step, index) => {
          // Five evenly spaced steps from the tint to the full brand colour.
          const depth = index / (steps.length - 1);
          return (
            <li key={step.title.en} className="relative ps-16 lg:ps-0">
              <span
                aria-hidden
                className="absolute start-0 top-0 flex size-12 items-center justify-center rounded-full border-2 border-white text-white shadow-sm lg:relative lg:mb-6"
                style={{
                  // Interpolated rather than five hand-picked classes, so
                  // adding a sixth step needs no new colour decision.
                  backgroundColor: `color-mix(in srgb, var(--color-brand-strong) ${
                    35 + depth * 65
                  }%, white)`,
                }}
              >
                <Icon name={step.icon} size={20} />
              </span>

              <p className="font-mono text-xs font-bold text-stone-400">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold text-stone-900">
                {t(step.title, locale)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{t(step.body, locale)}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------ Shathi Sheba product architecture -- */

export function RailsDiagram({ locale }: { locale: Locale }) {
  const rails: { title: Bi; body: Bi; icon: IconName }[] = [
    {
      icon: "wallet",
      title: { en: "Fund", bn: "ফান্ড" },
      body: {
        en: "Finance applications, risk grades, readiness status, lender packs",
        bn: "অর্থায়নের আবেদন, ঝুঁকি গ্রেড, প্রস্তুতির অবস্থা, ঋণদাতার প্যাক",
      },
    },
    {
      icon: "truck",
      title: { en: "Supply", bn: "সরবরাহ" },
      body: {
        en: "Input catalogue, order aggregation, cooperative-level distribution",
        bn: "উপকরণ তালিকা, অর্ডার একত্রীকরণ, সমবায় পর্যায়ে বিতরণ",
      },
    },
    {
      icon: "graduation-cap",
      title: { en: "Grow", bn: "প্রবৃদ্ধি" },
      body: {
        en: "Advisory, climate alerts, development plans, quizzes",
        bn: "পরামর্শ, আবহাওয়া সতর্কতা, উন্নয়ন পরিকল্পনা, কুইজ",
      },
    },
    {
      icon: "store",
      title: { en: "Sell", bn: "বিক্রয়" },
      body: {
        en: "Product listing, buyer rates, B2B matching, settlement evidence",
        bn: "পণ্য তালিকা, ক্রেতার দর, বিটুবি সংযোগ, নিষ্পত্তির প্রমাণ",
      },
    },
  ];

  return (
    <div className="mt-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rails.map((rail) => (
          <div key={rail.title.en} className="rounded-lg border border-brand-line bg-white p-6">
            <span className="flex size-10 items-center justify-center rounded-md bg-brand-tint text-brand-strong">
              <Icon name={rail.icon} size={20} />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-brand-strong">
              {t(rail.title, locale)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{t(rail.body, locale)}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-4 flex justify-center" aria-hidden="true">
        <span className="text-brand/40">
          <Icon name="chevron-down" size={26} />
        </span>
      </div>

      <div className="mt-2 rounded-lg bg-brand p-8 text-center text-on-brand">
        <h3 className="font-display text-xl font-bold lg:text-2xl">
          {locale === "en"
            ? "Rural Enterprise Passport & Trust Engine"
            : "রুরাল এন্টারপ্রাইজ পাসপোর্ট ও ট্রাস্ট ইঞ্জিন"}
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-white/85">
          {locale === "en"
            ? "KYC + production data + input behaviour + training history + behavioural assessment + sales and repayment evidence."
            : "কেওয়াইসি + উৎপাদন তথ্য + উপকরণ ব্যবহারের ধরন + প্রশিক্ষণের ইতিহাস + আচরণগত মূল্যায়ন + বিক্রয় ও পরিশোধের প্রমাণ।"}
        </p>
      </div>

      <p className="mt-4 text-center text-sm text-stone-500">
        {locale === "en"
          ? "Each rail creates data that improves finance readiness, supply efficiency and market access."
          : "প্রতিটি রেল এমন তথ্য তৈরি করে যা অর্থায়ন প্রস্তুতি, সরবরাহ দক্ষতা ও বাজারে প্রবেশাধিকার উন্নত করে।"}
      </p>
    </div>
  );
}

/* ------------------------------------------- Finance-readiness pathways -- */

export function ReadinessPathways({ locale }: { locale: Locale }) {
  const paths: { key: string; title: Bi; body: Bi; dot: string }[] = [
    {
      key: "A",
      dot: "bg-sheba-leafgreen",
      title: { en: "Bank Ready", bn: "ব্যাংক রেডি" },
      body: {
        en: "Complete, verified and suitable for lender submission. Approval remains the lender's decision.",
        bn: "সম্পূর্ণ, যাচাইকৃত এবং ঋণদাতার কাছে জমা দেওয়ার উপযুক্ত। অনুমোদনের সিদ্ধান্ত ঋণদাতারই।",
      },
    },
    {
      key: "B",
      dot: "bg-sheba-gold",
      title: { en: "Conditional / Project Ready", bn: "শর্তসাপেক্ষ / প্রকল্প রেডি" },
      body: {
        en: "Financeable with project safeguards, cooperative validation or a limited ticket size.",
        bn: "প্রকল্প সুরক্ষা, সমবায় যাচাই বা সীমিত অঙ্কের শর্তে অর্থায়নযোগ্য।",
      },
    },
    {
      key: "C",
      dot: "bg-sheba-plum",
      title: { en: "Development Required", bn: "উন্নয়ন প্রয়োজন" },
      body: {
        en: "Complete advisory tasks, documents, records or a quiz, then apply for reassessment.",
        bn: "পরামর্শমূলক কাজ, নথি, রেকর্ড বা কুইজ সম্পন্ন করে পুনর্মূল্যায়নের জন্য আবেদন করুন।",
      },
    },
    {
      key: "D",
      dot: "bg-sheba-700",
      title: { en: "Currently Ineligible", bn: "বর্তমানে অযোগ্য" },
      body: {
        en: "A hard stop or a major risk stands until it is corrected. The reason and the appeal route are shown.",
        bn: "সংশোধন না হওয়া পর্যন্ত একটি বাধা বা বড় ঝুঁকি থেকে যায়। কারণ ও আপিলের পথ দেখানো হয়।",
      },
    },
  ];

  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {paths.map((path) => (
        <div key={path.key} className="rounded-lg border border-brand-line bg-white p-6">
          <div className="flex items-center gap-3">
            <span
              className={clsx(
                "flex size-9 items-center justify-center rounded-full font-display text-sm font-bold text-white",
                path.dot,
              )}
            >
              {path.key}
            </span>
            <h3 className="font-display text-[15px] leading-snug font-bold text-stone-900">
              {t(path.title, locale)}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{t(path.body, locale)}</p>
        </div>
      ))}
    </div>
  );
}
