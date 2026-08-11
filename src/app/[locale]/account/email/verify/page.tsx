import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, Note } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { apiRequest } from "@/lib/api/client";
import { buildMetadata } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * Where a verification link lands.
 *
 * DELIBERATELY WORKS WITHOUT A SESSION.
 * The link is opened from a mail app, which usually launches a browser that has
 * no cookie for this site — often a completely different browser from the one
 * the person was using. Requiring a session here would break the link for
 * exactly the people it exists to serve.
 *
 * That is safe because the token is 32 random bytes and identifies the
 * challenge by itself; it authorises nothing but confirming the one address it
 * was issued for, and it is consumed on use.
 *
 * The exchange happens server-side on render rather than in a client effect, so
 * the page is correct on the first byte and cannot double-submit.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale: raw } = await params;
    const locale = (isLocale(raw) ? raw : "en") as Locale;
    return buildMetadata({
        locale,
        path: "/account/email/verify",
        title: locale === "en" ? "Confirm your email address" : "ইমেইল ঠিকানা নিশ্চিত করুন",
        description: "",
        noindex: true,
    });
}

export default async function VerifyEmailPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ token?: string }>;
}) {
    const { locale: raw } = await params;
    if (!isLocale(raw)) notFound();
    const locale = raw as Locale;
    const en = locale === "en";

    const { token } = await searchParams;

    let state: "ok" | "expired" | "invalid" | "taken" = "invalid";
    let email: string | null = null;

    if (token) {
        const res = await apiRequest<{ email?: string }>("v2/web/email/verify", {
            method: "POST",
            body: { token },
            revalidate: 0,
        });

        if (res.ok) {
            state = "ok";
            email = res.data?.email ?? null;
        } else if (res.code === "EXPIRED") {
            state = "expired";
        } else if (res.code === "TAKEN") {
            state = "taken";
        }
    }

    const copy = {
        ok: {
            icon: "check-circle" as const,
            title: en ? "Email address confirmed" : "ইমেইল ঠিকানা নিশ্চিত হয়েছে",
            body: en
                ? `${email ?? "Your address"} is verified. You can now sign in with it as well as your phone number.`
                : `${email ?? "আপনার ঠিকানা"} যাচাই হয়েছে। এখন ফোন নম্বরের পাশাপাশি এটি দিয়েও লগ ইন করতে পারবেন।`,
        },
        expired: {
            icon: "alert-triangle" as const,
            title: en ? "This link has expired" : "লিংকটির মেয়াদ শেষ",
            body: en
                ? "Verification links are short-lived on purpose. Open your profile and ask for a new one — it takes a moment."
                : "যাচাই লিংক ইচ্ছাকৃতভাবেই স্বল্পমেয়াদি। প্রোফাইলে গিয়ে নতুন একটি চান — এক মুহূর্তের কাজ।",
        },
        taken: {
            icon: "alert-triangle" as const,
            title: en ? "That address is now in use" : "ঠিকানাটি এখন ব্যবহৃত হচ্ছে",
            body: en
                ? "Another Shathi account claimed this address while the link was waiting. Open your profile to join the two accounts together."
                : "লিংকটি অপেক্ষায় থাকা অবস্থায় অন্য একটি সাথী অ্যাকাউন্ট এই ঠিকানাটি নিয়েছে। দুটি অ্যাকাউন্ট জোড়া দিতে প্রোফাইলে যান।",
        },
        invalid: {
            icon: "alert-triangle" as const,
            title: en ? "This link is not valid" : "লিংকটি বৈধ নয়",
            body: en
                ? "It may already have been used, or the address may have been confirmed another way. Check your profile — if it still says unverified, ask for a new code."
                : "এটি হয়তো আগেই ব্যবহৃত হয়েছে, অথবা ঠিকানাটি অন্যভাবে নিশ্চিত হয়েছে। প্রোফাইল দেখুন — এখনও অযাচাইকৃত দেখালে নতুন কোড চান।",
        },
    }[state];

    return (
        <div className="container-page flex min-h-[60vh] items-center py-16">
            <Card className="mx-auto max-w-lg p-8">
                <Icon
                    name={copy.icon}
                    size={28}
                    className={state === "ok" ? "text-brand-strong" : "text-amber-600"}
                />
                <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-stone-900">
                    {copy.title}
                </h1>
                <p className="mt-3 leading-relaxed text-stone-600">{copy.body}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href={localePath(locale, routes.account)}
                        className="inline-flex items-center gap-2 rounded-md bg-brand-strong px-4 py-2 text-sm font-semibold text-white"
                    >
                        {en ? "My account" : "আমার অ্যাকাউন্ট"}
                        <Icon name="arrow-right" size={16} />
                    </Link>
                    <Link
                        href={localePath(locale, routes.registerProfile)}
                        className="inline-flex items-center rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800"
                    >
                        {en ? "My profile" : "আমার প্রোফাইল"}
                    </Link>
                </div>

                {state === "ok" && (
                    <Note tone="info" icon="info" className="mt-6">
                        {en
                            ? "If you were signed in on another device, that session is unaffected."
                            : "অন্য ডিভাইসে লগ ইন থাকলে সেই সেশনে কোনো প্রভাব পড়বে না।"}
                    </Note>
                )}
            </Card>
        </div>
    );
}
