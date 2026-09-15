"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input, Label, Textarea } from "@/components/ui/field";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductVisual } from "@/components/product/product-visual";
import { slugify } from "@/lib/utils";
import type { ActionResult } from "@/lib/server/action-result";

export type ProductFormValues = {
  name: string;
  slug: string;
  flavor: string;
  tagline: string;
  description: string;
  price: string;
  packSize: string;
  cubeCount: string;
  imageUrl: string;
  accentColor: string;
  stock: string;
  sortOrder: string;
  isActive: boolean;
  isFeatured: boolean;
};

export const EMPTY_PRODUCT: ProductFormValues = {
  name: "",
  slug: "",
  flavor: "",
  tagline: "",
  description: "",
  price: "",
  packSize: "",
  cubeCount: "",
  imageUrl: "",
  accentColor: "#8fd8ee",
  stock: "0",
  sortOrder: "0",
  isActive: true,
  isFeatured: false,
};

export function ProductForm({
  values,
  submitLabel,
  action,
}: {
  values: ProductFormValues;
  submitLabel: string;
  action: (payload: Record<string, string>) => Promise<ActionResult<{ id: string }>>;
}) {
  const router = useRouter();

  const [pending, setPending] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  // Live preview, so the accent colour and name are visible while editing.
  const [name, setName] = React.useState(values.name);
  const [slug, setSlug] = React.useState(values.slug);
  const [slugTouched, setSlugTouched] = React.useState(values.slug !== "");
  const [accentColor, setAccentColor] = React.useState(values.accentColor);
  const [imageUrl, setImageUrl] = React.useState(values.imageUrl);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setMessage(null);
    setFieldErrors({});

    const data = new FormData(event.currentTarget);
    const payload: Record<string, string> = {};
    for (const [key, value] of data.entries()) {
      payload[key] = typeof value === "string" ? value : "";
    }
    // Unchecked checkboxes are absent from FormData; the schema expects "".
    payload.isActive = payload.isActive ?? "";
    payload.isFeatured = payload.isFeatured ?? "";

    const result = await action(payload);

    if (!result.ok) {
      setPending(false);
      setMessage(result.message);
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        {message ? (
          <Alert tone="error" title="Could not save">
            {message}
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Product</CardTitle>
          </CardHeader>
          <CardBody className="space-y-5">
            <Field name="name" label="Name" error={fieldErrors.name}>
              {(props) => (
                <Input
                  {...props}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (!slugTouched) setSlug(slugify(event.target.value));
                  }}
                  required
                />
              )}
            </Field>

            <Field
              name="slug"
              label="URL slug"
              hint="/shop/…"
              error={fieldErrors.slug}
            >
              {(props) => (
                <Input
                  {...props}
                  value={slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(event.target.value);
                  }}
                  required
                />
              )}
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="flavor" label="Flavor" error={fieldErrors.flavor}>
                {(props) => (
                  <Input {...props} defaultValue={values.flavor} required />
                )}
              </Field>
              <Field
                name="packSize"
                label="Pack size"
                hint="as written on the pack"
                error={fieldErrors.packSize}
              >
                {(props) => (
                  <Input
                    {...props}
                    defaultValue={values.packSize}
                    placeholder="Tray of 12 cubes"
                    required
                  />
                )}
              </Field>
            </div>

            <Field
              name="tagline"
              label="Tagline"
              hint="one line, optional"
              error={fieldErrors.tagline}
            >
              {(props) => <Input {...props} defaultValue={values.tagline} />}
            </Field>

            <Field
              name="description"
              label="Description"
              error={fieldErrors.description}
            >
              {(props) => (
                <Textarea {...props} rows={5} defaultValue={values.description} required />
              )}
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price and stock</CardTitle>
          </CardHeader>
          <CardBody className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field
                name="price"
                label="Price"
                hint="in rupees"
                error={fieldErrors.price}
              >
                {(props) => (
                  <Input
                    {...props}
                    inputMode="decimal"
                    defaultValue={values.price}
                    placeholder="199"
                    required
                  />
                )}
              </Field>
              <Field name="stock" label="Stock" error={fieldErrors.stock}>
                {(props) => (
                  <Input
                    {...props}
                    inputMode="numeric"
                    defaultValue={values.stock}
                    required
                  />
                )}
              </Field>
              <Field
                name="cubeCount"
                label="Cubes per pack"
                hint="optional"
                error={fieldErrors.cubeCount}
              >
                {(props) => (
                  <Input
                    {...props}
                    inputMode="numeric"
                    defaultValue={values.cubeCount}
                  />
                )}
              </Field>
            </div>
            <p className="text-xs text-ink-muted">
              Price is stored in paise. Cubes per pack is only used to show a
              per-cube price.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardBody className="space-y-5">
            <Field
              name="imageUrl"
              label="Image URL"
              hint="optional — a full URL or a path like /products/lime.jpg"
              error={fieldErrors.imageUrl}
            >
              {(props) => (
                <Input
                  {...props}
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                />
              )}
            </Field>
            <p className="-mt-2 text-xs text-ink-muted">
              With no image, the generated ice treatment is used and tinted with
              the accent colour below.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="accentColor">Accent colour</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="accentColor"
                    name="accentColor"
                    type="color"
                    value={accentColor}
                    onChange={(event) => setAccentColor(event.target.value)}
                    aria-invalid={Boolean(fieldErrors.accentColor)}
                    className="size-10 shrink-0 cursor-pointer rounded-lg border border-line bg-surface p-1"
                  />
                  <Input
                    value={accentColor}
                    onChange={(event) => setAccentColor(event.target.value)}
                    aria-label="Accent colour hex value"
                  />
                </div>
                {fieldErrors.accentColor ? (
                  <p className="text-sm text-danger">{fieldErrors.accentColor}</p>
                ) : null}
              </div>

              <Field
                name="sortOrder"
                label="Sort order"
                hint="lower shows first"
                error={fieldErrors.sortOrder}
              >
                {(props) => (
                  <Input
                    {...props}
                    inputMode="numeric"
                    defaultValue={values.sortOrder}
                  />
                )}
              </Field>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardBody>
            <ProductVisual
              name={name || "Product"}
              imageUrl={imageUrl || null}
              accentColor={/^#[0-9a-fA-F]{6}$/.test(accentColor) ? accentColor : "#8fd8ee"}
              sizes="18rem"
            />
            <p className="mt-3 truncate text-sm font-medium">
              {name || "Untitled product"}
            </p>
            <p className="truncate text-xs text-ink-muted">/shop/{slug || "…"}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={values.isActive}
                className="mt-0.5 size-4 accent-[var(--color-ice-deep)]"
              />
              <span className="text-sm">
                <span className="block font-medium">Active</span>
                <span className="text-ink-muted">Visible in the shop.</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={values.isFeatured}
                className="mt-0.5 size-4 accent-[var(--color-ice-deep)]"
              />
              <span className="text-sm">
                <span className="block font-medium">Featured</span>
                <span className="text-ink-muted">Shown on the homepage.</span>
              </span>
            </label>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              submitLabel
            )}
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </div>
    </form>
  );
}
