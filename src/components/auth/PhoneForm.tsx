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
 * This is sign-in AND sign-up. A number with no account gets one when the code
 * verifies, and is sent straight to the name-and-gender step. It used to refuse
 * an unknown number and point at the app stores; registration on the web is now
 * allowed, and the financial bar (a verified NID before any booking) is what
 * still holds.
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
          ? "New or returning — the same number works either way. We send a code by SMS; there is no password to remember."
          : "নতুন হোন বা আগের, একই নম্বরেই কাজ হবে। এসএমএসে কোড পাঠানো হবে; পাসওয়ার্ড মনে রাখতে হবে না।"
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
