"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n";

/**
 * One subtle icon row in brand colours, replacing the four garish coloured
 * share buttons on the current site. Copy-link gives feedback in place — no
 * alert, no toast library.
 */
export function ShareRow({
  url,
  title,
  locale,
}: {
  url: string;
  title: string;
  locale: Locale;
}) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const links: { icon: IconName; href: string; label: string }[] = [
    {
      icon: "facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      label: "Facebook",
    },
    {
      icon: "linkedin",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      label: "LinkedIn",
    },
    { icon: "whatsapp", href: `https://wa.me/?text=${text}%20${encoded}`, label: "WhatsApp" },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the visible links still work */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-display text-sm font-semibold text-stone-500">
        {locale === "en" ? "Share" : "শেয়ার করুন"}
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="flex size-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition-colors hover:border-brand hover:text-brand-strong"
        >
          <Icon name={link.icon} size={16} />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-2 rounded-full border border-stone-200 px-3.5 py-2 text-xs font-semibold text-stone-500 transition-colors hover:border-brand hover:text-brand-strong"
      >
        <Icon name={copied ? "check" : "link"} size={15} />
        {copied
          ? locale === "en"
            ? "Copied"
            : "কপি হয়েছে"
          : locale === "en"
            ? "Copy link"
            : "লিংক কপি"}
      </button>
    </div>
  );
}
