import { z } from "zod";
import { parseRupeesToMinor } from "@/lib/money";

/**
 * Product validation.
 *
 * The form takes a price in rupees because that is how the founder thinks
 * about it; it is converted to integer paise here, at the boundary, so no
 * rupee value ever reaches the database or any calculation.
 */

const priceField = z
  .string()
  .trim()
  .min(1, "Enter a price")
  .transform((value, ctx) => {
    const minor = parseRupeesToMinor(value);
    if (minor === null) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a price like 199 or 199.50",
      });
      return z.NEVER;
    }
    if (minor <= 0) {
      ctx.addIssue({ code: "custom", message: "Price must be more than zero" });
      return z.NEVER;
    }
    return minor;
  });

const intField = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .transform((value, ctx) => {
      const parsed = Number(value === "" ? "0" : value);
      if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
        ctx.addIssue({
          code: "custom",
          message: `${label} must be a whole number between ${min} and ${max}`,
        });
        return z.NEVER;
      }
      return parsed;
    });

const optionalIntField = (label: string, max: number) =>
  z
    .string()
    .trim()
    .transform((value, ctx) => {
      if (value === "") return null;
      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
        ctx.addIssue({
          code: "custom",
          message: `${label} must be a whole number between 1 and ${max}`,
        });
        return z.NEVER;
      }
      return parsed;
    });

export const productSchema = z.object({
  name: z.string().trim().min(2, "Enter a product name").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Enter a URL slug")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and hyphens only",
    ),
  flavor: z.string().trim().min(2, "Enter the flavor").max(60),
  tagline: z.string().trim().max(120).optional().or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(20, "Write at least a sentence or two")
    .max(2000),
  price: priceField,
  packSize: z.string().trim().min(2, "Describe the pack").max(80),
  cubeCount: optionalIntField("Cube count", 999),
  imageUrl: z
    .string()
    .trim()
    .max(500)
    .refine(
      (value) =>
        value === "" || value.startsWith("/") || /^https?:\/\//.test(value),
      "Enter a full URL or a path starting with /",
    )
    .optional()
    .or(z.literal("")),
  accentColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Enter a hex colour like #8fd8ee"),
  stock: intField("Stock", 0, 100000),
  sortOrder: intField("Sort order", 0, 9999),
  isActive: z.union([z.literal("on"), z.literal("")]).transform((v) => v === "on"),
  isFeatured: z
    .union([z.literal("on"), z.literal("")])
    .transform((v) => v === "on"),
});

export type ProductInput = z.infer<typeof productSchema>;

/** Quantity-only edit, used by the inline stock control in the product table. */
export const stockSchema = z.object({
  id: z.string().min(1),
  stock: intField("Stock", 0, 100000),
});
