import Link from "next/link";
import { Card } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { bookingBlockers, type SessionUser } from "@/lib/auth/session";
import { localePath, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";
import { loginUrlFor } from "@/lib/auth/returnTo";

/**
 * Stands in front of the booking flow when the account is not eligible.
 *
 * The rule, enforced in one place (`bookingBlockers`) so the account page, this
 * gate and the booking submission cannot disagree:
 *
 *   a **verified phone or email** — earned by how you signed in, not by typing
 *   an address into a form.
 *
 * That is the whole rule. An approved NID used to be required as well and no
 * longer is (removed 2026-11-13), so this gate says nothing about NID: someone
 * whose NID is pending, rejected or not yet uploaded goes straight to the
 * checkout. A bank account is not required here either — it is where returns
 * are paid, which matters before a payout, not before a booking.
 *
 * Returning `null` means eligible: the caller renders the real flow.
 */
export function BookingGate({
    locale,
    user,
    returnTo,
}: {
    locale: Locale;
    /** `null` when signed out. */
    user: SessionUser | null;
    /** Where to send the visitor back to after signing in. */
    returnTo?: string | null;
}) {
    const en = locale === "en";

    if (!user) {
        return (
            <Card className="p-6">
                <h2 className="font-display text-lg font-bold text-stone-900">
                    {en ? "Sign in to invest" : "বিনিয়োগ করতে লগ ইন করুন"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {en
                        ? "Sign in with your mobile number or your Google account. No account yet? The same step creates one."
                        : "আপনার মোবাইল নম্বর বা গুগল অ্যাকাউন্ট দিয়ে লগ ইন করুন। অ্যাকাউন্ট না থাকলে একই ধাপেই তৈরি হয়ে যাবে।"}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                        href={loginUrlFor(localePath(locale, routes.login), returnTo)}
                        className="inline-flex items-center gap-2 rounded-md bg-brand-strong px-4 py-2 text-sm font-semibold text-white"
                    >
                        {en ? "Log in" : "লগ ইন"}
                        <Icon name="arrow-right" size={16} />
                    </Link>
                    <a
                        href={site.app.playStore}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800"
                    >
                        {en ? "Get the app" : "অ্যাপটি নিন"}
                    </a>
                </div>
            </Card>
        );
    }

    const blockers = bookingBlockers(user);
    if (blockers.length === 0) return null;

    return (
        <Card className="p-6">
            <h2 className="font-display text-lg font-bold text-stone-900">
                {en ? "One step before you can invest" : "বিনিয়োগের আগে একটি ধাপ বাকি"}
            </h2>
            <ul className="mt-4 space-y-4">
                {blockers.map((blocker) => (
                    <li key={blocker} className="flex gap-3">
                        <Icon
                            name="alert-triangle"
                            size={18}
                            className="mt-0.5 shrink-0 text-amber-600"
                        />
                        <span className="text-sm leading-relaxed text-stone-700">
                            {blocker === "contact" &&
                                (en
                                    ? "Verify your phone or email. Signing in with an SMS code verifies your phone; signing in with Google verifies your email. Either one is enough."
                                    : "আপনার ফোন বা ইমেইল যাচাই করুন। এসএমএস কোড দিয়ে লগ ইন করলে ফোন যাচাই হয়; গুগল দিয়ে করলে ইমেইল। যেকোনো একটিই যথেষ্ট।")}
                        </span>
                    </li>
                ))}
            </ul>

            <Link
                href={localePath(locale, routes.registerProfile)}
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-strong px-4 py-2 text-sm font-semibold text-white"
            >
                {en ? "Complete my profile" : "প্রোফাইল সম্পূর্ণ করুন"}
                <Icon name="arrow-right" size={16} />
            </Link>
        </Card>
    );
}
