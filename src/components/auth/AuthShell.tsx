import Link from "next/link";
import type { ReactNode } from "react";
import { DigiGramLogo } from "@/components/brand/Logo";
import { localePath, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/site";

/**
 * Narrow, calm frame for the phone → OTP → profile screens.
 * Chrome stays teal here as everywhere else; nothing on these screens is
 * product-branded.
 */
export function AuthShell({
  locale,
  step,
  totalSteps,
  title,
  lead,
  children,
  footer,
}: {
  locale: Locale;
  step?: number;
  totalSteps?: number;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 px-5 pt-24 pb-16 lg:pt-32">
      <div className="mx-auto w-full max-w-md">
        <Link href={localePath(locale, routes.home)} className="mb-8 inline-block">
          <DigiGramLogo variant="teal" className="h-7 w-auto" />
        </Link>

        {step && totalSteps && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
              <span>
                {locale === "en" ? `Step ${step} of ${totalSteps}` : `ধাপ ${step} / ${totalSteps}`}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-300 ease-standard"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm lg:p-8">
          <h1 className="font-display text-2xl leading-tight font-bold text-stone-900">{title}</h1>
          {lead && <p className="mt-2 text-[15px] leading-relaxed text-stone-600">{lead}</p>}
          <div className="mt-7">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm text-stone-500">{footer}</div>}
      </div>
    </div>
  );
}
