import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Snowflake } from "lucide-react";
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
    <div className="container-page py-8 sm:py-12">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href="/shop">
          <ArrowLeft aria-hidden />
          All products
        </Link>
      </Button>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductVisual
            name={product.name}
            imageUrl={product.imageUrl}
            accentColor={product.accentColor}
            priority
            sizes="(min-width: 1024px) 34rem, 92vw"
          />
        </div>

        <div>
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

          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            {product.name}
          </h1>

          {product.tagline ? (
            <p className="mt-3 text-lg text-ink-soft">{product.tagline}</p>
          ) : null}

          <p className="mt-6 font-display text-3xl font-semibold">
            {formatMinor(product.priceMinor)}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {product.packSize}
            {product.cubeCount
              ? ` · ${formatMinor(
                  Math.round(product.priceMinor / product.cubeCount),
                )} per cube`
              : ""}
          </p>

          <div className="mt-8">
            <AddToCart
              productId={product.id}
              productName={product.name}
              stock={product.stock}
              maxPerOrder={MAX_QUANTITY_PER_ITEM}
            />
          </div>

          <div className="mt-10 border-t border-line pt-8">
            <h2 className="text-lg font-semibold">About this flavor</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              {product.description}
            </p>
          </div>

          <div className="mt-8 border-t border-line pt-8">
            <h2 className="text-lg font-semibold">Using it</h2>
            <ol className="mt-4 space-y-3">
              {EXPERIENCE_STEPS.map((step) => (
                <li key={step.step} className="flex gap-3">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-ice-deep"
                    aria-hidden
                  />
                  <p className="text-sm leading-relaxed text-ink-soft">
                    <span className="font-medium text-ink">{step.step}.</span>{" "}
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line">
            <div className="bg-surface p-5">
              <dt className="text-xs uppercase tracking-wider text-ink-muted">
                Flavor
              </dt>
              <dd className="mt-1 font-medium">{product.flavor}</dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="text-xs uppercase tracking-wider text-ink-muted">
                Pack
              </dt>
              <dd className="mt-1 font-medium">{product.packSize}</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20 border-t border-line pt-12">
          <div className="flex items-center gap-2">
            <Snowflake className="size-4 text-ice-deep" aria-hidden />
            <h2 className="text-2xl font-semibold">Other flavors</h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
