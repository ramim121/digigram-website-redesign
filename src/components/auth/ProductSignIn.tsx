import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { getSessionUser } from "@/lib/auth/session";
import { localePath, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";
import { loginUrlFor } from "@/lib/auth/returnTo";

/**
 * Sign-in band for the two product pages.
 *
 * The website's account is a **Shathi** account — the same one the app issues —
 * so the invitation to sign in belongs on the product pages rather than only
 * behind a small header link. Someone reading about Shathi is exactly the
 * person who has, or needs, that account.
 *
 * Signed in, it becomes a way back into the account instead of a dead
 * repetition of something already done. A server component, so it knows which
 * of the two to render on the first byte.
 */
export async function ProductSignIn({
    locale,
    product,
}: {
    locale: Locale;
    product: "shathi" | "sheba";
}) {
    const en = locale === "en";
    const user = await getSessionUser();

    // Come back to this page after signing in, rather than dropping the reader
    // into the account area from the middle of a product story.
    const here = localePath(locale, product === "shathi" ? routes.shathi : routes.shathiSheba);
    const loginHref = loginUrlFor(localePath(locale, routes.login), here);
    const name = user?.fullName?.trim() || user?.phoneNumber || "";

    return (
        <Section tone="surface">
            <div className="container-page">
                <div
                    data-brand={product === "shathi" ? "shathi" : undefined}
                    className="overflow-hidden rounded-xl bg-brand-canvas p-8 lg:p-12"
                >
                    {user ? (
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div>
                                <p className="font-display text-xs font-bold tracking-widest text-brand-strong uppercase">
                                    {en ? "Signed in" : "লগ ইন করা আছে"}
                                </p>
                                <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-stone-900 lg:text-3xl">
                                    {en ? `Welcome back, ${name}` : `আবার স্বাগতম, ${name}`}
                                </h2>
                                <p className="mt-2 max-w-xl text-stone-600">
                                    {en
                                        ? "Your investments, bookings and payout account are in one place."
                                        : "আপনার বিনিয়োগ, বুকিং ও পরিশোধের অ্যাকাউন্ট এক জায়গাতেই।"}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={localePath(locale, routes.account)}
                                    className="inline-flex items-center gap-2 rounded-md bg-brand-strong px-5 py-3 font-display text-sm font-semibold text-white"
                                >
                                    {en ? "My investments" : "আমার বিনিয়োগ"}
                                    <Icon name="arrow-right" size={16} />
                                </Link>
                                <Link
                                    href={localePath(locale, routes.projects)}
                                    className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-5 py-3 font-display text-sm font-semibold text-stone-800"
                                >
                                    {en ? "Browse projects" : "প্রকল্প দেখুন"}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
                            <div>
                                <p className="font-display text-xs font-bold tracking-widest text-brand-strong uppercase">
                                    {en ? "Already with Shathi?" : "আগে থেকেই সাথীর সঙ্গে আছেন?"}
                                </p>
                                <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-stone-900 lg:text-3xl">
                                    {en
                                        ? "Log in with the number you registered in the app"
                                        : "অ্যাপে যে নম্বরে নিবন্ধন করেছেন সেটি দিয়ে লগ ইন করুন"}
                                </h2>
                                <p className="mt-3 max-w-xl leading-relaxed text-stone-600">
                                    {en
                                        ? "One account across the app and this site. No password — a code by SMS, or your Google account."
                                        : "অ্যাপ ও এই সাইটে একটিই অ্যাকাউন্ট। পাসওয়ার্ড নেই — এসএমএসে কোড, অথবা আপনার গুগল অ্যাকাউন্ট।"}
                                </p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        href={loginHref}
                                        className="inline-flex items-center gap-2 rounded-md bg-brand-strong px-5 py-3 font-display text-sm font-semibold text-white"
                                    >
                                        {en ? "Log in" : "লগ ইন"}
                                        <Icon name="arrow-right" size={16} />
                                    </Link>
                                    <a
                                        href={product === "sheba" && site.app.shebaPlayStore ? site.app.shebaPlayStore : site.app.playStore}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-5 py-3 font-display text-sm font-semibold text-stone-800"
                                    >
                                        <Icon name="download" size={16} />
                                        {en ? "New here? Register in the app" : "নতুন? অ্যাপে নিবন্ধন করুন"}
                                    </a>
                                </div>
                            </div>

                            <ul className="space-y-3">
                                {[
                                    en ? "Track every booking and payout" : "প্রতিটি বুকিং ও পরিশোধ দেখুন",
                                    en ? "Upload your payment receipt" : "পরিশোধের রসিদ আপলোড করুন",
                                    en ? "See the Shathi partners you back" : "আপনি যাঁদের পাশে আছেন সেই সাথীদের দেখুন",
                                ].map((line) => (
                                    <li key={line} className="flex items-start gap-3 text-sm text-stone-700">
                                        <Icon name="check-circle" size={18} className="mt-0.5 shrink-0 text-brand-strong" />
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
}
