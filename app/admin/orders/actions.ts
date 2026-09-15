"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/server/session";
import { NEXT_STATUSES, restoreStockForOrder } from "@/lib/server/orders";
import {
  type ActionResult,
  fail,
  ok,
  toActionError,
} from "@/lib/server/action-result";

const orderStatusSchema = z.object({
  orderNumber: z.string().min(1),
  status: z.enum(OrderStatus),
});

/**
 * Moves an order along its lifecycle.
 *
 * Transitions are checked against NEXT_STATUSES rather than accepted as given,
 * so an order cannot jump from PENDING to DELIVERED or come back from
 * CANCELLED. Cancelling returns the reserved stock to the catalogue in the
 * same transaction.
 */
export async function updateOrderStatusAction(
  raw: unknown,
): Promise<ActionResult<{ status: OrderStatus }>> {
  try {
    await requireAdminAction();

    const parsed = orderStatusSchema.safeParse(raw);
    if (!parsed.success) return fail("Invalid request.");

    const { orderNumber, status } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: { status: true },
    });
    if (!order) return fail("That order no longer exists.");

    if (order.status === status) return ok({ status });

    if (!NEXT_STATUSES[order.status].includes(status)) {
      return fail(
        `An order that is ${order.status.toLowerCase()} cannot be moved to ${status.toLowerCase()}.`,
      );
    }

    await prisma.$transaction(async (tx) => {
      if (status === OrderStatus.CANCELLED) {
        // Cancelled goods go back on the shelf rather than staying reserved.
        await restoreStockForOrder(tx, orderNumber);
      }
      await tx.order.update({ where: { orderNumber }, data: { status } });
    });

    revalidateOrderViews(orderNumber);
    return ok({ status });
  } catch (error) {
    return toActionError(error);
  }
}

const paymentStatusSchema = z.object({
  orderNumber: z.string().min(1),
  paymentStatus: z.enum(PaymentStatus),
});

/**
 * Records payment state by hand.
 *
 * No provider is connected, so this is bookkeeping: an admin saying money
 * arrived. The dashboard labels it as exactly that.
 */
export async function updatePaymentStatusAction(
  raw: unknown,
): Promise<ActionResult<{ paymentStatus: PaymentStatus }>> {
  try {
    await requireAdminAction();

    const parsed = paymentStatusSchema.safeParse(raw);
    if (!parsed.success) return fail("Invalid request.");

    await prisma.order.update({
      where: { orderNumber: parsed.data.orderNumber },
      data: { paymentStatus: parsed.data.paymentStatus },
    });

    revalidateOrderViews(parsed.data.orderNumber);
    return ok({ paymentStatus: parsed.data.paymentStatus });
  } catch (error) {
    return toActionError(error);
  }
}

const notesSchema = z.object({
  orderNumber: z.string().min(1),
  adminNotes: z.string().trim().max(2000),
});

export async function updateOrderNotesAction(
  raw: unknown,
): Promise<ActionResult<undefined>> {
  try {
    await requireAdminAction();

    const parsed = notesSchema.safeParse(raw);
    if (!parsed.success) return fail("Keep notes under 2000 characters.");

    await prisma.order.update({
      where: { orderNumber: parsed.data.orderNumber },
      data: { adminNotes: parsed.data.adminNotes || null },
    });

    revalidateOrderViews(parsed.data.orderNumber);
    return ok();
  } catch (error) {
    return toActionError(error);
  }
}

function revalidateOrderViews(orderNumber: string) {
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath(`/order/${orderNumber}`);
  revalidatePath("/admin");
  revalidatePath("/account");
}
