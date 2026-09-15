import "server-only";
import { prisma } from "@/lib/prisma";
import { formatMinor } from "@/lib/money";
import type { CartLineInput } from "@/lib/validation/cart";
import type {
  CartIssue,
  PricedCart,
  PricedLine,
} from "@/lib/cart-types";
import {
  MAX_QUANTITY_PER_ITEM,
  calculateDeliveryFeeMinor,
} from "@/lib/server/settings";

/**
 * Cart pricing. The single authority on what a cart costs.
 *
 * The browser sends product ids and quantities and nothing else. Prices, names,
 * pack sizes and availability are read from the database here, for both the
 * cart display and order creation — so the number the customer sees and the
 * number that is charged come from the same code path.
 */

export async function priceCart(input: CartLineInput[]): Promise<PricedCart> {
  const lines: PricedLine[] = [];
  const issues: CartIssue[] = [];

  // Collapse duplicate ids so a repeated product cannot slip past the cap.
  const requested = new Map<string, number>();
  for (const line of input) {
    requested.set(
      line.productId,
      (requested.get(line.productId) ?? 0) + line.quantity,
    );
  }

  if (requested.size > 0) {
    const products = await prisma.product.findMany({
      where: { id: { in: [...requested.keys()] } },
      select: {
        id: true,
        slug: true,
        name: true,
        flavor: true,
        packSize: true,
        priceMinor: true,
        imageUrl: true,
        accentColor: true,
        stock: true,
        isActive: true,
      },
    });
    const byId = new Map(products.map((product) => [product.id, product]));

    for (const [productId, requestedQuantity] of requested) {
      const product = byId.get(productId);

      if (!product || !product.isActive) {
        issues.push({
          productId,
          productName: product?.name ?? "An item",
          message: product
            ? `${product.name} is no longer available and has been removed.`
            : "An item in your cart is no longer available and has been removed.",
          severity: "removed",
        });
        continue;
      }

      if (product.stock <= 0) {
        issues.push({
          productId,
          productName: product.name,
          message: `${product.name} is out of stock and has been removed.`,
          severity: "removed",
        });
        continue;
      }

      const quantity = Math.min(
        requestedQuantity,
        product.stock,
        MAX_QUANTITY_PER_ITEM,
      );

      if (quantity < requestedQuantity) {
        issues.push({
          productId,
          productName: product.name,
          message:
            quantity === product.stock
              ? `Only ${product.stock} of ${product.name} left, so the quantity was reduced.`
              : `${product.name} is limited to ${MAX_QUANTITY_PER_ITEM} per order.`,
          severity: "reduced",
        });
      }

      lines.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        flavor: product.flavor,
        packSize: product.packSize,
        imageUrl: product.imageUrl,
        accentColor: product.accentColor,
        unitPriceMinor: product.priceMinor,
        requestedQuantity,
        quantity,
        lineTotalMinor: product.priceMinor * quantity,
        stock: product.stock,
      });
    }
  }

  lines.sort((a, b) => a.name.localeCompare(b.name));

  const subtotalMinor = lines.reduce(
    (sum, line) => sum + line.lineTotalMinor,
    0,
  );
  const deliveryFeeMinor = calculateDeliveryFeeMinor(subtotalMinor);

  return {
    lines,
    issues,
    subtotalMinor,
    deliveryFeeMinor,
    totalMinor: subtotalMinor + deliveryFeeMinor,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    isEmpty: lines.length === 0,
  };
}

/** Delivery messaging for the cart, derived from the same rule as the fee. */
export function deliveryNote(cart: PricedCart): string {
  if (cart.isEmpty) return "";
  return cart.deliveryFeeMinor === 0
    ? "Delivery included"
    : `${formatMinor(cart.deliveryFeeMinor)} delivery`;
}
