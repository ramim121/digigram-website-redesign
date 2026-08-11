import { NextResponse } from "next/server";
import { apiUpload, isAllowedImage } from "@/lib/api/upload.server";
import { getSessionToken } from "@/lib/auth/session";

/**
 * POST multipart { nidfront, nidback } → submit NID images for review.
 *
 * The backend field names are `nidfront` and `nidback` (no separator, all
 * lowercase) — transcribed from `profile/nid.ts`, not guessed. It sets
 * `nidVerificationStatus = 'pending'`; an admin flips `nidVerified` to `yes`
 * from the admin panel. Nothing here can mark a NID verified, which is the
 * point: verification is a human decision.
 *
 * 15 MB per side. The backend caps the whole form at 30 MB, so two files at
 * that limit are the most it will accept; rejecting here gives a clear message
 * instead of a 413 from formidable.
 */

const MAX_BYTES = 15 * 1024 * 1024;

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

    const front = incoming.get("front");
    const back = incoming.get("back");

    if (!(front instanceof File) || !(back instanceof File)) {
        return NextResponse.json(
            { ok: false, message: "Both sides of your NID are required." },
            { status: 400 },
        );
    }

    for (const [label, file] of [
        ["front", front],
        ["back", back],
    ] as const) {
        if (!isAllowedImage(file)) {
            return NextResponse.json(
                { ok: false, message: `The ${label} image must be a JPG or PNG.` },
                { status: 400 },
            );
        }
        if (file.size > MAX_BYTES) {
            return NextResponse.json(
                { ok: false, message: `The ${label} image must be under 15 MB.` },
                { status: 400 },
            );
        }
    }

    const form = new FormData();
    form.append("nidfront", front, front.name || "nid-front.jpg");
    form.append("nidback", back, back.name || "nid-back.jpg");

    const res = await apiUpload("profile/nid", form, token);
    if (!res.ok) {
        return NextResponse.json(
            { ok: false, message: res.error },
            { status: res.status === 0 ? 503 : res.status },
        );
    }

    return NextResponse.json({ ok: true, status: "pending" });
}
