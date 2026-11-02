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
  const toggleRef = React.useRef<HTMLButtonElement>(null);

  // Close the mobile panel on navigation, otherwise it covers the new page.
  React.useEffect(() => setOpen(false), [pathname]);

  // While the panel is open the page behind it must not scroll or take focus.
  React.useEffect(() => {
    const behind = document.querySelectorAll<HTMLElement>("main, footer");
    document.body.style.overflow = open ? "hidden" : "";
    behind.forEach((element) => {
      element.inert = open;
    });
    return () => {
      document.body.style.overflow = "";
      behind.forEach((element) => {
        element.inert = false;
      });
    };
  }, [open]);

  const isAdmin = session?.user?.role === "ADMIN";

  // Solid on purpose: backdrop-filter would trap the fixed panel in the header.
  return (
    <header
      className="sticky top-0 z-50 bg-orange text-ink"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
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
                  "rounded-full px-3.5 py-2 text-base font-semibold underline-offset-[6px] hover:underline",
                  active && "underline",
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
            className="hidden size-10 items-center justify-center rounded-full transition-colors hover:bg-ink/10 sm:inline-flex"
          >
            <User className="size-5" aria-hidden />
          </Link>

          <CartBadge />

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-ink/10 lg:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-20 z-50 overflow-y-auto overscroll-contain bg-orange lg:hidden"
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
                        "block py-2 font-display text-5xl font-black underline-offset-8 hover:underline",
                        active && "underline",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 space-y-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/shop">Explore the collection</Link>
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
