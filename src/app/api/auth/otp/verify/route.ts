import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { setSessionCookie, type SessionUser } from "@/lib/auth/session";

/**
 * POST { phone, otp } → verify the code and open a session.
 *
 * The backend's token is written straight into an httpOnly cookie and is never
 * returned in the response body, so no client script ever sees it.
 *
 * Calls `v2/web/otp` (PUT), which signs in an existing account and will not
 * create one — the no-signup-on-the-web rule lives on the backend, not in this
 * handler, so it holds however the endpoint is reached.
 */
export async function POST(request: Request) {
    let phone: unknown;
    let otp: unknown;
    try {
        ({ phone, otp } = await request.json());
    } catch {
        return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
    }

    if (typeof phone !== "string" || typeof otp !== "string" || !phone.trim() || !otp.trim()) {
        return NextResponse.json(
            { ok: false, message: "Phone number and code are required" },
            { status: 400 },
        );
    }

    const res = await apiRequest<{ token?: string; user?: SessionUser }>("v2/web/otp", {
        method: "PUT",
        body: { phone: phone.trim(), otp: otp.trim() },
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

    // The token is unwrapped from the envelope alongside `user`, so read it off
    // the same object the backend returned.
    const payload = res.data as { token?: string; user?: SessionUser } | undefined;
    const token = payload?.token;
    if (!token) {
        return NextResponse.json(
            { ok: false, message: "Sign-in failed. Please try again." },
            { status: 502 },
        );
    }

    await setSessionCookie(token);

    // Only non-sensitive display fields go back to the browser.
    return NextResponse.json({
        ok: true,
        user: payload?.user
            ? { fullName: payload.user.fullName, phoneNumber: payload.user.phoneNumber }
            : null,
    });
}
