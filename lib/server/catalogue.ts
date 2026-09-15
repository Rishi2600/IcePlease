import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Catalogue reads.
 *
 * The public site only ever sees active products, and that rule lives here
 * rather than being repeated (and eventually forgotten) in each page.
 */

const PUBLIC_SELECT = {
  id: true,
  slug: true,
  name: true,
  flavor: true,
  tagline: true,
  description: true,
  priceMinor: true,
  packSize: true,
  cubeCount: true,
  imageUrl: true,
  accentColor: true,
  stock: true,
  isFeatured: true,
  isSeedData: true,
} satisfies Prisma.ProductSelect;

export type PublicProduct = Prisma.ProductGetPayload<{
  select: typeof PUBLIC_SELECT;
}>;

export function listActiveProducts(): Promise<PublicProduct[]> {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: PUBLIC_SELECT,
  });
}

export function listFeaturedProducts(take = 3): Promise<PublicProduct[]> {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take,
    select: PUBLIC_SELECT,
  });
}

export function getActiveProductBySlug(
  slug: string,
): Promise<PublicProduct | null> {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    select: PUBLIC_SELECT,
  });
}

/** Distinct flavors currently on sale, for the shop filter. */
export async function listActiveFlavors(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    distinct: ["flavor"],
    orderBy: { flavor: "asc" },
    select: { flavor: true },
  });
  return rows.map((row) => row.flavor);
}
