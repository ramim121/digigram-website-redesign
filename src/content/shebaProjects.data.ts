import type { ShebaProject } from "@/lib/sheba";

/**
 * Drafted Shathi Sheba partner projects.
 *
 * WHY THESE EXIST
 * Partner projects come from the Shathi Sheba platform — a separate service on
 * its own host. Everything else on `/projects` degrades gracefully when its
 * backend is unreachable (`fetchProjects` falls back to `projects.data.ts` and
 * marks the result stale), but the Sheba half did not: an unreachable platform
 * simply removed the partner-projects tab, and the page silently became
 * Shathi-only again. That is the worst possible failure for this section,
 * because nothing on screen says anything is missing.
 *
 * So these follow the same contract as the Shathi seed data: real content,
 * used only when the live call fails, surfaced as stale so the page can say it
 * is showing cached information rather than passing fixtures off as live.
 *
 * WHERE THE CONTENT COMES FROM
 * Transcribed from the live `partner_projects` row, not invented — the same
 * text the Shathi Sheba app prints on its own project card. There is exactly
 * one open partner project today; the other rows in that table are
 * `is_active = 0`, i.e. deliberately not published, so they are not seeded here
 * either. When the platform opens more, the live call returns them and this
 * file stops being reached.
 */
export const shebaProjectSeed: ShebaProject[] = [
    {
        id: "seed-prj-ctl-fat-01",
        code: "PRJ-CTL-FAT-01",
        title: { en: "Cattle Fattening Project", bn: "গরু মোটাতাজাকরণ প্রকল্প" },
        status: "open",
        image: "https://shathi-sheba.s3.ap-southeast-1.amazonaws.com/seed/project-cattle-fattening.jpg",
        location: { en: "Natore, Rajshahi", bn: "নাটোর, রাজশাহী" },
        model: {
            en: "Buy back offer + profit share model",
            bn: "বাই-ব্যাক অফার + লাভ ভাগাভাগি মডেল",
        },
        summary: {
            en: "Fatten cattle over four months with feed, veterinary support and a guaranteed buy-back. Your earnings come from the buy-back price plus a share of the profit.",
            bn: "চার মাসে গরু মোটাতাজা করুন — ফিড, পশু চিকিৎসা ও নিশ্চিত বাই-ব্যাক সহ। বাই-ব্যাক মূল্য ও লাভের ভাগ — দুই থেকেই আপনার আয়।",
        },
        marketOverview: {
            en: "Demand for finished cattle stays firm through the year and peaks before Eid. A guaranteed buy-back removes the price risk that normally sits with the farmer.",
            bn: "মোটাতাজা গরুর চাহিদা সারা বছর স্থিতিশীল, ঈদের আগে সর্বোচ্চ। নিশ্চিত বাই-ব্যাক থাকায় দামের ঝুঁকি আর কৃষকের ঘাড়ে থাকে না।",
        },
        duration: { en: "4 months", bn: "৪ মাস" },
        income: { en: "Up to ৳14,000 income", bn: "সর্বোচ্চ ৳১৪,০০০ আয়" },
        capacity: {
            en: "100 farmers in your upazila",
            bn: "আপনার উপজেলায় ১০০ জন কৃষক",
        },
        lenders: {
            en: "Loan provided by BRAC Bank & DigiGram Ventures",
            bn: "ঋণ প্রদান করছে ব্র্যাক ব্যাংক ও ডিজিগ্রাম ভেঞ্চারস",
        },
        lenderLogos: [
            "https://shathi-sheba.s3.ap-southeast-1.amazonaws.com/partners/brac-bank.png",
            "https://shathi-sheba.s3.ap-southeast-1.amazonaws.com/partners/digigram.png",
        ],
        interestSlug: "livestock-poultry",
    },
];
