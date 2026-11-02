import type { Metadata } from "next";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/server/settings";
import { CartView } from "@/components/cart/cart-view";
import { PageTitle } from "@/components/site/page-title";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your IcePlease order before checkout.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageTitle title="Your cart" />
      <div className="container-page py-10 sm:py-14">
        <CartView maxPerOrder={MAX_QUANTITY_PER_ITEM} />
      </div>
    </>
  );
}
