import Image from "next/image";
import { Section, SectionHead } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { formatBdt, t, type Locale } from "@/lib/i18n";
import type { Bi } from "@/lib/i18n";

/**
 * "How investing works" — a connected process, not four stacked slabs.
 *
 * TWO PROBLEMS THIS SOLVES
 *
 * 1. **Nothing showed that the steps were a sequence.** They were four
 *    independent rows; the eye had no reason to read them in order. A dashed
 *    rail now runs down the whole section through numbered nodes, so the
 *    connection is drawn rather than implied by numbering alone.
 *
 * 2. **Four near-identical phone screenshots.** They were the same object shown
 *    four times, which reads as one idea repeated rather than four steps. No
 *    device appears here at all now — the page already carries one in the
 *    app-download band, and two phones on one page is the repetition this was
 *    rebuilt to remove. Each step is built from real interface pieces in
 *    markup: a project card fragment, the five payment methods, a motif-backed
 *    impact panel, a payout summary. They are sharper than a screenshot, they
 *    translate with the page, and they cannot go stale when the app's UI
 *    changes.
 *
 * The rail is decorative and hidden from assistive technology; the ordered list
 * carries the sequence semantically.
 */

type Step = {
    n: string;
    title: Bi;
    body: Bi;
    bullets: Bi[];
    visual: "explore" | "fund" | "empower" | "returns";
    icon: "search" | "wallet" | "sprout" | "trending-up";
};

const STEPS: Step[] = [
    {
        n: "01",
        icon: "search",
        visual: "explore",
        title: { en: "Explore projects", bn: "প্রকল্প দেখুন" },
        body: {
            en: "Filter by livestock, agriculture or agri inputs. Every card shows unit price, location, tenure, return band and how many units are left.",
            bn: "পশুসম্পদ, কৃষি বা কৃষি উপকরণ অনুযায়ী বাছুন। প্রতিটি কার্ডে থাকে ইউনিট মূল্য, অবস্থান, মেয়াদ, রিটার্ন পরিসর ও কতটি ইউনিট বাকি।",
        },
        bullets: [
            {
                en: "Sustainable Return for long cycles, Fast Return for short",
                bn: "দীর্ঘ চক্রে টেকসই রিটার্ন, স্বল্প চক্রে দ্রুত রিটার্ন",
            },
            { en: "A return calculator on every project page", bn: "প্রতিটি প্রকল্প পাতায় রিটার্ন ক্যালকুলেটর" },
        ],
    },
    {
        n: "02",
        icon: "wallet",
        visual: "fund",
        title: { en: "Book your units and pay", bn: "ইউনিট বুক করে পরিশোধ করুন" },
        body: {
            // Corrected: the platform takes no online payment. Booking reserves
            // units, payment happens offline, and a receipt is uploaded. The
            // previous copy promised bKash and Nagad, which do not exist here.
            en: "Choose the number of units that matches your budget and tenure. Booking reserves them; you then pay by bank transfer, cash or cheque and upload the receipt.",
            bn: "আপনার বাজেট ও মেয়াদ অনুযায়ী ইউনিট সংখ্যা বাছুন। বুকিং করলে সেগুলো সংরক্ষিত হয়; এরপর ব্যাংক ট্রান্সফার, নগদ বা চেকে পরিশোধ করে রসিদ আপলোড করুন।",
        },
        bullets: [
            { en: "Five payment methods, all offline", bn: "পাঁচটি পরিশোধ পদ্ধতি, সবই অফলাইন" },
            { en: "Cancel any time before you pay", bn: "পরিশোধের আগে যেকোনো সময় বাতিল" },
        ],
    },
    {
        n: "03",
        icon: "sprout",
        visual: "empower",
        title: { en: "Empower rural producers", bn: "গ্রামীণ উৎপাদককে শক্তি দিন" },
        body: {
            en: "Your capital buys the animals or inputs, pays for veterinary and agronomy support, and funds the training the cycle needs — delivered through the cooperative network.",
            bn: "আপনার পুঁজিতে কেনা হয় পশু বা উপকরণ, দেওয়া হয় পশুচিকিৎসা ও কৃষি পরামর্শ, এবং চক্রের প্রয়োজনীয় প্রশিক্ষণ — সবই সমবায় নেটওয়ার্কের মাধ্যমে।",
        },
        bullets: [
            { en: "Up to 50% of profit to the farmer", bn: "মুনাফার ৫০% পর্যন্ত কৃষকের" },
            { en: "70% women, 15% persons with disabilities", bn: "৭০% নারী, ১৫% প্রতিবন্ধী ব্যক্তি" },
        ],
    },
    {
        n: "04",
        icon: "trending-up",
        visual: "returns",
        title: { en: "Monitor progress, receive returns", bn: "অগ্রগতি দেখুন, রিটার্ন নিন" },
        body: {
            en: "Milestone updates and financial summaries through the cycle. At maturity, returns go to your linked bank account — or roll into the next cycle.",
            bn: "চক্র জুড়ে মাইলফলক হালনাগাদ ও আর্থিক সারসংক্ষেপ। মেয়াদ শেষে রিটার্ন যায় আপনার সংযুক্ত ব্যাংক হিসাবে — অথবা পরের চক্রে পুনর্বিনিয়োগ হয়।",
        },
        bullets: [
            { en: "Weekly growth against project SOP", bn: "প্রকল্প এসওপি অনুযায়ী সাপ্তাহিক বৃদ্ধি" },
            { en: "Reinvest or withdraw at maturity", bn: "মেয়াদ শেষে পুনর্বিনিয়োগ বা উত্তোলন" },
        ],
    },
];

export function ProcessFlow({ locale }: { locale: Locale }) {
    const en = locale === "en";

    return (
        <Section tone="surface" id="how-it-works">
            <div className="container-page">
                <SectionHead
                    eyebrow={en ? "How investing works" : "বিনিয়োগ যেভাবে কাজ করে"}
                    title={en ? "Four steps, one cycle" : "চারটি ধাপ, একটি চক্র"}
                    lead={
                        en
                            ? "You can browse everything without an account. Login is only needed at the point of investing."
                            : "অ্যাকাউন্ট ছাড়াই সবকিছু দেখতে পারেন। লগইন লাগে কেবল বিনিয়োগের সময়।"
                    }
                />

                <ol className="relative mt-16">
                    {/* The rail. Dashed, brand-tinted, and stopping short at both
                        ends so it reads as a path between the nodes rather than a
                        border on the section. Hidden below lg, where the steps
                        stack and the connection is obvious. */}
                    <span
                        aria-hidden
                        className="absolute start-[27px] top-6 bottom-6 hidden w-px border-s-2 border-dashed border-brand-line lg:block"
                    />

                    {STEPS.map((step, index) => (
                        <li key={step.n} className="relative lg:ps-20">
                            <Reveal delay={index * 80}>
                                {/* Node marker sits on the rail. */}
                                <span
                                    aria-hidden
                                    className="absolute start-0 top-1 hidden size-14 items-center justify-center rounded-full border-2 border-brand-line bg-white lg:flex"
                                >
                                    <Icon name={step.icon} size={22} className="text-brand-strong" />
                                </span>

                                <div
                                    className={
                                        "grid items-center gap-10 pb-16 lg:grid-cols-2 lg:gap-16 lg:pb-24"
                                    }
                                >
                                    <div>
                                        <span className="font-mono text-sm font-bold text-brand">
                                            {step.n}
                                        </span>
                                        <h3 className="mt-2 font-display text-2xl leading-tight font-bold text-stone-900 lg:text-3xl">
                                            {t(step.title, locale)}
                                        </h3>
                                        <p className="mt-4 text-[15px] leading-relaxed text-stone-600 lg:text-base">
                                            {t(step.body, locale)}
                                        </p>
                                        <ul className="mt-5 space-y-2.5">
                                            {step.bullets.map((bullet) => (
                                                <li
                                                    key={bullet.en}
                                                    className="flex gap-2.5 text-[15px] text-stone-700"
                                                >
                                                    <Icon
                                                        name="check-circle"
                                                        size={18}
                                                        className="mt-0.5 shrink-0 text-brand"
                                                    />
                                                    {t(bullet, locale)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className={index % 2 === 1 ? "lg:order-first" : undefined}>
                                        <StepVisual visual={step.visual} locale={locale} />
                                    </div>
                                </div>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>
        </Section>
    );
}

/* ------------------------------------------------------------- visuals -- */

function StepVisual({ visual, locale }: { visual: Step["visual"]; locale: Locale }) {
    switch (visual) {
        case "explore":
            return <ProjectCardFragment locale={locale} />;
        case "fund":
            return <PaymentMethodsPanel locale={locale} />;
        case "empower":
            return <ImpactPanel locale={locale} />;
        default:
            return <PayoutPanel locale={locale} />;
    }
}

/** Shared stage: motif wash + soft brand glow, so every visual sits on the same ground. */
function Stage({ children, tone = "canvas" }: { children: React.ReactNode; tone?: "canvas" | "deep" }) {
    return (
        <div
            className={
                "relative isolate overflow-hidden rounded-2xl p-8 lg:p-10 " +
                (tone === "deep" ? "bg-teal-900" : "bg-brand-canvas")
            }
        >
            {/* The village motif, very low contrast — texture, not decoration
                competing with the content on top. */}
            <Image
                src="/assets/brand/village-motif.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className={
                    "-z-10 object-cover " + (tone === "deep" ? "opacity-[0.07]" : "opacity-[0.12]")
                }
            />
            {children}
        </div>
    );
}

/**
 * A cropped fragment of a real project card.
 *
 * Built from markup rather than captured as an image: it stays sharp at any
 * size, it translates, and it cannot drift out of date when the real card
 * changes. Slightly rotated and cropped at the edge so it reads as a piece of
 * a larger interface rather than a boxed screenshot.
 */
function ProjectCardFragment({ locale }: { locale: Locale }) {
    const en = locale === "en";
    return (
        <Stage>
            <div className="rotate-[-2deg]">
                <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                        <span className="rounded bg-brand-tint px-2 py-1 font-display text-[11px] font-bold text-brand-strong uppercase">
                            {en ? "Livestock" : "পশুসম্পদ"}
                        </span>
                        <span className="font-display text-xs font-semibold text-stone-400">
                            {en ? "281 units left" : "২৮১ ইউনিট বাকি"}
                        </span>
                    </div>
                    <h4 className="mt-3 font-display text-lg font-bold text-stone-900">
                        {en ? "Project Sack Ginger 2" : "প্রজেক্ট স্যাক জিঞ্জার ২"}
                    </h4>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
                        <Icon name="map-pin" size={14} />
                        {en ? "Rangunia, Chattogram" : "রাঙ্গুনিয়া, চট্টগ্রাম"}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-3 border-t border-stone-100 pt-4">
                        <Metric label={en ? "Per unit" : "প্রতি ইউনিট"} value={formatBdt(25000, locale)} />
                        <Metric label={en ? "Return" : "রিটার্ন"} value="13–15%" accent />
                        <Metric label={en ? "Tenure" : "মেয়াদ"} value={en ? "8 months" : "৮ মাস"} />
                    </div>

                    <div className="mt-4">
                        <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
                            <div className="h-full w-[62%] rounded-full bg-brand" />
                        </div>
                    </div>
                </div>
            </div>

            {/* A second card peeking from beneath, cropped by the stage — the
                cue that this is one of many, without drawing a whole card. */}
            <div className="mt-4 translate-y-2 rotate-[1.5deg] rounded-xl border border-stone-200 bg-white/85 px-5 py-4 shadow-lg">
                <div className="h-2.5 w-28 rounded bg-stone-200" />
                <div className="mt-2.5 h-2 w-44 rounded bg-stone-100" />
            </div>
        </Stage>
    );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
        <div>
            <p className="text-[11px] text-stone-400">{label}</p>
            <p
                className={
                    "mt-0.5 font-display text-sm font-bold " +
                    (accent ? "text-brand-strong" : "text-stone-900")
                }
            >
                {value}
            </p>
        </div>
    );
}

/**
 * The five payment methods, as the step's visual.
 *
 * This step used to show a phone. The homepage already carries a device in the
 * app-download band, and two phones on one page is the repetition the whole
 * section was rebuilt to remove. The methods are also the actual content of
 * this step — an investor's real question here is "how do I pay?", and a
 * screenshot does not answer it.
 */
function PaymentMethodsPanel({ locale }: { locale: Locale }) {
    const en = locale === 'en';
    const methods = [
        { icon: 'building' as const, label: en ? 'BEFTN transfer' : 'বিইএফটিএন ট্রান্সফার' },
        { icon: 'refresh' as const, label: en ? 'NPSB transfer' : 'এনপিএসবি ট্রান্সফার' },
        { icon: 'banknote' as const, label: en ? 'RTGS transfer' : 'আরটিজিএস ট্রান্সফার' },
        { icon: 'wallet' as const, label: en ? 'Cash collection' : 'নগদ সংগ্রহ' },
        { icon: 'file-text' as const, label: en ? 'Cheque collection' : 'চেক সংগ্রহ' },
    ];

    return (
        <Stage tone="deep">
            <div className="rounded-xl bg-white p-6 shadow-2xl">
                <p className="font-display text-xs font-bold tracking-widest text-stone-400 uppercase">
                    {en ? 'Five ways to pay' : 'পরিশোধের পাঁচটি উপায়'}
                </p>
                <ul className="mt-4 space-y-2.5">
                    {methods.map((method) => (
                        <li key={method.label} className="flex items-center gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand-strong">
                                <Icon name={method.icon} size={17} />
                            </span>
                            <span className="text-sm font-medium text-stone-700">{method.label}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-5 flex items-center gap-2 rounded-lg border border-dashed border-stone-300 px-4 py-3">
                    <Icon name="download" size={16} className="rotate-180 text-stone-400" />
                    <span className="text-xs text-stone-500">
                        {en ? 'Then upload your receipt' : 'তারপর আপনার রসিদ আপলোড করুন'}
                    </span>
                </div>
            </div>
        </Stage>
    );
}

/** Impact figures as chips over the motif — no device, no stock photograph. */
function ImpactPanel({ locale }: { locale: Locale }) {
    const en = locale === "en";
    const chips = [
        { icon: "users" as const, value: "70%", label: en ? "women" : "নারী" },
        { icon: "handshake" as const, value: "15%", label: en ? "persons with disabilities" : "প্রতিবন্ধী ব্যক্তি" },
        { icon: "banknote" as const, value: "50%", label: en ? "of profit to the farmer" : "মুনাফা কৃষকের" },
    ];

    return (
        <Stage>
            <div className="space-y-3">
                {chips.map((chip, index) => (
                    <div
                        key={chip.label}
                        className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white/90 px-5 py-4 shadow-sm"
                        // A slight stagger, so the stack reads as layered cards
                        // rather than a plain list.
                        style={{ marginInlineStart: index * 14 }}
                    >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand-strong">
                            <Icon name={chip.icon} size={20} />
                        </span>
                        <span>
                            <span className="font-display text-xl font-extrabold text-stone-900">
                                {chip.value}
                            </span>
                            <span className="ms-2 text-sm text-stone-600">{chip.label}</span>
                        </span>
                    </div>
                ))}
            </div>
        </Stage>
    );
}

/** A payout summary fragment — the shape of the thing the investor ends up with. */
function PayoutPanel({ locale }: { locale: Locale }) {
    const en = locale === "en";
    return (
        <Stage tone="deep">
            <div className="rounded-xl bg-white p-6 shadow-2xl">
                <p className="font-display text-xs font-bold tracking-widest text-stone-400 uppercase">
                    {en ? "At maturity" : "মেয়াদ শেষে"}
                </p>
                <p className="mt-3 font-display text-3xl font-extrabold text-stone-900">
                    {formatBdt(57500, locale)}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                    {en ? "on ৳50,000 invested · 8 months" : "৳৫০,০০০ বিনিয়োগে · ৮ মাস"}
                </p>

                <div className="mt-5 space-y-2.5 border-t border-stone-100 pt-5">
                    <Line label={en ? "Capital returned" : "মূলধন ফেরত"} value={formatBdt(50000, locale)} />
                    <Line label={en ? "Earnings" : "আয়"} value={formatBdt(7500, locale)} accent />
                </div>

                <p className="mt-5 text-[11px] leading-relaxed text-stone-400">
                    {en
                        ? "Illustrative, using a real project's stated range. Returns are estimated, never guaranteed."
                        : "একটি প্রকৃত প্রকল্পের ঘোষিত পরিসর ব্যবহার করে উদাহরণ। রিটার্ন প্রত্যাশিত, নিশ্চিত নয়।"}
                </p>
            </div>
        </Stage>
    );
}

function Line({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
        <div className="flex items-baseline justify-between">
            <span className="text-sm text-stone-500">{label}</span>
            <span
                className={
                    "font-display text-sm font-bold " + (accent ? "text-brand-strong" : "text-stone-900")
                }
            >
                {value}
            </span>
        </div>
    );
}
