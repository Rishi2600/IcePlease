"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import {
  EMPTY_PRODUCT,
  ProductForm,
} from "@/components/admin/product-form";
import { createProductAction } from "@/app/admin/products/actions";

export default function NewProductPage() {
  return (
    <>
      <Button asChild variant="ghost" size="sm" className="-ml-3 mb-2">
        <Link href="/admin/products">
          <ArrowLeft aria-hidden />
          Products
        </Link>
      </Button>

      <AdminPageHeader
        title="New product"
        description="It appears in the shop as soon as it is saved and active."
      />

      <ProductForm
        values={EMPTY_PRODUCT}
        submitLabel="Create product"
        action={(payload) => createProductAction(payload)}
      />
    </>
  );
}
