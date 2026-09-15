import type { Metadata } from "next";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/server/settings";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your IcePlease order before checkout.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <h1 className="text-4xl font-semibold sm:text-5xl">Your cart</h1>
      <div className="mt-10">
        <CartView maxPerOrder={MAX_QUANTITY_PER_ITEM} />
      </div>
    </div>
  );
}
