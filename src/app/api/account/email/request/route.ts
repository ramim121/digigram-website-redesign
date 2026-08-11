import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

/**
 * POST { email, locale } → send a verification code to that address.
 *
 * Proxies `v2/web/email/request`. The session token is read from the httpOnly
 * cookie here and attached server-side, so the browser never handles it.
 *
 * The backend answers 409 TAKEN when a live account already holds the address.
 * That is not an error to swallow: it is the signal that this is a *merge*, and
 * the code is passed through so the UI can offer one.
 */
export async function POST(request: Request) {
    const token = await getSessionToken();
    if (!token) {
        return NextResponse.json({ ok: false, message: "Sign in first" }, { status: 401 });
    }

    let email: unknown;
    let locale: unknown;
    try {
        ({ email, locale } = await request.json());
    } catch {
        return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
    }

    if (typeof email !== "string" || !email.trim()) {
        return NextResponse.json(
            { ok: false, message: "Enter an email address" },
            { status: 400 },
        );
    }

    const res = await apiRequest<{ expiresInSeconds?: number; alreadyVerified?: boolean }>(
        "v2/web/email/request",
        {
            method: "POST",
            token,
            body: { email: email.trim(), locale: locale === "bn" ? "bn" : "en" },
            revalidate: 0,
        },
    );

    if (!res.ok) {
        return NextResponse.json(
            {
                ok: false,
                code: res.code ?? null,
                message:
                    res.status === 0
                        ? "We could not reach the server. Please try again."
                        : res.error,
            },
            { status: res.status === 0 ? 503 : res.status },
        );
    }

    return NextResponse.json({ ok: true, ...(res.data ?? {}) });
}
