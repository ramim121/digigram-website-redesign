"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Note } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatBdt, localePath, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * Checkout — choose how many units, then place the booking.
 *
 * NO MONEY MOVES HERE. Placing a booking reserves units and creates a record
 * with `paymentConfirmationStatus = 'pending'`; payment happens offline
 * afterwards, and the investor uploads proof. The copy says so before the
 * button, because "Place booking" next to a total reads like a card payment.
 *
 * The partner split is not shown as editable. Units are distributed across the
 * project's assigned Shathi partners by the server; the app calls these
 * "tentative" and reassigns after payment, so presenting a choice here would
 * promise something the process does not honour.
 */

export type CheckoutPartner = { idProjectPartners: number; name: string | null };

export function CheckoutForm({
    locale,
    idProjects,
    slug,
    title,
    unitValue,
    unitsRemaining,
    maxPerInvestor,
    partners,
}: {
    locale: Locale;
    idProjects: number;
    slug: string;
    title: string;
    unitValue: number;
    unitsRemaining: number;
    /** 0 means the project sets no per-investor cap. */
    maxPerInvestor: number;
    partners: CheckoutPartner[];
}) {
    const en = locale === "en";
    const router = useRouter();

    const ceiling = Math.max(
        1,
        Math.min(unitsRemaining || 1, maxPerInvestor > 0 ? maxPerInvestor : Number.MAX_SAFE_INTEGER),
    );

    const [units, setUnits] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const total = units * unitValue;
    const soldOut = unitsRemaining <= 0;

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        setError(null);

        if (!agreed) {
            setError(en ? "Please accept the terms to continue." : "চালিয়ে যেতে শর্তাবলিতে সম্মতি দিন।");
            return;
        }

        setBusy(true);
        try {
            const res = await fetch("/api/bookings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idProjects, units, unitValue, partners }),
            });
            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.message ?? (en ? "Could not place the booking." : "বুকিং সম্পন্ন করা যায়নি।"));
                return;
            }

            // The bookings list is the reliable landing place: the create
            // response does not carry a booking id, and inventing a redirect to
            // a guessed id would 404.
            router.push(localePath(locale, `${routes.account}?placed=1`));
            router.refresh();
        } catch {
            setError(en ? "Network error. Please try again." : "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
        } finally {
            setBusy(false);
        }
    }

    if (soldOut) {
        return (
            <Note tone="info" icon="info">
                {en
                    ? "Every unit in this project is taken. Look at the other open projects — new ones open regularly."
                    : "এই প্রকল্পের সব ইউনিট নেওয়া হয়ে গেছে। অন্য চালু প্রকল্পগুলো দেখুন — নিয়মিত নতুন প্রকল্প আসে।"}
            </Note>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <Card className="p-6">
                <h2 className="font-display text-lg font-bold text-stone-900">{title}</h2>
                <p className="mt-1 text-sm text-stone-600">
                    {formatBdt(unitValue, locale)} {en ? "per unit" : "প্রতি ইউনিট"}
                </p>

                <div className="mt-5 flex items-center gap-4">
                    <span className="font-display text-sm font-semibold text-stone-800">
                        {en ? "Units" : "ইউনিট"}
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setUnits((n) => Math.max(1, n - 1))}
                            disabled={units <= 1}
                            aria-label={en ? "One unit fewer" : "একটি ইউনিট কম"}
                            className="flex size-10 items-center justify-center rounded-md border border-stone-300 text-stone-700 disabled:opacity-40"
                        >
                            <Icon name="minus" size={18} />
                        </button>
                        <span
                            aria-live="polite"
                            className="min-w-10 text-center font-display text-xl font-bold text-stone-900"
                        >
                            {units}
                        </span>
                        <button
                            type="button"
                            onClick={() => setUnits((n) => Math.min(ceiling, n + 1))}
                            disabled={units >= ceiling}
                            aria-label={en ? "One unit more" : "একটি ইউনিট বেশি"}
                            className="flex size-10 items-center justify-center rounded-md border border-stone-300 text-stone-700 disabled:opacity-40"
                        >
                            <Icon name="plus" size={18} />
                        </button>
                    </div>
                    <span className="text-sm text-stone-500">
                        {en ? `${unitsRemaining} left` : `${unitsRemaining} টি বাকি`}
                    </span>
                </div>

                {units >= ceiling && maxPerInvestor > 0 && ceiling === maxPerInvestor && (
                    <p className="mt-3 text-sm text-stone-500">
                        {en
                            ? `This project allows up to ${maxPerInvestor} units per investor.`
                            : `এই প্রকল্পে প্রতি বিনিয়োগকারী সর্বোচ্চ ${maxPerInvestor} ইউনিট নিতে পারেন।`}
                    </p>
                )}

                <div className="mt-6 flex items-baseline justify-between border-t border-stone-200 pt-5">
                    <span className="font-display font-semibold text-stone-800">
                        {en ? "Total payable" : "মোট প্রদেয়"}
                    </span>
                    <span className="font-display text-2xl font-extrabold text-stone-900">
                        {formatBdt(total, locale)}
                    </span>
                </div>
            </Card>

            <Note tone="info" icon="info">
                {en
                    ? "Placing a booking reserves your units. No money is taken now — you pay offline afterwards and upload the receipt, and we confirm once the funds arrive."
                    : "বুকিং করলে আপনার ইউনিট সংরক্ষিত হয়। এখনই কোনো টাকা নেওয়া হয় না — পরে অফলাইনে পরিশোধ করে রসিদ আপলোড করবেন, আর অর্থ পৌঁছালে আমরা নিশ্চিত করব।"}
            </Note>

            <label className="flex items-start gap-3 text-sm text-stone-700">
                <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    className="mt-1 size-4 rounded border-stone-300"
                />
                <span>
                    {en ? "I agree with the " : "আমি "}
                    <a
                        href={localePath(locale, routes.terms)}
                        className="text-brand-strong underline"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {en ? "terms and conditions" : "শর্তাবলি"}
                    </a>
                    {en ? ", and understand returns are estimated, not guaranteed." : " মেনে নিচ্ছি এবং বুঝছি যে রিটার্ন প্রত্যাশিত, নিশ্চিত নয়।"}
                </span>
            </label>

            {error && (
                <p role="alert" className="text-sm font-medium text-danger">
                    {error}
                </p>
            )}

            <Button type="submit" size="lg" fullWidth icon="arrow-right" disabled={busy}>
                {busy
                    ? en
                        ? "Placing…"
                        : "সম্পন্ন হচ্ছে…"
                    : en
                      ? "Place booking"
                      : "বুকিং করুন"}
            </Button>

            <p className="text-center text-xs text-stone-500">
                {en
                    ? "You can cancel a booking before you pay."
                    : "পরিশোধের আগে যেকোনো সময় বুকিং বাতিল করতে পারেন।"}
            </p>
        </form>
    );
}
