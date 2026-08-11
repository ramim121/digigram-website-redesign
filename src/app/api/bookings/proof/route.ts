import { NextResponse } from "next/server";
import { apiUpload, isAllowedImage } from "@/lib/api/upload.server";
import { getSessionToken } from "@/lib/auth/session";
import { PROOF_MAX_BYTES, paymentMethodSpec, toApiDateTime } from "@/lib/booking";

/**
 * POST multipart → submit proof of payment for a booking.
 *
 * Fields: `bookingId`, `paymentMethod`, `proof` (file), plus whichever of
 * `collectionDate` / `collectionLocation` / `idUserBanks` the chosen method
 * requires.
 *
 * The conditional requirements are checked here as well as on the backend, not
 * instead of it. The backend's Joi rules are the authority; repeating them
 * turns "collectionDate is required" — which arrives with no indication of
 * *why* — into a message tied to the method the person actually picked.
 *
 * The backend field name for the file is `proofOfPayment`, and the target route
 * is `bookings/proof-of-payment-upload/{id}`, which was given an ownership
 * check in Phase A: before that, any signed-in user could attach a payment file
 * and bank account to somebody else's booking.
 */
export async function POST(request: Request) {
    const token = await getSessionToken();
    if (!token) {
        return NextResponse.json({ ok: false, message: "Not signed in" }, { status: 401 });
    }

    let incoming: FormData;
    try {
        incoming = await request.formData();
    } catch {
        return NextResponse.json({ ok: false, message: "Invalid upload" }, { status: 400 });
    }

    const bookingId = String(incoming.get("bookingId") ?? "");
    const paymentMethod = String(incoming.get("paymentMethod") ?? "");
    const proof = incoming.get("proof");

    if (!/^\d+$/.test(bookingId)) {
        return NextResponse.json({ ok: false, message: "Invalid booking" }, { status: 400 });
    }

    const spec = paymentMethodSpec(paymentMethod);
    if (!spec) {
        return NextResponse.json({ ok: false, message: "Choose a payment method." }, { status: 400 });
    }

    if (!(proof instanceof File)) {
        return NextResponse.json(
            { ok: false, message: "Attach a photo or screenshot of your payment." },
            { status: 400 },
        );
    }
    if (!isAllowedImage(proof)) {
        return NextResponse.json(
            { ok: false, message: "The proof must be a JPG or PNG image." },
            { status: 400 },
        );
    }
    if (proof.size > PROOF_MAX_BYTES) {
        return NextResponse.json(
            { ok: false, message: "The image must be under 10 MB." },
            { status: 400 },
        );
    }

    const form = new FormData();
    form.append("paymentMethod", spec.value);
    form.append("proofOfPayment", proof, proof.name || "proof.jpg");

    if (spec.needsCollection) {
        const collectionDate = String(incoming.get("collectionDate") ?? "");
        const collectionLocation = String(incoming.get("collectionLocation") ?? "").trim();
        if (!collectionDate || !collectionLocation) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "Tell us when and where our representative should collect the payment.",
                },
                { status: 400 },
            );
        }
        // The backend rejects an ISO string; see toApiDateTime.
        form.append("collectionDate", toApiDateTime(collectionDate));
        form.append("collectionLocation", collectionLocation);
    }

    if (spec.needsUserBank) {
        const idUserBanks = String(incoming.get("idUserBanks") ?? "");
        if (!/^\d+$/.test(idUserBanks)) {
            return NextResponse.json(
                { ok: false, message: "Choose the bank account you transferred from." },
                { status: 400 },
            );
        }
        // Sent as a string: the backend's schema types this one as a string,
        // and a number fails validation with a "required" message.
        form.append("idUserBanks", idUserBanks);
    }

    const res = await apiUpload(`bookings/proof-of-payment-upload/${bookingId}`, form, token);
    if (!res.ok) {
        return NextResponse.json(
            { ok: false, message: res.error.replace(/\.\s*<br>\s*/g, ". ") },
            { status: res.status === 0 ? 503 : res.status },
        );
    }

    return NextResponse.json({ ok: true });
}
