import Image from "next/image";
import clsx from "clsx";

/**
 * Brand lockups.
 *
 * The Shathi Sheba mark is the supplied vector. Its wordmark is set as HTML
 * text in the site's display font rather than as SVG <text>: the supplied file
 * specifies `Segoe UI`, which is not the brand face and renders differently on
 * every machine. As real text it stays sharp at any size, inherits the theme,
 * and can carry a Bangla variant.
 *
 * `shathi-sheba-horizontal.svg` keeps the supplied single-file lockup for
 * places that need one image — email signatures, OG cards, print.
 */

export function DigiGramLogo({
  variant = "teal",
  className,
  priority,
}: {
  variant?: "teal" | "white" | "black";
  className?: string;
  priority?: boolean;
}) {
  const src = {
    teal: "/assets/brand/digigram-wordmark-teal.png",
    white: "/assets/brand/digigram-wordmark-white.png",
    black: "/assets/brand/digigram-wordmark-black.png",
  }[variant];

  return (
    <Image
      src={src}
      alt="DigiGram Ventures"
      width={1092}
      height={297}
      priority={priority}
      className={clsx("h-7 w-auto md:h-8", className)}
    />
  );
}

export function ShathiLogo({
  variant = "colour",
  className,
}: {
  variant?: "colour" | "white" | "mark";
  className?: string;
}) {
  if (variant === "mark") {
    return (
      <Image
        src="/assets/brand/shathi-mark.png"
        alt="Shathi"
        width={438}
        height={500}
        className={clsx("h-8 w-auto", className)}
      />
    );
  }

  return (
    <Image
      src={
        variant === "white"
          ? "/assets/brand/shathi-wordmark-white.png"
          : "/assets/brand/shathi-wordmark.png"
      }
      alt="Shathi"
      width={2248}
      height={500}
      className={clsx("h-7 w-auto", className)}
    />
  );
}

export function ShathiShebaLogo({
  className,
  invert,
  locale,
}: {
  className?: string;
  invert?: boolean;
  locale?: "en" | "bn";
}) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/assets/brand/shathi-sheba-mark.svg"
        alt=""
        width={137}
        height={174}
        className="h-8 w-auto"
      />
      <span
        className={clsx(
          "font-display text-xl leading-none font-bold tracking-tight",
          invert ? "text-white" : "text-sheba-600",
        )}
      >
        {locale === "bn" ? "সাথী সেবা" : "Shathi Sheba"}
      </span>
    </span>
  );
}

/** Small colour dot used beside product names in nav and footer. */
export function BrandDot({ brand }: { brand: "shathi" | "shathi-sheba" | "digigram" }) {
  const colour = {
    shathi: "bg-shathi-600",
    "shathi-sheba": "bg-sheba-600",
    digigram: "bg-teal-600",
  }[brand];
  return <span className={clsx("size-2 shrink-0 rounded-full", colour)} aria-hidden="true" />;
}
