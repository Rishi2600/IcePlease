import { formatMinor } from "@/lib/money";

/**
 * Totals panel, shared by the cart and checkout so the two can never disagree
 * about how the number was arrived at.
 */
export function OrderSummary({
  subtotalMinor,
  deliveryFeeMinor,
  totalMinor,
  itemCount,
  children,
}: {
  subtotalMinor: number;
  deliveryFeeMinor: number;
  totalMinor: number;
  itemCount: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">
            Subtotal
            <span className="ml-1">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </dt>
          <dd className="font-medium tabular-nums">
            {formatMinor(subtotalMinor)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Delivery</dt>
          <dd className="font-medium tabular-nums">
            {deliveryFeeMinor === 0 ? "Free" : formatMinor(deliveryFeeMinor)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-line pt-3 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-display text-xl font-semibold tabular-nums">
            {formatMinor(totalMinor)}
          </dd>
        </div>
      </dl>

      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
