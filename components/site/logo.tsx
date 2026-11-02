import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** The brand idea in two shapes: a cube, and the drop leaving it. */
const MARK = (
  <svg viewBox="0 0 28 32" className="h-8 w-7" aria-hidden focusable="false">
    <path
      d="M14 2 25 8.4v12.2L14 27 3 20.6V8.4Z"
      fill="var(--color-panel)"
      stroke="var(--color-fg)"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M14 2 25 8.4 14 14.8 3 8.4Z" fill="var(--color-fg)" />
    <path d="M14 14.8V27L3 20.6V8.4Z" fill="var(--color-electric)" />
    <path
      d="M14 23c2.2 2.9 3.3 4.3 3.3 5.7a3.3 3.3 0 0 1-6.6 0c0-1.4 1.1-2.8 3.3-5.7Z"
      fill="var(--color-accent)"
      stroke="var(--color-page)"
      strokeWidth="1"
    />
  </svg>
);

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-sm text-fg transition-opacity hover:opacity-80",
        className,
      )}
    >
      {MARK}
      <span
        translate="no"
        className="font-display text-2xl font-normal tracking-tight [font-variation-settings:'SOFT'_100]"
      >
        {BRAND.name}
      </span>
    </Link>
  );
}
