"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n";

/**
 * The receipt already on file for a booking.
 *
 * WHY SHOW IT BACK
 * Somebody who has uploaded a bank slip and heard nothing has no way to tell
 * whether the right file arrived, or any file at all. The status said
 * "under review" and showed nothing to review. FR-INV-03 asks for the state to
 * be visible; the artefact is the honest form of that.
 *
 * NOT AN <img> STRAIGHT FROM S3
 * The object is private. `/api/bookings/{id}/proof` attaches the session token
 * server-side and 302s to a five-minute presigned URL, so the browser fetches
 * from S3 directly but only for as long as that link lives.
 *
 * Loaded on demand rather than on render: these are bank documents, and
 * fetching one every time the page opens puts a receipt on screen in front of
 * whoever happens to be looking.
 */
export function SubmittedProof({ locale, bookingId }: { locale: Locale; bookingId: number }) {
    const en = locale === "en";
    const [shown, setShown] = useState(false);
    const [failed, setFailed] = useState(false);

    return (
        <div className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold text-stone-900">
                    <Icon name="file-text" size={16} className="shrink-0 text-brand-strong" />
                    {en ? "Your receipt" : "আপনার রসিদ"}
                </h3>

                <button
                    type="button"
                    onClick={() => setShown((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 font-display text-xs font-semibold text-stone-700 hover:border-brand-strong hover:text-brand-strong"
                >
                    {shown
                        ? en
                            ? "Hide"
                            : "লুকান"
                        : en
                          ? "View what I sent"
                          : "আমি যা পাঠিয়েছি দেখুন"}
                    <Icon name={shown ? "chevron-down" : "chevron-right"} size={13} />
                </button>
            </div>

            {shown && (
                <div className="mt-3">
                    {failed ? (
                        <p className="rounded-md bg-stone-50 p-3 text-sm text-stone-600">
                            {en
                                ? "The receipt could not be loaded. It is still on file — contact support if you need a copy."
                                : "রসিদটি দেখানো যায়নি। এটি সংরক্ষিত আছে — কপি প্রয়োজন হলে সহায়তা কেন্দ্রে জানান।"}
                        </p>
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={`/api/bookings/${bookingId}/proof`}
                            alt={en ? "The payment receipt you uploaded" : "আপনার আপলোড করা পরিশোধের রসিদ"}
                            className="max-h-[26rem] w-full rounded-md border border-stone-200 object-contain"
                            onError={() => setFailed(true)}
                        />
                    )}
                </div>
            )}

            <p className="mt-3 text-xs leading-relaxed text-stone-500">
                {en
                    ? "Only you and the team reviewing it can open this file."
                    : "কেবল আপনি এবং যাচাইকারী দলই এই ফাইলটি দেখতে পারেন।"}
            </p>
        </div>
    );
}
