"use client";

import { useState } from "react";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Note } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import type { SessionUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n";
import { AccountMerge } from "@/components/auth/AccountMerge";

/**
 * Proving an email address.
 *
 * WHY THIS REPLACED A PLAIN TEXT FIELD
 * The profile form used to take an address, save it, and tell the reader that
 * saving does not verify it — "sign in with Google to verify" — which is a dead
 * end for anyone whose email is not a Google account. `emailVerified` could
 * only ever be set by Google, so most people had no route to it at all.
 *
 * Now: type the address, receive a code, enter it. The address only lands on
 * the account once the code is right, so an unverified address is never stored
 * and cannot be confused for a proven one.
 *
 * THE TAKEN CASE IS THE INTERESTING ONE
 * If a live account already holds the address, the backend answers 409 TAKEN.
 * That is not a failure — it almost always means the same person registered
 * twice, once by phone and once with Google, which is true of the majority of
 * accounts. So it hands over to the merge flow instead of showing an error.
 */

type Step = "idle" | "sent" | "verified";

export function EmailVerification({
    locale,
    user,
}: {
    locale: Locale;
    user: SessionUser;
}) {
    const en = locale === "en";
    const alreadyVerified = user.emailVerified === "yes" && Boolean(user.email);

    const [email, setEmail] = useState(user.email ?? "");
    const [code, setCode] = useState("");
    const [step, setStep] = useState<Step>(alreadyVerified ? "verified" : "idle");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    /** Set when the address belongs to somebody else's account. */
    const [conflict, setConflict] = useState<string | null>(null);

    async function send() {
        setBusy(true);
        setError(null);
        setNotice(null);
        setConflict(null);
        try {
            const res = await fetch("/api/account/email/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, locale }),
            });
            const data = await res.json();

            if (!res.ok || !data.ok) {
                if (data.code === "TAKEN") {
                    setConflict(email.trim());
                    return;
                }
                setError(data.message ?? (en ? "Could not send the code." : "কোড পাঠানো যায়নি।"));
                return;
            }

            if (data.alreadyVerified) {
                setStep("verified");
                return;
            }

            setStep("sent");
            setNotice(
                en
                    ? "Check your inbox — and your spam folder, which is where it usually is."
                    : "আপনার ইনবক্স দেখুন — স্প্যাম ফোল্ডারও দেখবেন, সাধারণত ওখানেই থাকে।",
            );
        } catch {
            setError(en ? "Network error. Please try again." : "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
        } finally {
            setBusy(false);
        }
    }

    async function confirm() {
        setBusy(true);
        setError(null);
        try {
            const res = await fetch("/api/account/email/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.message ?? (en ? "That code is not right." : "কোডটি সঠিক নয়।"));
                return;
            }

            setStep("verified");
            setNotice(null);
            // A full reload, so every server component re-reads the session and
            // the booking gate updates with it.
            window.location.reload();
        } catch {
            setError(en ? "Network error. Please try again." : "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
        } finally {
            setBusy(false);
        }
    }

    if (conflict) {
        return (
            <AccountMerge
                locale={locale}
                channel="email"
                value={conflict}
                onCancel={() => {
                    setConflict(null);
                    setStep("idle");
                }}
            />
        );
    }

    if (step === "verified") {
        return (
            <div className="flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4">
                <Icon name="check-circle" size={18} className="mt-0.5 shrink-0 text-brand-strong" />
                <div className="text-sm leading-relaxed text-stone-700">
                    <p className="font-semibold text-stone-900">{user.email ?? email}</p>
                    <p className="mt-1">
                        {en
                            ? "Verified. You can sign in with this address as well as your phone number."
                            : "যাচাইকৃত। ফোন নম্বরের পাশাপাশি এই ঠিকানা দিয়েও লগ ইন করতে পারবেন।"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <TextField
                id="verify-email"
                label={en ? "Email address" : "ইমেইল ঠিকানা"}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={step === "sent"}
                hint={
                    en
                        ? "We send a 6-digit code to confirm it is yours. Nothing is saved until you enter the code."
                        : "এটি আপনার কিনা নিশ্চিত করতে ৬ সংখ্যার একটি কোড পাঠানো হবে। কোড না দেওয়া পর্যন্ত কিছুই সংরক্ষণ হয় না।"
                }
            />

            {step === "sent" && (
                <TextField
                    id="verify-code"
                    label={en ? "6-digit code" : "৬ সংখ্যার কোড"}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                />
            )}

            {error && (
                <p role="alert" className="text-sm font-medium text-danger">
                    {error}
                </p>
            )}
            {notice && <Note tone="info" icon="info">{notice}</Note>}

            <div className="flex flex-wrap gap-3">
                {step === "sent" ? (
                    <>
                        <Button type="button" disabled={busy || code.length < 6} onClick={() => void confirm()}>
                            {en ? "Confirm" : "নিশ্চিত করুন"}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={busy}
                            onClick={() => {
                                setStep("idle");
                                setCode("");
                                setNotice(null);
                            }}
                        >
                            {en ? "Use a different address" : "অন্য ঠিকানা ব্যবহার করুন"}
                        </Button>
                    </>
                ) : (
                    <Button type="button" disabled={busy || !email.trim()} onClick={() => void send()}>
                        {en ? "Send me a code" : "কোড পাঠান"}
                    </Button>
                )}
            </div>
        </div>
    );
}
