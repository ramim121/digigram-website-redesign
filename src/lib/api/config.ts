/**
 * Backend connection settings.
 *
 * The Shathi API is reached **server-side only**. Nothing here is prefixed
 * `NEXT_PUBLIC_`, so none of it is inlined into the client bundle: the browser
 * talks to this site's own route handlers under `/api/shathi/*`, and those talk
 * to the backend. That indirection is the point — it keeps the backend origin
 * and, later, the session token out of client JavaScript.
 */

/** Backend base URL, always with a single trailing slash. */
export const API_BASE_URL: string = normaliseBase(
    process.env.SHATHI_API_URL ?? "https://api-test.digigramventures.com/api/",
);

/** Public S3 origin that serves project, partner and blog images. */
export const S3_URL: string = normaliseBase(
    process.env.SHATHI_S3_URL ?? "https://saathi-files-new.s3.ap-southeast-1.amazonaws.com/",
);

/**
 * How long a cached backend response stays fresh, in seconds.
 *
 * Project data changes when an admin edits it or a booking is confirmed, so
 * minutes-level staleness is fine and keeps the site fast. Individual calls
 * override this — anything user-specific must not be cached at all.
 */
export const DEFAULT_REVALIDATE_SECONDS = Number(process.env.SHATHI_REVALIDATE ?? 300);

/** Give up on a backend call after this long, so one slow query cannot hang a page render. */
export const API_TIMEOUT_MS = Number(process.env.SHATHI_TIMEOUT_MS ?? 8000);

function normaliseBase(value: string): string {
    return value.endsWith("/") ? value : `${value}/`;
}

/** Absolute URL for an S3 object, e.g. `s3Url("projects", row.fileName)`. */
export function s3Url(prefix: string, fileName: string | null | undefined): string | null {
    if (!fileName) return null;
    const clean = prefix.replace(/^\/+|\/+$/g, "");
    return `${S3_URL}${clean}/${fileName}`;
}
