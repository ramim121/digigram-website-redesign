"use client";

import { useId, useState, type ReactNode } from "react";
import clsx from "clsx";

export type TabItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
};

/** Keyboard-navigable tab set (arrow keys, Home/End) with roving tabindex. */
export function Tabs({ items, className }: { items: TabItem[]; className?: string }) {
  const [active, setActive] = useState(0);
  const uid = useId();

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const last = items.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        onKeyDown={onKeyDown}
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0"
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            id={`${uid}-tab-${index}`}
            role="tab"
            type="button"
            aria-selected={index === active}
            aria-controls={`${uid}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={clsx(
              "shrink-0 rounded-full border px-4 py-2 font-display text-sm font-semibold transition-colors duration-150",
              index === active
                ? "border-brand bg-brand text-on-brand"
                : "border-stone-200 bg-white text-stone-600 hover:border-brand-line hover:text-brand-strong",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          id={`${uid}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${index}`}
          hidden={index !== active}
          className="pt-8"
        >
          {index === active && item.content}
        </div>
      ))}
    </div>
  );
}
