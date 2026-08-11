import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

/**
 * POST → end the session.
 *
 * POST rather than GET on purpose: a GET logout can be triggered by any image
 * or link on another site, and by a prefetcher, which signs people out at
 * random. The backend has no token-revocation list, so this clears the cookie —
 * the token itself stays valid until it expires, which is why it is httpOnly
 * and never handed to client script in the first place.
 */
export async function POST() {
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
}
