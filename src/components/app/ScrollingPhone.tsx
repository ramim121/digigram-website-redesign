import Image from "next/image";
import clsx from "clsx";
import type { CSSProperties } from "react";

/**
 * A long app screenshot scrolling inside a phone-shaped frame.
 *
 * THE PROBLEM IT SOLVES
 * App captures of a real, populated screen are tall — the Shathi Sheba home
 * screen runs to roughly 1:2.8, and the sale-earnings screen to 1:2. Rendering
 * one at `h-auto` inside a marketing layout produces a phone several times
 * taller than anything around it; cropping it to a phone aspect throws away
 * everything below the fold, which on this product is most of the evidence that
 * it is finished. Scrolling the content inside a correctly-shaped frame keeps
 * both the shape and the content.
 *
 * HOW THE TRAVEL IS COMPUTED
 * The frame is `aspect`-locked (9:19.5 by default — a modern handset). The image
 * fills the frame's width, so its rendered height is `width × height/width` of
 * the source. The distance it must travel to reveal its last pixel is
 * `imageHeight − frameHeight`, and CSS `translateY` percentages resolve against
 * the element's own height, so that distance as a fraction is:
 *
 *     1 − frameHeight/imageHeight
 *       = 1 − (aspect × sourceWidth) / sourceHeight
 *
 * Doing it from the intrinsic dimensions rather than a hand-tuned magic number
 * means a re-captured screenshot of a different length just works — which
 * matters, because these captures are re-taken every time the app ships.
 *
 * A capture shorter than the frame yields a non-positive travel; that clamps to
 * zero and the image simply sits still rather than drifting upward into blank
 * space.
 */
export function ScrollingPhone({
  src,
  alt,
  width,
  height,
  /** Frame aspect as height ÷ width. 19.5/9 is a current handset. */
  aspect = 19.5 / 9,
  /** One full top-to-bottom pass, in seconds. */
  duration = 26,
  priority,
  sizes = "(min-width: 1024px) 300px, 70vw",
  className,
  frameClassName,
}: {
  src: string;
  alt: string;
  /** Intrinsic pixel dimensions of the source capture. */
  width: number;
  height: number;
  aspect?: number;
  duration?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Extra classes for the frame itself — e.g. the ring colour. */
  frameClassName?: string;
}) {
  const travelFraction = Math.max(0, 1 - (aspect * width) / height);
  const travel = `-${(travelFraction * 100).toFixed(2)}%`;

  return (
    <div className={clsx("mx-auto w-full", className)}>
      <div
        className={clsx(
          "app-scroll relative w-full rounded-[2rem] bg-white shadow-2xl",
          frameClassName ?? "ring-8 ring-white/10",
        )}
        style={
          {
            aspectRatio: `9 / ${(aspect * 9).toFixed(2)}`,
            "--app-scroll-travel": travel,
            "--app-scroll-duration": `${duration}s`,
          } as CSSProperties
        }
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={sizes}
          className="app-scroll__screen"
        />
      </div>
    </div>
  );
}
