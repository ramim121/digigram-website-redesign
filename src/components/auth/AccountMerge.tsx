"use client";

import { useEffect, useState } from "react";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Note } from "@/components/ui/Primitives";
import type { Locale } from "@/lib/i18n";

/**
 * Joining two accounts that belong to the same person.
 *
 * WHY THIS EXISTS AT ALL
 * Of 425 accounts, only 63 hold both a phone number and an email address.
 * Registering by phone and later signing in with Google produced a *second*
 * account, with no way back — the collision was detected and answered with
 * "already exists", and that was the end of it.
 *
 * WHAT THE PERSON HAS TO PROVE
 * Both sides. Being signed in proves this account; a code sent to the other
 * account's own channel proves that one. Nothing moves on the strength of an
 * address someone merely typed in — otherwise entering a stranger's number
 * would pull their bookings onto your account.
 *
 * WHY THE PLAN IS SHOWN FIRST
 * The surviving account is whichever holds more records, because that is the
 * merge where fewest money rows have to be rewritten. That means the person may
 * keep the *other* account, which is surprising if it happens silently. So the
 * check step says which one survives and how much moves, before any code is
 * sent.
 */

type Plan = {
    survivorId: number;
    youAreSurvivor: boolean;
    recordsMoving: number;
};

export function AccountMerge({
    locale,
    channel,
    value,
    onCancel,
}: {
    locale: Locale;
    channel: "email" | "phone";
    /** The address or number that turned out to belong to another account. */
    value: string;
    onCancel: () => void;
}) {
    const en = locale === "en";
    const [plan, setPlan] = useState<Plan | null>(null);
    const [code, setCode] = useState("");
    const [sent, setSent] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState<number | null>(null);

    async function call(step: "check" | "request" | "confirm", extra: Record<string, unknown> = {}) {
        const res = await fetch("/api/account/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ step, channel, value, ...extra }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message ?? "Something went wrong.");
        return data;
    }

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await call("check");
                if (!cancelled) {
                    setPlan({
                        survivorId: data.survivorId,
                        youAreSurvivor: Boolean(data.youAreSurvivor),
                        recordsMoving: Number(data.recordsMoving ?? 0),
                    });
                }
            } catch (e) {
                if (!cancelled) setError((e as Error).message);
            }
        })();
        return () => {
            cancelled = true;
        };
        // `value` and `channel` fully determine the plan.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channel, value]);

    if (done !== null) {
        return (
            <Note tone="info" icon="check-circle">
                {en
                    ? `Your accounts are now one. ${done} record${done === 1 ? "" : "s"} moved across, and you can sign in with either your phone number or your email.`
                    : `আপনার অ্যাকাউন্ট দুটি এখন একটিই। ${done}টি রেকর্ড স্থানান্তরিত হয়েছে, আর আপনি ফোন নম্বর বা ইমেইল — যেকোনোটি দিয়ে লগ ইন করতে পারবেন।`}
            </Note>
        );
    }

    return (
        <div className="space-y-4 rounded-lg border border-amber-300 bg-amber-50 p-5">
            <div>
                <h3 className="font-display text-base font-bold text-stone-900">
                    {en ? "This already belongs to a Shathi account" : "এটি ইতিমধ্যেই একটি সাথী অ্যাকাউন্টের সঙ্গে যুক্ত"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                    {en
                        ? `${value} is registered to another account. If that one is also yours — for example you registered by phone and later signed in with Google — the two can be joined.`
                        : `${value} অন্য একটি অ্যাকাউন্টে নিবন্ধিত। সেটিও যদি আপনারই হয় — যেমন ফোন দিয়ে নিবন্ধন করে পরে গুগল দিয়ে লগ ইন করেছেন — তাহলে দুটি একসঙ্গে জোড়া যায়।`}
                </p>
            </div>

            {plan && (
                <div className="rounded-md border border-amber-200 bg-white p-4 text-sm leading-relaxed text-stone-700">
                    <p>
                        {plan.recordsMoving === 0
                            ? en
                                ? "Nothing has to move — the other account holds no bookings or investments."
                                : "কিছুই স্থানান্তর করতে হবে না — অন্য অ্যাকাউন্টে কোনো বুকিং বা বিনিয়োগ নেই।"
                            : en
                              ? `${plan.recordsMoving} record${plan.recordsMoving === 1 ? "" : "s"} — bookings, investments and bank details — will move onto the account that is kept.`
                              : `${plan.recordsMoving}টি রেকর্ড — বুকিং, বিনিয়োগ ও ব্যাংক তথ্য — যে অ্যাকাউন্টটি রাখা হবে সেটিতে চলে যাবে।`}
                    </p>
                    {!plan.youAreSurvivor && (
                        <p className="mt-2 font-semibold text-stone-900">
                            {en
                                ? "The other account is the one kept, because it holds more records. You will stay signed in — nothing is lost either way."
                                : "অন্য অ্যাকাউন্টটিই রাখা হবে, কারণ সেখানে বেশি রেকর্ড আছে। আপনি লগ ইন থাকবেন — কোনোভাবেই কিছু হারাবে না।"}
                        </p>
                    )}
                </div>
            )}

            <p className="text-sm leading-relaxed text-stone-700">
                {en
                    ? channel === "email"
                        ? "To go ahead, prove that mailbox is yours: we will send a code to it."
                        : "To go ahead, prove that number is yours: we will send a code to it by SMS."
                    : channel === "email"
                      ? "এগিয়ে যেতে হলে প্রমাণ করুন মেইলবক্সটি আপনার: সেখানে একটি কোড পাঠানো হবে।"
                      : "এগিয়ে যেতে হলে প্রমাণ করুন নম্বরটি আপনার: এসএমএসে একটি কোড পাঠানো হবে।"}
            </p>

            {sent && (
                <TextField
                    id="merge-code"
                    label={en ? "Code" : "কোড"}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                />
            )}

            {error && (
                <p role="alert" className="text-sm font-medium text-danger">
                    {error}
                </p>
            )}

            <div className="flex flex-wrap gap-3">
                {sent ? (
                    <Button
                        type="button"
                        disabled={busy || code.length < 4}
                        onClick={() => {
                            setBusy(true);
                            setError(null);
                            call("confirm", { code })
                                .then((data) => {
                                    setDone(Number(data.recordsMoved ?? 0));
                                    // Server components must re-read the session:
                                    // the surviving account may not be the one
                                    // the old cookie named.
                                    setTimeout(() => window.location.reload(), 1800);
                                })
                                .catch((e) => setError((e as Error).message))
                                .finally(() => setBusy(false));
                        }}
                    >
                        {en ? "Join the accounts" : "অ্যাকাউন্ট দুটি জোড়া দিন"}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        disabled={busy || !plan}
                        onClick={() => {
                            setBusy(true);
                            setError(null);
                            call("request")
                                .then(() => setSent(true))
                                .catch((e) => setError((e as Error).message))
                                .finally(() => setBusy(false));
                        }}
                    >
                        {en ? "Send the code" : "কোড পাঠান"}
                    </Button>
                )}

                <Button type="button" variant="ghost" disabled={busy} onClick={onCancel}>
                    {en ? "Not mine — use another address" : "আমার নয় — অন্য ঠিকানা দিন"}
                </Button>
            </div>
        </div>
    );
}
