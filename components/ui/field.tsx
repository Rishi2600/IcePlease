import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Form primitives.
 *
 * Every input is wired to a label and, when invalid, to its error message via
 * aria-describedby + aria-invalid — so the error reaches screen readers rather
 * than only appearing as red text.
 */

export function Label({
  className,
  children,
  hint,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { hint?: string }) {
  return (
    <label
      className={cn("block text-sm font-medium text-ink", className)}
      {...props}
    >
      {children}
      {hint ? (
        <span className="ml-1.5 font-normal text-ink-muted">{hint}</span>
      ) : null}
    </label>
  );
}

const controlStyles =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-muted/70 hover:border-line-strong focus:border-ice-deep disabled:cursor-not-allowed disabled:bg-surface-sunken aria-[invalid=true]:border-danger";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlStyles, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(controlStyles, "min-h-24 resize-y", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(controlStyles, "appearance-none bg-no-repeat pr-9", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235d7a86' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 0.75rem center",
      }}
      {...props}
    />
  );
}

export function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-danger">
      {children}
    </p>
  );
}

/** Label + control + error, with the aria wiring done once. */
export function Field({
  name,
  label,
  hint,
  error,
  children,
  className,
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  children: (props: {
    id: string;
    name: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  }) => React.ReactNode;
  className?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={name} hint={hint}>
        {label}
      </Label>
      {children({
        id: name,
        name,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
