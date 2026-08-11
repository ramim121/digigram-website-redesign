"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Note } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import type { BankAccount } from "@/lib/account.server";
import type { DigigramBank } from "@/lib/bookings.server";
import { PAYMENT_METHODS, PROOF_ACCEPT, paymentMethodSpec } from "@/lib/booking";
import { t, type Locale } from "@/lib/i18n";

/**
 * Submit proof of payment.
 *
 * Five methods, and each asks for exactly what it needs and nothing else:
 *
 *   BEFTN / NPSB / RTGS  →  which of *your* accounts you sent from
 *   Cash / Cheque        →  when and where to collect
 *
 * The conditional fields are driven by `PAYMENT_METHODS`, the same table the
 * server route validates against, so the form cannot ask for one set of fields
 * while the backend requires another.
 *
 * DigiGram's account is read from the database, never hardcoded — hardcoding it
 * in the app is how the displayed account and the stored one came to disagree.
 * If it cannot be loaded, the transfer methods are hidden rather than shown
 * with a blank or guessed account number.
 */

export function ProofOfPaymentForm({
    locale,
    bookingId,
    digigramBank,
    userBanks,
}: {
    locale: Locale;
    bookingId: number;
    digigramBank: DigigramBank | null;
    userBanks: BankAccount[];
}) {
    const en = locale === "en";
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);

    const [method, setMethod] = useState("");
    const [idUserBanks, setIdUserBanks] = useState(
        String(userBanks.find((bank) => bank.isDefault)?.id ?? userBanks[0]?.id ?? ""),
    );
    const [collectionDate, setCollectionDate] = useState("");
    const [collectionLocation, setCollectionLocation] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const spec = paymentMethodSpec(method);

    // Without DigiGram's account there is nothing to transfer to, so those
    // options are withheld rather than shown as unusable.
    const methods = useMemo(
        () => (digigramBank ? PAYMENT_METHODS : PAYMENT_METHODS.filter((m) => !m.needsUserBank)),
        [digigramBank],
    );

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        setError(null);

        if (!spec) {
            setError(en ? "Choose a payment method." : "একটি পেমেন্ট পদ্ধতি বেছে নিন।");
            return;
        }
        const proof = fileRef.current?.files?.[0];
        if (!proof) {
            setError(
                en
                    ? "Attach a photo or screenshot of your payment."
                    : "আপনার পেমেন্টের ছবি বা স্ক্রিনশট সংযুক্ত করুন।",
            );
            return;
        }
        if (spec.needsUserBank && !idUserBanks) {
            setError(
                en
                    ? "Add a bank account first, then choose which one you paid from."
                    : "প্রথমে একটি ব্যাংক অ্যাকাউন্ট যোগ করুন, তারপর কোনটি থেকে পরিশোধ করেছেন তা বেছে নিন।",
            );
            return;
        }

        const form = new FormData();
        form.append("bookingId", String(bookingId));
        form.append("paymentMethod", spec.value);
        form.append("proof", proof);
        if (spec.needsUserBank) form.append("idUserBanks", idUserBanks);
        if (spec.needsCollection) {
            form.append("collectionDate", collectionDate);
            form.append("collectionLocation", collectionLocation);
        }

        setBusy(true);
        try {
            const res = await fetch("/api/bookings/proof", { method: "POST", body: form });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                setError(data.message ?? (en ? "Upload failed." : "আপলোড ব্যর্থ হয়েছে।"));
                return;
            }
            router.refresh();
        } catch {
            setError(en ? "Network error. Please try again." : "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
        } finally {
            setBusy(false);
        }
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <label
                    htmlFor="paymentMethod"
                    className="block font-display text-sm font-semibold text-stone-800"
                >
                    {en ? "How did you pay?" : "আপনি কীভাবে পরিশোধ করেছেন?"}
                </label>
                <select
                    id="paymentMethod"
                    value={method}
                    onChange={(event) => setMethod(event.target.value)}
                    className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-[15px] text-stone-900 focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none"
                >
                    <option value="">{en ? "Select a payment method" : "পেমেন্ট পদ্ধতি বেছে নিন"}</option>
                    {methods.map((item) => (
                        <option key={item.value} value={item.value}>
                            {t(item.label, locale)}
                        </option>
                    ))}
                </select>
            </div>

            {spec && digigramBank && spec.needsUserBank && (
                <Card className="bg-brand-canvas p-5">
                    <h3 className="font-display text-sm font-bold tracking-wide text-brand-strong uppercase">
                        {en ? "DigiGram's bank details" : "ডিজিগ্রামের ব্যাংক তথ্য"}
                    </h3>
                    <dl className="mt-3 space-y-2 text-sm">
                        <BankRow label={en ? "Bank name" : "ব্যাংকের নাম"} value={digigramBank.bankName} />
                        <BankRow label={en ? "Branch" : "শাখা"} value={digigramBank.branchName} />
                        <BankRow label={en ? "Account name" : "অ্যাকাউন্টের নাম"} value={digigramBank.accountName} />
                        <BankRow label={en ? "Account number" : "অ্যাকাউন্ট নম্বর"} value={digigramBank.accountNumber} />
                        <BankRow label={en ? "Routing number" : "রাউটিং নম্বর"} value={digigramBank.routingNumber} />
                    </dl>
                </Card>
            )}

            {spec && (
                <Card className="p-5">
                    <h3 className="font-display text-sm font-bold text-stone-900">
                        {en ? "How to pay" : "যেভাবে পরিশোধ করবেন"}
                    </h3>
                    <ol className="mt-3 space-y-2">
                        {spec.steps.map((step, index) => (
                            <li key={index} className="flex gap-3 text-sm text-stone-600">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-canvas font-display text-xs font-bold text-brand-strong">
                                    {index + 1}
                                </span>
                                <span>{t(step, locale)}</span>
                            </li>
                        ))}
                    </ol>
                </Card>
            )}

            {spec?.needsUserBank &&
                (userBanks.length > 0 ? (
                    <div>
                        <label
                            htmlFor="idUserBanks"
                            className="block font-display text-sm font-semibold text-stone-800"
                        >
                            {en ? "Which account did you pay from?" : "কোন অ্যাকাউন্ট থেকে পরিশোধ করেছেন?"}
                        </label>
                        <select
                            id="idUserBanks"
                            value={idUserBanks}
                            onChange={(event) => setIdUserBanks(event.target.value)}
                            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-[15px] text-stone-900 focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none"
                        >
                            {userBanks.map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                    {[bank.bankName, bank.branchName, bank.accountNumber]
                                        .filter(Boolean)
                                        .join(" · ")}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <Note tone="warn" icon="alert-triangle">
                        {en
                            ? "Add the bank account you are paying from in your profile first — we match the incoming transfer against it."
                            : "আগে আপনার প্রোফাইলে যে ব্যাংক অ্যাকাউন্ট থেকে পরিশোধ করছেন সেটি যোগ করুন — আমরা আসা ট্রান্সফারটি তার সঙ্গে মিলিয়ে দেখি।"}
                    </Note>
                ))}

            {spec?.needsCollection && (
                <>
                    <div>
                        <label
                            htmlFor="collectionDate"
                            className="block font-display text-sm font-semibold text-stone-800"
                        >
                            {en ? "When should we collect?" : "কখন সংগ্রহ করব?"}
                        </label>
                        <input
                            id="collectionDate"
                            type="datetime-local"
                            value={collectionDate}
                            onChange={(event) => setCollectionDate(event.target.value)}
                            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-[15px] text-stone-900 focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none"
                            required
                        />
                    </div>
                    <TextField
                        id="collectionLocation"
                        label={en ? "Collection address" : "সংগ্রহের ঠিকানা"}
                        value={collectionLocation}
                        onChange={(event) => setCollectionLocation(event.target.value)}
                        hint={
                            en
                                ? "Include an area and a landmark so our representative can find it."
                                : "এলাকা ও একটি পরিচিত স্থান উল্লেখ করুন যাতে আমাদের প্রতিনিধি খুঁজে পান।"
                        }
                        required
                    />
                </>
            )}

            <div>
                <label htmlFor="proof" className="block font-display text-sm font-semibold text-stone-800">
                    {en ? "Upload your proof of payment" : "পরিশোধের প্রমাণ আপলোড করুন"}
                </label>
                <input
                    id="proof"
                    ref={fileRef}
                    type="file"
                    accept={PROOF_ACCEPT}
                    className="mt-2 block w-full text-sm text-stone-600 file:me-4 file:rounded-md file:border-0 file:bg-stone-100 file:px-4 file:py-2 file:font-display file:text-sm file:font-semibold file:text-stone-800"
                />
                <p className="mt-2 text-xs text-stone-500">
                    {en
                        ? "JPG or PNG, up to 10 MB. PDFs are not accepted."
                        : "জেপিজি বা পিএনজি, সর্বোচ্চ ১০ এমবি। পিডিএফ গ্রহণ করা হয় না।"}
                </p>
            </div>

            {error && (
                <p role="alert" className="text-sm font-medium text-danger">
                    {error}
                </p>
            )}

            <Button type="submit" size="lg" fullWidth disabled={busy || !spec}>
                {busy ? (en ? "Submitting…" : "জমা হচ্ছে…") : en ? "Submit proof" : "প্রমাণ জমা দিন"}
            </Button>
        </form>
    );
}

function BankRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="text-stone-500">{label}</dt>
            <dd className="text-end font-medium text-stone-900">{value}</dd>
        </div>
    );
}
