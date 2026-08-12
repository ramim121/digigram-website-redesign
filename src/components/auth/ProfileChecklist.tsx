import { Icon } from "@/components/ui/Icon";
import type { SessionUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n";

/**
 * What is still outstanding on this account, as a progress list.
 *
 * WHY THIS EXISTS
 * The requirements were scattered down the profile page — a badge on the
 * contact card, another on NID, nothing at all for the bank — so "what do I
 * still have to do before I can invest?" could only be answered by scrolling
 * and adding it up. This states it once.
 *
 * WHAT COUNTS AS REQUIRED
 * Only what actually blocks a booking: a verified contact channel and an
 * approved NID (BR-03). A bank account is listed because a payout has nowhere
 * to go without it, but it is marked optional — it is needed before money comes
 * back, not before money goes out. Overstating it would be a lie the booking
 * endpoint does not tell.
 *
 * A step under review is neither done nor outstanding, and says so: telling
 * somebody to "verify your NID" when it is sitting in a queue reads as though
 * their submission was lost.
 */

type State = "done" | "pending" | "todo";

type Step = {
    label: string;
    state: State;
    detail?: string;
    optional?: boolean;
};

function buildSteps(user: SessionUser, hasBank: boolean, en: boolean): Step[] {
    const contactDone = user.emailVerified === "yes" || user.phoneVerified === "yes";
    const nidDone = user.nidVerified === "yes";
    const nidPending = !nidDone && user.nidVerificationStatus === "pending";
    const named = Boolean(user.fullName && user.fullName.trim());

    return [
        {
            label: en ? "Your name" : "আপনার নাম",
            state: named ? "done" : "todo",
        },
        {
            label: en ? "Phone or email verified" : "ফোন বা ইমেইল যাচাই",
            state: contactDone ? "done" : "todo",
            detail: contactDone
                ? user.phoneVerified === "yes"
                    ? en
                        ? "Phone confirmed"
                        : "ফোন নিশ্চিত"
                    : en
                      ? "Email confirmed"
                      : "ইমেইল নিশ্চিত"
                : en
                  ? "Either one is enough"
                  : "যেকোনো একটিই যথেষ্ট",
        },
        {
            label: en ? "NID verified" : "এনআইডি যাচাই",
            state: nidDone ? "done" : nidPending ? "pending" : "todo",
            detail: nidPending
                ? en
                    ? "Under review"
                    : "পর্যালোচনায়"
                : undefined,
        },
        {
            label: en ? "Bank account" : "ব্যাংক অ্যাকাউন্ট",
            state: hasBank ? "done" : "todo",
            optional: true,
            detail: en ? "Where returns are paid" : "যেখানে ফেরত পাঠানো হবে",
        },
    ];
}

export function ProfileChecklist({
    locale,
    user,
    hasBank,
}: {
    locale: Locale;
    user: SessionUser;
    hasBank: boolean;
}) {
    const en = locale === "en";
    const steps = buildSteps(user, hasBank, en);

    // Progress counts every step, optional included — it is "how complete is my
    // profile", not "can I invest". The blocker line below answers that.
    const done = steps.filter((s) => s.state === "done").length;
    const percent = Math.round((done / steps.length) * 100);

    const blockers = steps.filter((s) => !s.optional && s.state !== "done");
    const canInvest = blockers.length === 0;

    return (
        <aside className="rounded-xl border border-stone-200 bg-white p-5 lg:sticky lg:top-24">
            <h2 className="font-display text-base font-bold text-stone-900">
                {en ? "Profile completion" : "প্রোফাইল সম্পূর্ণতা"}
            </h2>

            <div className="mt-3 flex items-center gap-3">
                <div
                    className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100"
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={en ? "Profile completion" : "প্রোফাইল সম্পূর্ণতা"}
                >
                    <div
                        className="h-full rounded-full bg-brand-strong transition-[width] duration-500"
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <span className="font-display text-sm font-bold text-stone-900 tabular-nums">
                    {percent}%
                </span>
            </div>

            <ul className="mt-4 space-y-3">
                {steps.map((step) => (
                    <li key={step.label} className="flex items-start gap-2.5">
                        {step.state === "done" ? (
                            <Icon
                                name="check-circle"
                                size={18}
                                className="mt-0.5 shrink-0 text-emerald-600"
                            />
                        ) : step.state === "pending" ? (
                            <Icon name="clock" size={18} className="mt-0.5 shrink-0 text-sky-600" />
                        ) : (
                            <span
                                aria-hidden
                                className="mt-1 size-3.5 shrink-0 rounded-full border-2 border-stone-300"
                            />
                        )}

                        <div className="min-w-0">
                            <p
                                className={
                                    step.state === "done"
                                        ? "text-sm font-medium text-stone-500 line-through decoration-stone-300"
                                        : "text-sm font-semibold text-stone-900"
                                }
                            >
                                {step.label}
                                {step.optional && (
                                    <span className="ms-1.5 font-display text-[10px] font-bold tracking-wide text-stone-400 uppercase">
                                        {en ? "optional" : "ঐচ্ছিক"}
                                    </span>
                                )}
                            </p>
                            {step.detail && (
                                <p className="text-xs text-stone-500">{step.detail}</p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            <div
                className={`mt-5 rounded-lg p-3 text-sm leading-relaxed ${
                    canInvest ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-stone-700"
                }`}
            >
                {canInvest ? (
                    <span className="flex items-start gap-2">
                        <Icon name="check-circle" size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                        {en
                            ? "You can invest. Everything required is verified."
                            : "আপনি বিনিয়োগ করতে পারেন। প্রয়োজনীয় সবকিছু যাচাইকৃত।"}
                    </span>
                ) : (
                    <span className="flex items-start gap-2">
                        <Icon name="info" size={16} className="mt-0.5 shrink-0 text-amber-600" />
                        {en
                            ? `Before you can invest: ${blockers.map((b) => b.label.toLowerCase()).join(", ")}.`
                            : `বিনিয়োগের আগে দরকার: ${blockers.map((b) => b.label).join(", ")}।`}
                    </span>
                )}
            </div>
        </aside>
    );
}
