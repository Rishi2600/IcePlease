import Link from "next/link";
import { formatMinor } from "@/lib/money";
import type { PublicProduct } from "@/lib/server/catalogue";
import { Badge } from "@/components/ui/badge";
import { ProductVisual } from "@/components/product/product-visual";

/** Set like a line on a bar menu: name, dotted leader, price. */
export function ProductCard({
  product,
  priority = false,
}: {
  product: PublicProduct;
  priority?: boolean;
}) {
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;

  return (
    <article className="group relative flex min-w-0 flex-col">
      <div className="relative">
        <ProductVisual
          name={product.name}
          imageUrl={product.imageUrl}
          accentColor={product.accentColor}
          stock={product.stock}
          priority={priority}
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
        />
        {outOfStock ? (
          <Badge tone="solid" className="absolute left-3 top-3">
            Out of stock
          </Badge>
        ) : lowStock ? (
          <Badge tone="neutral" className="absolute left-3 top-3">
            Only {product.stock} left
          </Badge>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline gap-2.5">
        <h3 className="min-w-0 text-2xl font-normal leading-tight md:max-lg:text-xl">
          {/* The whole card is the link target; the overlay below does that
              without nesting interactive elements. */}
          <Link
            href={`/shop/${product.slug}`}
            className="underline-offset-4 after:absolute after:inset-0 after:rounded-card group-hover:underline"
          >
            {product.name}
          </Link>
        </h3>
        <span
          aria-hidden
          className="min-w-4 flex-1 self-end border-b border-dotted border-line-strong pb-1.5"
        />
        <p className="shrink-0 text-lg font-medium tabular-nums">
          {formatMinor(product.priceMinor)}
        </p>
      </div>

      <p className="mt-1 text-sm text-fg-muted">
        {product.flavor} · {product.packSize}
      </p>

      {product.tagline ? (
        <p className="mt-2 text-sm leading-relaxed text-fg-soft">
          {product.tagline}
        </p>
      ) : null}
    </article>
  );
}
