import Link from "next/link";
import { Card, Note } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { maskAccountNumber, type BankAccount } from "@/lib/account.server";
import { profileGaps, type SessionUser } from "@/lib/auth/session";
import type { BookingSummary } from "@/lib/bookings.server";
import { BookingCard } from "@/components/auth/BookingCard";
import { localePath, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";

/**
 * The signed-in account area.
 *
 * A server component: the session lives in an httpOnly cookie, so the only
 * place that can read it is the server. That also means there is no
 * "flash of logged-out UI" while a client checks storage — the first byte of
 * HTML is already the right one.
 *
 * Nothing here is invented. Every field is either a value the backend returned
 * or an explicit "not provided yet"; the profile checklist is derived from the
 * same fields the booking flow will require, so it cannot promise completeness
 * the booking step then rejects.
 */

const GAP_COPY: Record<
    ReturnType<typeof profileGaps>[number],
    { en: string; bn: string; why: { en: string; bn: string } }
> = {
    name: {
        en: "Add your full name",
        bn: "আপনার পুরো নাম দিন",
        why: {
            en: "Payout records and booking receipts are issued in this name.",
            bn: "পরিশোধের নথি ও বুকিং রসিদ এই নামেই তৈরি হয়।",
        },
    },
    contact: {
        en: "Verify a phone number or email",
        bn: "ফোন নম্বর বা ইমেইল যাচাই করুন",
        why: {
            // Deliberately explains *how* it gets verified: there is no button
            // for this, and without the explanation it reads as a dead end.
            en: "Signing in with an SMS code verifies your phone; signing in with Google verifies your email. Either one is enough.",
            bn: "এসএমএস কোড দিয়ে লগ ইন করলে ফোন যাচাই হয়; গুগল দিয়ে লগ ইন করলে ইমেইল যাচাই হয়। যেকোনো একটিই যথেষ্ট।",
        },
    },
    nid: {
        en: "Verify your NID",
        bn: "আপনার এনআইডি যাচাই করুন",
        // Says what the NID is for, not that it is a condition of investing:
        // an approved NID stopped being required to book on 2026-11-13. The
        // wording is the same pair the profile form shows beside the upload.
        why: {
            en: "Your NID images are used only to verify your identity, and are reviewed by our verification team.",
            bn: "আপনার এনআইডির ছবি কেবল পরিচয় যাচাইয়ের জন্য ব্যবহার করা হয়, এবং আমাদের যাচাইকারী দল তা দেখে।",
        },
    },
    photo: {
        en: "Add a profile photo",
        bn: "প্রোফাইল ছবি যোগ করুন",
        why: {
            en: "Optional, but it helps our team recognise your account.",
            bn: "ঐচ্ছিক, তবে এটি আমাদের দলকে আপনার অ্যাকাউন্ট চিনতে সাহায্য করে।",
        },
    },
    bank: {
        en: "Add a bank account",
        bn: "ব্যাংক অ্যাকাউন্ট যোগ করুন",
        why: {
            en: "This is where returns are paid. Payouts cannot be released without it.",
            bn: "এখানেই রিটার্ন পরিশোধ করা হয়। এটি ছাড়া পরিশোধ সম্ভব নয়।",
        },
    },
};

export function AccountOverview({
    locale,
    user,
    banks,
    bookings,
}: {
    locale: Locale;
    user: SessionUser;
    /** `null` means the lookup failed — not "no accounts". */
    banks: BankAccount[] | null;
    /** `null` means the lookup failed — not "no bookings". */
    bookings: BookingSummary[] | null;
}) {
    const en = locale === "en";
    const gaps = profileGaps(user, (banks?.length ?? 0) > 0);
    /*
     * "Under review" is only true while the NID is *not yet* verified.
     *
     * This read `nidVerificationStatus === "pending"` on its own, and the
     * backend does not clear that column when an admin approves a NID — it
     * flips `nidVerified` to "yes" and leaves the submission status where it
     * was. So a fully verified investor was told their NID was still sitting in
     * a queue, on a page that printed "Verified" two cards further down.
     *
     * `session.ts` and `ProfileChecklist` already test `nidVerified` first.
     * This was the one place that did not.
     */
    const nidVerified = user.nidVerified === "yes";
    const nidPending = !nidVerified && user.nidVerificationStatus === "pending";

    return (
        <div className="container-page py-12 lg:py-16">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900">
                        {en ? "My account" : "আমার অ্যাকাউন্ট"}
                    </h1>
                    <p className="mt-2 text-stone-600">
                        {user.fullName?.trim() || user.phoneNumber || ""}
                    </p>
                </div>
                <SignOutButton locale={locale} />
            </div>

            {gaps.length > 0 && (
                <Card className="mt-8 p-6">
                    <h2 className="font-display text-lg font-bold text-stone-900">
                        {en ? "Finish setting up your account" : "অ্যাকাউন্ট সেটআপ শেষ করুন"}
                    </h2>
                    {/* A sentence used to sit here saying an investment
                        "cannot be confirmed until they are done". That was
                        never true of the photo, and stopped being true of the
                        NID on 2026-11-13. Each item below states its own
                        reason instead, which is the only claim that holds for
                        all five. */}
                    <ul className="mt-5 space-y-3">
                        {gaps.map((gap) => (
                            <li key={gap} className="flex gap-3">
                                <Icon
                                    name="alert-triangle"
                                    size={18}
                                    className="mt-0.5 shrink-0 text-amber-600"
                                />
                                <span>
                                    <span className="font-display text-[15px] font-semibold text-stone-900">
                                        {en ? GAP_COPY[gap].en : GAP_COPY[gap].bn}
                                    </span>
                                    <span className="block text-sm text-stone-500">
                                        {en ? GAP_COPY[gap].why.en : GAP_COPY[gap].why.bn}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href={localePath(locale, routes.registerProfile)}
                        className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-brand-strong hover:underline"
                    >
                        {en ? "Complete my profile" : "প্রোফাইল সম্পূর্ণ করুন"}
                        <Icon name="arrow-right" size={16} />
                    </Link>
                </Card>
            )}

            {nidPending && (
                <Note tone="info" icon="info" className="mt-6">
                    {en
                        ? "Your NID is submitted and under review. You will be told once it is verified."
                        : "আপনার এনআইডি জমা হয়েছে এবং পর্যালোচনায় আছে। যাচাই সম্পন্ন হলে জানানো হবে।"}
                </Note>
            )}

            {bookings !== null && bookings.length > 0 && (
                <Card className="mt-8 p-6">
                    <h2 className="font-display text-lg font-bold text-stone-900">
                        {en ? "Your bookings" : "আপনার বুকিং"}
                    </h2>
                    <ul className="mt-4 grid gap-4">
                        {bookings.map((booking) => (
                            <BookingCard key={booking.id} locale={locale} booking={booking} />
                        ))}
                    </ul>
                    {/*
                        Only when something is genuinely outstanding.
                    
                        This rendered unconditionally at the foot of the bookings
                        list, so an account with a complete, verified profile was
                        still being told to go and finish it — directly beneath the
                        bookings it had already placed. The setup card above carries
                        the same link when there are gaps; this is that same
                        condition, not a new one.
                    */}
                    {gaps.length > 0 && (
                        <Link
                            href={localePath(locale, routes.registerProfile)}
                            className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-brand-strong hover:underline"
                        >
                            {en ? "Complete my profile" : "প্রোফাইল সম্পূর্ণ করুন"}
                            <Icon name="arrow-right" size={16} />
                        </Link>
                    )}
                </Card>
            )}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <Card className="p-6">
                    <h2 className="font-display text-lg font-bold text-stone-900">
                        {en ? "Details" : "তথ্য"}
                    </h2>
                    <dl className="mt-4 space-y-3 text-sm">
                        <Row
                            label={en ? "Name" : "নাম"}
                            value={user.fullName}
                            missing={en ? "Not provided" : "দেওয়া হয়নি"}
                        />
                        <Row
                            label={en ? "Mobile" : "মোবাইল"}
                            value={user.phoneNumber}
                            missing={en ? "Not provided" : "দেওয়া হয়নি"}
                        />
                        <Row
                            label={en ? "Email" : "ইমেইল"}
                            value={user.email}
                            missing={en ? "Not provided" : "দেওয়া হয়নি"}
                        />
                        <Row
                            label={en ? "NID" : "এনআইডি"}
                            value={
                                nidVerified
                                    ? en
                                        ? "Verified"
                                        : "যাচাইকৃত"
                                    : nidPending
                                      ? en
                                          ? "Under review"
                                          : "পর্যালোচনায়"
                                      : null
                            }
                            missing={en ? "Not submitted" : "জমা হয়নি"}
                        />
                    </dl>
                </Card>

                <Card className="p-6">
                    <h2 className="font-display text-lg font-bold text-stone-900">
                        {en ? "Payout account" : "পরিশোধের অ্যাকাউন্ট"}
                    </h2>

                    {banks === null ? (
                        <p className="mt-4 text-sm text-stone-500">
                            {en
                                ? "We could not load your bank details just now. Please refresh."
                                : "এই মুহূর্তে আপনার ব্যাংক তথ্য আনা যায়নি। রিফ্রেশ করুন।"}
                        </p>
                    ) : banks.length === 0 ? (
                        <p className="mt-4 text-sm text-stone-500">
                            {en
                                ? "No bank account on file yet."
                                : "এখনও কোনো ব্যাংক অ্যাকাউন্ট যোগ করা হয়নি।"}
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-4">
                            {banks.map((bank) => (
                                <li key={bank.id} className="text-sm">
                                    <p className="font-display font-semibold text-stone-900">
                                        {bank.bankName ?? (en ? "Bank" : "ব্যাংক")}
                                        {bank.isDefault && (
                                            <span className="ms-2 rounded bg-brand-canvas px-2 py-0.5 text-xs font-bold text-brand-strong">
                                                {en ? "Default" : "ডিফল্ট"}
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-stone-600">{bank.branchName}</p>
                                    <p className="text-stone-600">
                                        {maskAccountNumber(bank.accountNumber)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            <Note tone="info" icon="info" className="mt-8">
                {en ? (
                    <>
                        Investments made in the Shathi app appear here too — it is one account. Get
                        the app on{" "}
                        <a href={site.app.playStore} className="underline" target="_blank" rel="noreferrer">
                            Google Play
                        </a>{" "}
                        or the{" "}
                        <a href={site.app.appStore} className="underline" target="_blank" rel="noreferrer">
                            App Store
                        </a>
                        .
                    </>
                ) : (
                    <>
                        সাথী অ্যাপে করা বিনিয়োগও এখানে দেখা যাবে — এটি একই অ্যাকাউন্ট।{" "}
                        <a href={site.app.playStore} className="underline" target="_blank" rel="noreferrer">
                            গুগল প্লে
                        </a>{" "}
                        বা{" "}
                        <a href={site.app.appStore} className="underline" target="_blank" rel="noreferrer">
                            অ্যাপ স্টোর
                        </a>{" "}
                        থেকে অ্যাপটি নিন।
                    </>
                )}
            </Note>
        </div>
    );
}

function Row({
    label,
    value,
    missing,
}: {
    label: string;
    value: string | null | undefined;
    missing: string;
}) {
    const has = Boolean(value && String(value).trim());
    return (
        <div className="flex justify-between gap-4">
            <dt className="text-stone-500">{label}</dt>
            <dd className={has ? "font-medium text-stone-900" : "text-stone-400 italic"}>
                {has ? value : missing}
            </dd>
        </div>
    );
}
