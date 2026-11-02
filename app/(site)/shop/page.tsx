import type { Metadata } from "next";
import Link from "next/link";
import { formatMinor } from "@/lib/money";
import { listActiveProducts, listActiveFlavors } from "@/lib/server/catalogue";
import { FlavorTray } from "@/components/product/flavor-tray";
import { QuickAdd } from "@/components/product/quick-add";
import { trayOrder } from "@/components/product/tones";
import { PageTitle } from "@/components/site/page-title";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The collection",
  description:
    "The IcePlease collection of flavored ice, for drinks worth lingering over.",
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

  const activeFlavor = flavor && flavors.includes(flavor) ? flavor : null;
  const visible = trayOrder(
    activeFlavor
      ? products.filter((product) => product.flavor === activeFlavor)
      : products,
  );

  return (
    <>
      <PageTitle title="The collection">
        <p>Each flavor is composed for one kind of drink. Choose by what you are pouring tonight.</p>
        {flavors.length > 1 ? (
          <nav aria-label="Filter by flavor" className="mt-6">
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
      </PageTitle>

      <h2 className="sr-only">Products</h2>
      {visible.length > 0 ? (
        <FlavorTray
          products={visible}
          detail={(product) => (
            <div className="flex flex-col lg:min-h-44">
              <span className="text-2xl font-extrabold">
                {formatMinor(product.priceMinor)}
              </span>
              <span className="mb-3 mt-1 font-semibold leading-tight">
                {product.tagline ?? product.packSize}
              </span>
              {product.stock > 0 ? (
                <QuickAdd productId={product.id} productName={product.name} />
              ) : (
                <span className="mt-auto font-semibold">Out of stock</span>
              )}
            </div>
          )}
        />
      ) : (
        <div className="container-page py-20">
          <h2 className="text-5xl font-black">
            {products.length > 0 ? `No ${activeFlavor} right now` : "The first flavors are on their way"}
          </h2>
          <p className="mt-4 max-w-xl text-lg font-medium">
            {products.length > 0
              ? "That flavor is resting for the moment. The rest of the collection is ready for you."
              : "Tell us what you would love to pour, and we will let you know when they arrive."}
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href={products.length > 0 ? "/shop" : "/contact"}>
              {products.length > 0 ? "See the collection" : "Talk to us"}
            </Link>
          </Button>
        </div>
      )}
    </>
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
        "inline-flex h-11 items-center rounded-full px-4 text-base font-bold shadow-[inset_0_0_0_2px_var(--color-ink)]",
        active ? "bg-ink text-white" : "hover:bg-ink/10",
      )}
    >
      {children}
    </Link>
  );
}
