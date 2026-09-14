import "server-only";

import { API_TIMEOUT_MS, DEFAULT_REVALIDATE_SECONDS } from "./config";

/**
 * Server-side client for the **Shathi Sheba platform** API.
 *
 * THIS IS A SECOND, SEPARATE BACKEND.
 * `lib/api/client.ts` talks to the Shathi API (`saathi-web-application`) — the
 * investment side: projects you buy units in, bookings, accounts. Shathi Sheba
 * is a different system entirely (`ShathiShebaAdmin`, its own `shathi_sheba`
 * MySQL database, its own `/api/v1` surface, its own envelope) serving the
 * farmer side: partner projects you *apply* to, with a lender and a buy-back.
 *
 * The two do not share a database, an id space or a response shape, so they get
 * two clients rather than one with a mode flag. Their envelopes differ too:
 * Shathi wraps results as `{ success, data }`, Sheba as `{ ok, data, meta }`.
 *
 * Same contract as the Shathi client in the two ways that matter:
 *   - `server-only`, so the origin never reaches the browser bundle;
 *   - it never throws. The projects page must render its Shathi half even when
 *     the Sheba platform is unreachable, so callers get `ok: false` and decide.
 */

/** Base URL, always with a single trailing slash. Includes the `/api/v1/` path. */
export const SHEBA_API_URL: string = normaliseBase(
    process.env.SHEBA_API_URL ?? "http://localhost:3300/api/v1/",
);

function normaliseBase(value: string): string {
    return value.endsWith("/") ? value : `${value}/`;
}

/**
 * Whether the Sheba platform is configured at all.
 *
 * Kept explicit so a deployment that has not been given `SHEBA_API_URL` shows
 * the Shathi projects alone and stays quiet, rather than spending eight seconds
 * timing out against a localhost default on every render.
 */
export const SHEBA_CONFIGURED = Boolean(process.env.SHEBA_API_URL);

export type ShebaResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: string; status: number };

/** The Sheba envelope. `ok: false` carries `message`. */
type ShebaEnvelope<T> = { ok?: boolean; data?: T; message?: string };

export async function shebaGet<T>(
    path: string,
    options: { revalidate?: number } = {},
): Promise<ShebaResult<T>> {
    if (!SHEBA_CONFIGURED) {
        return { ok: false, error: "SHEBA_API_URL is not set", status: 0 };
    }

    const { revalidate = DEFAULT_REVALIDATE_SECONDS } = options;
    const url = `${SHEBA_API_URL}${path.replace(/^\/+/, "")}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
            next: { revalidate, tags: ["sheba"] },
        });

        const text = await res.text();
        let payload: ShebaEnvelope<T> | null = null;
        try {
            payload = text ? (JSON.parse(text) as ShebaEnvelope<T>) : null;
        } catch {
            return { ok: false, error: `Non-JSON response from ${path}`, status: res.status };
        }

        if (!res.ok || payload?.ok === false) {
            return {
                ok: false,
                error: payload?.message ?? `Sheba returned ${res.status} for ${path}`,
                status: res.status,
            };
        }

        return { ok: true, data: (payload?.data ?? null) as T };
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
