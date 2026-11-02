import Link from "next/link";
import type { PublicProduct } from "@/lib/server/catalogue";
import { cn } from "@/lib/utils";
import { toneFor } from "@/components/product/tones";

/** Flavors as full-height columns of colour, like a freezer tray. */
export function FlavorTray({
  products,
  detail,
}: {
  products: PublicProduct[];
  detail: (product: PublicProduct) => React.ReactNode;
}) {
  return (
    <ul
      className="tray"
      style={
        { "--tray-columns": Math.min(products.length, 6) } as React.CSSProperties
      }
    >
      {products.map((product, index) => (
        <li
          key={product.id}
          className={cn("slot relative", toneFor(index, product.stock))}
        >
          {/* Covers the column, so the whole colour opens the product. */}
          <Link
            href={`/shop/${product.slug}`}
            aria-label={product.name}
            className="absolute inset-0 z-0"
          />
          <h3 aria-hidden className="slot-name font-black">
            {product.name}
          </h3>
          <div className="slot-detail">{detail(product)}</div>
        </li>
      ))}
    </ul>
  );
}
