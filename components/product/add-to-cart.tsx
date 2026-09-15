"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { useCart } from "@/components/cart/cart-provider";

/**
 * Add-to-cart for the product page.
 *
 * Out-of-stock products render a disabled control with an explanation rather
 * than a button that silently does nothing.
 */
export function AddToCart({
  productId,
  productName,
  stock,
  maxPerOrder,
}: {
  productId: string;
  productName: string;
  stock: number;
  maxPerOrder: number;
}) {
  const { addItem, quantityOf, hydrated } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [justAdded, setJustAdded] = React.useState(false);

  const inCart = hydrated ? quantityOf(productId) : 0;
  const limit = Math.max(0, Math.min(stock, maxPerOrder) - inCart);

  React.useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 2600);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  if (stock <= 0) {
    return (
      <div className="rounded-xl border border-line bg-surface-sunken px-4 py-4 text-sm text-ink-soft">
        <p className="font-medium text-ink">Out of stock</p>
        <p className="mt-1">
          This flavor is not available right now. Everything else in the shop
          is ready to ship.
        </p>
      </div>
    );
  }

  if (hydrated && limit <= 0) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-line bg-surface-sunken px-4 py-4 text-sm text-ink-soft">
          <p className="font-medium text-ink">
            All {inCart} available in your cart
          </p>
          <p className="mt-1">
            {stock <= maxPerOrder
              ? `Only ${stock} left in stock.`
              : `Limited to ${maxPerOrder} per order.`}
          </p>
        </div>
        <Button asChild size="lg" variant="outline" className="w-full">
          <Link href="/cart">Go to cart</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          max={Math.max(1, limit)}
          onChange={setQuantity}
          label={productName}
        />
        <Button
          size="lg"
          className="min-w-44 flex-1"
          onClick={() => {
            addItem(productId, quantity);
            setQuantity(1);
            setJustAdded(true);
          }}
        >
          <ShoppingBag aria-hidden />
          Add to cart
        </Button>
      </div>

      <p aria-live="polite" className="min-h-6 text-sm">
        {justAdded ? (
          <span className="inline-flex items-center gap-1.5 text-mint-deep">
            <Check className="size-4" aria-hidden />
            Added.{" "}
            <Link href="/cart" className="underline underline-offset-2">
              View cart
            </Link>
          </span>
        ) : inCart > 0 ? (
          <span className="text-ink-muted">{inCart} already in your cart</span>
        ) : null}
      </p>
    </div>
  );
}
