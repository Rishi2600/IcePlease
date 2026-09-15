import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { formatMinor } from "@/lib/money";
import { formatDateTime } from "@/lib/utils";
import { getOrderByNumber, NEXT_STATUSES } from "@/lib/server/orders";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Table, TableWrap, Td, Th, Tr } from "@/components/admin/table";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/site/status-badge";
import {
  OrderNotes,
  OrderStatusControls,
  PaymentStatusControl,
} from "@/components/admin/order-controls";

export const metadata: Metadata = { title: "Order" };

const PAYMENT_METHOD_LABEL = {
  CASH_ON_DELIVERY: "Pay on delivery",
  MANUAL_TRANSFER: "Bank transfer / UPI",
} as const;

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber.toUpperCase());
  if (!order) notFound();

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="-ml-3 mb-2">
        <Link href="/admin/orders">
          <ArrowLeft aria-hidden />
          Orders
        </Link>
      </Button>

      <AdminPageHeader
        title={order.orderNumber}
        description={`Placed ${formatDateTime(order.createdAt)}${
          order.updatedAt.getTime() !== order.createdAt.getTime()
            ? ` · updated ${formatDateTime(order.updatedAt)}`
            : ""
        }`}
        action={
          <Button asChild variant="outline">
            <Link href={`/order/${order.orderNumber}`} target="_blank">
              <ExternalLink aria-hidden />
              Customer view
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <OrderStatusBadge status={order.status} />
        <PaymentStatusBadge status={order.paymentStatus} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <TableWrap className="rounded-none border-0">
                <Table>
                  <thead>
                    <tr>
                      <Th>Product</Th>
                      <Th>Pack</Th>
                      <Th align="right">Unit price</Th>
                      <Th align="right">Qty</Th>
                      <Th align="right">Line total</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <Tr key={item.id}>
                        <Td>
                          <span className="block font-medium">
                            {item.productName}
                          </span>
                          <span className="block text-xs text-ink-muted">
                            {item.productFlavor}
                          </span>
                        </Td>
                        <Td>
                          <span className="text-ink-muted">{item.packSize}</span>
                        </Td>
                        <Td align="right">{formatMinor(item.unitPriceMinor)}</Td>
                        <Td align="right">{item.quantity}</Td>
                        <Td align="right">{formatMinor(item.lineTotalMinor)}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>

              {/* Snapshot values, not live product rows — these are what the
                  customer actually agreed to. */}
              <dl className="space-y-2.5 px-5 py-5 text-sm sm:px-6">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd className="tabular-nums">
                    {formatMinor(order.subtotalMinor)}
                  </dd>
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

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardBody>
              <OrderNotes
                orderNumber={order.orderNumber}
                adminNotes={order.adminNotes ?? ""}
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fulfilment</CardTitle>
            </CardHeader>
            <CardBody>
              <OrderStatusControls
                orderNumber={order.orderNumber}
                status={order.status}
                nextStatuses={NEXT_STATUSES[order.status]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-sm">
                <span className="text-ink-muted">Method: </span>
                <span className="font-medium">
                  {PAYMENT_METHOD_LABEL[order.paymentMethod]}
                </span>
              </p>
              <PaymentStatusControl
                orderNumber={order.orderNumber}
                paymentStatus={order.paymentStatus}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4 text-sm">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-ink-muted">
                  {order.userId ? (
                    <Link
                      href={`/admin/customers?q=${encodeURIComponent(order.customerEmail)}`}
                      className="hover:text-ice-deep"
                    >
                      Registered customer
                    </Link>
                  ) : (
                    "Guest order"
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="block text-ink-soft hover:text-ice-deep"
                >
                  {order.customerEmail}
                </a>
                <a
                  href={`tel:${order.customerPhone.replace(/\s/g, "")}`}
                  className="block text-ink-soft hover:text-ice-deep"
                >
                  {order.customerPhone}
                </a>
              </div>
              <div className="border-t border-line pt-4 leading-relaxed text-ink-soft">
                <p className="mb-1 font-medium text-ink">Delivery address</p>
                <p>{order.addressLine1}</p>
                {order.addressLine2 ? <p>{order.addressLine2}</p> : null}
                <p>
                  {order.city} {order.postalCode}
                </p>
              </div>
              {order.deliveryNotes ? (
                <div className="border-t border-line pt-4">
                  <p className="mb-1 font-medium">Delivery notes</p>
                  <p className="text-ink-soft">{order.deliveryNotes}</p>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
