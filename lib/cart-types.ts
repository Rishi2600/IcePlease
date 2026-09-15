/**
 * Cart shapes shared by the server pricing module and the client.
 *
 * Kept in a neutral module so client components can import the types without
 * pulling in server-only code.
 */

export type PricedLine = {
  productId: string;
  slug: string;
  name: string;
  flavor: string;
  packSize: string;
  imageUrl: string | null;
  accentColor: string;
  unitPriceMinor: number;
  /** What the customer asked for. */
  requestedQuantity: number;
  /** What can actually be fulfilled — never more than stock or the per-item cap. */
  quantity: number;
  lineTotalMinor: number;
  stock: number;
};

/** A line the customer asked for that cannot be honoured as requested. */
export type CartIssue = {
  productId: string;
  productName: string;
  /** Written for the customer; safe to render directly. */
  message: string;
  severity: "removed" | "reduced";
};

export type PricedCart = {
  lines: PricedLine[];
  issues: CartIssue[];
  subtotalMinor: number;
  deliveryFeeMinor: number;
  totalMinor: number;
  itemCount: number;
  /** True when nothing in the cart can currently be ordered. */
  isEmpty: boolean;
};
