"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Note } from "@/components/ui/Primitives";
import { useSession } from "@/components/auth/session";
import { localePath, type Locale } from "@/lib/i18n";
import { routes, site } from "@/lib/site";

/**
 * Google sign-in.
 *
 * Uses Google Identity Services, which hands us an **ID token** — a JWT signed
 * by Google. It is posted to `/api/auth/google`, which forwards it to the
 * backend, which verifies the signature and audience server-side. Nothing is
 * trusted because the browser said it.
 *
 * SIGN-IN ONLY, NEVER SIGN-UP.
 * The backend route this reaches (`v2/web/google`) looks the account up and
 * refuses to create one. A Google account with no matching Shathi account gets
 * `NOT_REGISTERED`, and this component shows the download-the-app panel — the
 * same rule the phone form enforces.
 *
 * Renders nothing when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is unset, so a
 * misconfigured deploy shows one working sign-in path rather than a button that
 * fails on click.
 */

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const GSI_SRC = "https://accounts.google.com/gsi/client";

type CredentialResponse = { credential?: string };

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: CredentialResponse) => void;
                        ux_mode?: "popup" | "redirect";
                        auto_select?: boolean;
                        itp_support?: boolean;
                    }) => void;
                    renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
                    disableAutoSelect: () => void;
                };
            };
        };
    }
}

export function GoogleSignIn({ locale, returnTo }: { locale: Locale; returnTo?: string | null }) {
    const en = locale === "en";
    const { signIn, takeIntent } = useSession();

    const holder = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [notRegistered, setNotRegistered] = useState(false);
    const [busy, setBusy] = useState(false);

    const onCredential = useCallback(
        async (response: CredentialResponse) => {
            if (!response.credential) return;
            setBusy(true);
            setError(null);
            setNotRegistered(false);

            try {
                const res = await fetch("/api/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken: response.credential }),
                });
                const data = await res.json();

                if (!res.ok || !data.ok) {
                    if (data.code === "NOT_REGISTERED") {
                        setNotRegistered(true);
                        return;
                    }
                    setError(data.message ?? (en ? "Sign-in failed." : "লগ ইন ব্যর্থ হয়েছে।"));
                    return;
                }

                signIn({
                    phone: data.user?.phoneNumber ?? "",
                    name: data.user?.fullName ?? (en ? "Investor" : "বিনিয়োগকারী"),
                });

                // Same rule as the OTP path: the `next` parameter wins, then a
                // stored invest intent, then the account page. And the same
                // full document load — see the comment in `OtpForm` for why
                // `router.replace()` + `refresh()` is not reliable here.
                const intent = takeIntent();
                window.location.assign(returnTo ?? intent ?? localePath(locale, routes.account));
                return;
            } catch {
                setError(en ? "Network error. Please try again." : "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
            } finally {
                setBusy(false);
            }
        },
        [en, locale, signIn, takeIntent],
    );

    useEffect(() => {
        if (!CLIENT_ID) return;

        // The GSI script is loaded once per document; a second <script> would
        // re-initialise the library and detach the rendered button.
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
        const script = existing ?? document.createElement("script");

        function render() {
            if (!window.google || !holder.current) return;
            /*
             * `auto_select: false` and `disableAutoSelect()` together stop
             * Google silently signing the visitor in as whichever account the
             * browser happens to be holding.
             *
             * A caveat worth knowing: this is the ID-token flow, and it uses
             * the browser's *active* Google session. With one session signed
             * in, clicking the button uses that account without offering a
             * chooser — there is no "prompt=select_account" in this flow. To
             * pick a different account, the visitor signs out of Google or uses
             * another profile. If a chooser is a requirement, it needs the
             * authorization-code flow (`initCodeClient`) plus a backend
             * endpoint to exchange the code, which is a larger change than this.
             */
            window.google.accounts.id.disableAutoSelect();
            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: (response) => void onCredential(response),
                auto_select: false,
                itp_support: true,
            });
            window.google.accounts.id.renderButton(holder.current, {
                theme: "outline",
                size: "large",
                width: 320,
                text: "signin_with",
                locale: locale === "bn" ? "bn" : "en",
            });
        }

        if (existing && window.google) {
            render();
            return;
        }

        script.src = GSI_SRC;
        script.async = true;
        script.defer = true;
        script.addEventListener("load", render);
        if (!existing) document.head.appendChild(script);

        return () => script.removeEventListener("load", render);
    }, [locale, onCredential]);

    if (!CLIENT_ID) return null;

    return (
        <div className="mt-6">
            <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-stone-200" />
                <span className="font-display text-xs font-semibold tracking-wide text-stone-400 uppercase">
                    {en ? "or" : "অথবা"}
                </span>
                <span className="h-px flex-1 bg-stone-200" />
            </div>

            <div className="mt-5 flex justify-center" aria-busy={busy}>
                {/* Google renders its own button in here; it must be an empty
                    element it owns, so nothing else goes inside. */}
                <div ref={holder} />
            </div>

            <p className="mt-3 text-center text-xs text-stone-500">
                {en
                    ? "Signing in with Google also verifies your email address."
                    : "গুগল দিয়ে লগ ইন করলে আপনার ইমেইল ঠিকানাও যাচাই হয়ে যায়।"}
            </p>

            {error && (
                <p role="alert" className="mt-3 text-center text-sm font-medium text-danger">
                    {error}
                </p>
            )}

            {notRegistered && (
                <Note tone="warn" icon="alert-triangle" className="mt-4">
                    {en ? (
                        <>
                            No Shathi account is linked to that Google address. Accounts are created
                            in the Shathi app —{" "}
                            <a href={site.app.playStore} target="_blank" rel="noreferrer" className="underline">
                                Google Play
                            </a>{" "}
                            or{" "}
                            <a href={site.app.appStore} target="_blank" rel="noreferrer" className="underline">
                                App Store
                            </a>{" "}
                            — then sign in here.
                        </>
                    ) : (
                        <>
                            ওই গুগল ঠিকানার সঙ্গে কোনো সাথী অ্যাকাউন্ট যুক্ত নেই। অ্যাকাউন্ট তৈরি হয় সাথী
                            অ্যাপে —{" "}
                            <a href={site.app.playStore} target="_blank" rel="noreferrer" className="underline">
                                গুগল প্লে
                            </a>{" "}
                            বা{" "}
                            <a href={site.app.appStore} target="_blank" rel="noreferrer" className="underline">
                                অ্যাপ স্টোর
                            </a>{" "}
                            — তারপর এখানে লগ ইন করুন।
                        </>
                    )}
                </Note>
            )}
        </div>
    );
}
