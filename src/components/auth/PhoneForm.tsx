"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { TextField, CheckboxField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { localePath, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";

/**
 * Step 1 — phone only. No password is ever asked for, stored or displayed.
 *
 * The +880 prefix is locked so a visitor cannot enter a country code twice,
 * and the field is numeric-only so a phone keyboard opens on mobile.
 */

const PENDING_KEY = "digigram.pending-phone";

export function PhoneForm({ locale, returnTo }: { locale: Locale; returnTo?: string | null }) {
  const en = locale === "en";
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notRegistered, setNotRegistered] = useState(false);

  const digits = phone.replace(/\D/g, "");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setConsentError(null);

    // Bangladeshi mobile numbers are 1XXXXXXXXX after the +880 prefix.
    if (!/^1[3-9]\d{8}$/.test(digits)) {
      setError(
        en
          ? "Enter a 10-digit Bangladeshi mobile number, starting with 1."
          : "১ দিয়ে শুরু ১০ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।",
      );
      return;
    }

    if (!agreed) {
      setConsentError(
        en ? "Please accept the terms to continue." : "চালিয়ে যেতে শর্তাবলিতে সম্মতি দিন।",
      );
      return;
    }

    void send();
  }

  async function send() {
    setBusy(true);
    setNotRegistered(false);
    // The backend normalises this form; it accepts 01XXXXXXXXX or +8801XXXXXXXXX.
    const phoneNumber = `0${digits}`;

    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        // The one failure that is not an error on the user's part: they have
        // no Shathi account yet, and the web cannot create one.
        if (data.code === "NOT_REGISTERED") {
          setNotRegistered(true);
          return;
        }
        setError(data.message ?? (en ? "Could not send the code." : "কোড পাঠানো যায়নি।"));
        return;
      }

      try {
        window.sessionStorage.setItem(PENDING_KEY, phoneNumber);
      } catch {
        /* Private browsing can refuse sessionStorage; the OTP screen asks for
           the number again in that case rather than failing. */
      }
      // Carry the destination through the code step so it survives the hop.
      const otpPath = localePath(locale, routes.otp);
      router.push(returnTo ? `${otpPath}?next=${encodeURIComponent(returnTo)}` : otpPath);
    } catch {
      setError(en ? "Network error. Please try again." : "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      locale={locale}
      title={en ? "Log in" : "লগ ইন"}
      lead={
        en
          ? "Use the mobile number you registered with in the Shathi app. No password to remember."
          : "সাথী অ্যাপে যে মোবাইল নম্বর দিয়ে নিবন্ধন করেছেন সেটিই ব্যবহার করুন। পাসওয়ার্ড মনে রাখতে হবে না।"
      }
      footer={
        en ? (
          <>
            Browsing does not need an account.{" "}
            <Link href={localePath(locale, routes.projects)} className="font-semibold text-brand-strong">
              Keep exploring projects
            </Link>
          </>
        ) : (
          <>
            দেখার জন্য অ্যাকাউন্ট লাগে না।{" "}
            <Link href={localePath(locale, routes.projects)} className="font-semibold text-brand-strong">
              প্রকল্প দেখতে থাকুন
            </Link>
          </>
        )
      }
    >
      {/* Registration happens in the app, never here. This panel is what the
          site shows instead of a sign-up form, and it is the only place a
          visitor learns that the number they typed has no account yet. */}
      {notRegistered && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-5">
          <p className="font-display text-[15px] font-bold text-stone-900">
            {en ? "No Shathi account for this number" : "এই নম্বরে কোনো সাথী অ্যাকাউন্ট নেই"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-700">
            {en
              ? "Accounts are created in the Shathi app, where identity verification happens. Register there once, then sign in here with the same number."
              : "অ্যাকাউন্ট তৈরি হয় সাথী অ্যাপে, যেখানে পরিচয় যাচাই করা হয়। একবার সেখানে নিবন্ধন করুন, তারপর একই নম্বর দিয়ে এখানে লগ ইন করুন।"}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={site.app.playStore}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-brand-strong px-4 py-2 text-sm font-semibold text-white"
            >
              {en ? "Get it on Google Play" : "গুগল প্লে থেকে নিন"}
            </a>
            <a
              href={site.app.appStore}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800"
            >
              {en ? "Download on the App Store" : "অ্যাপ স্টোর থেকে ডাউনলোড"}
            </a>
          </div>
        </div>
      )}

      <form onSubmit={submit} noValidate className="space-y-6">
        <TextField
          id="phone"
          label={en ? "Mobile number" : "মোবাইল নম্বর"}
          prefix="+880"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={11}
          placeholder="1XXXXXXXXX"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          error={error}
          hint={en ? "We will send a 4-digit code by SMS." : "এসএমএসে ৪ সংখ্যার একটি কোড পাঠানো হবে।"}
          required
        />

        <CheckboxField
          id="consent"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          error={consentError}
          label={
            en ? (
              <>
                I accept the{" "}
                <Link href={localePath(locale, routes.terms)} className="text-brand-strong underline">
                  Terms &amp; Conditions
                </Link>{" "}
                and the{" "}
                <Link href={localePath(locale, routes.privacy)} className="text-brand-strong underline">
                  Privacy Policy
                </Link>
                .
              </>
            ) : (
              <>
                আমি{" "}
                <Link href={localePath(locale, routes.terms)} className="text-brand-strong underline">
                  শর্তাবলি
                </Link>{" "}
                ও{" "}
                <Link href={localePath(locale, routes.privacy)} className="text-brand-strong underline">
                  গোপনীয়তা নীতি
                </Link>{" "}
                মেনে নিচ্ছি।
              </>
            )
          }
        />

        <Button type="submit" fullWidth size="lg" icon="arrow-right" disabled={busy}>
          {en ? "Continue" : "চালিয়ে যান"}
        </Button>
      </form>

      <GoogleSignIn locale={locale} returnTo={returnTo} />
    </AuthShell>
  );
}

export { PENDING_KEY };
