import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";
import { getSessionToken } from "@/lib/auth/session";

/**
 * GET /api/bookings/{id}/proof → the receipt image for that booking.
 *
 * WHY A PROXY IS NEEDED AT ALL
 * The backend route (`files/proof-of-payment/{id}`) checks ownership and then
 * 302s to a five-minute presigned S3 URL, which makes it usable directly as an
 * `<img src>`. But it authenticates with the session token, and that token
 * lives in an httpOnly cookie scoped to *this* origin — a browser fetching
 * `api-test.digigramventures.com` would not send it. So the token is attached
 * here, server-side, where it can be read.
 *
 * The redirect is passed through rather than the bytes: the browser then
 * collects the image straight from S3, and the receipt never travels through
 * this server.
 *
 * `redirect: "manual"` matters. Left to follow, fetch would resolve the
 * presigned URL itself and we would end up streaming the image after all.
 */
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const token = await getSessionToken();
    if (!token) {
        return NextResponse.json({ ok: false, message: "Not signed in" }, { status: 401 });
    }

    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
        return NextResponse.json({ ok: false, message: "Unknown booking" }, { status: 400 });
    }

    const upstream = await fetch(`${API_BASE_URL}files/proof-of-payment/${numericId}`, {
        headers: { Authorization: `Bearer ${token}` },
        redirect: "manual",
        cache: "no-store",
    });

    const location = upstream.headers.get("location");
    if (upstream.status >= 300 && upstream.status < 400 && location) {
        // A presigned URL is a bearer credential with a short life. It must not
        // be cached by a shared proxy, and it must not outlive the redirect.
        return NextResponse.redirect(location, {
            status: 302,
            headers: { "Cache-Control": "private, no-store" },
        });
    }

    // The backend answers 404 for a booking that is not yours, so "not found"
    // and "not yours" are deliberately indistinguishable from here.
    return NextResponse.json(
        { ok: false, message: "No receipt available for this booking." },
        { status: upstream.status === 404 ? 404 : 502 },
    );
}
