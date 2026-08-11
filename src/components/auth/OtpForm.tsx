"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { PENDING_KEY } from "@/components/auth/PhoneForm";
import { useSession } from "@/components/auth/session";
import { localePath, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * Step 2 — enter the SMS code.
 *
 * Four boxes, not six: the backend generates a 4-digit code
 * (`crypto.randomInt(1000, 10000)`). The form used to ask for six, which no
 * code could ever satisfy.
 *
 * The real verification happens in `/api/auth/otp/verify`, which exchanges the
 * code for a session cookie. Attempt counting, expiry and lockout are enforced
 * by the backend — what is shown here is a reflection of its replies, not an
 * independent check, so the two cannot disagree.
 */

const LENGTH = 4;
const RESEND_SECONDS = 60;
const EXPIRY_SECONDS = 300;

export function OtpForm({ locale, returnTo }: { locale: Locale; returnTo?: string | null }) {
  const en = locale === "en";
  const router = useRouter();
  const { signIn, takeIntent } = useSession();

  const [phone, setPhone] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [expiresIn, setExpiresIn] = useState(EXPIRY_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(PENDING_KEY);
      if (!stored) {
        router.replace(localePath(locale, routes.login));
        return;
      }
      setPhone(stored);
    } catch {
      router.replace(localePath(locale, routes.login));
    }
  }, [router, locale]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendIn((v) => (v > 0 ? v - 1 : 0));
      setExpiresIn((v) => (v > 0 ? v - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const expired = expiresIn === 0;
  const code = digits.join("");

  function setDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((current) => current.map((d, i) => (i === index ? "" : d)));
      return;
    }
    setDigits((current) => {
      const next = [...current];
      // Pasting the whole code into any box fills the row.
      clean.split("").forEach((char, offset) => {
        if (index + offset < LENGTH) next[index + offset] = char;
      });
      return next;
    });
    const jump = Math.min(index + clean.length, LENGTH - 1);
    inputs.current[jump]?.focus();
  }

  function onKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  const clear = useCallback(() => {
    setDigits(Array(LENGTH).fill(""));
    inputs.current[0]?.focus();
  }, []);

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!phone) return;
    if (code.length < LENGTH) {
      setError(en ? "Enter all four digits." : "চারটি সংখ্যাই দিন।");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: code }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        // The backend's message already says how many attempts remain, or that
        // the code expired — showing our own guess instead would be wrong the
        // moment the two drift apart.
        setError(data.message ?? (en ? "Incorrect code." : "ভুল কোড।"));
        clear();
        return;
      }

      // The cookie is already set; this only updates what client components
      // render. The cookie is the authority, not this.
      signIn({
        phone,
        name: data.user?.fullName ?? (en ? "Investor" : "বিনিয়োগকারী"),
      });

      try {
        window.sessionStorage.removeItem(PENDING_KEY);
      } catch {
        /* ignore */
      }

      /*
       * Back to wherever the visitor started, falling back to the account
       * page. `takeIntent()` is kept as a second source because the invest
       * flow may have stored one, but the `next` parameter wins: it is the
       * more specific and more recent signal.
       */
      const intent = takeIntent();
      const destination = returnTo ?? intent ?? localePath(locale, routes.account);

      /*
       * A FULL DOCUMENT LOAD, NOT router.replace().
       *
       * The session is an httpOnly cookie set by the response we just read.
       * `router.replace()` can serve the destination from the client router
       * cache, which was filled while the visitor was still signed out — so the
       * page renders signed-out and the whole thing reads as "login did
       * nothing". Pairing it with `router.refresh()` was meant to cover that,
       * but the two race: refresh re-fetches the *current* route and can land
       * after the replace.
       *
       * A real navigation re-runs every server component with the cookie
       * attached. One page load at sign-in is a fair price for a destination
       * that is correct every time.
       */
      window.location.assign(destination);
      return;
    } catch {
      setError(en ? "Network error. Please try again." : "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (!phone || resendIn > 0) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message ?? (en ? "Could not resend the code." : "কোড আবার পাঠানো যায়নি।"));
        return;
      }
      setResendIn(RESEND_SECONDS);
      setExpiresIn(data.expiresInSeconds ?? EXPIRY_SECONDS);
      clear();
    } catch {
      setError(en ? "Network error. Please try again." : "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  const masked = phone ? `${phone.slice(0, 5)}••••${phone.slice(-2)}` : "";

  return (
    <AuthShell
      locale={locale}
      title={en ? "Enter the code" : "কোডটি দিন"}
      lead={
        en ? (
          <>
            We sent a 4-digit code to <strong className="text-stone-800">{masked}</strong>.{" "}
            <Link href={localePath(locale, routes.login)} className="font-semibold text-brand-strong">
              Change number
            </Link>
          </>
        ) : (
          <>
            <strong className="text-stone-800">{masked}</strong> নম্বরে ৪ সংখ্যার কোড পাঠানো হয়েছে।{" "}
            <Link href={localePath(locale, routes.login)} className="font-semibold text-brand-strong">
              নম্বর বদলান
            </Link>
          </>
        )
      }
    >
      <form onSubmit={verify} noValidate>
        <fieldset disabled={busy}>
          <legend className="sr-only">
            {en ? "4-digit verification code" : "৪ সংখ্যার যাচাই কোড"}
          </legend>
          <div className="flex justify-between gap-3" dir="ltr">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(node) => {
                  inputs.current[index] = node;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={LENGTH}
                value={digit}
                aria-label={en ? `Digit ${index + 1}` : `${index + 1} নম্বর সংখ্যা`}
                aria-invalid={error ? true : undefined}
                onChange={(event) => setDigit(index, event.target.value)}
                onKeyDown={(event) => onKeyDown(index, event)}
                onFocus={(event) => event.target.select()}
                className="h-14 w-full rounded-md border border-stone-300 text-center font-display text-xl font-bold text-stone-900 focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none disabled:bg-stone-100"
              />
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        {!error && !expired && (
          <p className="mt-3 text-sm text-stone-500">
            {en
              ? `Code expires in ${Math.floor(expiresIn / 60)}:${String(expiresIn % 60).padStart(2, "0")}`
              : `কোডের মেয়াদ শেষ হবে ${Math.floor(expiresIn / 60)}:${String(expiresIn % 60).padStart(2, "0")} মিনিটে`}
          </p>
        )}

        <Button type="submit" fullWidth size="lg" className="mt-6" disabled={busy}>
          {en ? "Verify and continue" : "যাচাই করে চালিয়ে যান"}
        </Button>

        <div className="mt-5 text-sm">
          {resendIn > 0 ? (
            <span className="text-stone-500">
              {en ? `Resend code in ${resendIn}s` : `${resendIn} সেকেন্ড পর আবার পাঠানো যাবে`}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => void resend()}
              disabled={busy}
              className="font-display font-semibold text-brand-strong hover:underline disabled:opacity-50"
            >
              {en ? "Resend code" : "কোড আবার পাঠান"}
            </button>
          )}
        </div>
      </form>
    </AuthShell>
  );
}
