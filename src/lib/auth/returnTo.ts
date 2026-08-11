/**
 * Where to send someone after they sign in.
 *
 * The session shell exposed `setIntent` / `takeIntent`, but **nothing ever
 * called `setIntent`** — so `takeIntent()` always returned null and every
 * sign-in landed on the account page, wherever it started. Someone reading the
 * Shathi page, signing in, and being dropped into "My investments" has lost
 * their place.
 *
 * This uses a `?next=` query parameter rather than session storage: it survives
 * a page reload, works if the login link is opened in a new tab, and is visible
 * in the URL, so where you will end up is never a surprise.
 *
 * Client-safe — no backend imports.
 */

/**
 * Accepts only same-origin paths.
 *
 * A `next` value comes from the URL, so it is attacker-controllable: without
 * this check, `?next=https://example.com/login` turns our sign-in into an open
 * redirect, and a convincing phishing page one hop from a real DigiGram URL.
 *
 * Allowed: `/en/products/shathi`, `/bn/projects?sort=return`
 * Rejected: absolute URLs, protocol-relative `//evil.com`, anything not
 * starting with a single `/`, and backslash variants that some browsers
 * normalise to slashes.
 */
export function safeReturnTo(value: string | null | undefined): string | null {
    if (!value) return null;

    const candidate = value.trim();
    if (!candidate.startsWith("/")) return null;
    if (candidate.startsWith("//")) return null;
    if (candidate.startsWith("/\\") || candidate.includes("\\")) return null;

    return candidate;
}

/** Builds a login URL that will come back to `from` afterwards. */
export function loginUrlFor(loginPath: string, from: string | null | undefined): string {
    const target = safeReturnTo(from);
    return target ? `${loginPath}?next=${encodeURIComponent(target)}` : loginPath;
}

/**
 * Pages that must never be a return destination.
 *
 * Coming back to `/login` after logging in is a loop, and coming back to
 * `/login/otp` lands on a code form whose code has already been spent. Both
 * read as "the login failed" even though it succeeded.
 */
const NEVER_RETURN_TO = ["/login", "/login/otp"];

/**
 * True when `path` (locale prefix already stripped) is somewhere worth
 * returning to.
 */
export function isReturnable(barePath: string): boolean {
    return !NEVER_RETURN_TO.some(
        (route) => barePath === route || barePath.startsWith(`${route}/`),
    );
}
