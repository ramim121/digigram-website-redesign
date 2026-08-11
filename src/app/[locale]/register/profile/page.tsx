import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProfileForms } from "@/components/auth/ProfileForms";
import { fetchBankAccounts } from "@/lib/account.server";
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
    path: routes.registerProfile,
    title: locale === "en" ? "Complete your profile" : "প্রোফাইল সম্পন্ন করুন",
    description:
      locale === "en"
        ? "Add your name and district so we can show you the right projects."
        : "নাম ও জেলা যোগ করুন, যাতে আমরা উপযুক্ত প্রকল্প দেখাতে পারি।",
    noindex: true,
  });
}

/** Account data, never cached or prerendered. See the note on the account page. */
export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const user = await getSessionUser();
  if (!user) {
    // Send them back to the profile form once they are in, rather than to a
    // generic landing page — they asked for this URL.
    redirect(loginUrlFor(localePath(locale, routes.login), localePath(locale, routes.registerProfile)));
  }

  const banks = await fetchBankAccounts(user.idUsers);

  return (
    <div className="container-page py-12 lg:py-16">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900">
        {locale === "en" ? "Complete your profile" : "প্রোফাইল সম্পূর্ণ করুন"}
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        {locale === "en"
          ? "A verified contact and a verified NID are what an investment needs. Everything else can wait."
          : "বিনিয়োগের জন্য দরকার একটি যাচাইকৃত যোগাযোগ ও যাচাইকৃত এনআইডি। বাকি সব পরে করলেও চলবে।"}
      </p>
      <div className="mt-8 max-w-2xl">
        <ProfileForms locale={locale} user={user} hasBank={(banks?.length ?? 0) > 0} />
      </div>
    </div>
  );
}
