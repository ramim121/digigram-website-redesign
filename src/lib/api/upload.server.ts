import "server-only";

import { API_BASE_URL, API_TIMEOUT_MS } from "@/lib/api/config";

/**
 * Multipart passthrough to the Shathi API.
 *
 * `apiRequest` is JSON-only, and rightly so — it sets `Content-Type` and
 * serialises the body. File uploads need the raw multipart stream with its
 * generated boundary, so they get this instead.
 *
 * The `Content-Type` header is deliberately **not** set: passing a `FormData`
 * to `fetch` makes it generate the header *including the boundary*. Setting it
 * by hand produces a boundary-less header, and the backend's formidable parser
 * then rejects every field as missing — a failure that looks like "the file
 * did not arrive" rather than "the header was wrong".
 */

export type UploadResult =
    | { ok: true; status: number; data: unknown }
    | { ok: false; status: number; error: string };

export async function apiUpload(
    path: string,
    form: FormData,
    token: string,
): Promise<UploadResult> {
    const controller = new AbortController();
    // Uploads are slower than JSON calls — NID scans are photographs from a
    // phone camera — so they get a longer ceiling than API_TIMEOUT_MS.
    const timer = setTimeout(() => controller.abort(), Math.max(API_TIMEOUT_MS, 60_000));

    try {
        const res = await fetch(`${API_BASE_URL}${path.replace(/^\/+/, "")}`, {
            method: "POST",
            headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
            body: form,
            signal: controller.signal,
            cache: "no-store",
        });

        const text = await res.text();
        let payload: unknown = null;
        try {
            payload = text ? JSON.parse(text) : null;
        } catch {
            return { ok: false, status: res.status, error: "Unexpected response from the server" };
        }

        const envelope = payload as { success?: boolean; message?: string } | null;

        /**
         * `profile/picture` returns `success: false` on the happy path — the
         * handler says `{ success: false, message: 'Profile picture updated
         * successfully' }`. Trusting that flag would report every successful
         * upload as a failure, so the HTTP status is what decides here, and the
         * backend's own flag is only consulted for a 2xx that genuinely failed.
         */
        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                error: envelope?.message ?? `Upload failed (${res.status})`,
            };
        }

        return { ok: true, status: res.status, data: payload };
    } catch (error) {
        const aborted = error instanceof Error && error.name === "AbortError";
        return {
            ok: false,
            status: 0,
            error: aborted ? "The upload timed out. Please try again." : "Network error",
        };
    } finally {
        clearTimeout(timer);
    }
}

/** Image types the backend stores. Anything else is rejected before upload. */
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"] as const;

export function isAllowedImage(file: File): boolean {
    return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type);
}
