import type { Metadata } from "next";
import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMinor } from "@/lib/money";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Table, TableWrap, Td, Th, Tr } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductVisual } from "@/components/product/product-visual";
import {
  ActiveToggle,
  DeleteProductButton,
  StockControl,
} from "@/components/admin/product-row-actions";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { orderItems: true } } },
  });

  const seedCount = products.filter((product) => product.isSeedData).length;

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="The shop shows active products only. Deactivating hides a product without touching order history."
        action={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus aria-hidden />
              New product
            </Link>
          </Button>
        }
      />

      {seedCount > 0 ? (
        <div className="mb-6 rounded-xl border border-citrus/40 bg-citrus/15 px-4 py-3 text-sm text-citrus-deep">
          <strong className="font-semibold">
            {seedCount} demo {seedCount === 1 ? "product" : "products"}.
          </strong>{" "}
          These came from the development seed and are not real IcePlease
          product information. Replace or delete them before taking real orders.
        </div>
      ) : null}

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Add your first product and it will appear in the shop straight away."
          action={
            <Button asChild>
              <Link href="/admin/products/new">New product</Link>
            </Button>
          }
        />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Flavor</Th>
                <Th align="right">Price</Th>
                <Th align="right">Stock</Th>
                <Th>Status</Th>
                <Th align="right">Sold</Th>
                <Th>
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="size-10 shrink-0">
                        <ProductVisual
                          name={product.name}
                          imageUrl={product.imageUrl}
                          accentColor={product.accentColor}
                          sizes="2.5rem"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="block truncate font-medium hover:text-ice-deep"
                        >
                          {product.name}
                        </Link>
                        <span className="block truncate text-xs text-ink-muted">
                          /{product.slug}
                        </span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-ink-soft">{product.flavor}</span>
                  </Td>
                  <Td align="right">{formatMinor(product.priceMinor)}</Td>
                  <Td align="right">
                    <StockControl
                      productId={product.id}
                      productName={product.name}
                      stock={product.stock}
                    />
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      {product.isActive ? (
                        product.stock > 0 ? (
                          <Badge tone="mint">Live</Badge>
                        ) : (
                          <Badge tone="citrus">Live · no stock</Badge>
                        )
                      ) : (
                        <Badge tone="neutral">Hidden</Badge>
                      )}
                      {product.isFeatured ? <Badge tone="ice">Featured</Badge> : null}
                      {product.isSeedData ? <Badge tone="neutral">Demo</Badge> : null}
                    </div>
                  </Td>
                  <Td align="right">
                    <span className="text-ink-muted">
                      {product._count.orderItems}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/products/${product.id}`}>Edit</Link>
                      </Button>
                      <ActiveToggle
                        productId={product.id}
                        productName={product.name}
                        isActive={product.isActive}
                      />
                      {product._count.orderItems === 0 ? (
                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      ) : null}
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </>
  );
}
