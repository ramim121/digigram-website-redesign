"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { DigiGramLogo, BrandDot } from "@/components/brand/Logo";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { useSession } from "@/components/auth/session";
import { mainNav, routes, type NavItem } from "@/lib/site";
import { AccountMenu, type HeaderUser } from "@/components/layout/AccountMenu";
import { useLoginHref } from "@/lib/auth/useLoginHref";
import { localePath, stripLocale, t, type Locale } from "@/lib/i18n";

/**
 * Sticky site header.
 *
 * Chrome stays DigiGram teal on every page, including product pages — only a
 * page's content region switches brand (brief §3.4.1). The one place all three
 * brand colours appear together is the Products mega-menu, which is deliberate.
 *
 * Over a dark hero the bar starts transparent and turns solid teal after 80px.
 * Whether a route has a dark hero is decided from the pathname so the first
 * server render already matches — no flash of the wrong treatment.
 */

/**
 * Routes that open with a dark hero, and so can carry a transparent bar.
 *
 * THIS LIST IS THE RIGHT WAY ROUND, AND IT DID NOT USED TO BE.
 * It was previously a list of routes needing a *solid* bar, which meant every
 * page not on it got the transparent treatment by default: white text with
 * nothing behind it. Any new page without a hero shipped with an invisible
 * header, and that is exactly what happened to the invest page — the nav was
 * there, drawn in white on white.
 *
 * Inverted, the default is safe. A page missing from this list gets a solid bar
 * over a hero: slightly less pretty, entirely readable. That is the failure
 * worth having.
 *
 * `/faq` and `/delete-account` render a PageHero but are deliberately absent —
 * their heroes are light, so a transparent bar would be unreadable there too.
 *
 * Matched exactly, except where a prefix is given: `/projects` has a hero but
 * `/projects/[slug]` and `/projects/[slug]/invest` do not.
 */
const HERO_ROUTES = [
  "/",
  routes.about,
  `${routes.about}/careers`,
  routes.blog,
  routes.contact,
  routes.impact,
  routes.products,
  `${routes.products}/shadhin-feed`,
  // Both carry a dark hero of their own rather than a PageHero, which is why
  // they were missed when this list was first derived.
  routes.shathi,
  routes.shathiSheba,
  routes.projects,
];

export function Header({ locale, sessionUser }: { locale: Locale; sessionUser: HeaderUser | null }) {
  const pathname = usePathname() || "/";
  const bare = stripLocale(pathname);
  const { user, signOut } = useSession();

  const overlayCapable = HERO_ROUTES.includes(bare);
  // `/` and `/bn` both strip to `/`.
  const isHome = bare === "/";
  const loginHref = useLoginHref(locale);
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setOpenMenu(null);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setDrawer(false);
      setOpenMenu(null);
      setAccountOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const transparent = overlayCapable && !scrolled && !drawer;

  function hoverOpen(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }

  function hoverClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }

  const isActive = (href: string) =>
    href === "/" ? bare === "/" : bare === href || bare.startsWith(`${href}/`);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-standard",
        transparent ? "bg-transparent" : "bg-teal-800/95 shadow-md backdrop-blur-md",
      )}
      data-transparent={transparent ? "true" : "false"}
    >
      <a
        href="#main"
        className="sr-only rounded-md bg-white px-4 py-2 font-display text-sm font-semibold text-teal-800 focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-10"
      >
        {locale === "en" ? "Skip to content" : "মূল অংশে যান"}
      </a>

      <div className="container-page">
        <div className="flex h-15 items-center gap-6 lg:h-18">
          <Link
            href={localePath(locale, routes.home)}
            className="shrink-0"
            aria-label={locale === "en" ? "DigiGram Ventures — home" : "ডিজিগ্রাম ভেঞ্চারস — হোম"}
          >
            <DigiGramLogo variant="white" priority className="h-6 w-auto lg:h-7" />
          </Link>

          {/* ------------------------------------------------ desktop nav -- */}
          <nav
            className="ms-auto hidden items-center gap-1 lg:flex"
            aria-label={locale === "en" ? "Main" : "প্রধান"}
          >
            {mainNav.map((item) => (
              <DesktopNavItem
                key={item.href}
                item={item}
                locale={locale}
                active={isActive(item.href)}
                open={openMenu === item.href}
                onOpen={() => hoverOpen(item.href)}
                onClose={hoverClose}
                onToggle={() => setOpenMenu(openMenu === item.href ? null : item.href)}
              />
            ))}
          </nav>

          {/* -------------------------------------------- account cluster -- */}
          <div className="ms-auto flex items-center gap-2 lg:ms-0 lg:gap-3">
            {/* Contact sits here rather than in the primary nav: it is an
                action, not a destination competing with Products and Impact. */}
            <Link
              href={localePath(locale, routes.contact)}
              className="hidden font-display text-sm font-semibold text-white/75 transition-colors hover:text-white lg:block"
            >
              {locale === 'en' ? 'Contact' : 'যোগাযোগ'}
            </Link>

            {/* Always visible, including on mobile: a Bangla-first visitor must
                be able to switch in one tap without opening the drawer. */}
            <LanguageToggle locale={locale} invert />

            {/* Identity comes from the httpOnly session cookie, read on the
                server and passed down — client script cannot see that cookie,
                and rendering from it server-side avoids a logged-out flash. */}
            {/*
              Signed in: the account menu. Signed out: a "Log in" link on every
              page except the homepage.

              The header used to show nothing at all when signed out, on the
              reasoning that most visitors are reading marketing pages and an
              account only becomes meaningful on the two product pages, which
              carry their own sign-in band.

              That held while accounts could only be created in the app. Now
              that registering happens here too, it left a signed-out reader on
              /projects, /impact or /about with no way in from anywhere on the
              page — the two product pages were the only door, and nothing said
              so.

              The homepage still stays clean: it is the one page whose job is
              the pitch, not the product.
            */}
            {sessionUser ? (
              <AccountMenu locale={locale} user={sessionUser} />
            ) : (
              !isHome && (
                <Link
                  href={loginHref}
                  className="hidden items-center gap-1.5 rounded-md border border-white/25 px-3 py-1.5 font-display text-sm font-semibold text-white/85 transition-colors hover:border-white/50 hover:text-white sm:inline-flex"
                  data-header-login
                >
                  {locale === "en" ? "Log in" : "লগ ইন"}
                  <Icon name="arrow-right" size={15} />
                </Link>
              )
            )}

            {/* Wrapped rather than given `hidden sm:inline-flex` directly: the
                button's own `inline-flex` and a `hidden` utility are both
                display rules, and which one wins depends on stylesheet order,
                not class order. A wrapper makes it deterministic. On mobile the
                CTA lives at the bottom of the drawer instead. */}
            <span className="hidden sm:block">
              <ButtonLink
                href={localePath(locale, routes.projects)}
                size="sm"
                variant="inverse"
                icon="arrow-right"
              >
                {locale === "en" ? "Invest now" : "বিনিয়োগ করুন"}
              </ButtonLink>
            </span>

            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label={locale === "en" ? "Open menu" : "মেনু খুলুন"}
              aria-expanded={drawer}
              className="flex size-10 items-center justify-center rounded-md text-white lg:hidden"
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </div>

      {drawer && (
        <MobileDrawer
          locale={locale}
          onClose={() => setDrawer(false)}
          user={user}
          onSignOut={signOut}
          loginHref={loginHref}
        />
      )}
    </header>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="block px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-brand-strong"
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------- desktop -- */

function DesktopNavItem({
  item,
  locale,
  active,
  open,
  onOpen,
  onClose,
  onToggle,
}: {
  item: NavItem;
  locale: Locale;
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  const label = t(item.label, locale);

  if (!item.children) {
    return (
      <Link
        href={localePath(locale, item.href)}
        aria-current={active ? "page" : undefined}
        className={clsx(
          "rounded-md px-3 py-2 font-display text-sm font-semibold transition-colors duration-150",
          active ? "text-white" : "text-white/80 hover:text-white",
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="true"
        className={clsx(
          "flex items-center gap-1 rounded-md px-3 py-2 font-display text-sm font-semibold transition-colors duration-150",
          active ? "text-white" : "text-white/80 hover:text-white",
        )}
      >
        {label}
        <Icon
          name="chevron-down"
          size={15}
          className={clsx("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          className={clsx(
            "absolute start-0 top-full pt-2",
            item.layout === "products" ? "w-[38rem]" : "w-64",
          )}
        >
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white p-2 shadow-lg">
            {item.layout === "products" ? (
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={localePath(locale, child.href)}
                    className="group flex flex-col gap-1.5 rounded-md p-3.5 transition-colors hover:bg-stone-50"
                  >
                    <span className="flex items-center gap-2">
                      {child.brand && <BrandDot brand={child.brand} />}
                      <span
                        className={clsx(
                          "font-display text-[15px] font-bold",
                          child.brand === "shathi" && "text-shathi-600",
                          child.brand === "shathi-sheba" && "text-sheba-600",
                          child.brand === "digigram" && "text-teal-700",
                        )}
                      >
                        {t(child.label, locale)}
                      </span>
                    </span>
                    {child.description && (
                      <span className="text-[13px] leading-relaxed text-stone-500">
                        {t(child.description, locale)}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={localePath(locale, child.href)}
                    className="rounded-md px-3.5 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-brand-strong"
                  >
                    {t(child.label, locale)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- mobile -- */

function MobileDrawer({
  locale,
  onClose,
  user,
  onSignOut,
  loginHref,
}: {
  locale: Locale;
  onClose: () => void;
  user: { name: string } | null;
  /** Where "Log in" goes, already carrying ?next= for the current page. */
  loginHref: string;
  onSignOut: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-stone-950/50" onClick={onClose} aria-hidden="true" />
      <div
        className="absolute inset-y-0 end-0 flex w-full max-w-sm flex-col bg-white"
        role="dialog"
        aria-modal="true"
        aria-label={locale === "en" ? "Menu" : "মেনু"}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <LanguageToggle locale={locale} />
          <button
            type="button"
            onClick={onClose}
            aria-label={locale === "en" ? "Close menu" : "মেনু বন্ধ করুন"}
            className="flex size-10 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100"
          >
            <Icon name="x" size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {mainNav.map((item) =>
            item.children ? (
              <details key={item.href} className="group border-b border-stone-100">
                <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-3.5 font-display text-base font-semibold text-stone-900 [&::-webkit-details-marker]:hidden">
                  {t(item.label, locale)}
                  <Icon
                    name="chevron-down"
                    size={18}
                    className="text-stone-400 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div className="flex flex-col pb-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={localePath(locale, child.href)}
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-md px-4 py-2.5 text-[15px] text-stone-600"
                    >
                      {child.brand && <BrandDot brand={child.brand} />}
                      {t(child.label, locale)}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link
                key={item.href}
                href={localePath(locale, item.href)}
                onClick={onClose}
                className="block border-b border-stone-100 px-2 py-3.5 font-display text-base font-semibold text-stone-900"
              >
                {t(item.label, locale)}
              </Link>
            ),
          )}

          <div className="mt-4 px-2">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={localePath(locale, routes.account)}
                  onClick={onClose}
                  className="font-display text-sm font-semibold text-brand-strong"
                >
                  {locale === "en" ? "My investments" : "আমার বিনিয়োগ"}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="text-start font-display text-sm font-semibold text-danger"
                >
                  {locale === "en" ? "Log out" : "লগ আউট"}
                </button>
              </div>
            ) : (
              <Link
                href={loginHref}
                onClick={onClose}
                className="font-display text-sm font-semibold text-brand-strong"
              >
                {locale === "en" ? "Log in or register" : "লগ ইন বা নিবন্ধন"}
              </Link>
            )}
          </div>
        </nav>

        <div className="border-t border-stone-200 p-4">
          <ButtonLink
            href={localePath(locale, routes.projects)}
            fullWidth
            icon="arrow-right"
            size="lg"
          >
            {locale === "en" ? "Invest now" : "বিনিয়োগ করুন"}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
