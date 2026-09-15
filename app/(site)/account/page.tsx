import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/server/session";
import { listOrdersForUser } from "@/lib/server/orders";
import { formatMinor } from "@/lib/money";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SignOutButton } from "@/components/site/sign-out-button";
import { ProfileForm } from "@/components/forms/profile-form";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/site/status-badge";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false },
};

export default async function AccountPage() {
  const session = await requireUser("/account");

  const [account, orders] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: session.id },
      select: {
        name: true,
        email: true,
        phone: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        postalCode: true,
      },
    }),
    listOrdersForUser(session.id),
  ]);

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">Your account</h1>
          <p className="mt-2 text-ink-muted">{account.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        <section aria-labelledby="orders-heading">
          <h2 id="orders-heading" className="text-2xl font-semibold">
            Your orders
          </h2>

          {orders.length === 0 ? (
            <EmptyState
              className="mt-6"
              icon={Package}
              title="No orders yet"
              description="Orders you place while signed in will appear here."
              action={
                <Button asChild>
                  <Link href="/shop">Browse flavors</Link>
                </Button>
              }
            />
          ) : (
            <ul className="mt-6 space-y-4">
              {orders.map((order) => (
                <li key={order.orderNumber}>
                  <Card>
                    <CardHeader className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <CardTitle>
                          <Link
                            href={`/order/${order.orderNumber}`}
                            className="hover:text-ice-deep"
                          >
                            {order.orderNumber}
                          </Link>
                        </CardTitle>
                        <p className="mt-1 text-sm text-ink-muted">
                          {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </div>
                    </CardHeader>
                    <CardBody className="flex flex-wrap items-center justify-between gap-4">
                      <p className="text-sm text-ink-soft">
                        {order.items
                          .map((item) => `${item.quantity} × ${item.productName}`)
                          .join(", ")}
                      </p>
                      <p className="font-display text-lg font-semibold tabular-nums">
                        {formatMinor(order.totalMinor)}
                      </p>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="details-heading">
          <h2 id="details-heading" className="text-2xl font-semibold">
            Your details
          </h2>
          <div className="mt-6 rounded-card border border-line bg-surface p-6">
            <ProfileForm
              values={{
                name: account.name ?? "",
                phone: account.phone ?? "",
                addressLine1: account.addressLine1 ?? "",
                addressLine2: account.addressLine2 ?? "",
                city: account.city ?? "",
                postalCode: account.postalCode ?? "",
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
