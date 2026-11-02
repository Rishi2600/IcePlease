import type { Metadata } from "next";
import Link from "next/link";
import { Snowflake } from "lucide-react";
import { listActiveProducts, listActiveFlavors } from "@/lib/server/catalogue";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Every IcePlease flavor, pack size and price. Flavored ice cubes you drop straight into your drink.",
};

// The catalogue is edited from the admin screens; admin mutations revalidate
// this path, and this window bounds how stale it can get in the meantime.
export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ flavor?: string }>;
}) {
  const [{ flavor }, products, flavors] = await Promise.all([
    searchParams,
    listActiveProducts(),
    listActiveFlavors(),
  ]);

  const activeFlavor =
    flavor && flavors.includes(flavor) ? flavor : null;
  const visible = activeFlavor
    ? products.filter((product) => product.flavor === activeFlavor)
    : products;

  return (
    <div className="relative overflow-x-clip">
      <div className="container-page grid gap-4 pb-8 pt-10 sm:pt-14 lg:grid-cols-2 lg:items-end lg:gap-20">
        <h1 className="text-6xl font-light leading-none tracking-[-0.03em] sm:text-7xl lg:text-8xl">
          Shop
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-fg-soft">
          Each flavor is built around one kind of drink it makes better. Pick
          the one that matches what you actually pour.
        </p>
      </div>

      <div aria-hidden className="water pointer-events-none absolute inset-x-0 h-96" />

      <div className="container-page relative pb-8">
        {flavors.length > 1 ? (
          <nav aria-label="Filter by flavor" className="pt-6">
            <ul className="flex flex-wrap gap-2">
              <li>
                <FilterLink href="/shop" active={!activeFlavor}>
                  All
                </FilterLink>
              </li>
              {flavors.map((item) => (
                <li key={item}>
                  <FilterLink
                    href={`/shop?flavor=${encodeURIComponent(item)}`}
                    active={activeFlavor === item}
                  >
                    {item}
                  </FilterLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <h2 className="sr-only">Products</h2>
        {visible.length > 0 ? (
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 3}
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <EmptyState
            className="mt-10"
            icon={Snowflake}
            title={`Nothing in ${activeFlavor} right now`}
            description="That flavor is not currently on sale. The rest of the range is."
            action={
              <Button asChild variant="outline">
                <Link href="/shop">Show everything</Link>
              </Button>
            }
          />
        ) : (
          <EmptyState
            className="mt-10"
            icon={Snowflake}
            title="The shop is not open yet"
            description="No products have been published. Check back shortly, or get in touch if you want to be told when they are."
            action={
              <Button asChild variant="outline">
                <Link href="/contact">Contact us</Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-fg bg-fg text-page"
          : "border-line-strong text-fg-soft hover:border-fg hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}
