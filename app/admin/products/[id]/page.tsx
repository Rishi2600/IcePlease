import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { minorToRupeeInput } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EditProductForm } from "@/components/admin/edit-product-form";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="-ml-3 mb-2">
        <Link href="/admin/products">
          <ArrowLeft aria-hidden />
          Products
        </Link>
      </Button>

      <AdminPageHeader
        title={product.name}
        description={
          product.isSeedData
            ? "This is demo seed data. Saving turns it into your own product content."
            : undefined
        }
        action={
          product.isActive ? (
            <Button asChild variant="outline">
              <Link href={`/shop/${product.slug}`} target="_blank">
                <ExternalLink aria-hidden />
                View in shop
              </Link>
            </Button>
          ) : undefined
        }
      />

      <EditProductForm
        id={product.id}
        values={{
          name: product.name,
          slug: product.slug,
          flavor: product.flavor,
          tagline: product.tagline ?? "",
          description: product.description,
          price: minorToRupeeInput(product.priceMinor),
          packSize: product.packSize,
          cubeCount: product.cubeCount ? String(product.cubeCount) : "",
          imageUrl: product.imageUrl ?? "",
          accentColor: product.accentColor,
          stock: String(product.stock),
          sortOrder: String(product.sortOrder),
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        }}
      />
    </>
  );
}
