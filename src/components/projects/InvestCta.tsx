"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/components/auth/session";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatBdt, localePath, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";
import { loginUrlFor } from "@/lib/auth/returnTo";

/**
 * The invest entry point, in both session states.
 *
 * Logged out the CTA reads "Log in to invest" and stores the return-to-intent
 * URL before sending the visitor to the phone screen, so login never dead-ends
 * on the homepage. Logged in it goes straight to the invest step.
 *
 * Browsing is never gated — only this action is.
 */
export function InvestCta({
  slug,
  locale,
  soldOut,
  size = "lg",
  fullWidth = true,
}: {
  slug: string;
  locale: Locale;
  soldOut: boolean;
  size?: "md" | "lg";
  fullWidth?: boolean;
}) {
  const en = locale === "en";
  const router = useRouter();
  const { user, ready, setIntent } = useSession();

  if (soldOut) {
    return (
      <Button variant="primary" size={size} fullWidth={fullWidth} disabled>
        {en ? "Fully funded" : "পূর্ণ বিনিয়োগকৃত"}
      </Button>
    );
  }

  if (!ready) {
    return (
      <Button variant="primary" size={size} fullWidth={fullWidth} disabled>
        {en ? "Invest now" : "এখনই বিনিয়োগ করুন"}
      </Button>
    );
  }

  if (!user) {
    const target = localePath(locale, routes.invest(slug));
    return (
      <Button
        variant="primary"
        size={size}
        fullWidth={fullWidth}
        icon="arrow-right"
        onClick={() => {
          // `setIntent` is kept as a second channel, but `?next=` is the one
          // that survives a reload or a login link opened in a new tab.
          setIntent(target);
          router.push(loginUrlFor(localePath(locale, routes.login), target));
        }}
      >
        {en ? "Log in to invest" : "বিনিয়োগ করতে লগ ইন করুন"}
      </Button>
    );
  }

  return (
    <ButtonLink
      href={localePath(locale, routes.invest(slug))}
      variant="primary"
      size={size}
      fullWidth={fullWidth}
      icon="arrow-right"
    >
      {en ? "Invest now" : "এখনই বিনিয়োগ করুন"}
    </ButtonLink>
  );
}

/**
 * Mobile sticky bar: unit price on the left, the invest action on the right.
 * Sits above the safe-area inset so it clears an iPhone home indicator.
 */
export function MobileInvestBar({
  slug,
  locale,
  soldOut,
  unitAmount,
}: {
  slug: string;
  locale: Locale;
  soldOut: boolean;
  unitAmount: number;
}) {
  const en = locale === "en";
  return (
    <div
      data-brand="shathi"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center gap-4 px-5 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-stone-500">{en ? "Per unit" : "প্রতি ইউনিট"}</p>
          <p className="font-display text-lg font-extrabold text-brand tabular">
            {formatBdt(unitAmount, locale, { variant: "data" })}
          </p>
        </div>
        <div className="ms-auto shrink-0">
          <InvestCta slug={slug} locale={locale} soldOut={soldOut} size="md" fullWidth={false} />
        </div>
      </div>
    </div>
  );
}

/** Secondary action shown under the primary CTA on the fact card. */
export function AppFallbackLink({ locale }: { locale: Locale }) {
  return (
    <ButtonLink
      href={site.app.playStore}
      external
      variant="secondary"
      size="md"
      fullWidth
      icon="download"
      iconPosition="left"
    >
      {locale === "en" ? "Download the Shathi app" : "সাথী অ্যাপ ডাউনলোড করুন"}
    </ButtonLink>
  );
}
