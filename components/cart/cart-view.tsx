"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/components/cart/cart-provider";
import { usePricedCart } from "@/components/cart/use-priced-cart";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { OrderSummary } from "@/components/cart/order-summary";

export function CartView({ maxPerOrder }: { maxPerOrder: number }) {
  const { setQuantity, removeItem } = useCart();
  const { cart, isLoading, error } = usePricedCart();

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (error || !cart) {
    return (
      <Alert tone="error" title="We could not load your cart">
        {error ?? "Please refresh the page and try again."}
      </Alert>
    );
  }

  if (cart.isEmpty) {
    return (
      <>
        {cart.issues.length > 0 ? (
          <div className="mb-6 space-y-3">
            {cart.issues.map((issue) => (
              <Alert key={issue.productId} tone="info">
                {issue.message}
              </Alert>
            ))}
          </div>
        ) : null}
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Pick a flavor and it will show up here."
          action={
            <Button asChild>
              <Link href="/shop">Browse flavors</Link>
            </Button>
          }
        />
      </>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
      <div>
        {cart.issues.length > 0 ? (
          <div className="mb-6 space-y-3">
            {cart.issues.map((issue) => (
              <Alert key={issue.productId} tone="info" title="Cart updated">
                {issue.message}
              </Alert>
            ))}
          </div>
        ) : null}

        <ul className="divide-y divide-line border-y border-line">
          {cart.lines.map((line) => (
            <CartLineItem
              key={line.productId}
              line={line}
              maxPerOrder={maxPerOrder}
              onQuantityChange={(quantity) =>
                setQuantity(line.productId, quantity)
              }
              onRemove={() => removeItem(line.productId)}
            />
          ))}
        </ul>

        <Button asChild variant="link" size="sm" className="mt-6 px-0">
          <Link href="/shop">Keep shopping</Link>
        </Button>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary
          subtotalMinor={cart.subtotalMinor}
          deliveryFeeMinor={cart.deliveryFeeMinor}
          totalMinor={cart.totalMinor}
          itemCount={cart.itemCount}
        >
          <Button asChild size="lg" className="w-full">
            <Link href="/checkout">
              Checkout
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <p className="mt-3 text-center text-xs text-ink-muted">
            Prices are confirmed against the catalogue when your order is placed.
          </p>
        </OrderSummary>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
      <div
        className="space-y-5 border-y border-line py-5"
        role="status"
        aria-label="Loading your cart"
      >
        {[0, 1].map((row) => (
          <div key={row} className="flex animate-pulse gap-4">
            <div className="size-20 shrink-0 rounded-card bg-surface-sunken sm:size-24" />
            <div className="flex-1 space-y-2.5 py-1">
              <div className="h-4 w-2/5 rounded bg-surface-sunken" />
              <div className="h-3 w-3/5 rounded bg-surface-sunken" />
              <div className="h-8 w-28 rounded-full bg-surface-sunken" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-56 animate-pulse rounded-card bg-surface-sunken" />
    </div>
  );
}
