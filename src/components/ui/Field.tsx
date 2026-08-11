import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/**
 * Form fields with a real <label> for every control — never placeholder-only,
 * which is the accessibility bug on the current contact form. Errors are
 * inline and wired with `aria-describedby`; nothing uses a modal alert.
 */

const control =
  "w-full rounded-md border bg-white px-3.5 py-2.5 text-[15px] text-stone-900 placeholder:text-stone-400 " +
  "transition-[border-color,box-shadow] duration-150 " +
  "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 " +
  "disabled:bg-stone-100 disabled:text-stone-400";

function Wrapper({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="font-display text-sm font-semibold text-stone-700">
        {label}
        {required && (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-stone-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  id,
  label,
  hint,
  error,
  required,
  className,
  prefix,
  ...rest
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  prefix?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} required={required} className={className}>
      {prefix ? (
        <div
          className={clsx(
            "flex items-stretch overflow-hidden rounded-md border bg-white transition-[border-color,box-shadow] duration-150 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25",
            error ? "border-danger" : "border-stone-300",
          )}
        >
          <span className="flex items-center border-r border-stone-200 bg-stone-50 px-3 font-display text-sm font-semibold text-stone-600">
            {prefix}
          </span>
          <input
            id={id}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            className="w-full px-3.5 py-2.5 text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none"
            {...rest}
          />
        </div>
      ) : (
        <input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={clsx(control, error ? "border-danger" : "border-stone-300")}
          {...rest}
        />
      )}
    </Wrapper>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
  ...rest
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={clsx(control, "appearance-none pr-9", error ? "border-danger" : "border-stone-300")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
        {...rest}
      >
        {children}
      </select>
    </Wrapper>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  required,
  className,
  ...rest
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={id}
        required={required}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={clsx(control, "resize-y", error ? "border-danger" : "border-stone-300")}
        {...rest}
      />
    </Wrapper>
  );
}

export function CheckboxField({
  id,
  label,
  error,
  className,
  ...rest
}: {
  id: string;
  label: ReactNode;
  error?: ReactNode;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-4.5 shrink-0 rounded-sm border-stone-300 accent-[var(--brand)]"
          {...rest}
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-stone-600">
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
