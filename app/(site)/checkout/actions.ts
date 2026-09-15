"use server";

import { revalidatePath } from "next/cache";
import { checkoutSchema } from "@/lib/validation/checkout";
import { createOrder } from "@/lib/server/orders";
import { getSessionUser } from "@/lib/server/session";
import {
  type ActionResult,
  fail,
  fieldErrorsOf,
  ok,
  toActionError,
} from "@/lib/server/action-result";

/**
 * Places an order.
 *
 * The payload carries contact details and a list of product ids with
 * quantities. It carries no prices — those are read from the database inside
 * `createOrder`, which is the only place an order total is ever decided.
 */
export async function placeOrderAction(
  raw: unknown,
): Promise<ActionResult<{ orderNumber: string }>> {
  try {
    const parsed = checkoutSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(
        "Please check the highlighted fields.",
        fieldErrorsOf(parsed.error),
      );
    }

    // Signing in is optional. An order placed while signed in is attached to
    // the account so it shows up in order history.
    const user = await getSessionUser();

    const order = await createOrder(parsed.data, user?.id ?? null);

    // Stock changed, so the catalogue pages are now stale.
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/shop/[slug]", "page");

    return ok({ orderNumber: order.orderNumber });
  } catch (error) {
    return toActionError(error);
  }
}
