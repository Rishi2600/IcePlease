import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

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
        "inline-flex items-center gap-2 text-ink transition-opacity hover:opacity-80",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-lg bg-ink"
      >
        <span className="block size-4 rounded-[5px] bg-linear-to-br from-ice to-ice-deep" />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">
        {BRAND.name}
      </span>
    </Link>
  );
}
