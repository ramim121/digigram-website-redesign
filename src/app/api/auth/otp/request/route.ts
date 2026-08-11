import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";

/**
 * POST { phone } → ask the backend to SMS a sign-in code.
 *
 * Proxied rather than called from the browser so the backend origin stays out
 * of client JavaScript and the response can be normalised to exactly what the
 * form needs.
 *
 * Calls `v2/web/otp`, which refuses numbers that have no account — the site
 * must not create one. That refusal comes back as `NOT_REGISTERED`, which the
 * form turns into the "download the app to register" panel.
 */
export async function POST(request: Request) {
    let phone: unknown;
    try {
        ({ phone } = await request.json());
    } catch {
        return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
    }

    if (typeof phone !== "string" || !phone.trim()) {
        return NextResponse.json({ ok: false, message: "Phone number is required" }, { status: 400 });
    }

    const res = await apiRequest<{ message?: string; code?: string; expiresInSeconds?: number }>(
        "v2/web/otp",
        { method: "POST", body: { phone: phone.trim() }, revalidate: 0 },
    );

    if (!res.ok) {
        // `status: 0` is this site's own timeout/network failure, not a backend
        // verdict — say so rather than blaming the user's number.
        const status = res.status === 0 ? 503 : res.status;
        return NextResponse.json(
            {
                ok: false,
                code: res.code ?? null,
                message:
                    res.status === 0
                        ? "We could not reach the server. Please try again."
                        : res.error,
            },
            { status },
        );
    }

    return NextResponse.json({ ok: true, expiresInSeconds: res.data?.expiresInSeconds ?? null });
}
