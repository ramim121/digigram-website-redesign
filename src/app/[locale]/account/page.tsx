import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AccountOverview } from "@/components/auth/AccountOverview";
import { fetchBankAccounts } from "@/lib/account.server";
import { fetchMyBookings } from "@/lib/bookings.server";
import { getSessionUser } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";
import { loginUrlFor } from "@/lib/auth/returnTo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  return buildMetadata({
    locale,
    path: routes.account,
    title: locale === "en" ? "My investments" : "আমার বিনিয়োগ",
    description:
      locale === "en"
        ? "Your active and matured investments, statements and payout records."
        : "আপনার চলমান ও মেয়াদপূর্ণ বিনিয়োগ, স্টেটমেন্ট ও পরিশোধের নথি।",
    noindex: true,
  });
}

/**
 * Never prerendered and never cached.
 *
 * Without this the page can be captured at build time — when there is no
 * session — and that snapshot, a redirect to the login screen, would be served
 * to signed-in visitors too. Reading `cookies()` already opts most requests out
 * of caching, but stating it here makes the guarantee explicit rather than a
 * side effect of an implementation detail.
 */
export const dynamic = "force-dynamic";

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  // Gated on the server: an unauthenticated request never receives account
  // markup at all, rather than receiving it and hiding it in the browser.
  const user = await getSessionUser();
  if (!user) {
    // Send them back to the account page once they are in, rather than to a
    // generic landing page — they asked for this URL.
    redirect(loginUrlFor(localePath(locale, routes.login), localePath(locale, routes.account)));
  }

  const [banks, bookings] = await Promise.all([fetchBankAccounts(user.idUsers), fetchMyBookings()]);

  return <AccountOverview locale={locale} user={user} banks={banks} bookings={bookings} />;
}
