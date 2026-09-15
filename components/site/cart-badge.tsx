"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function CartBadge({ className }: { className?: string }) {
  const { itemCount, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      className={className}
      aria-label={
        hydrated && itemCount > 0
          ? `Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`
          : "Cart"
      }
    >
      <span className="relative inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-sunken">
        <ShoppingBag className="size-5" aria-hidden />
        {hydrated && itemCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-ice-deep px-1 text-[11px] font-semibold leading-5 text-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
