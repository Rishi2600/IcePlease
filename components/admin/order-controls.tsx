"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Select, Textarea, Label } from "@/components/ui/field";
import {
  updateOrderNotesAction,
  updateOrderStatusAction,
  updatePaymentStatusAction,
} from "@/app/admin/orders/actions";
import { orderStatusLabel } from "@/components/site/status-badge";

/**
 * Fulfilment controls.
 *
 * Only transitions the server would accept are offered, so the admin is not
 * shown a button that will be refused.
 */
export function OrderStatusControls({
  orderNumber,
  status,
  nextStatuses,
}: {
  orderNumber: string;
  status: OrderStatus;
  nextStatuses: OrderStatus[];
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState<OrderStatus | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function move(next: OrderStatus) {
    setPending(next);
    setError(null);
    const result = await updateOrderStatusAction({ orderNumber, status: next });
    setPending(null);
    if (result.ok) {
      router.refresh();
    } else {
      setError(result.message);
    }
  }

  if (nextStatuses.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        This order is {orderStatusLabel(status).toLowerCase()}. There is nothing
        further to change.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error ? <Alert tone="error">{error}</Alert> : null}
      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((next) => (
          <Button
            key={next}
            size="sm"
            variant={next === "CANCELLED" ? "outline" : "primary"}
            disabled={pending !== null}
            onClick={() => move(next)}
          >
            {pending === next ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : null}
            {next === "CANCELLED"
              ? "Cancel order"
              : `Mark ${orderStatusLabel(next).toLowerCase()}`}
          </Button>
        ))}
      </div>
      <p className="text-xs text-ink-muted">
        Cancelling returns the items to stock.
      </p>
    </div>
  );
}

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

export function PaymentStatusControl({
  orderNumber,
  paymentStatus,
}: {
  orderNumber: string;
  paymentStatus: PaymentStatus;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Label htmlFor="paymentStatus">Payment status</Label>
      <div className="flex items-center gap-2">
        <Select
          id="paymentStatus"
          value={paymentStatus}
          disabled={pending}
          onChange={async (event) => {
            const next = event.target.value as PaymentStatus;
            setPending(true);
            setError(null);
            const result = await updatePaymentStatusAction({
              orderNumber,
              paymentStatus: next,
            });
            setPending(false);
            if (result.ok) {
              router.refresh();
            } else {
              setError(result.message);
            }
          }}
        >
          {PAYMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {pending ? (
          <Loader2 className="size-4 animate-spin text-ink-muted" aria-hidden />
        ) : null}
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      <p className="text-xs text-ink-muted">
        Set by hand. No payment provider is connected, so this records your
        bookkeeping rather than a confirmed settlement.
      </p>
    </div>
  );
}

export function OrderNotes({
  orderNumber,
  adminNotes,
}: {
  orderNumber: string;
  adminNotes: string;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(adminNotes);
  const [state, setState] = React.useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  React.useEffect(() => {
    if (state !== "saved") return;
    const timer = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setState("saving");
        const result = await updateOrderNotesAction({
          orderNumber,
          adminNotes: value,
        });
        setState(result.ok ? "saved" : "error");
        if (result.ok) router.refresh();
      }}
      className="space-y-3"
    >
      <Label htmlFor="adminNotes">Internal notes</Label>
      <Textarea
        id="adminNotes"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={4}
        placeholder="Anything the team needs to know about this order. The customer does not see this."
      />
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" variant="outline" disabled={state === "saving"}>
          {state === "saving" ? (
            <Loader2 className="animate-spin" aria-hidden />
          ) : null}
          Save notes
        </Button>
        <span aria-live="polite" className="text-sm">
          {state === "saved" ? (
            <span className="text-mint-deep">Saved</span>
          ) : state === "error" ? (
            <span className="text-danger">Could not save</span>
          ) : null}
        </span>
      </div>
    </form>
  );
}
