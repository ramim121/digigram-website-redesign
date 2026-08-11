"use client";

import { usePathname } from "next/navigation";
import { isReturnable, loginUrlFor } from "@/lib/auth/returnTo";
import { localePath, stripLocale, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * The login URL that comes back to wherever the visitor currently is.
 *
 * WHY A HOOK AND NOT A PROP
 * `?next=` was first threaded by hand from the two product pages and the
 * booking gate. Every *other* way into login — the header button, "Log in to
 * invest" on a project card, the redirect out of an expired account page —
 * still sent a bare `/login`, so those visitors landed on the account page and
 * lost their place. That is the bug as reported: "login works but does not
 * redirect to the page it came from".
 *
 * Reading the current path here fixes all of them at once, and cannot drift out
 * of sync the way a hand-passed prop does.
 *
 * Deliberately pathname-only. `useSearchParams()` would opt every page
 * rendering the header into dynamic rendering unless each is wrapped in its own
 * Suspense boundary; losing `?sort=return` on the page you came from is a far
 * smaller cost than that.
 */
export function useLoginHref(locale: Locale): string {
    const pathname = usePathname() || "/";
    const bare = stripLocale(pathname);
    const loginPath = localePath(locale, routes.login);

    // On the login pages themselves there is nothing to come back to.
    if (!isReturnable(bare)) return loginPath;

    return loginUrlFor(loginPath, pathname);
}
