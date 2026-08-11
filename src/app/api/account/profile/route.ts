import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

/**
 * PUT { fullName, gender, dateOfBirth } → update the signed-in user's profile.
 *
 * The backend derives the user from the token, so there is no id in the body
 * and nothing to tamper with.
 *
 * WHY v2/web/profile AND NOT THE APP'S PUT /api/user
 * That route writes exactly `fullName`, `email` and `dateOfBirth`. It has no
 * `gender` column in its update, so gender would be silently dropped — and it
 * writes `email` straight onto the account without verifying it, which is the
 * state that produced duplicate accounts and that migration 010's unique index
 * now rejects outright.
 *
 * `email` is therefore not accepted by this handler at all. An address reaches
 * an account only through v2/web/email/verify, which requires a code proving
 * the mailbox.
 *
 * The app route is left exactly as it is: the shipped app depends on it.
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
    const gender = typeof body.gender === "string" ? body.gender.trim() : "";
    const dateOfBirth = typeof body.dateOfBirth === "string" ? body.dateOfBirth : "";

    if (!fullName) {
        return NextResponse.json({ ok: false, message: "Full name is required" }, { status: 400 });
    }
    /*
     * `email` is deliberately not accepted here.
     *
     * It used to be forwarded, which wrote an unverified address straight onto
     * the account — the exact state that made the Google handler create
     * duplicates, and that migration 010's unique index now rejects outright.
     * An address only reaches an account through v2/web/email/verify, which
     * requires a code proving the mailbox.
     */
    const GENDERS = ["male", "female", "other", "prefer_not_to_say"];
    if (gender && !GENDERS.includes(gender)) {
        return NextResponse.json(
            { ok: false, message: "Choose one of the listed options" },
            { status: 400 },
        );
    }

    if (!dateOfBirth) {
        return NextResponse.json({ ok: false, message: "Date of birth is required" }, { status: 400 });
    }

    const res = await apiRequest("v2/web/profile", {
        method: "POST",
        token,
        revalidate: 0,
        body: { fullName, dateOfBirth, ...(gender ? { gender } : {}) },
    });

    if (!res.ok) {
        return NextResponse.json(
            { ok: false, message: res.error },
            { status: res.status === 0 ? 503 : res.status },
        );
    }

    return NextResponse.json({ ok: true });
}
