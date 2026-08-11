"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n";

/**
 * Hero image plus thumbnails, with a lightbox.
 *
 * A missing or 404 image resolves to a branded placeholder rather than a broken
 * image icon — the partial-failure state the brief asks for.
 */
export function ProjectGallery({
  images,
  title,
  locale,
}: {
  images: string[];
  title: string;
  locale: Locale;
}) {
  const list = images.length > 0 ? images : ["/assets/brand/empty-state.png"];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  const src = broken[active] ? "/assets/brand/empty-state.png" : list[active];

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="group relative block aspect-4/3 w-full overflow-hidden rounded-lg bg-stone-100"
        aria-label={locale === "en" ? `Enlarge image of ${title}` : `${title}-এর ছবি বড় করে দেখুন`}
      >
        <Image
          src={src}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover"
          onError={() => setBroken((b) => ({ ...b, [active]: true }))}
        />
        <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-stone-950/60 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Icon name="search" size={14} />
          {locale === "en" ? "Enlarge" : "বড় করুন"}
        </span>
      </button>

      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {list.slice(0, 4).map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={
                locale === "en" ? `Show image ${index + 1}` : `${index + 1} নম্বর ছবি দেখুন`
              }
              aria-current={index === active}
              className={clsx(
                "relative aspect-4/3 overflow-hidden rounded-md border-2 bg-stone-100 transition-colors",
                index === active ? "border-brand" : "border-transparent hover:border-stone-300",
              )}
            >
              <Image
                src={broken[index] ? "/assets/brand/empty-state.png" : image}
                alt=""
                fill
                sizes="140px"
                className="object-cover"
                onError={() => setBroken((b) => ({ ...b, [index]: true }))}
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-stone-950/90 p-6"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label={locale === "en" ? "Close" : "বন্ধ করুন"}
            className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <Icon name="x" size={22} />
          </button>
          <div className="relative h-full max-h-[80vh] w-full max-w-4xl">
            <Image src={src} alt={title} fill sizes="90vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
