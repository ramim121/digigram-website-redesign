"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/auth/session";
import { Button } from "@/components/ui/Button";
import { localePath, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * Signs out by asking the server to clear the httpOnly cookie — client script
 * cannot delete it, which is the point of it being httpOnly.
 *
 * POST, not a link: a GET logout can be fired by any cross-site image tag or a
 * link prefetcher, which signs people out at random.
 */
export function SignOutButton({ locale }: { locale: Locale }) {
    const en = locale === "en";
    const router = useRouter();
    const { signOut } = useSession();
    const [busy, setBusy] = useState(false);

    async function submit() {
        setBusy(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch {
            /* Clearing local state below still signs the person out visually;
               the cookie expires on its own if the request never landed. */
        }
        signOut();
        router.replace(localePath(locale, routes.home));
        router.refresh();
    }

    return (
        <Button variant="ghost" onClick={() => void submit()} disabled={busy}>
            {en ? "Sign out" : "সাইন আউট"}
        </Button>
    );
}
