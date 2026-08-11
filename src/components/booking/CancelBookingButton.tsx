"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n";

/**
 * Cancels an unpaid booking.
 *
 * Two-step, not a one-click destructive action: cancelling releases the units
 * back to the project and they may be taken by someone else before the investor
 * changes their mind. The confirmation says that, rather than asking a generic
 * "are you sure?".
 *
 * Only rendered for bookings awaiting payment. A confirmed booking needs a
 * refund decision, and the backend refuses it for non-admins.
 */
export function CancelBookingButton({ locale, bookingId }: { locale: Locale; bookingId: number }) {
    const en = locale === "en";
    const router = useRouter();
    const [confirming, setConfirming] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function cancel() {
        setBusy(true);
        setError(null);
        try {
            const res = await fetch("/api/bookings/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                setError(data.message ?? (en ? "Could not cancel." : "বাতিল করা যায়নি।"));
                return;
            }
            router.refresh();
        } catch {
            setError(en ? "Network error. Please try again." : "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
        } finally {
            setBusy(false);
            setConfirming(false);
        }
    }

    if (!confirming) {
        return (
            <div className="mt-6">
                <button
                    type="button"
                    onClick={() => setConfirming(true)}
                    className="text-sm font-semibold text-stone-500 underline hover:text-stone-800"
                >
                    {en ? "Cancel this booking" : "এই বুকিং বাতিল করুন"}
                </button>
                {error && (
                    <p role="alert" className="mt-2 text-sm font-medium text-danger">
                        {error}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="mt-6 rounded-lg border border-stone-300 bg-stone-50 p-5">
            <p className="text-sm leading-relaxed text-stone-700">
                {en
                    ? "Cancelling releases your units back to the project. Someone else may take them, and the booking cannot be reinstated."
                    : "বাতিল করলে আপনার ইউনিট প্রকল্পে ফিরে যাবে। অন্য কেউ সেগুলো নিয়ে নিতে পারেন, আর বুকিংটি আর ফেরানো যাবে না।"}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => void cancel()} disabled={busy}>
                    {busy
                        ? en
                            ? "Cancelling…"
                            : "বাতিল হচ্ছে…"
                        : en
                          ? "Yes, cancel it"
                          : "হ্যাঁ, বাতিল করুন"}
                </Button>
                <Button variant="ghost" onClick={() => setConfirming(false)} disabled={busy}>
                    {en ? "Keep my booking" : "বুকিং রাখুন"}
                </Button>
            </div>
            {error && (
                <p role="alert" className="mt-3 text-sm font-medium text-danger">
                    {error}
                </p>
            )}
        </div>
    );
}
