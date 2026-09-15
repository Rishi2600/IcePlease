"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, LayoutDashboard, User } from "lucide-react";
import { PRIMARY_NAV } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { CartBadge } from "@/components/site/cart-badge";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);

  // Close the mobile panel on navigation, otherwise it covers the new page.
  React.useEffect(() => setOpen(false), [pathname]);

  // While the panel is open the page behind it must not scroll.
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-frost/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 lg:flex"
        >
          {PRIMARY_NAV.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-surface-sunken text-ink"
                    : "text-ink-soft hover:bg-surface-sunken hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {isAdmin ? (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/admin">
                <LayoutDashboard aria-hidden />
                Admin
              </Link>
            </Button>
          ) : null}

          <Link
            href={session ? "/account" : "/login"}
            aria-label={session ? "Your account" : "Sign in"}
            className="hidden size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-sunken sm:inline-flex"
          >
            <User className="size-5" aria-hidden />
          </Link>

          <CartBadge />

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/shop">Shop</Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-sunken lg:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-line bg-frost lg:hidden"
        >
          <nav aria-label="Main" className="container-page py-6">
            <ul className="space-y-1">
              {PRIMARY_NAV.map((link) => {
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-4 py-3.5 text-lg font-medium transition-colors",
                        active
                          ? "bg-surface text-ink"
                          : "text-ink-soft hover:bg-surface",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 space-y-3 border-t border-line pt-6">
              <Button asChild size="lg" className="w-full">
                <Link href="/shop">Shop IcePlease</Link>
              </Button>
              {isAdmin ? (
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/admin">Admin dashboard</Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href={session ? "/account" : "/login"}>
                  {session ? "Your account" : "Sign in"}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
