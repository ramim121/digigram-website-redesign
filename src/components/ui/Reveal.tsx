"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

/**
 * Fade + 8px rise on first scroll-in. Restrained by design: 360ms, one axis,
 * no parallax, and `prefers-reduced-motion` short-circuits it in CSS.
 *
 * The element is visible by default and only *hidden* once the observer has
 * confirmed it can run — so a JS failure never leaves the page blank.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={clsx(armed && "reveal", className)}
      data-visible={visible ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
