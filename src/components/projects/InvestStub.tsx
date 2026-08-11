"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/components/auth/session";
import { Card, Note } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatBdt, localePath, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";
import { loginUrlFor } from "@/lib/auth/returnTo";

/**
 * The one auth-gated screen on the site.
 *
 * A logged-out visitor is bounced to /login with the intent recorded, so login
 * returns them here rather than to the homepage.
 */
export function InvestStub({
  locale,
  slug,
  title,
  unitAmount,
  unitsRemaining,
}: {
  locale: Locale;
  slug: string;
  title: string;
  unitAmount: number;
  unitsRemaining: number;
}) {
  const en = locale === "en";
  const router = useRouter();
  const { user, ready, setIntent } = useSession();

  useEffect(() => {
    if (!ready || user) return;
    const target = localePath(locale, routes.invest(slug));
    setIntent(target);
    // Come back to the invest page, not the account page — this visitor was
    // part-way through investing in a specific project.
    router.replace(loginUrlFor(localePath(locale, routes.login), target));
  }, [ready, user, router, setIntent, locale, slug]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5 pt-24">
        <p className="text-sm text-stone-500">
          {en ? "Checking your session…" : "আপনার সেশন যাচাই করা হচ্ছে…"}
        </p>
      </div>
    );
  }

  return (
    <div data-brand="shathi" className="bg-brand-canvas pt-28 pb-20 lg:pt-36">
      <div className="container-prose">
        <Link
          href={localePath(locale, routes.project(slug))}
          className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-brand-strong"
        >
          <Icon name="arrow-left" size={16} />
          {en ? "Back to project" : "প্রকল্পে ফিরুন"}
        </Link>

        <h1 className="mt-5 font-display text-3xl leading-tight font-extrabold tracking-tight text-stone-900 lg:text-4xl">
          {en ? "Complete your investment" : "আপনার বিনিয়োগ সম্পন্ন করুন"}
        </h1>
        <p className="mt-3 text-lg text-stone-600">{title}</p>

        <Card className="mt-8 p-7">
          <dl className="divide-y divide-stone-100">
            <Line
              label={en ? "Signed in as" : "লগ ইন করেছেন"}
              value={`${user.name} · ${user.phone}`}
            />
            <Line
              label={en ? "Unit price" : "ইউনিট মূল্য"}
              value={formatBdt(unitAmount, locale, { variant: "data" })}
            />
            <Line
              label={en ? "Units available" : "উপলব্ধ ইউনিট"}
              value={String(unitsRemaining)}
            />
          </dl>

          <Note tone="info" icon="info" className="mt-6">
            {en
              ? "Web booking and payment are being finalised. Until then, investments complete inside the Shathi app — sign in there with this same phone number and your project selection will be waiting."
              : "ওয়েবে বুকিং ও পেমেন্ট চূড়ান্ত করা হচ্ছে। ততদিন পর্যন্ত বিনিয়োগ সম্পন্ন হয় সাথী অ্যাপে — একই ফোন নম্বর দিয়ে সেখানে লগ ইন করুন, আপনার নির্বাচিত প্রকল্প অপেক্ষায় থাকবে।"}
          </Note>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={site.app.playStore} external icon="download" iconPosition="left">
              {en ? "Continue in the Shathi app" : "সাথী অ্যাপে চালিয়ে যান"}
            </ButtonLink>
            <ButtonLink
              href={localePath(locale, routes.contact)}
              variant="secondary"
              icon="message-circle"
              iconPosition="left"
            >
              {en ? "Book by phone instead" : "ফোনে বুক করুন"}
            </ButtonLink>
          </div>
        </Card>

        <p className="mt-6 text-xs leading-relaxed text-stone-500">
          {en
            ? "Payment is accepted by bKash, Nagad, bank transfer, cheque collection or direct deposit. Returns are estimated, not guaranteed, and your capital is at risk."
            : "পেমেন্ট নেওয়া হয় বিকাশ, নগদ, ব্যাংক ট্রান্সফার, চেক সংগ্রহ বা সরাসরি জমার মাধ্যমে। রিটার্ন প্রাক্কলিত, নিশ্চিত নয়, এবং আপনার পুঁজি ঝুঁকিতে থাকে।"}
        </p>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-stone-500">{label}</dt>
      <dd className="font-display text-sm font-bold text-stone-900">{value}</dd>
    </div>
  );
}
