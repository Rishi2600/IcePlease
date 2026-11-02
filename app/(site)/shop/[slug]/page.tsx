import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatMinor } from "@/lib/money";
import {
  getActiveProductBySlug,
  listActiveProducts,
} from "@/lib/server/catalogue";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/server/settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/product/product-visual";
import { ProductCard } from "@/components/product/product-card";
import { AddToCart } from "@/components/product/add-to-cart";
import { EXPERIENCE_STEPS } from "@/lib/brand";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getActiveProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.tagline ?? product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} · IcePlease`,
      description: product.tagline ?? product.description.slice(0, 160),
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getActiveProductBySlug(slug);
  if (!product) notFound();

  const all = await listActiveProducts();
  const related = all.filter((item) => item.id !== product.id).slice(0, 3);

  const outOfStock = product.stock <= 0;

  return (
    <div className="container-page py-6 sm:py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href="/shop">
          <ArrowLeft aria-hidden />
          All products
        </Link>
      </Button>

      <div className="mt-4 grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
        <div className="md:sticky md:top-22 md:self-start">
          <ProductVisual
            name={product.name}
            imageUrl={product.imageUrl}
            accentColor={product.accentColor}
            stock={product.stock}
            priority
            className="aspect-square md:aspect-4/5"
            sizes="(min-width: 768px) 46vw, 92vw"
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="ice">{product.flavor}</Badge>
            {outOfStock ? (
              <Badge tone="solid">Out of stock</Badge>
            ) : product.stock <= 5 ? (
              <Badge tone="citrus">Only {product.stock} left</Badge>
            ) : (
              <Badge tone="mint">In stock</Badge>
            )}
            {product.isSeedData ? (
              <Badge tone="neutral">Demo product</Badge>
            ) : null}
          </div>

          <h1 className="mt-5 text-5xl font-light leading-[1.02] tracking-[-0.03em] lg:text-7xl">
            {product.name}
          </h1>

          {product.tagline ? (
            <p className="mt-4 text-lg text-fg-soft sm:text-xl">
              {product.tagline}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-line pt-6">
            <p className="text-3xl font-medium tabular-nums">
              {formatMinor(product.priceMinor)}
            </p>
            <p className="text-sm text-fg-muted">
              {product.packSize}
              {product.cubeCount
                ? ` · ${formatMinor(
                    Math.round(product.priceMinor / product.cubeCount),
                  )} per cube`
                : ""}
            </p>
          </div>

          <div className="mt-6">
            <AddToCart
              productId={product.id}
              productName={product.name}
              stock={product.stock}
              maxPerOrder={MAX_QUANTITY_PER_ITEM}
            />
          </div>

          <div className="mt-8 border-t border-line pt-8">
            <h2 className="text-2xl font-normal">About this flavor</h2>
            <p className="mt-3 leading-relaxed text-fg-soft">
              {product.description}
            </p>
          </div>

          <div className="mt-8 border-t border-line pt-8">
            <h2 className="text-2xl font-normal">Using it</h2>
            <ol className="mt-4 space-y-3">
              {EXPERIENCE_STEPS.map((step, index) => (
                <li key={step.step} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden className="w-3 shrink-0 tabular-nums text-fg-muted">
                    {index + 1}
                  </span>
                  <p className="text-fg-soft">
                    <span className="font-medium text-fg">{step.step}.</span>{" "}
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 border-t border-line pt-6">
            <div>
              <dt className="text-xs text-fg-muted">Flavor</dt>
              <dd className="mt-1 font-medium">{product.flavor}</dd>
            </div>
            <div>
              <dt className="text-xs text-fg-muted">Pack</dt>
              <dd className="mt-1 font-medium">{product.packSize}</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="text-4xl font-light">Other flavors</h2>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
