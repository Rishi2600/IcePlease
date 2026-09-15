import { cn } from "@/lib/utils";

/**
 * Admin table primitives.
 *
 * Dense by design — the admin is a working tool, not a marketing page. Each
 * table lives in its own horizontal scroll container so narrow screens scroll
 * the table rather than the whole page.
 */

export function TableWrap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-card border border-line bg-surface",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full min-w-3xl text-sm">{children}</table>;
}

export function Th({
  children,
  className,
  align = "left",
}: {
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-muted",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  align = "left",
}: {
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <td
      className={cn(
        "border-b border-line px-4 py-3 align-middle",
        align === "right" ? "text-right tabular-nums" : "",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="transition-colors hover:bg-frost">{children}</tr>;
}
