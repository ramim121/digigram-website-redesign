import { Icon, type IconName } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n";

/**
 * What happens after "Place booking".
 *
 * WHY IT IS HERE AND NOT IN A HELP PAGE
 * Payment is offline (BR-08). The button does not take money — it reserves
 * units and starts a three-day clock, and the investor then has to go to a bank
 * and come back with a receipt. Somebody who expects a card form and gets a
 * booking reference has no idea they are now on a deadline.
 *
 * The steps are the SRS booking process, 5 through 8, in the investor's own
 * terms: placed, pay, submit proof, we confirm.
 *
 * DELIBERATELY NOT A PROGRESS BAR
 * Nothing has happened yet. A rail with step one filled in would suggest the
 * booking already exists.
 */

type Step = { icon: IconName; en: string; bn: string; enDetail: string; bnDetail: string };

const STEPS: Step[] = [
    {
        icon: "check-circle",
        en: "Your units are reserved",
        bn: "আপনার ইউনিট সংরক্ষিত হবে",
        enDetail: "You get a booking reference straight away. No money is taken.",
        bnDetail: "সঙ্গে সঙ্গেই একটি বুকিং নম্বর পাবেন। এখনই কোনো টাকা নেওয়া হয় না।",
    },
    {
        icon: "banknote",
        en: "Transfer the amount",
        bn: "টাকা পাঠান",
        enDetail: "By BEFTN, NPSB, RTGS, cash deposit or cheque, to the account we show you next.",
        bnDetail: "বিইএফটিএন, এনপিএসবি, আরটিজিএস, নগদ জমা বা চেকে — পরের ধাপে দেখানো অ্যাকাউন্টে।",
    },
    {
        icon: "file-text",
        en: "Upload the receipt within 3 days",
        bn: "৩ দিনের মধ্যে রসিদ আপলোড করুন",
        enDetail: "A photo or scan of the transfer confirmation. Miss the window and the units are released.",
        bnDetail: "পরিশোধের প্রমাণের ছবি বা স্ক্যান। সময় পেরিয়ে গেলে ইউনিটগুলো ছেড়ে দেওয়া হবে।",
    },
    {
        icon: "shield",
        en: "We confirm it",
        bn: "আমরা নিশ্চিত করি",
        enDetail: "Once the funds arrive your investment becomes active and the term starts.",
        bnDetail: "অর্থ পৌঁছালে আপনার বিনিয়োগ সক্রিয় হবে এবং মেয়াদ শুরু হবে।",
    },
];

export function WhatHappensNext({ locale }: { locale: Locale }) {
    const en = locale === "en";

    return (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <h3 className="font-display text-sm font-bold text-stone-900">
                {en ? "What happens after you book" : "বুকিংয়ের পরে যা হবে"}
            </h3>

            <ol className="mt-3 space-y-3">
                {STEPS.map((step, index) => (
                    <li key={step.en} className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-500">
                            <Icon name={step.icon} size={14} />
                        </span>
                        <span className="min-w-0">
                            <span className="block font-display text-sm font-semibold text-stone-900">
                                {index + 1}. {en ? step.en : step.bn}
                            </span>
                            <span className="block text-xs leading-relaxed text-stone-600">
                                {en ? step.enDetail : step.bnDetail}
                            </span>
                        </span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
