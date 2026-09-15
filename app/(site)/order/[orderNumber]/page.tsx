import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package } from "lucide-react";
import { formatMinor } from "@/lib/money";
import { formatDateTime } from "@/lib/utils";
import { getOrderByNumber } from "@/lib/server/orders";
import { getSessionUser } from "@/lib/server/session";
import { CONTACT, whatsappLink } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/site/status-badge";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
};

type Params = {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ placed?: string }>;
};

const PAYMENT_METHOD_LABEL = {
  CASH_ON_DELIVERY: "Pay on delivery",
  MANUAL_TRANSFER: "Bank transfer / UPI",
} as const;

export default async function OrderPage({ params, searchParams }: Params) {
  const [{ orderNumber }, { placed }] = await Promise.all([
    params,
    searchParams,
  ]);

  const order = await getOrderByNumber(orderNumber.toUpperCase());
  if (!order) notFound();

  // An order placed as a guest is reachable by anyone holding its reference,
  // which is how a guest returns to it. An order attached to an account is
  // only shown to that account or to an admin.
  const viewer = await getSessionUser();
  if (order.userId && viewer?.id !== order.userId && viewer?.role !== "ADMIN") {
    notFound();
  }

  const justPlaced = placed === "1";
  const whatsapp = whatsappLink(`Hi, I have a question about order ${order.orderNumber}.`);

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      {justPlaced ? (
        <div className="mb-8 flex items-start gap-3 rounded-card border border-mint-deep/25 bg-mint/15 p-5">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-mint-deep" aria-hidden />
          <div>
            <h1 className="text-xl font-semibold text-mint-deep">
              Order placed
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              We have your order. Nothing has been charged yet — we will contact
              you to confirm the details and arrange payment.
            </p>
          </div>
        </div>
      ) : (
        <h1 className="text-3xl font-semibold sm:text-4xl">Your order</h1>
      )}

      <Card className="mt-2">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>{order.orderNumber}</CardTitle>
            <p className="mt-1 text-sm text-ink-muted">
              Placed {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </CardHeader>

        <CardBody>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-3 first:pt-0">
                <div className="min-w-0">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-ink-muted">
                    {item.packSize} · {item.quantity} ×{" "}
                    {formatMinor(item.unitPriceMinor)}
                  </p>
                </div>
                <p className="shrink-0 font-medium tabular-nums">
                  {formatMinor(item.lineTotalMinor)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Subtotal</dt>
              <dd className="tabular-nums">{formatMinor(order.subtotalMinor)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Delivery</dt>
              <dd className="tabular-nums">
                {order.deliveryFeeMinor === 0
                  ? "Free"
                  : formatMinor(order.deliveryFeeMinor)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-2.5 text-base font-semibold">
              <dt>Total</dt>
              <dd className="font-display text-xl tabular-nums">
                {formatMinor(order.totalMinor)}
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivering to</CardTitle>
          </CardHeader>
          <CardBody className="text-sm leading-relaxed text-ink-soft">
            <p className="font-medium text-ink">{order.customerName}</p>
            <p>{order.addressLine1}</p>
            {order.addressLine2 ? <p>{order.addressLine2}</p> : null}
            <p>
              {order.city} {order.postalCode}
            </p>
            <p className="mt-2">{order.customerPhone}</p>
            <p>{order.customerEmail}</p>
            {order.deliveryNotes ? (
              <p className="mt-3 border-t border-line pt-3 text-ink-muted">
                {order.deliveryNotes}
              </p>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3 text-sm text-ink-soft">
            <p>
              <span className="font-medium text-ink">
                {PAYMENT_METHOD_LABEL[order.paymentMethod]}
              </span>
            </p>
            {/* No payment provider is configured. Nothing here implies money
                has moved. */}
            <Alert tone="info">
              We do not take payment online yet. Your order is recorded and we
              will confirm payment with you directly.
            </Alert>
          </CardBody>
        </Card>
      </div>

      <div className="mt-8 rounded-card border border-line bg-surface p-6">
        <div className="flex items-start gap-3">
          <Package className="mt-0.5 size-5 shrink-0 text-ice-deep" aria-hidden />
          <div>
            <h2 className="font-semibold">Keep this reference</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Quote <span className="font-semibold text-ink">{order.orderNumber}</span>{" "}
              in any message about this order.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/shop">Continue shopping</Link>
          </Button>
          {whatsapp ? (
            <Button asChild variant="outline">
              <a href={whatsapp} target="_blank" rel="noreferrer noopener">
                Message us on WhatsApp
              </a>
            </Button>
          ) : CONTACT.email ? (
            <Button asChild variant="outline">
              <a href={`mailto:${CONTACT.email}?subject=Order ${order.orderNumber}`}>
                Email us about this order
              </a>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href="/contact">Contact us</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
