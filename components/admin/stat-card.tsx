import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  /** Says what the number means or what it excludes. Not decoration. */
  hint?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-ink-muted">{label}</p>
        {Icon ? (
          <Icon className="size-4 shrink-0 text-ice-deep" aria-hidden />
        ) : null}
      </div>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}
