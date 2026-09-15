import "server-only";
import { Prisma, PaymentMethod, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/order-number";
import { priceCart } from "@/lib/server/pricing";
import { BusinessRuleError } from "@/lib/server/errors";
import type { CheckoutInput } from "@/lib/validation/checkout";

/**
 * Order creation.
 *
 * Three things matter here and are worth stating plainly:
 *
 *  1. Nothing about money comes from the browser. The request carries product
 *     ids and quantities; prices, the delivery fee and the total are computed
 *     from database rows inside the transaction that writes the order.
 *  2. Stock is decremented with a conditional update, so two customers racing
 *     for the last tray cannot both succeed — the second update matches zero
 *     rows and the whole transaction rolls back.
 *  3. Order items snapshot name, flavor, pack size and unit price. Editing a
 *     product later never rewrites what someone already bought.
 */

export type CreatedOrder = {
  orderNumber: string;
  totalMinor: number;
};

export async function createOrder(
  input: CheckoutInput,
  userId: string | null,
): Promise<CreatedOrder> {
  const cart = await priceCart(input.lines);

  if (cart.isEmpty) {
    throw new BusinessRuleError(
      "Nothing in your cart is available to order right now.",
    );
  }

  // A reduced or dropped line changes what the customer is agreeing to pay,
  // so they confirm the corrected cart rather than having it charged silently.
  const blocking = cart.issues.filter((issue) => issue.severity === "removed");
  if (blocking.length > 0) {
    throw new BusinessRuleError(blocking[0].message);
  }
  if (cart.issues.length > 0) {
    throw new BusinessRuleError(cart.issues[0].message);
  }

  return withUniqueOrderNumber(async (orderNumber) =>
    prisma.$transaction(async (tx) => {
      for (const line of cart.lines) {
        const claimed = await tx.product.updateMany({
          where: {
            id: line.productId,
            isActive: true,
            stock: { gte: line.quantity },
          },
          data: { stock: { decrement: line.quantity } },
        });

        if (claimed.count !== 1) {
          throw new BusinessRuleError(
            `${line.name} sold out while you were checking out. Please review your cart.`,
          );
        }
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2 || null,
          city: input.city,
          postalCode: input.postalCode,
          deliveryNotes: input.deliveryNotes || null,
          subtotalMinor: cart.subtotalMinor,
          deliveryFeeMinor: cart.deliveryFeeMinor,
          totalMinor: cart.totalMinor,
          paymentMethod: input.paymentMethod as PaymentMethod,
          // Status starts at PENDING and payment at PENDING. No payment
          // provider is configured, so nothing here claims money was taken.
          items: {
            create: cart.lines.map((line) => ({
              productId: line.productId,
              productName: line.name,
              productFlavor: line.flavor,
              packSize: line.packSize,
              unitPriceMinor: line.unitPriceMinor,
              quantity: line.quantity,
              lineTotalMinor: line.lineTotalMinor,
            })),
          },
        },
        select: { orderNumber: true, totalMinor: true },
      });

      return order;
    }),
  );
}

/** Retries on the vanishingly rare order-number collision. */
async function withUniqueOrderNumber<T>(
  write: (orderNumber: string) => Promise<T>,
): Promise<T> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await write(generateOrderNumber());
    } catch (error) {
      const isCollision =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002";
      if (!isCollision) throw error;
    }
  }
  throw new Error("Could not allocate a unique order number.");
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

const ORDER_DETAIL_INCLUDE = {
  items: { orderBy: { productName: "asc" } },
} satisfies Prisma.OrderInclude;

export type OrderDetail = Prisma.OrderGetPayload<{
  include: typeof ORDER_DETAIL_INCLUDE;
}>;

export function getOrderByNumber(
  orderNumber: string,
): Promise<OrderDetail | null> {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: ORDER_DETAIL_INCLUDE,
  });
}

export function listOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: ORDER_DETAIL_INCLUDE,
  });
}

/**
 * Restores stock when an order is cancelled, so a cancelled order does not
 * quietly keep inventory off the shelf.
 */
export async function restoreStockForOrder(
  tx: Prisma.TransactionClient,
  orderNumber: string,
): Promise<void> {
  const items = await tx.orderItem.findMany({
    where: { orderNumber, productId: { not: null } },
    select: { productId: true, quantity: true },
  });

  for (const item of items) {
    if (!item.productId) continue;
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
}

/** Statuses an order can move to from where it is now. */
export const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  PREPARING: [OrderStatus.READY, OrderStatus.CANCELLED],
  READY: [OrderStatus.DISPATCHED, OrderStatus.CANCELLED],
  DISPATCHED: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  DELIVERED: [],
  CANCELLED: [],
};
