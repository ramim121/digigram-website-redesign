import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { getSessionToken, setSessionCookie } from "@/lib/auth/session";

/**
 * POST { step, channel, value, code?, survivorId? } → account merge.
 *
 * Three steps, proxied to `v2/web/account/merge`:
 *   check   — what a merge would do, before any code is sent
 *   request — send a code to the *other* account's own channel
 *   confirm — verify it and carry the merge out
 *
 * WHY THE SESSION IS REPLACED ON CONFIRM
 * The merge may keep the other account, not this one — the survivor is whichever
 * holds more records, because that is the one where fewest money rows have to
 * move. When that happens the cookie names an account that can no longer sign
 * in, and the person would be silently logged out by their own successful
 * merge. The backend returns a token for the survivor and it is written here.
 */
export async function POST(request: Request) {
    const session = await getSessionToken();
    if (!session) {
        return NextResponse.json({ ok: false, message: "Sign in first" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
    }

    const step = String(body.step ?? "");
    if (!["check", "request", "confirm"].includes(step)) {
        return NextResponse.json({ ok: false, message: "Unknown step" }, { status: 400 });
    }
    if (typeof body.value !== "string" || !body.value.trim()) {
        return NextResponse.json({ ok: false, message: "Enter a value" }, { status: 400 });
    }
    if (body.channel !== "email" && body.channel !== "phone") {
        return NextResponse.json({ ok: false, message: "Unknown channel" }, { status: 400 });
    }

    const res = await apiRequest<{
        token?: string;
        survivorId?: number;
        youAreSurvivor?: boolean;
        recordsMoving?: number;
        recordsMoved?: number;
    }>("v2/web/account/merge", {
        method: "POST",
        token: session,
        body: {
            step,
            channel: body.channel,
            value: String(body.value).trim(),
            ...(body.code ? { code: String(body.code).trim() } : {}),
            ...(body.survivorId ? { survivorId: Number(body.survivorId) } : {}),
        },
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

    const data = res.data ?? {};

    if (step === "confirm" && data.token) {
        await setSessionCookie(data.token);
    }

    // The token never goes to the browser.
    const { token: _discard, ...safe } = data;
    void _discard;
    return NextResponse.json({ ok: true, ...safe });
}
