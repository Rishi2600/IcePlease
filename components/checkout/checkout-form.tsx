"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input, Textarea } from "@/components/ui/field";
import { OrderSummary } from "@/components/cart/order-summary";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/components/cart/cart-provider";
import { usePricedCart } from "@/components/cart/use-priced-cart";
import { placeOrderAction } from "@/app/(site)/checkout/actions";
import { formatMinor } from "@/lib/money";
import { ShoppingBag } from "lucide-react";

type Prefill = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
};

const PAYMENT_OPTIONS = [
  {
    value: "CASH_ON_DELIVERY",
    label: "Pay on delivery",
    detail: "Hand over the amount when the order arrives.",
  },
  {
    value: "MANUAL_TRANSFER",
    label: "Bank transfer / UPI",
    detail: "We will send payment details to confirm your order.",
  },
] as const;

export function CheckoutForm({ prefill }: { prefill: Prefill }) {
  const router = useRouter();
  const { lines, clear } = useCart();
  const { cart, isLoading, error: cartError } = usePricedCart();

  const [pending, setPending] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [paymentMethod, setPaymentMethod] =
    React.useState<(typeof PAYMENT_OPTIONS)[number]["value"]>(
      "CASH_ON_DELIVERY",
    );
  const errorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (formError) errorRef.current?.scrollIntoView({ block: "center" });
  }, [formError]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setFormError(null);
    setFieldErrors({});

    const data = new FormData(event.currentTarget);
    const payload = {
      customerName: String(data.get("customerName") ?? ""),
      customerEmail: String(data.get("customerEmail") ?? ""),
      customerPhone: String(data.get("customerPhone") ?? ""),
      addressLine1: String(data.get("addressLine1") ?? ""),
      addressLine2: String(data.get("addressLine2") ?? ""),
      city: String(data.get("city") ?? ""),
      postalCode: String(data.get("postalCode") ?? ""),
      deliveryNotes: String(data.get("deliveryNotes") ?? ""),
      paymentMethod,
      lines,
    };

    const result = await placeOrderAction(payload);

    if (!result.ok) {
      setPending(false);
      setFormError(result.message);
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }

    // The order is written; the local cart has served its purpose.
    clear();
    router.push(`/order/${result.data.orderNumber}?placed=1`);
  }

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading checkout"
        className="h-96 animate-pulse rounded-card bg-surface-sunken"
      />
    );
  }

  if (cartError || !cart) {
    return (
      <Alert tone="error" title="We could not load your cart">
        {cartError ?? "Please refresh the page and try again."}
      </Alert>
    );
  }

  if (cart.isEmpty) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="There is nothing to check out"
        description="Your cart is empty, so there is no order to place yet."
        action={
          <Button asChild>
            <Link href="/shop">Browse flavors</Link>
          </Button>
        }
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
      <div className="space-y-10">
        <div ref={errorRef}>
          {formError ? (
            <Alert tone="error" title="Your order was not placed">
              {formError}
            </Alert>
          ) : null}
          {cart.issues.length > 0 ? (
            <div className="space-y-3">
              {cart.issues.map((issue) => (
                <Alert key={issue.productId} tone="info" title="Cart updated">
                  {issue.message}
                </Alert>
              ))}
            </div>
          ) : null}
        </div>

        <fieldset className="space-y-5">
          <legend className="text-lg font-semibold">Your details</legend>
          <Field name="customerName" label="Full name" error={fieldErrors.customerName}>
            {(props) => (
              <Input
                {...props}
                autoComplete="name"
                defaultValue={prefill.customerName}
                required
              />
            )}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="customerEmail" label="Email" error={fieldErrors.customerEmail}>
              {(props) => (
                <Input
                  {...props}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  defaultValue={prefill.customerEmail}
                  required
                />
              )}
            </Field>
            <Field name="customerPhone" label="Phone" error={fieldErrors.customerPhone}>
              {(props) => (
                <Input
                  {...props}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  defaultValue={prefill.customerPhone}
                  required
                />
              )}
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="text-lg font-semibold">Delivery</legend>
          <Field name="addressLine1" label="Address" error={fieldErrors.addressLine1}>
            {(props) => (
              <Input
                {...props}
                autoComplete="address-line1"
                defaultValue={prefill.addressLine1}
                required
              />
            )}
          </Field>
          <Field
            name="addressLine2"
            label="Apartment, floor, landmark"
            hint="optional"
            error={fieldErrors.addressLine2}
          >
            {(props) => (
              <Input
                {...props}
                autoComplete="address-line2"
                defaultValue={prefill.addressLine2}
              />
            )}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="city" label="City" error={fieldErrors.city}>
              {(props) => (
                <Input
                  {...props}
                  autoComplete="address-level2"
                  defaultValue={prefill.city}
                  required
                />
              )}
            </Field>
            <Field name="postalCode" label="PIN code" error={fieldErrors.postalCode}>
              {(props) => (
                <Input
                  {...props}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  defaultValue={prefill.postalCode}
                  required
                />
              )}
            </Field>
          </div>
          <Field
            name="deliveryNotes"
            label="Delivery notes"
            hint="optional"
            error={fieldErrors.deliveryNotes}
          >
            {(props) => (
              <Textarea
                {...props}
                rows={3}
                placeholder="Gate code, best time to deliver, anything we should know."
              />
            )}
          </Field>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-lg font-semibold">Payment</legend>
          <p className="text-sm text-ink-muted">
            Online payment is not available yet. Choose how you would like to
            settle and we will confirm the order with you.
          </p>
          <div className="space-y-3 pt-1">
            {PAYMENT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface p-4 transition-colors has-checked:border-ice-deep has-checked:bg-ice-light/30"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={() => setPaymentMethod(option.value)}
                  className="mt-1 size-4 accent-[var(--color-ice-deep)]"
                />
                <span>
                  <span className="block text-sm font-medium">{option.label}</span>
                  <span className="mt-0.5 block text-sm text-ink-muted">
                    {option.detail}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-card border border-line bg-surface p-6">
          <h2 className="text-lg font-semibold">Review</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {cart.lines.map((line) => (
              <li key={line.productId} className="flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{line.name}</span>
                  <span className="text-ink-muted">
                    {line.quantity} × {formatMinor(line.unitPriceMinor)}
                  </span>
                </span>
                <span className="shrink-0 font-medium tabular-nums">
                  {formatMinor(line.lineTotalMinor)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <OrderSummary
            subtotalMinor={cart.subtotalMinor}
            deliveryFeeMinor={cart.deliveryFeeMinor}
            totalMinor={cart.totalMinor}
            itemCount={cart.itemCount}
          >
            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Placing order…
                </>
              ) : (
                <>
                  <Lock aria-hidden />
                  Place order
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-ink-muted">
              Totals are recalculated on our server before the order is saved.
            </p>
          </OrderSummary>
        </div>
      </div>
    </form>
  );
}
