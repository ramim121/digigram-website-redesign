"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Note } from "@/components/ui/Primitives";
import { formatBdt, formatDate, formatNumber, type Locale } from "@/lib/i18n";
import type { Project } from "@/lib/projects";

/**
 * Units × unit price, with the estimated return band and maturity date.
 *
 * Entirely client-side arithmetic — it never posts anywhere, so it cannot be
 * mistaken for a booking. The "estimated, not guaranteed" line is part of the
 * component rather than page copy, so the disclaimer can never be dropped when
 * the calculator is reused.
 */
export function ReturnCalculator({ project, locale }: { project: Project; locale: Locale }) {
  const en = locale === "en";
  const max = Math.max(1, project.unitsRemaining);
  const [units, setUnits] = useState(1);

  const invested = units * project.unitAmountBdt;
  const low = units * project.returnAmountBdt.min;
  const high = units * project.returnAmountBdt.max;
  const profitLow = low - invested;
  const profitHigh = high - invested;

  const maturity = (() => {
    const base = project.milestones.find((m) => m.label.en === "Project starts")?.date;
    if (!base) return null;
    const date = new Date(base);
    if (Number.isNaN(date.getTime())) return null;
    date.setMonth(date.getMonth() + project.tenureMonths);
    return date.toISOString().slice(0, 10);
  })();

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 lg:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label
            htmlFor="units"
            className="font-display text-sm font-semibold text-stone-700"
          >
            {en ? "Number of units" : "ইউনিট সংখ্যা"}
          </label>
          <div className="mt-2 flex items-center gap-2">
            <StepButton
              onClick={() => setUnits((u) => Math.max(1, u - 1))}
              disabled={units <= 1}
              label={en ? "Decrease" : "কমান"}
              icon="minus"
            />
            <input
              id="units"
              type="number"
              inputMode="numeric"
              min={1}
              max={max}
              value={units}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isNaN(next)) return;
                setUnits(Math.min(max, Math.max(1, Math.floor(next))));
              }}
              className="w-20 rounded-md border border-stone-300 px-3 py-2 text-center font-display text-lg font-bold text-stone-900 focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none"
            />
            <StepButton
              onClick={() => setUnits((u) => Math.min(max, u + 1))}
              disabled={units >= max}
              label={en ? "Increase" : "বাড়ান"}
              icon="plus"
            />
          </div>
          <p className="mt-2 text-xs text-stone-500">
            {en
              ? `${project.unitsRemaining} of ${project.totalUnits} units available`
              : `${project.totalUnits}টির মধ্যে ${project.unitsRemaining}টি ইউনিট উপলব্ধ`}
          </p>
        </div>

        <div className="text-start sm:text-end">
          <p className="text-sm text-stone-500">{en ? "Total invested" : "মোট বিনিয়োগ"}</p>
          <p className="font-display text-3xl font-extrabold text-stone-900 tabular">
            {formatBdt(invested, locale, { variant: "data" })}
          </p>
        </div>
      </div>

      <dl className="mt-7 grid gap-px overflow-hidden rounded-md border border-stone-200 bg-stone-200 sm:grid-cols-3">
        <Cell
          label={en ? "Estimated return" : "প্রাক্কলিত রিটার্ন"}
          value={`${formatBdt(low, locale, { variant: "data" })} – ${formatBdt(high, locale, { variant: "data" })}`}
          emphasis
        />
        <Cell
          label={en ? "Estimated profit" : "প্রাক্কলিত মুনাফা"}
          value={`${formatBdt(profitLow, locale, { variant: "data" })} – ${formatBdt(profitHigh, locale, { variant: "data" })}`}
        />
        <Cell
          label={en ? "Maturity" : "মেয়াদপূর্তি"}
          value={
            formatDate(maturity, locale) ??
            `${formatNumber(project.tenureMonths, locale, "data")} ${en ? "months" : "মাস"}`
          }
        />
      </dl>

      <Note tone="risk" icon="alert-triangle" className="mt-6">
        {en
          ? "These figures are estimates based on the project's production plan and expected sale price. They are not a guarantee, not an offer, and not financial advice. Actual returns can be lower, and your capital is at risk."
          : "এই হিসাব প্রকল্পের উৎপাদন পরিকল্পনা ও প্রত্যাশিত বিক্রয়মূল্যের ভিত্তিতে প্রাক্কলিত। এটি কোনো নিশ্চয়তা নয়, প্রস্তাব নয়, আর্থিক পরামর্শও নয়। প্রকৃত রিটার্ন কম হতে পারে এবং আপনার পুঁজি ঝুঁকিতে থাকে।"}
      </Note>
    </div>
  );
}

function Cell({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="bg-white px-5 py-4">
      <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">{label}</dt>
      <dd
        className={`mt-1.5 font-display text-lg font-bold tabular ${
          emphasis ? "text-brand-strong" : "text-stone-900"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function StepButton({
  onClick,
  disabled,
  label,
  icon,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  icon: "plus" | "minus";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-md border border-stone-300 text-stone-600 transition-colors hover:border-brand hover:text-brand-strong disabled:opacity-40"
    >
      <Icon name={icon} size={17} />
    </button>
  );
}
