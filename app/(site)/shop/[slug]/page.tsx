import type { Metadata } from "next";
import Image from "next/image";
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
import { AddToCart } from "@/components/product/add-to-cart";
import { FlavorTray } from "@/components/product/flavor-tray";
import { toneFor, trayOrder } from "@/components/product/tones";
import { cn } from "@/lib/utils";

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

  const all = trayOrder(await listActiveProducts());
  const others = all.filter((item) => item.id !== product.id).slice(0, 4);
  const position = all.findIndex((item) => item.id === product.id);
  const outOfStock = product.stock <= 0;

  return (
    <>
      <section className={toneFor(position, product.stock)}>
        <div className="container-page grid gap-10 pb-14 pt-6 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:pb-20">
          <div>
            <Link
              href="/shop"
              className="inline-flex min-h-11 items-center gap-2 font-bold underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden />
              The collection
            </Link>
            <h1 className="mt-8 text-[clamp(4rem,12vw,11rem)] font-black leading-[0.95] lg:mt-20">
              {product.name}
            </h1>
            {product.tagline ? (
              <p className="mt-5 text-2xl font-semibold">{product.tagline}</p>
            ) : null}
          </div>

          <div className="rounded-card bg-panel p-6 text-fg sm:p-8">
            {product.imageUrl ? (
              <div className="relative mb-6 aspect-square overflow-hidden rounded-xl">
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} flavored ice`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 28rem, 92vw"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
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
            <p className="mt-5 font-display text-5xl font-black">
              {formatMinor(product.priceMinor)}
            </p>
            <p className="mt-1 mb-6 font-medium text-fg-muted">
              {product.packSize}
              {product.cubeCount
                ? `, ${formatMinor(Math.round(product.priceMinor / product.cubeCount))} per cube`
                : ""}
            </p>
            <AddToCart
              productId={product.id}
              productName={product.name}
              stock={product.stock}
              maxPerOrder={MAX_QUANTITY_PER_ITEM}
            />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-page">
          <h2 className="text-5xl font-black sm:text-6xl">The experience</h2>
          <p className="mt-5 max-w-2xl text-xl font-medium leading-relaxed">
            {product.description}
          </p>
        </div>
      </section>

      {others.length > 0 ? (
        <section className={cn("bg-sky pt-14 text-white")}>
          <h2 className="container-page pb-10 text-5xl font-black sm:text-6xl">
            Continue the collection
          </h2>
          <FlavorTray
            products={others}
            detail={(item) => (
              <>
                <span className="text-2xl font-extrabold">
                  {formatMinor(item.priceMinor)}
                </span>
                <span className="mt-1 font-semibold leading-tight">
                  {item.stock > 0 ? item.packSize : "Out of stock"}
                </span>
              </>
            )}
          />
        </section>
      ) : null}
    </>
  );
}
