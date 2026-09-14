"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";

/**
 * Cross-fading background for the homepage hero.
 *
 * SCOPE
 * The homepage only. Every other page keeps a single still image: a rotating
 * background is a device for the one page whose job is the pitch, and repeating
 * it on `/about` or `/impact` would turn a signature into a tic.
 *
 * WHAT IT IS NOT
 * It is not a content carousel. The headline, the copy and the buttons do not
 * change between slides — only the photograph behind them. Slides that swap the
 * message are a well-documented way to have most visitors read none of it, and
 * they put the primary call to action on a timer.
 *
 * ACCESSIBILITY
 * The images are decorative (`alt=""`), the container is `aria-hidden`, and
 * nothing here is reachable by keyboard, because there is nothing to reach: no
 * information exists in one slide that is missing from another. Under
 * `prefers-reduced-motion` the rotation does not start at all and the first
 * frame simply stays. Rotation also pauses while the tab is hidden, so a
 * backgrounded tab is not decoding images nobody is looking at.
 *
 * IMAGE REQUIREMENTS — READ BEFORE ADDING A SLIDE
 * These render full-bleed at `sizes="100vw"`, so on a desktop display each one
 * is asked to cover roughly 2560×1100. Anything smaller is upscaled by the
 * browser and looks exactly as soft as it is. The first version of this hero
 * used a 479×551 photograph, which is a 4× upscale on a normal laptop and the
 * single biggest reason the old hero looked cheap.
 *
 * Supply at least 2400px wide, 16:9-ish, and let `next/image` produce the AVIF
 * and WebP variants — `next.config.ts` already lists both formats, so a large
 * source is compressed hard at serve time without being blurry at rest.
 */

export type HeroSlide = {
    src: string;
    /**
     * What the photograph shows, for the alt text of the first (LCP) slide only.
     * Later slides are decorative duplicates of the same idea.
     */
    caption?: { en: string; bn: string };
};

export function HeroCarousel({
    slides,
    locale,
    /** Seconds each slide holds before the cross-fade begins. */
    interval = 6,
}: {
    slides: HeroSlide[];
    locale: Locale;
    interval?: number;
}) {
    const [active, setActive] = useState(0);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (slides.length < 2) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (reduced.matches) return;

        function start() {
            if (timer.current) return;
            timer.current = setInterval(
                () => setActive((index) => (index + 1) % slides.length),
                interval * 1000,
            );
        }
        function stop() {
            if (!timer.current) return;
            clearInterval(timer.current);
            timer.current = null;
        }
        // A hidden tab should not be paying to decode images.
        function onVisibility() {
            if (document.hidden) stop();
            else start();
        }

        start();
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            stop();
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [slides.length, interval]);

    return (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
            {slides.map((slide, index) => (
                <Image
                    key={slide.src}
                    src={slide.src}
                    alt=""
                    fill
                    /*
                     * Only the first slide is a priority load — it is the LCP
                     * element. Marking all of them priority would have the
                     * browser fetch every hero image before the page is usable,
                     * which is slower than no carousel at all.
                     */
                    priority={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                    sizes="100vw"
                    className={clsx(
                        "object-cover object-center transition-opacity duration-1000 ease-standard",
                        index === active ? "opacity-60" : "opacity-0",
                    )}
                />
            ))}

            {/*
                Progress pips. Deliberately not buttons: there is nothing to
                choose between, so a control would promise a difference the
                slides do not deliver. They exist so the fade reads as intended
                rather than as the page repainting.
            */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 lg:bottom-8">
                    {slides.map((slide, index) => (
                        <span
                            key={slide.src}
                            className={clsx(
                                "h-1 rounded-full transition-all duration-500",
                                index === active ? "w-7 bg-white/75" : "w-2.5 bg-white/30",
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/** The alt text a screen reader gets, rendered once outside the decorative layer. */
export function heroAlt(slides: HeroSlide[], locale: Locale): string {
    return slides[0]?.caption?.[locale] ?? "";
}
