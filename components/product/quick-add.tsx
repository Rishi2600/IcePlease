"use client";

import * as React from "react";
import { useCart } from "@/components/cart/cart-provider";

/** Adds one to the cart from the tray, and says so on the button. */
export function QuickAdd({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <button
      type="button"
      aria-label={`Add ${productName} to cart`}
      onClick={() => {
        addItem(productId);
        setAdded(true);
      }}
      className="relative z-10 mt-auto inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-(--tone-btn-bg) px-5 font-bold text-(--tone-btn-fg) focus-visible:outline-current"
    >
      <span aria-live="polite">{added ? "Added" : "Add to cart"}</span>
    </button>
  );
}
