import "server-only";

import { API_BASE_URL, API_TIMEOUT_MS, DEFAULT_REVALIDATE_SECONDS } from "./config";

/**
 * Server-side HTTP client for the Shathi API.
 *
 * `server-only` above is load-bearing: importing this from a client component
 * is a build error rather than a silent leak of the backend origin (and later,
 * of session tokens) into the browser bundle.
 *
 * DESIGN NOTE — why this never throws.
 * The public site must render when the backend is down. A marketing page that
 * 500s because a project list timed out is worse than one showing slightly old
 * data. So every call returns a result object with an `ok` flag, and callers
 * decide what to do. `lib/projects.ts` falls back to seed data and sets
 * `stale: true`, which the UI surfaces as a "showing cached information" note.
 */

export type ApiResult<T> =
    | { ok: true; data: T; status: number }
    /**
     * `code` is the backend's machine-readable reason, when it sends one
     * (e.g. `NOT_REGISTERED`). Callers should branch on this rather than
     * pattern-matching the human-readable `error` string, which is copy and
     * will change.
     */
    | { ok: false; error: string; status: number; code?: string };

type RequestOptions = {
    /** Seconds of cache freshness. Pass 0 for user-specific data that must never be cached. */
    revalidate?: number;
    /** Bearer token, for calls made on behalf of a signed-in investor. */
    token?: string;
    /** Cache tags, so a webhook or admin action can invalidate precisely. */
    tags?: string[];
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
};

/** The backend's envelope. Not every route fills every field. */
type Envelope<T> = { success?: boolean; data?: T; message?: string; code?: string };

/** Pulls the backend's `code` out of an error envelope, when it sent one. */
function codeOf(payload: unknown): string | undefined {
    const code = (payload as { code?: unknown })?.code;
    return typeof code === "string" ? code : undefined;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
    const {
        revalidate = DEFAULT_REVALIDATE_SECONDS,
        token,
        tags,
        method = "GET",
        body,
    } = options;

    const url = `${API_BASE_URL}${path.replace(/^\/+/, "")}`;

    // AbortSignal.timeout would be neater, but an explicit controller lets us
    // clear the timer on success and keep the reason specific in the log.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
        const headers: Record<string, string> = { Accept: "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (body !== undefined) headers["Content-Type"] = "application/json";

        const res = await fetch(url, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: controller.signal,
            // A token means the response is user-specific: never cache it, no
            // matter what the caller passed.
            ...(token || revalidate === 0
                ? { cache: "no-store" as const }
                : { next: { revalidate, ...(tags ? { tags } : {}) } }),
        });

        const text = await res.text();
        let payload: Envelope<T> | T | null = null;
        try {
            payload = text ? (JSON.parse(text) as Envelope<T> | T) : null;
        } catch {
            return { ok: false, error: `Non-JSON response from ${path}`, status: res.status };
        }

        if (!res.ok) {
            const message =
                (payload as Envelope<T>)?.message ?? `Backend returned ${res.status} for ${path}`;
            return { ok: false, error: message, status: res.status, code: codeOf(payload) };
        }

        // Most routes wrap results as { success, data }; a few return the value
        // directly. Unwrap only when the envelope is actually present, so a
        // legitimate payload with its own `data` key is not mangled.
        const envelope = payload as Envelope<T>;
        const unwrapped =
            envelope && typeof envelope === "object" && "data" in envelope
                ? (envelope.data as T)
                : (payload as T);

        if (envelope && typeof envelope === "object" && envelope.success === false) {
            return {
                ok: false,
                error: envelope.message ?? "Request failed",
                status: res.status,
                code: codeOf(payload),
            };
        }

        return { ok: true, data: unwrapped, status: res.status };
    } catch (error) {
        const aborted = error instanceof Error && error.name === "AbortError";
        return {
            ok: false,
            error: aborted
                ? `Timed out after ${API_TIMEOUT_MS}ms: ${path}`
                : error instanceof Error
                  ? error.message
                  : "Unknown network error",
            status: 0,
        };
    } finally {
        clearTimeout(timer);
    }
}

export function apiGet<T>(path: string, options: Omit<RequestOptions, "method" | "body"> = {}) {
    return apiRequest<T>(path, { ...options, method: "GET" });
}
