import "server-only";

/**
 * Operational settings the founder can change without a code change.
 *
 * Server-only: these must never reach the browser, because delivery pricing is
 * recalculated on the server for every order and the client's copy would be
 * advisory at best.
 */

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(
      `${name} must be a non-negative integer (received "${raw}").`,
    );
  }
  return parsed;
}

/** Flat delivery fee in paise. */
export const DELIVERY_FEE_MINOR = intEnv("DELIVERY_FEE_MINOR", 4900);

/**
 * Subtotal at or above which delivery is free. `null` disables the threshold
 * entirely, which is the honest default before the business has decided.
 */
export const FREE_DELIVERY_THRESHOLD_MINOR: number | null =
  process.env.FREE_DELIVERY_THRESHOLD_MINOR?.trim()
    ? intEnv("FREE_DELIVERY_THRESHOLD_MINOR", 0)
    : null;

/** Units of a single product allowed in one order. */
export const MAX_QUANTITY_PER_ITEM = intEnv("MAX_QUANTITY_PER_ITEM", 20);

/**
 * The single place delivery cost is decided. A zone- or distance-based rule
 * later replaces the body of this function without touching checkout.
 */
export function calculateDeliveryFeeMinor(subtotalMinor: number): number {
  if (subtotalMinor <= 0) return 0;
  if (
    FREE_DELIVERY_THRESHOLD_MINOR !== null &&
    subtotalMinor >= FREE_DELIVERY_THRESHOLD_MINOR
  ) {
    return 0;
  }
  return DELIVERY_FEE_MINOR;
}
