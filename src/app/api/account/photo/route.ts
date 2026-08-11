import { NextResponse } from "next/server";
import { apiUpload, isAllowedImage } from "@/lib/api/upload.server";
import { getSessionToken } from "@/lib/auth/session";

/**
 * POST multipart { photo } → set the profile picture.
 *
 * The backend expects the field to be called `profile-picture`, with the
 * hyphen (see `profile/picture.ts`).
 *
 * Note that that handler replies `success: false` even when the upload worked —
 * its success message is attached to a false flag. `apiUpload` decides on the
 * HTTP status for exactly this reason; see the comment there.
 */

const MAX_BYTES = 8 * 1024 * 1024;

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

    const photo = incoming.get("photo");
    if (!(photo instanceof File)) {
        return NextResponse.json({ ok: false, message: "Choose a photo first." }, { status: 400 });
    }
    if (!isAllowedImage(photo)) {
        return NextResponse.json(
            { ok: false, message: "The photo must be a JPG or PNG." },
            { status: 400 },
        );
    }
    if (photo.size > MAX_BYTES) {
        return NextResponse.json(
            { ok: false, message: "The photo must be under 8 MB." },
            { status: 400 },
        );
    }

    const form = new FormData();
    form.append("profile-picture", photo, photo.name || "profile.jpg");

    const res = await apiUpload("profile/picture", form, token);
    if (!res.ok) {
        return NextResponse.json(
            { ok: false, message: res.error },
            { status: res.status === 0 ? 503 : res.status },
        );
    }

    return NextResponse.json({ ok: true });
}
