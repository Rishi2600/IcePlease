"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/server/session";
import { productSchema, stockSchema } from "@/lib/validation/product";
import {
  type ActionResult,
  fail,
  fieldErrorsOf,
  ok,
  toActionError,
} from "@/lib/server/action-result";

/**
 * Product management.
 *
 * Every action starts with requireAdminAction. Server actions are reachable by
 * anyone who can construct a request, so the check belongs here rather than
 * only on the page that renders the button.
 */

/** Public catalogue surfaces that a catalogue change makes stale. */
function revalidateCatalogue() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/shop/[slug]", "page");
  revalidatePath("/admin/products");
}

export async function createProductAction(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdminAction();

    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
      return fail("Please check the highlighted fields.", fieldErrorsOf(parsed.error));
    }

    const existing = await prisma.product.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (existing) {
      return fail("That URL slug is already taken.", {
        slug: "That URL slug is already taken.",
      });
    }

    const product = await prisma.product.create({
      data: toProductData(parsed.data),
      select: { id: true },
    });

    revalidateCatalogue();
    return ok({ id: product.id });
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateProductAction(
  id: string,
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdminAction();

    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
      return fail("Please check the highlighted fields.", fieldErrorsOf(parsed.error));
    }

    const clash = await prisma.product.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (clash && clash.id !== id) {
      return fail("That URL slug is already taken.", {
        slug: "That URL slug is already taken.",
      });
    }

    await prisma.product.update({
      where: { id },
      data: {
        ...toProductData(parsed.data),
        // Editing a seed row makes it the founder's own content.
        isSeedData: false,
      },
    });

    revalidateCatalogue();
    return ok({ id });
  } catch (error) {
    return toActionError(error);
  }
}

/** Publish / unpublish. The row is kept so order history stays intact. */
export async function setProductActiveAction(
  raw: unknown,
): Promise<ActionResult<undefined>> {
  try {
    await requireAdminAction();

    const parsed = z
      .object({ id: z.string().min(1), isActive: z.enum(["true", "false"]) })
      .safeParse(raw);
    if (!parsed.success) return fail("Invalid request.");

    await prisma.product.update({
      where: { id: parsed.data.id },
      data: { isActive: parsed.data.isActive === "true" },
    });

    revalidateCatalogue();
    return ok();
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateStockAction(
  raw: unknown,
): Promise<ActionResult<{ stock: number }>> {
  try {
    await requireAdminAction();

    const parsed = stockSchema.safeParse(raw);
    if (!parsed.success) {
      return fail("Enter a whole number of units.", fieldErrorsOf(parsed.error));
    }

    const product = await prisma.product.update({
      where: { id: parsed.data.id },
      data: { stock: parsed.data.stock },
      select: { stock: true },
    });

    revalidateCatalogue();
    return ok({ stock: product.stock });
  } catch (error) {
    return toActionError(error);
  }
}

/**
 * Deletion is only offered for products that have never been ordered.
 * Anything with order history is deactivated instead, so past orders keep
 * their product reference.
 */
export async function deleteProductAction(
  raw: unknown,
): Promise<ActionResult<undefined>> {
  try {
    await requireAdminAction();

    const parsed = z.object({ id: z.string().min(1) }).safeParse(raw);
    if (!parsed.success) return fail("Invalid request.");

    const orderedCount = await prisma.orderItem.count({
      where: { productId: parsed.data.id },
    });
    if (orderedCount > 0) {
      return fail(
        "This product has been ordered before, so it cannot be deleted. Deactivate it instead to remove it from the shop.",
      );
    }

    await prisma.product.delete({ where: { id: parsed.data.id } });

    revalidateCatalogue();
    return ok();
  } catch (error) {
    return toActionError(error);
  }
}

function toProductData(input: z.infer<typeof productSchema>) {
  return {
    name: input.name,
    slug: input.slug,
    flavor: input.flavor,
    tagline: input.tagline || null,
    description: input.description,
    priceMinor: input.price,
    packSize: input.packSize,
    cubeCount: input.cubeCount,
    imageUrl: input.imageUrl || null,
    accentColor: input.accentColor,
    stock: input.stock,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
    isFeatured: input.isFeatured,
  };
}
