import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

/**
 * POST { code } | { token } → confirm an email address.
 *
 * Two shapes, because the two challenges arrive differently.
 *
 * The 6-digit code needs the session, so it is scoped to one account and cannot
 * be replayed against another. The link token identifies the challenge by
 * itself and deliberately does not require a session — that is what lets it
 * work when the mail app opens a browser with no cookie, which is the whole
 * reason a link is offered.
 */
export async function POST(request: Request) {
    let code: unknown;
    let token: unknown;
    try {
        ({ code, token } = await request.json());
    } catch {
        return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
    }

    const usingLink = typeof token === "string" && token.trim().length > 0;

    if (!usingLink && (typeof code !== "string" || !code.trim())) {
        return NextResponse.json({ ok: false, message: "Enter the code" }, { status: 400 });
    }

    const session = usingLink ? null : await getSessionToken();
    if (!usingLink && !session) {
        return NextResponse.json({ ok: false, message: "Sign in first" }, { status: 401 });
    }

    const res = await apiRequest<{ email?: string }>("v2/web/email/verify", {
        method: "POST",
        ...(session ? { token: session } : {}),
        body: usingLink ? { token: String(token).trim() } : { code: String(code).trim() },
        revalidate: 0,
    });

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

    return NextResponse.json({ ok: true, email: res.data?.email ?? null });
}
