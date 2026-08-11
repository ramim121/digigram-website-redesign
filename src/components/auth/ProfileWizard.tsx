"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { TextField, SelectField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Note } from "@/components/ui/Primitives";
import { useSession } from "@/components/auth/session";
import { localePath, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";
import { useLoginHref } from "@/lib/auth/useLoginHref";

/**
 * Step 3 — profile completion, first time only.
 *
 * Built as a two-step wizard with a progress bar so fields can be ADDED later
 * without a redesign: the client's registration/KYC list is still to come, and
 * step 2 is the drawer it drops into. The visitor can skip to browsing at any
 * point — nothing on this site is gated behind a completed profile.
 */

const DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

export function ProfileWizard({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const router = useRouter();
  const { user, ready, signIn } = useSession();

  const loginHref = useLoginHref(locale);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("");
  const [intent, setIntentValue] = useState<"investor" | "farmer">("investor");
  const [referral, setReferral] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !user) router.replace(loginHref);
  }, [ready, user, router, loginHref]);

  useEffect(() => {
    if (user?.name && user.name !== "Investor" && user.name !== "বিনিয়োগকারী") setName(user.name);
  }, [user]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5 pt-24">
        <p className="text-sm text-stone-500">{en ? "Loading…" : "লোড হচ্ছে…"}</p>
      </div>
    );
  }

  function next(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setNameError(en ? "Please enter your full name." : "আপনার পুরো নাম লিখুন।");
      return;
    }
    setNameError(null);
    setStep(2);
  }

  function finish(event: React.FormEvent) {
    event.preventDefault();
    signIn({ phone: user!.phone, name: name.trim(), district: district || undefined, intent });
    router.push(localePath(locale, routes.account));
  }

  function skip() {
    router.push(localePath(locale, routes.projects));
  }

  return (
    <AuthShell
      locale={locale}
      step={step}
      totalSteps={2}
      title={step === 1 ? (en ? "Tell us who you are" : "আপনার পরিচয় দিন") : en ? "A little more" : "আরও কিছু তথ্য"}
      lead={
        step === 1
          ? en
            ? "This appears on your investment records and nowhere else."
            : "এটি কেবল আপনার বিনিয়োগ নথিতে দেখা যাবে, অন্য কোথাও নয়।"
          : en
            ? "Optional, but it helps us show you the projects closest to you."
            : "ঐচ্ছিক, তবে এতে আমরা আপনার কাছাকাছি প্রকল্প দেখাতে পারি।"
      }
      footer={
        <button type="button" onClick={skip} className="font-semibold text-stone-500 hover:underline">
          {en ? "Skip for now and keep browsing" : "আপাতত বাদ দিয়ে দেখতে থাকুন"}
        </button>
      }
    >
      {step === 1 ? (
        <form onSubmit={next} noValidate className="space-y-5">
          <TextField
            id="name"
            label={en ? "Full name" : "পুরো নাম"}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={nameError}
            required
          />
          <TextField
            id="email"
            label={en ? "Email (optional)" : "ইমেইল (ঐচ্ছিক)"}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            hint={
              en
                ? "For statements and project reports. We never sell it."
                : "স্টেটমেন্ট ও প্রকল্প প্রতিবেদনের জন্য। আমরা কখনো এটি বিক্রি করি না।"
            }
          />
          <TextField
            id="phone-locked"
            label={en ? "Mobile number" : "মোবাইল নম্বর"}
            value={user.phone}
            readOnly
            disabled
          />
          <Button type="submit" fullWidth size="lg" icon="arrow-right">
            {en ? "Continue" : "চালিয়ে যান"}
          </Button>
        </form>
      ) : (
        <form onSubmit={finish} noValidate className="space-y-5">
          <SelectField
            id="district"
            label={en ? "District" : "জেলা"}
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
          >
            <option value="">{en ? "Choose a district" : "জেলা বাছুন"}</option>
            {DISTRICTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>

          <fieldset>
            <legend className="font-display text-sm font-semibold text-stone-700">
              {en ? "I am here to" : "আমি এসেছি"}
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(
                [
                  { key: "investor" as const, en: "Invest", bn: "বিনিয়োগ করতে" },
                  { key: "farmer" as const, en: "Join as a Shathi partner", bn: "সাথী অংশীদার হতে" },
                ]
              ).map((option) => (
                <label
                  key={option.key}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-4 py-3 text-sm transition-colors ${
                    intent === option.key
                      ? "border-brand bg-brand-tint text-brand-strong"
                      : "border-stone-300 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="intent"
                    value={option.key}
                    checked={intent === option.key}
                    onChange={() => setIntentValue(option.key)}
                    className="accent-[var(--brand)]"
                  />
                  {en ? option.en : option.bn}
                </label>
              ))}
            </div>
          </fieldset>

          <TextField
            id="referral"
            label={en ? "Referral code (optional)" : "রেফারেল কোড (ঐচ্ছিক)"}
            value={referral}
            onChange={(event) => setReferral(event.target.value)}
          />

          <Note tone="info" icon="shield">
            {en
              ? "Identity documents are only requested if a specific project or lender requires them — never at sign-up."
              : "পরিচয়পত্র কেবল তখনই চাওয়া হয় যখন নির্দিষ্ট কোনো প্রকল্প বা ঋণদাতার প্রয়োজন হয় — নিবন্ধনের সময় কখনো নয়।"}
          </Note>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}>
              {en ? "Back" : "পেছনে"}
            </Button>
            <Button type="submit" fullWidth size="lg" icon="check">
              {en ? "Finish" : "সম্পন্ন করুন"}
            </Button>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
