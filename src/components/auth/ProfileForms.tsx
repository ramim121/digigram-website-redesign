"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Note } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField } from "@/components/ui/Field";
import { EmailVerification } from "@/components/auth/EmailVerification";
import { Icon } from "@/components/ui/Icon";
import type { SessionUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n";

/**
 * The "complete your profile" forms.
 *
 * HOW THIS DIFFERS FROM THE APP'S CURRENT FLOW
 * The app presents one long profile form with every field always editable and
 * no indication of which parts actually block an investment. Here:
 *
 *   - each item states whether it is **required to invest** or optional, so
 *     nobody fills in a bank account believing it is the thing standing in
 *     their way;
 *   - a verified phone or email is shown as **already done**, with the reason
 *     ("verified when you signed in"), instead of being an editable field that
 *     looks unfinished;
 *   - an email typed into the form is never labelled verified, because saving
 *     it does not verify it;
 *   - NID has three states — not submitted, under review, verified — rather
 *     than a file input that looks identical before and after upload;
 *   - a verified NID is not re-uploadable: it is locked with a note to contact
 *     support, so nobody resets their own verified status by accident.
 *
 * Each section posts to its own route and refreshes the server components, so
 * the status shown always comes from the backend rather than from optimistic
 * local state.
 */

type Props = {
    locale: Locale;
    user: SessionUser;
    hasBank: boolean;
};

export function ProfileForms({ locale, user, hasBank }: Props) {
    const en = locale === "en";

    return (
        <div className="space-y-6">
            <IdentitySection locale={locale} user={user} />
            <ContactSection locale={locale} user={user} />
            <NidSection locale={locale} user={user} />
            <PhotoSection locale={locale} user={user} />
            <BankSection locale={locale} hasBank={hasBank} />

            <p className="text-xs text-stone-500">
                {en
                    ? "Your NID images are stored privately and are only seen by the team that verifies them."
                    : "আপনার এনআইডির ছবি ব্যক্তিগতভাবে সংরক্ষিত থাকে এবং কেবল যাচাইকারী দলই তা দেখতে পান।"}
            </p>
        </div>
    );
}

/* ------------------------------------------------------------- scaffold -- */

function Section({
    title,
    requirement,
    children,
}: {
    title: string;
    requirement: { label: string; required: boolean };
    children: React.ReactNode;
}) {
    return (
        <Card className="p-6">
            <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-lg font-bold text-stone-900">{title}</h2>
                <span
                    className={
                        requirement.required
                            ? "rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800"
                            : "rounded bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-500"
                    }
                >
                    {requirement.label}
                </span>
            </div>
            <div className="mt-4">{children}</div>
        </Card>
    );
}

function Done({ children }: { children: React.ReactNode }) {
    return (
        <p className="flex items-start gap-2 text-sm text-stone-700">
            <Icon name="check" size={18} className="mt-0.5 shrink-0 text-brand-strong" />
            <span>{children}</span>
        </p>
    );
}

function useRefreshingSubmit() {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    async function run(send: () => Promise<Response>) {
        setBusy(true);
        setError(null);
        setDone(false);
        try {
            const res = await send();
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) {
                setError(
                    // The backend returns an array of Joi messages for some
                    // routes and a string for others.
                    Array.isArray(data.message) ? data.message.join(" ") : (data.message ?? "Failed"),
                );
                return false;
            }
            setDone(true);
            // Re-render the server components so the status badges reflect the
            // backend, not what we hope happened.
            router.refresh();
            return true;
        } catch {
            setError("Network error");
            return false;
        } finally {
            setBusy(false);
        }
    }

    return { busy, error, done, run, setError };
}

/* ------------------------------------------------------------- identity -- */

function IdentitySection({ locale, user }: { locale: Locale; user: SessionUser }) {
    const en = locale === "en";
    const { busy, error, done, run } = useRefreshingSubmit();
    const [fullName, setFullName] = useState(user.fullName ?? "");
    const [gender, setGender] = useState(user.gender ?? "");
    const [dateOfBirth, setDateOfBirth] = useState(
        user.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : "",
    );

    return (
        <Section
            title={en ? "Your details" : "আপনার তথ্য"}
            requirement={{
                label: en ? "Required to invest" : "বিনিয়োগের জন্য আবশ্যক",
                required: true,
            }}
        >
            <form
                className="space-y-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    void run(() =>
                        fetch("/api/account/profile", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ fullName, gender, dateOfBirth }),
                        }),
                    );
                }}
            >
                <TextField
                    id="fullName"
                    label={en ? "Full name" : "পুরো নাম"}
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    hint={
                        en
                            ? "As printed on your NID — the two are checked against each other."
                            : "আপনার এনআইডিতে যেভাবে লেখা আছে — দুটি মিলিয়ে দেখা হয়।"
                    }
                    required
                />
                <SelectField
                    id="gender"
                    label={en ? "Gender" : "লিঙ্গ"}
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    required
                >
                    <option value="" disabled>
                        {en ? "Choose one" : "একটি নির্বাচন করুন"}
                    </option>
                    <option value="female">{en ? "Female" : "নারী"}</option>
                    <option value="male">{en ? "Male" : "পুরুষ"}</option>
                    <option value="other">{en ? "Other" : "অন্যান্য"}</option>
                    <option value="prefer_not_to_say">
                        {en ? "Prefer not to say" : "বলতে চাই না"}
                    </option>
                </SelectField>
                <TextField
                    id="dateOfBirth"
                    label={en ? "Date of birth" : "জন্ম তারিখ"}
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) => setDateOfBirth(event.target.value)}
                    required
                />
                {/* The email lives in its own flow, not this form: an address
                    is only written to the account once a code proves it, so it
                    cannot be saved here alongside fields that need no proof. */}
                <div className="border-t border-stone-200 pt-4">
                    <p className="mb-3 font-display text-sm font-bold text-stone-900">
                        {en ? "Email address" : "ইমেইল ঠিকানা"}
                    </p>
                    <EmailVerification locale={locale} user={user} />
                </div>

                {error && (
                    <p role="alert" className="text-sm font-medium text-danger">
                        {error}
                    </p>
                )}
                {done && (
                    <p className="text-sm font-medium text-brand-strong">
                        {en ? "Saved." : "সংরক্ষিত হয়েছে।"}
                    </p>
                )}

                <Button type="submit" disabled={busy}>
                    {en ? "Save details" : "তথ্য সংরক্ষণ করুন"}
                </Button>
            </form>
        </Section>
    );
}

/* -------------------------------------------------------------- contact -- */

function ContactSection({ locale, user }: { locale: Locale; user: SessionUser }) {
    const en = locale === "en";
    const phoneOk = user.phoneVerified === "yes";
    const emailOk = user.emailVerified === "yes";

    return (
        <Section
            title={en ? "Contact verification" : "যোগাযোগ যাচাই"}
            requirement={{
                label: en ? "Required to invest" : "বিনিয়োগের জন্য আবশ্যক",
                required: true,
            }}
        >
            {phoneOk || emailOk ? (
                <div className="space-y-2">
                    {phoneOk && (
                        <Done>
                            {en
                                ? `Phone verified (${user.phoneNumber ?? ""}) — confirmed by the SMS code you signed in with.`
                                : `ফোন যাচাইকৃত (${user.phoneNumber ?? ""}) — যে এসএমএস কোড দিয়ে লগ ইন করেছেন তা দিয়েই নিশ্চিত।`}
                        </Done>
                    )}
                    {emailOk && (
                        <Done>
                            {en
                                ? `Email verified (${user.email ?? ""}) — confirmed by Google sign-in.`
                                : `ইমেইল যাচাইকৃত (${user.email ?? ""}) — গুগল সাইন-ইনের মাধ্যমে নিশ্চিত।`}
                        </Done>
                    )}
                    <p className="text-sm text-stone-500">
                        {en
                            ? "One verified contact is enough. Verifying the other as well is optional."
                            : "একটি যাচাইকৃত যোগাযোগই যথেষ্ট। অন্যটিও যাচাই করা ঐচ্ছিক।"}
                    </p>
                </div>
            ) : (
                <Note tone="warn" icon="alert-triangle">
                    {en
                        ? "Neither your phone nor your email is verified yet. Sign in with an SMS code to verify your phone, or with Google to verify your email — either one is enough."
                        : "আপনার ফোন বা ইমেইল কোনোটিই এখনও যাচাই হয়নি। ফোন যাচাই করতে এসএমএস কোড দিয়ে, অথবা ইমেইল যাচাই করতে গুগল দিয়ে লগ ইন করুন — যেকোনো একটিই যথেষ্ট।"}
                </Note>
            )}
        </Section>
    );
}

/* ------------------------------------------------------------------ NID -- */

function NidSection({ locale, user }: { locale: Locale; user: SessionUser }) {
    const en = locale === "en";
    const { busy, error, done, run, setError } = useRefreshingSubmit();
    const frontRef = useRef<HTMLInputElement>(null);
    const backRef = useRef<HTMLInputElement>(null);

    const verified = user.nidVerified === "yes";
    const pending = !verified && user.nidVerificationStatus === "pending";

    return (
        <Section
            title={en ? "NID verification" : "এনআইডি যাচাই"}
            requirement={{
                label: en ? "Required to invest" : "বিনিয়োগের জন্য আবশ্যক",
                required: true,
            }}
        >
            {verified ? (
                <div className="space-y-2">
                    <Done>{en ? "Your NID is verified." : "আপনার এনআইডি যাচাইকৃত।"}</Done>
                    <p className="text-sm text-stone-500">
                        {en
                            ? "To change the NID on file, contact support — it cannot be replaced here, so a verified account cannot be reset by accident."
                            : "নথিভুক্ত এনআইডি পরিবর্তন করতে সহায়তা কেন্দ্রে যোগাযোগ করুন — এখান থেকে বদলানো যায় না, যাতে যাচাইকৃত অ্যাকাউন্ট ভুলবশত বাতিল না হয়।"}
                    </p>
                </div>
            ) : (
                <>
                    {pending && (
                        <Note tone="info" icon="info" className="mb-4">
                            {en
                                ? "Submitted and under review. You can keep browsing; you will be able to invest once it is approved. Uploading again replaces what you sent."
                                : "জমা হয়েছে এবং পর্যালোচনায় আছে। আপনি দেখা চালিয়ে যেতে পারেন; অনুমোদনের পরই বিনিয়োগ করতে পারবেন। আবার আপলোড করলে আগেরটি প্রতিস্থাপিত হবে।"}
                        </Note>
                    )}

                    <form
                        className="space-y-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            const front = frontRef.current?.files?.[0];
                            const back = backRef.current?.files?.[0];
                            if (!front || !back) {
                                setError(
                                    en
                                        ? "Choose both the front and the back."
                                        : "সামনে ও পেছনের দুটি ছবিই বেছে নিন।",
                                );
                                return;
                            }
                            const form = new FormData();
                            form.append("front", front);
                            form.append("back", back);
                            void run(() =>
                                fetch("/api/account/nid", { method: "POST", body: form }),
                            );
                        }}
                    >
                        <FileInput
                            id="nid-front"
                            ref={frontRef}
                            label={en ? "NID — front" : "এনআইডি — সামনের দিক"}
                        />
                        <FileInput
                            id="nid-back"
                            ref={backRef}
                            label={en ? "NID — back" : "এনআইডি — পেছনের দিক"}
                        />

                        <p className="text-xs text-stone-500">
                            {en
                                ? "JPG or PNG, up to 15 MB each. Make sure the number and your name are readable."
                                : "জেপিজি বা পিএনজি, প্রতিটি সর্বোচ্চ ১৫ এমবি। নম্বর ও নাম যেন পড়া যায় তা নিশ্চিত করুন।"}
                        </p>

                        {error && (
                            <p role="alert" className="text-sm font-medium text-danger">
                                {error}
                            </p>
                        )}
                        {done && (
                            <p className="text-sm font-medium text-brand-strong">
                                {en
                                    ? "Submitted. We will review it shortly."
                                    : "জমা হয়েছে। শীঘ্রই পর্যালোচনা করা হবে।"}
                            </p>
                        )}

                        <Button type="submit" disabled={busy}>
                            {busy
                                ? en
                                    ? "Uploading…"
                                    : "আপলোড হচ্ছে…"
                                : en
                                  ? "Submit NID"
                                  : "এনআইডি জমা দিন"}
                        </Button>
                    </form>
                </>
            )}
        </Section>
    );
}

/* ---------------------------------------------------------------- photo -- */

function PhotoSection({ locale, user }: { locale: Locale; user: SessionUser }) {
    const en = locale === "en";
    const { busy, error, done, run, setError } = useRefreshingSubmit();
    const ref = useRef<HTMLInputElement>(null);

    return (
        <Section
            title={en ? "Profile photo" : "প্রোফাইল ছবি"}
            requirement={{ label: en ? "Optional" : "ঐচ্ছিক", required: false }}
        >
            {user.profileImage && (
                <p className="mb-3 text-sm text-stone-600">
                    {en
                        ? "You have a photo on file. Uploading a new one replaces it."
                        : "আপনার একটি ছবি সংরক্ষিত আছে। নতুন আপলোড করলে সেটি প্রতিস্থাপিত হবে।"}
                </p>
            )}
            <form
                className="space-y-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    const photo = ref.current?.files?.[0];
                    if (!photo) {
                        setError(en ? "Choose a photo first." : "প্রথমে একটি ছবি বেছে নিন।");
                        return;
                    }
                    const form = new FormData();
                    form.append("photo", photo);
                    void run(() => fetch("/api/account/photo", { method: "POST", body: form }));
                }}
            >
                <FileInput id="photo" ref={ref} label={en ? "Choose a photo" : "ছবি বেছে নিন"} />
                {error && (
                    <p role="alert" className="text-sm font-medium text-danger">
                        {error}
                    </p>
                )}
                {done && (
                    <p className="text-sm font-medium text-brand-strong">
                        {en ? "Photo updated." : "ছবি হালনাগাদ হয়েছে।"}
                    </p>
                )}
                <Button type="submit" variant="secondary" disabled={busy}>
                    {en ? "Upload photo" : "ছবি আপলোড করুন"}
                </Button>
            </form>
        </Section>
    );
}

/* ----------------------------------------------------------------- bank -- */

type Option = { id: number; name: string };

function BankSection({ locale, hasBank }: { locale: Locale; hasBank: boolean }) {
    const en = locale === "en";
    const { busy, error, done, run, setError } = useRefreshingSubmit();

    const [banks, setBanks] = useState<Option[]>([]);
    const [branches, setBranches] = useState<Option[]>([]);
    const [bankId, setBankId] = useState("");
    const [branchId, setBranchId] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");

    useEffect(() => {
        let cancelled = false;
        fetch("/api/account/banks")
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled && data.ok) setBanks(data.items);
            })
            .catch(() => {
                /* The select stays empty and the form cannot be submitted;
                   an error banner here would fire on every flaky connection. */
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!bankId) {
            setBranches([]);
            return;
        }
        let cancelled = false;
        setBranchId("");
        fetch(`/api/account/banks?bank=${bankId}`)
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled && data.ok) setBranches(data.items);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [bankId]);

    return (
        <Section
            title={en ? "Payout bank account" : "পরিশোধের ব্যাংক অ্যাকাউন্ট"}
            requirement={{
                // Honest: this does not block a booking, it blocks the payout.
                label: en ? "Needed before payout" : "পরিশোধের আগে প্রয়োজন",
                required: false,
            }}
        >
            {hasBank && (
                <p className="mb-4 text-sm text-stone-600">
                    {en
                        ? "You already have an account on file. Adding another lets you choose which one receives your returns."
                        : "আপনার একটি অ্যাকাউন্ট আগে থেকেই আছে। আরেকটি যোগ করলে কোনটিতে রিটার্ন যাবে তা বেছে নিতে পারবেন।"}
                </p>
            )}

            <form
                className="space-y-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    if (!bankId || !branchId) {
                        setError(en ? "Choose a bank and a branch." : "ব্যাংক ও শাখা বেছে নিন।");
                        return;
                    }
                    void run(() =>
                        fetch("/api/account/bank", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                idBanks: Number(bankId),
                                idBankBranches: Number(branchId),
                                accountHolderName,
                                accountNumber,
                                makeDefault: !hasBank,
                            }),
                        }),
                    ).then((ok) => {
                        if (ok) {
                            setBankId("");
                            setBranchId("");
                            setAccountHolderName("");
                            setAccountNumber("");
                        }
                    });
                }}
            >
                <Select
                    id="bank"
                    label={en ? "Bank" : "ব্যাংক"}
                    value={bankId}
                    onChange={setBankId}
                    options={banks}
                    placeholder={en ? "Select a bank" : "ব্যাংক বেছে নিন"}
                />
                <Select
                    id="branch"
                    label={en ? "Branch" : "শাখা"}
                    value={branchId}
                    onChange={setBranchId}
                    options={branches}
                    disabled={!bankId}
                    placeholder={
                        bankId
                            ? en
                                ? "Select a branch"
                                : "শাখা বেছে নিন"
                            : en
                              ? "Choose a bank first"
                              : "আগে ব্যাংক বেছে নিন"
                    }
                />
                <TextField
                    id="accountHolderName"
                    label={en ? "Account holder name" : "অ্যাকাউন্টধারীর নাম"}
                    value={accountHolderName}
                    onChange={(event) => setAccountHolderName(event.target.value)}
                    hint={
                        en
                            ? "Exactly as it appears on the bank account."
                            : "ব্যাংক অ্যাকাউন্টে যেভাবে আছে ঠিক সেভাবে।"
                    }
                    required
                />
                <TextField
                    id="accountNumber"
                    label={en ? "Account number" : "অ্যাকাউন্ট নম্বর"}
                    inputMode="numeric"
                    value={accountNumber}
                    onChange={(event) => setAccountNumber(event.target.value)}
                    required
                />

                {error && (
                    <p role="alert" className="text-sm font-medium text-danger">
                        {error}
                    </p>
                )}
                {done && (
                    <p className="text-sm font-medium text-brand-strong">
                        {en ? "Bank account added." : "ব্যাংক অ্যাকাউন্ট যোগ হয়েছে।"}
                    </p>
                )}

                <Button type="submit" variant="secondary" disabled={busy}>
                    {en ? "Add account" : "অ্যাকাউন্ট যোগ করুন"}
                </Button>
            </form>
        </Section>
    );
}

/* ------------------------------------------------------------- controls -- */

const FileInput = function FileInput({
    id,
    label,
    ref,
}: {
    id: string;
    label: string;
    ref: React.RefObject<HTMLInputElement | null>;
}) {
    return (
        <div>
            <label htmlFor={id} className="block font-display text-sm font-semibold text-stone-800">
                {label}
            </label>
            <input
                id={id}
                ref={ref}
                type="file"
                accept="image/jpeg,image/png"
                className="mt-2 block w-full text-sm text-stone-600 file:me-4 file:rounded-md file:border-0 file:bg-stone-100 file:px-4 file:py-2 file:font-display file:text-sm file:font-semibold file:text-stone-800"
            />
        </div>
    );
};

function Select({
    id,
    label,
    value,
    onChange,
    options,
    placeholder,
    disabled,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder: string;
    disabled?: boolean;
}) {
    return (
        <div>
            <label htmlFor={id} className="block font-display text-sm font-semibold text-stone-800">
                {label}
            </label>
            <select
                id={id}
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-[15px] text-stone-900 focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none disabled:bg-stone-100 disabled:text-stone-400"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
