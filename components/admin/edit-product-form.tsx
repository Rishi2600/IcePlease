"use client";

import {
  ProductForm,
  type ProductFormValues,
} from "@/components/admin/product-form";
import { updateProductAction } from "@/app/admin/products/actions";

/** Binds the product id to the update action so the form stays id-agnostic. */
export function EditProductForm({
  id,
  values,
}: {
  id: string;
  values: ProductFormValues;
}) {
  return (
    <ProductForm
      values={values}
      submitLabel="Save changes"
      action={(payload) => updateProductAction(id, payload)}
    />
  );
}
