import { Icon } from "@/components/ui/Icon";
import type { BookingStatus } from "@/lib/booking";
import { formatDate, type Locale } from "@/lib/i18n";

/**
 * Where a booking has got to, and how long is left.
 *
 * TWO DIFFERENT PROGRESSIONS, DELIBERATELY SEPARATE
 * The step rail is the *administrative* path — placed, paid, confirmed — which
 * is what the investor influences and where the next action lives. The maturity
 * bar is the *project* clock, and it only starts once payment is confirmed.
 * Merging them would imply a booking awaiting a receipt is 20% of the way to a
 * return, which is not true of either.
 *
 * A denied or cancelled booking gets no rail at all: showing a half-finished
 * progress line under "cancelled" reads as though it might still complete.
 */

const STEPS = [
    { key: "placed", en: "Booking placed", bn: "বুকিং জমা" },
    { key: "proof", en: "Receipt uploaded", bn: "রসিদ আপলোড" },
    { key: "confirmed", en: "Payment confirmed", bn: "পরিশোধ নিশ্চিত" },
] as const;

function stepIndex(status: BookingStatus, proofSubmitted: boolean): number {
    if (status === "confirmed") return 2;
    if (status === "proof_submitted" || proofSubmitted) return 1;
    return 0;
}

/** Whole days between today and `date`; negative once it has passed. */
function daysUntil(date: string): number {
    const target = new Date(date);
    if (Number.isNaN(target.getTime())) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function BookingProgress({
    locale,
    status,
    proofSubmitted,
    placedAt,
    maturityDate,
}: {
    locale: Locale;
    status: BookingStatus;
    proofSubmitted: boolean;
    placedAt: string | null;
    maturityDate: string | null;
}) {
    const en = locale === "en";

    if (status === "cancelled" || status === "denied") {
        return (
            <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <Icon name="info" size={18} className="mt-0.5 shrink-0 text-stone-400" />
                <p className="text-sm leading-relaxed text-stone-600">
                    {status === "cancelled"
                        ? en
                            ? "This booking was cancelled and its units released. Nothing was charged."
                            : "এই বুকিং বাতিল হয়েছে এবং এককগুলো ছেড়ে দেওয়া হয়েছে। কোনো অর্থ কাটা হয়নি।"
                        : en
                          ? "This payment could not be verified. Contact support and we will explain what is needed."
                          : "এই পরিশোধ যাচাই করা যায়নি। সহায়তা কেন্দ্রে যোগাযোগ করুন, আমরা জানিয়ে দেব কী প্রয়োজন।"}
                </p>
            </div>
        );
    }

    const current = stepIndex(status, proofSubmitted);

    // The project clock only runs once money is confirmed.
    const started = status === "confirmed" && placedAt;
    const remaining = maturityDate ? daysUntil(maturityDate) : null;

    let elapsedPercent = 0;
    if (started && maturityDate) {
        const from = new Date(placedAt).getTime();
        const to = new Date(maturityDate).getTime();
        const now = Date.now();
        if (to > from) elapsedPercent = Math.min(100, Math.max(0, ((now - from) / (to - from)) * 100));
    }

    return (
        <div className="space-y-5 rounded-xl border border-stone-200 bg-white p-5">
            {/* Administrative path */}
            <ol className="flex items-start gap-2">
                {STEPS.map((step, index) => {
                    const done = index < current;
                    const active = index === current;
                    return (
                        <li key={step.key} className="flex flex-1 flex-col items-center text-center">
                            <div className="flex w-full items-center">
                                <span
                                    aria-hidden
                                    className={`h-0.5 flex-1 ${index === 0 ? "bg-transparent" : done || active ? "bg-brand-strong" : "bg-stone-200"}`}
                                />
                                <span
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 ${
                                        done
                                            ? "border-brand-strong bg-brand-strong text-white"
                                            : active
                                              ? "border-brand-strong bg-white text-brand-strong"
                                              : "border-stone-200 bg-white text-stone-300"
                                    }`}
                                >
                                    {done ? (
                                        <Icon name="check" size={15} />
                                    ) : (
                                        <span className="font-display text-xs font-bold">{index + 1}</span>
                                    )}
                                </span>
                                <span
                                    aria-hidden
                                    className={`h-0.5 flex-1 ${index === STEPS.length - 1 ? "bg-transparent" : done ? "bg-brand-strong" : "bg-stone-200"}`}
                                />
                            </div>
                            <span
                                className={`mt-2 font-display text-xs leading-tight ${
                                    done || active ? "font-bold text-stone-900" : "text-stone-400"
                                }`}
                            >
                                {en ? step.en : step.bn}
                            </span>
                        </li>
                    );
                })}
            </ol>

            {/* Project clock */}
            {maturityDate && (
                <div className="border-t border-stone-100 pt-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-display text-xs font-semibold tracking-wide text-stone-500 uppercase">
                            {en ? "Maturity" : "মেয়াদপূর্তি"}
                        </span>
                        <span className="font-display text-sm font-bold text-stone-900">
                            {formatDate(maturityDate, locale) ?? maturityDate}
                        </span>
                    </div>

                    {started ? (
                        <>
                            <div
                                className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100"
                                role="progressbar"
                                aria-valuenow={Math.round(elapsedPercent)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={en ? "Time to maturity" : "মেয়াদপূর্তির সময়"}
                            >
                                <div
                                    className="h-full rounded-full bg-brand-strong"
                                    style={{ width: `${elapsedPercent}%` }}
                                />
                            </div>
                            <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-600">
                                <Icon name="clock" size={14} className="shrink-0 text-stone-400" />
                                {remaining !== null && remaining > 0
                                    ? en
                                        ? `${remaining} day${remaining === 1 ? "" : "s"} remaining`
                                        : `${remaining} দিন বাকি`
                                    : en
                                      ? "Matured"
                                      : "মেয়াদ পূর্ণ"}
                            </p>
                        </>
                    ) : (
                        <p className="mt-2 flex items-start gap-1.5 text-sm text-stone-500">
                            <Icon name="info" size={14} className="mt-0.5 shrink-0 text-stone-400" />
                            {en
                                ? "The countdown starts when your payment is confirmed."
                                : "আপনার পরিশোধ নিশ্চিত হলেই সময় গণনা শুরু হবে।"}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
