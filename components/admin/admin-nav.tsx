"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ReceiptText,
  Users,
  Building2,
  MessageSquare,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { SignOutButton } from "@/components/site/sign-out-button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/inquiries", label: "B2B enquiries", icon: Building2 },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export function AdminNav({
  counts,
  adminName,
}: {
  counts: { orders: number; inquiries: number; messages: number };
  adminName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  const badgeFor = (href: string) =>
    href === "/admin/orders"
      ? counts.orders
      : href === "/admin/inquiries"
        ? counts.inquiries
        : href === "/admin/messages"
          ? counts.messages
          : 0;

  const nav = (
    <nav aria-label="Admin" className="flex-1">
      <ul className="space-y-1">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const badge = badgeFor(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:bg-surface-sunken hover:text-ink",
                )}
              >
                <link.icon className="size-4 shrink-0" aria-hidden />
                <span className="flex-1">{link.label}</span>
                {badge > 0 ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      active ? "bg-white/20" : "bg-citrus/40 text-citrus-deep",
                    )}
                  >
                    {badge}
                    <span className="sr-only"> needing attention</span>
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const footer = (
    <div className="space-y-3 border-t border-line pt-4">
      <p className="truncate px-3 text-xs text-ink-muted">
        Signed in as {adminName}
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
      >
        <ExternalLink className="size-4" aria-hidden />
        View the site
      </Link>
      <div className="px-3">
        <SignOutButton className="w-full" />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-frost px-4 lg:hidden">
        <Logo href="/admin" />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-surface-sunken"
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {open ? (
        <div
          id="admin-mobile-nav"
          className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col gap-4 overflow-y-auto border-t border-line bg-frost p-4 lg:hidden"
        >
          {nav}
          {footer}
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 border-r border-line bg-frost p-4 lg:flex">
        <div className="px-1">
          <Logo href="/admin" />
          <p className="mt-1 px-0.5 text-xs font-medium uppercase tracking-wider text-ink-muted">
            Admin
          </p>
        </div>
        {nav}
        {footer}
      </aside>
    </>
  );
}
