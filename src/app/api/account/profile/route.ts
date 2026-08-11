import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

/**
 * PUT { fullName, email?, dateOfBirth } → update the signed-in user's profile.
 *
 * The backend derives the user from the token, so there is no id in the body
 * and nothing to tamper with.
 *
 * NOTE ON EMAIL
 * Saving an address does **not** verify it — `PUT /api/user` leaves
 * `emailVerified` untouched, and only signing in with Google sets it. The UI
 * must not imply otherwise, or someone will believe they have satisfied the
 * booking requirement when they have not.
 */
export async function PUT(request: Request) {
    const token = await getSessionToken();
    if (!token) {
        return NextResponse.json({ ok: false, message: "Not signed in" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
    }

    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const dateOfBirth = typeof body.dateOfBirth === "string" ? body.dateOfBirth : "";

    if (!fullName) {
        return NextResponse.json({ ok: false, message: "Full name is required" }, { status: 400 });
    }
    if (!dateOfBirth) {
        return NextResponse.json({ ok: false, message: "Date of birth is required" }, { status: 400 });
    }

    const res = await apiRequest("user", {
        method: "PUT",
        token,
        revalidate: 0,
        // `email` is sent only when present: the backend runs a
        // case-insensitive uniqueness check, and an empty string would collide
        // with every other account that has no address.
        body: { fullName, dateOfBirth, ...(email ? { email } : {}) },
    });

    if (!res.ok) {
        return NextResponse.json(
            { ok: false, message: res.error },
            { status: res.status === 0 ? 503 : res.status },
        );
    }

    return NextResponse.json({ ok: true });
}
