import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

/**
 * POST { bookingId } → cancel a booking that has not been paid for.
 *
 * The backend route is `PUT /api/bookings/cancel`, which now verifies that the
 * booking belongs to the caller. It previously did not: the id came from the
 * body with no ownership check at all, so any signed-in user could cancel
 * anyone's booking and release their units.
 *
 * POST here rather than PUT because this is a browser-facing action on our own
 * origin and the verb carries no meaning to the client; the backend's PUT is an
 * implementation detail of the call below.
 */
export async function POST(request: Request) {
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

    const bookingId = Number(body.bookingId);
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
        return NextResponse.json({ ok: false, message: "Invalid booking" }, { status: 400 });
    }

    const res = await apiRequest("bookings/cancel", {
        method: "PUT",
        token,
        revalidate: 0,
        body: {
            idProjectInvestmentBookings: bookingId,
            remarks: "Cancelled by the investor from the website",
        },
    });

    if (!res.ok) {
        return NextResponse.json(
            { ok: false, message: res.error },
            { status: res.status === 0 ? 503 : res.status },
        );
    }

    return NextResponse.json({ ok: true });
}
