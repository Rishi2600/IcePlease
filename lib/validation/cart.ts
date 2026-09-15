import { z } from "zod";

/**
 * What the browser is allowed to say about a cart: which product, how many.
 *
 * Deliberately no price, no name, no availability. Everything else is looked
 * up server-side from the database.
 */
export const cartLineSchema = z.object({
  productId: z.string().min(1).max(64),
  quantity: z.number().int().min(1).max(99),
});

export const cartSchema = z.object({
  lines: z.array(cartLineSchema).max(50),
});

export type CartLineInput = z.infer<typeof cartLineSchema>;
