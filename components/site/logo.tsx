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
        "inline-flex items-center rounded-sm font-paint text-3xl transition-opacity hover:opacity-80",
        className,
      )}
    >
      <span translate="no">{BRAND.name}</span>
    </Link>
  );
}
