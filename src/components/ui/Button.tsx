import Link from "next/link";
import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * One button, three brand layers.
 *
 * Colour comes from `--brand` / `--on-brand`, so the same component renders
 * teal in site chrome, purple inside a `[data-brand="shathi"]` region and wine
 * inside `[data-brand="shathi-sheba"]` — with no variant per brand.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-standard " +
  "disabled:opacity-45 disabled:pointer-events-none active:translate-y-px text-center";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-brand hover:bg-brand-strong shadow-sm hover:shadow-md",
  secondary:
    "bg-transparent text-brand-strong border border-brand-line hover:bg-brand-tint hover:border-brand",
  ghost: "bg-transparent text-brand-strong hover:bg-brand-tint",
  inverse: "bg-white text-brand-strong hover:bg-white/90 shadow-sm",
  danger: "bg-danger text-white hover:brightness-95",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

export function buttonClass({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: Pick<CommonProps, "variant" | "size" | "fullWidth" | "className">) {
  return clsx(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  fullWidth,
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClass({ variant, size, fullWidth, className })} {...rest}>
      {icon && iconPosition === "left" && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {icon && iconPosition === "right" && <Icon name={icon} size={18} />}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  fullWidth,
  className,
  children,
  external,
  ...rest
}: CommonProps & {
  href: string;
  external?: boolean;
  "aria-label"?: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
}) {
  const content = (
    <>
      {icon && iconPosition === "left" && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {icon && iconPosition === "right" && <Icon name={icon} size={18} />}
    </>
  );

  const cls = buttonClass({ variant, size, fullWidth, className });

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}

/** Text link with a trailing arrow — the site's standard "read more" affordance. */
export function ArrowLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = clsx(
    "group inline-flex items-center gap-1.5 font-display font-semibold text-[15px] text-brand-strong",
    "hover:text-brand transition-colors duration-150",
    className,
  );
  const inner = (
    <>
      <span className="underline-offset-4 group-hover:underline">{children}</span>
      <Icon
        name="arrow-right"
        size={17}
        className="transition-transform duration-200 ease-standard group-hover:translate-x-0.5"
      />
    </>
  );

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
