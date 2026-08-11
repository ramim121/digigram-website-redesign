import "server-only";

import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api/client";

/**
 * Session handling for the website.
 *
 * THE TOKEN NEVER REACHES CLIENT JAVASCRIPT.
 * The Shathi JWT lives in an httpOnly cookie. Browser code cannot read it, so a
 * cross-site scripting bug in any third-party script cannot walk off with a
 * 30-day credential. Every authenticated backend call is made by a route
 * handler or a server component that reads the cookie here — which is the whole
 * reason the site talks to the backend through its own `/api/auth/*` handlers
 * rather than calling the Shathi API from the browser.
 *
 * The mobile app stores the same token in AsyncStorage and sends it as a bearer
 * header; that is appropriate there and not here.
 *
 * NO SIGNUP ON THE WEB.
 * The handlers call `v2/web/*` on the backend, which sign in existing accounts
 * and refuse to create one. `/api/otp` — which the app uses — registers on first
 * use, and pointing the site at it would quietly turn the login form into a
 * signup form.
 */

const COOKIE_NAME = "shathi_session";

/** 30 days, matching the backend token's own expiry. */
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export type SessionUser = {
    idUsers: number;
    fullName: string | null;
    fullNameBn?: string | null;
    email: string | null;
    phoneNumber: string | null;
    userType: string | null;
    profileImage: string | null;
    dateOfBirth: string | null;
    emailVerified: string | null;
    phoneVerified: string | null;
    nidVerified: string | null;
    nidVerificationStatus: string | null;
    status: string | null;
};

export async function setSessionCookie(token: string): Promise<void> {
    const store = await cookies();
    store.set(COOKIE_NAME, token, {
        httpOnly: true,
        // Allowed over plain HTTP in development so the flow can be exercised
        // locally; always secure once deployed.
        secure: process.env.NODE_ENV === "production",
        // `lax` still sends the cookie on top-level navigation back from the
        // Google sign-in redirect, while blocking cross-site POSTs.
        sameSite: "lax",
        path: "/",
        maxAge: MAX_AGE_SECONDS,
    });
}

export async function clearSessionCookie(): Promise<void> {
    const store = await cookies();
    store.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

/** The raw token, for server-side calls that act on the user's behalf. */
export async function getSessionToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(COOKIE_NAME)?.value ?? null;
}

/**
 * The signed-in user, or null.
 *
 * Deliberately re-fetched from the backend rather than decoded from the token:
 * the token carries only an id and a user type, while the account area needs to
 * know what the profile is still missing. `revalidate: 0` because this is
 * user-specific and must never be cached.
 *
 * An expired or revoked token simply reads as signed-out. Callers render the
 * logged-out view; nothing throws.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
    const token = await getSessionToken();
    if (!token) return null;

    const res = await apiRequest<{ user?: SessionUser } | SessionUser>("user", {
        token,
        revalidate: 0,
    });
    if (!res.ok || !res.data) return null;

    const data = res.data as { user?: SessionUser } & SessionUser;
    const user = data.user ?? data;
    return user?.idUsers ? user : null;
}

/** What the account area still needs from the user, in the order it asks for it. */
export type ProfileGap = "name" | "contact" | "nid" | "photo" | "bank";

export function profileGaps(user: SessionUser, hasBank: boolean): ProfileGap[] {
    const gaps: ProfileGap[] = [];
    if (!user.fullName?.trim()) gaps.push("name");
    if (!isContactVerified(user)) gaps.push("contact");
    if (user.nidVerified !== "yes") gaps.push("nid");
    if (!user.profileImage) gaps.push("photo");
    if (!hasBank) gaps.push("bank");
    return gaps;
}

/* --------------------------------------------------- booking eligibility -- */

/**
 * Contact verification.
 *
 * A verified phone **or** a verified email is enough — not both. The two are
 * earned rather than claimed, and each comes from the way the person signed in:
 *
 *   signing in with an OTP  → the phone is proven, `phoneVerified = 'yes'`
 *   signing in with Google  → the address is proven, `emailVerified = 'yes'`
 *
 * Typing an email into the profile form does **not** verify it: `PUT /api/user`
 * updates the address and deliberately leaves `emailVerified` alone. So the
 * profile UI must never present a saved email as verified — it is contact
 * information until Google says otherwise.
 */
export function isContactVerified(user: SessionUser): boolean {
    return user.phoneVerified === "yes" || user.emailVerified === "yes";
}

export type BookingBlocker = "contact" | "nid" | "nid_pending";

/**
 * Whether this account may place a booking.
 *
 * Two hard requirements, per the product rule:
 *   1. phone **or** email verified;
 *   2. NID verified by an admin — submitted is not sufficient.
 *
 * A profile photo and a bank account are *not* blockers. The photo is
 * cosmetic, and the bank account is where returns are paid — it is needed
 * before a payout, not before a booking, and demanding it up front would stop
 * people investing for a reason that does not yet apply.
 *
 * `nid_pending` is reported separately from `nid` so the UI can say "we are
 * reviewing it" instead of "you have not done this", which reads as though the
 * upload failed.
 */
export function bookingBlockers(user: SessionUser): BookingBlocker[] {
    const blockers: BookingBlocker[] = [];
    if (!isContactVerified(user)) blockers.push("contact");
    if (user.nidVerified !== "yes") {
        blockers.push(user.nidVerificationStatus === "pending" ? "nid_pending" : "nid");
    }
    return blockers;
}

export function canBook(user: SessionUser): boolean {
    return bookingBlockers(user).length === 0;
}
