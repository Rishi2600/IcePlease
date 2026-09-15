"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  label,
  size = "md",
  className,
}: {
  value: number;
  min?: number;
  max: number;
  onChange: (next: number) => void;
  /** Names the product, so screen readers hear which quantity is changing. */
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const button =
    size === "sm"
      ? "size-8 [&_svg]:size-3.5"
      : "size-10 [&_svg]:size-4";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-surface",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${label}`}
        className={cn(
          "grid place-items-center rounded-full text-ink transition-colors hover:bg-surface-sunken disabled:pointer-events-none disabled:opacity-40",
          button,
        )}
      >
        <Minus aria-hidden />
      </button>

      <span
        aria-live="polite"
        className={cn(
          "min-w-8 text-center text-sm font-semibold tabular-nums",
          size === "sm" && "min-w-6",
        )}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
        className={cn(
          "grid place-items-center rounded-full text-ink transition-colors hover:bg-surface-sunken disabled:pointer-events-none disabled:opacity-40",
          button,
        )}
      >
        <Plus aria-hidden />
      </button>
    </div>
  );
}
