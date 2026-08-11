import { NextResponse, type NextRequest } from "next/server";

/**
 * Locale routing.
 *
 * English is served at the root (`/about`) and Bangla under a path prefix
 * (`/bn/about`) — the prefix form is what search engines want, and it lets
 * `hreflang` alternates resolve to real, crawlable URLs.
 *
 * Internally every page lives under `app/[locale]/…`, so a root request is
 * rewritten to `/en/…`. The rewrite is invisible: the address bar keeps
 * `/about`, and the prerendered `/en/about` HTML is what gets served.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // `/bn` and `/bn/...` already carry their locale segment.
  if (pathname === "/bn" || pathname.startsWith("/bn/")) {
    return NextResponse.next();
  }

  // Someone hitting `/en/about` directly gets redirected to the canonical
  // `/about`, so the two forms never both rank.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/en" ? "/" : pathname.slice(3);
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Everything except:
     *  - /_next/*          Next.js internals
     *  - /assets/*         static images, logos, fonts
     *  - files with an extension (favicon.ico, og.png, manifest.webmanifest…)
     *  - the SEO endpoints that must stay locale-free
     */
    "/((?!_next/|assets/|api/|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|.*\\.[\\w]+$).*)",
  ],
};
