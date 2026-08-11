import clsx from "clsx";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Accordion built on native <details>/<summary>.
 *
 * No JavaScript, no ARIA to get wrong, keyboard- and screen-reader-correct by
 * construction, and the content is in the DOM so search engines index every
 * FAQ answer. `name` groups items so only one stays open at a time.
 */
export function Accordion({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("divide-y divide-stone-200", className)}>{children}</div>;
}

export function AccordionItem({
  question,
  children,
  group,
  defaultOpen,
}: {
  question: ReactNode;
  children: ReactNode;
  group?: string;
  defaultOpen?: boolean;
}) {
  return (
    <details name={group} open={defaultOpen} className="group py-1">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
        <h3 className="font-display text-lg leading-snug font-semibold text-stone-900 group-open:text-brand-strong">
          {question}
        </h3>
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition-transform duration-200 ease-standard group-open:rotate-180 group-open:border-brand-line group-open:text-brand-strong">
          <Icon name="chevron-down" size={16} />
        </span>
      </summary>
      <div className="pb-5 text-[15px] leading-relaxed text-stone-600">{children}</div>
    </details>
  );
}
