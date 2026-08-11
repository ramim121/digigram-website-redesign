"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { Icon } from "@/components/ui/Icon";
import { testimonials } from "@/content/company";
import { t, type Locale } from "@/lib/i18n";

/**
 * Scroll-snap carousel. Native horizontal scrolling does the work — arrows only
 * nudge `scrollBy`, so touch, trackpad, keyboard and screen readers all behave
 * without a gesture library, and the cards are real DOM in reading order.
 */
export function ScrollCarousel({
  children,
  locale,
  itemClassName,
  ariaLabel,
}: {
  children: ReactNode;
  locale: Locale;
  itemClassName?: string;
  ariaLabel: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  function nudge(direction: 1 | -1) {
    const node = track.current;
    if (!node) return;
    const step = node.clientWidth * 0.8;
    node.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={track}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className={clsx(
          "no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2",
          "md:mx-0 md:px-0",
          itemClassName,
        )}
      >
        {children}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <CarouselButton
          onClick={() => nudge(-1)}
          label={locale === "en" ? "Previous" : "আগের"}
          icon="chevron-left"
        />
        <CarouselButton
          onClick={() => nudge(1)}
          label={locale === "en" ? "Next" : "পরের"}
          icon="chevron-right"
        />
      </div>
    </div>
  );
}

function CarouselButton({
  onClick,
  label,
  icon,
}: {
  onClick: () => void;
  label: string;
  icon: "chevron-left" | "chevron-right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 transition-colors duration-150 hover:border-brand hover:text-brand-strong"
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

/* --------------------------------------------------------- testimonials -- */

export function TestimonialCarousel({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];

  function move(step: number) {
    setIndex((current) => (current + step + testimonials.length) % testimonials.length);
  }

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-5">
        <div className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-lg bg-stone-100">
          <Image
            src={item.photo}
            alt={t(item.name, locale)}
            fill
            sizes="(min-width: 1024px) 420px, 80vw"
            className="object-cover"
          />
        </div>
      </div>

      <figure className="lg:col-span-7">
        <Icon name="quote" size={36} className="text-brand/25" />
        <blockquote className="mt-5 font-display text-2xl leading-snug font-semibold text-balance text-stone-900 lg:text-3xl">
          “{t(item.quote, locale)}”
        </blockquote>
        <p className="mt-5 text-[15px] leading-relaxed text-stone-600">{t(item.story, locale)}</p>

        <figcaption className="mt-6">
          <p className="font-display text-lg font-bold text-stone-900">{t(item.name, locale)}</p>
          <p className="text-sm text-stone-500">
            {t(item.role, locale)} · {t(item.district, locale)}
          </p>
        </figcaption>

        <div className="mt-8 flex items-center gap-3">
          <CarouselButton
            onClick={() => move(-1)}
            label={locale === "en" ? "Previous voice" : "আগের বক্তব্য"}
            icon="chevron-left"
          />
          <CarouselButton
            onClick={() => move(1)}
            label={locale === "en" ? "Next voice" : "পরের বক্তব্য"}
            icon="chevron-right"
          />
          <div className="ms-2 flex gap-1.5" aria-hidden="true">
            {testimonials.map((entry, dot) => (
              <span
                key={entry.name.en}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-200",
                  dot === index ? "w-6 bg-brand" : "w-1.5 bg-stone-300",
                )}
              />
            ))}
          </div>
        </div>
      </figure>
    </div>
  );
}
