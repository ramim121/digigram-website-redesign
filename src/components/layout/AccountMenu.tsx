"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { localePath, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * Signed-in account menu in the header.
 *
 * The identity comes from the **server**, passed in as a prop, because the
 * session is an httpOnly cookie that client JavaScript cannot read. That also
 * removes the flash of a logged-out header while a client checks storage — the
 * first byte of HTML already knows who you are.
 *
 * Opens on hover for pointer users and on click/focus for everyone else. A
 * hover-only menu is unusable by keyboard and on touch, so both are wired:
 * `onMouseEnter`/`onMouseLeave` for the pointer, `onClick` and focus-within for
 * the rest. The close-on-outside-click and Escape handlers apply to both.
 */

export type HeaderUser = {
    name: string;
    image: string | null;
};

export function AccountMenu({ locale, user }: { locale: Locale; user: HeaderUser }) {
    const en = locale === "en";
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const holder = useRef<HTMLDivElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        function onPointerDown(event: MouseEvent) {
            if (holder.current && !holder.current.contains(event.target as Node)) setOpen(false);
        }
        function onKey(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    // A small grace period on leave, so crossing the gap between the trigger
    // and the panel does not snap the menu shut mid-movement.
    function scheduleClose() {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setOpen(false), 180);
    }
    function cancelClose() {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    }

    async function signOut() {
        setBusy(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch {
            /* The cookie expires on its own if this never lands. */
        }
        setOpen(false);
        router.replace(localePath(locale, routes.home));
        router.refresh();
    }

    const firstName = user.name.trim().split(/\s+/)[0] || user.name;

    return (
        <div
            ref={holder}
            className="relative hidden lg:block"
            onMouseEnter={() => {
                cancelClose();
                setOpen(true);
            }}
            onMouseLeave={scheduleClose}
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full py-1 pe-2 ps-1 text-white/90 transition-colors hover:text-white"
            >
                <Avatar user={user} />
                <span className="font-display text-sm font-semibold">{firstName}</span>
                <Icon name="chevron-down" size={14} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>

            {open && (
                <div
                    role="menu"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    className="absolute end-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-xl"
                >
                    <div className="flex items-center gap-3 border-b border-stone-100 px-4 py-3">
                        <Avatar user={user} size={40} />
                        <div className="min-w-0">
                            <p className="truncate font-display text-sm font-bold text-stone-900">
                                {user.name}
                            </p>
                            <p className="text-xs text-stone-500">
                                {en ? "Signed in" : "লগ ইন করা আছে"}
                            </p>
                        </div>
                    </div>

                    <MenuLink
                        href={localePath(locale, routes.registerProfile)}
                        icon="users"
                        label={en ? "My profile" : "আমার প্রোফাইল"}
                        onNavigate={() => setOpen(false)}
                    />
                    <MenuLink
                        href={localePath(locale, routes.account)}
                        icon="trending-up"
                        label={en ? "My investments" : "আমার বিনিয়োগ"}
                        onNavigate={() => setOpen(false)}
                    />

                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => void signOut()}
                        disabled={busy}
                        className="flex w-full items-center gap-3 border-t border-stone-100 px-4 py-3 text-start text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-danger disabled:opacity-60"
                    >
                        <Icon name="log-out" size={16} />
                        {en ? "Log out" : "লগ আউট"}
                    </button>
                </div>
            )}
        </div>
    );
}

function MenuLink({
    href,
    icon,
    label,
    onNavigate,
}: {
    href: string;
    icon: "users" | "trending-up";
    label: string;
    onNavigate: () => void;
}) {
    return (
        <Link
            href={href}
            role="menuitem"
            onClick={onNavigate}
            className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 transition-colors hover:bg-stone-50 hover:text-brand-strong"
        >
            <Icon name={icon} size={16} />
            {label}
        </Link>
    );
}

function Avatar({ user, size = 28 }: { user: HeaderUser; size?: number }) {
    if (user.image) {
        return (
            <span
                className="relative shrink-0 overflow-hidden rounded-full bg-white/20"
                style={{ width: size, height: size }}
            >
                <Image src={user.image} alt="" fill sizes={`${size}px`} className="object-cover" />
            </span>
        );
    }

    // Initial rather than a generic silhouette: it identifies the account at a
    // glance and never looks like a broken image.
    return (
        <span
            className="flex shrink-0 items-center justify-center rounded-full bg-brand-accent font-display font-bold text-teal-900"
            style={{ width: size, height: size, fontSize: size * 0.45 }}
        >
            {(user.name.trim()[0] || "?").toUpperCase()}
        </span>
    );
}
