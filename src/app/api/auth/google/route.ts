import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { setSessionCookie, type SessionUser } from "@/lib/auth/session";

/**
 * POST { idToken } → exchange a Google ID token for a session.
 *
 * The browser gets the ID token from Google Identity Services and posts it
 * here; this handler forwards it to `v2/web/google`, which verifies the
 * signature against the configured client id server-side. A token is never
 * trusted because the client said so.
 *
 * As with OTP, the backend route signs in existing accounts only. Someone who
 * has never registered in the Shathi app gets `NOT_REGISTERED` and the
 * download-the-app panel, not a new account.
 */
export async function POST(request: Request) {
    let idToken: unknown;
    try {
        ({ idToken } = await request.json());
    } catch {
        return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
    }

    if (typeof idToken !== "string" || !idToken.trim()) {
        return NextResponse.json({ ok: false, message: "Missing Google token" }, { status: 400 });
    }

    const res = await apiRequest<{ token?: string; user?: SessionUser; isNew?: boolean; needsProfile?: boolean }>("v2/web/google", {
        method: "POST",
        body: { idToken },
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

    const payload = res.data as
        | { token?: string; user?: SessionUser; isNew?: boolean; needsProfile?: boolean }
        | undefined;
    if (!payload?.token) {
        return NextResponse.json(
            { ok: false, message: "Sign-in failed. Please try again." },
            { status: 502 },
        );
    }

    await setSessionCookie(payload.token);

    return NextResponse.json({
        ok: true,
        isNew: Boolean(payload?.isNew),
        needsProfile: Boolean(payload?.needsProfile),
        user: payload.user
            ? { fullName: payload.user.fullName, phoneNumber: payload.user.phoneNumber }
            : null,
    });
}
