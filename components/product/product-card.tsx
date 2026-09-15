import Link from "next/link";
import { formatMinor } from "@/lib/money";
import type { PublicProduct } from "@/lib/server/catalogue";
import { Badge } from "@/components/ui/badge";
import { ProductVisual } from "@/components/product/product-visual";

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
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-line-strong">
      <div className="relative p-3 pb-0">
        <ProductVisual
          name={product.name}
          imageUrl={product.imageUrl}
          accentColor={product.accentColor}
          priority={priority}
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
        />
        {outOfStock ? (
          <Badge tone="solid" className="absolute left-5 top-5">
            Out of stock
          </Badge>
        ) : lowStock ? (
          <Badge tone="citrus" className="absolute left-5 top-5">
            Only {product.stock} left
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight">
            {/* The whole card is the link target; the overlay below does that
                without nesting interactive elements. */}
            <Link href={`/shop/${product.slug}`} className="after:absolute after:inset-0">
              {product.name}
            </Link>
          </h3>
          <p className="shrink-0 text-lg font-semibold">
            {formatMinor(product.priceMinor)}
          </p>
        </div>

        <p className="mt-1 text-sm text-ink-muted">
          {product.flavor} · {product.packSize}
        </p>

        {product.tagline ? (
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {product.tagline}
          </p>
        ) : null}

        <p className="mt-auto pt-4 text-sm font-medium text-ice-deep">
          View flavor
          <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </p>
      </div>
    </article>
  );
}
