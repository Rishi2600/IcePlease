import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  Info,
  Package,
  ReceiptText,
  TrendingUp,
  Users,
} from "lucide-react";
import { formatMinor } from "@/lib/money";
import {
  getDashboardMetrics,
  UNAVAILABLE_METRICS,
} from "@/lib/server/analytics";
import { orderStatusLabel } from "@/components/site/status-badge";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@prisma/client";

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  const needsAttention = [
    metrics.sales.awaitingConfirmation > 0
      ? {
          label: `${metrics.sales.awaitingConfirmation} ${
            metrics.sales.awaitingConfirmation === 1 ? "order needs" : "orders need"
          } confirmation`,
          href: "/admin/orders?status=PENDING",
        }
      : null,
    metrics.sales.readyForDispatch > 0
      ? {
          label: `${metrics.sales.readyForDispatch} ready for dispatch`,
          href: "/admin/orders?status=READY",
        }
      : null,
    metrics.b2b.byStatus.NEW > 0
      ? {
          label: `${metrics.b2b.byStatus.NEW} new B2B ${
            metrics.b2b.byStatus.NEW === 1 ? "enquiry" : "enquiries"
          }`,
          href: "/admin/inquiries?status=NEW",
        }
      : null,
    metrics.catalogue.outOfStock > 0
      ? {
          label: `${metrics.catalogue.outOfStock} out of stock`,
          href: "/admin/products",
        }
      : null,
    metrics.inbox.unhandledMessages > 0
      ? {
          label: `${metrics.inbox.unhandledMessages} unread ${
            metrics.inbox.unhandledMessages === 1 ? "message" : "messages"
          }`,
          href: "/admin/messages",
        }
      : null,
  ].filter((item): item is { label: string; href: string } => item !== null);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description={`Everything below is calculated from real orders, products and enquiries. The window is the last ${metrics.windowDays} days where stated.`}
      />

      {needsAttention.length > 0 ? (
        <section aria-labelledby="attention" className="mb-8">
          <h2 id="attention" className="sr-only">
            Needs attention
          </h2>
          <div className="flex flex-wrap gap-2">
            {needsAttention.map((item) => (
              <Button key={item.href + item.label} asChild variant="outline" size="sm">
                <Link href={item.href}>
                  <AlertTriangle aria-hidden />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------------------- Sales */}
      <section aria-labelledby="sales-heading">
        <h2 id="sales-heading" className="text-lg font-semibold">
          Sales
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={ReceiptText}
            label="Orders"
            value={String(metrics.sales.orderCount)}
            hint="All time, excluding cancelled"
          />
          <StatCard
            icon={TrendingUp}
            label="Order value"
            value={formatMinor(metrics.sales.orderValueMinor)}
            hint="Agreed totals, not money received"
          />
          <StatCard
            label="Average order value"
            value={
              metrics.sales.orderCount > 0
                ? formatMinor(metrics.sales.averageOrderValueMinor)
                : "—"
            }
            hint={
              metrics.sales.orderCount > 0
                ? `Across ${metrics.sales.orderCount} orders`
                : "No orders yet"
            }
          />
          <StatCard
            label={`Last ${metrics.windowDays} days`}
            value={String(metrics.sales.windowOrderCount)}
            hint={`${formatMinor(metrics.sales.windowOrderValueMinor)} in order value`}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Orders by status</CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2.5">
                {(
                  Object.entries(metrics.sales.ordersByStatus) as [
                    OrderStatus,
                    number,
                  ][]
                ).map(([status, count]) => (
                  <li key={status} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 text-sm text-ink-soft">
                      {orderStatusLabel(status)}
                    </span>
                    <span
                      aria-hidden
                      className="h-2 rounded-full bg-ice-deep"
                      style={{
                        width: `${
                          metrics.sales.orderCount > 0
                            ? Math.max(
                                count > 0 ? 4 : 0,
                                (count / Math.max(metrics.sales.orderCount, 1)) *
                                  100,
                              )
                            : 0
                        }%`,
                      }}
                    />
                    <span className="ml-auto text-sm font-semibold tabular-nums">
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-ink-soft">
                  Marked paid by an admin
                </span>
                <span className="font-display text-2xl font-semibold tabular-nums">
                  {formatMinor(metrics.sales.collectedValueMinor)}
                </span>
              </div>
              <p className="text-sm text-ink-muted">
                Across {metrics.sales.collectedOrderCount}{" "}
                {metrics.sales.collectedOrderCount === 1 ? "order" : "orders"}.
              </p>
              {/* Never described as "revenue collected": no payment provider is
                  connected, so this reflects manual bookkeeping only. */}
              <div className="flex items-start gap-2.5 rounded-xl bg-surface-sunken p-3 text-xs leading-relaxed text-ink-soft">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                <span>
                  No payment provider is connected. This figure reflects orders
                  an admin has marked as paid, not confirmed settlements.
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* ----------------------------------------------------------- Products */}
      <section aria-labelledby="products-heading" className="mt-10">
        <h2 id="products-heading" className="text-lg font-semibold">
          Products
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Package}
            label="Active products"
            value={String(metrics.catalogue.active)}
            hint={`${metrics.catalogue.total} in the catalogue`}
          />
          <StatCard
            label="Units in stock"
            value={String(metrics.catalogue.unitsInStock)}
            hint="Across every product"
          />
          <StatCard
            label="Out of stock"
            value={String(metrics.catalogue.outOfStock)}
            hint="Active products with zero stock"
          />
          <StatCard
            label="Low stock"
            value={String(metrics.catalogue.lowStock)}
            hint="Five or fewer left"
          />
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Best sellers by units</CardTitle>
          </CardHeader>
          <CardBody>
            {metrics.catalogue.topProducts.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Nothing has sold yet, so there is no ranking to show.
              </p>
            ) : (
              <ol className="space-y-3">
                {metrics.catalogue.topProducts.map((product, index) => (
                  <li
                    key={`${product.name}-${product.flavor}`}
                    className="flex items-center gap-3"
                  >
                    <span
                      aria-hidden
                      className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-sunken text-xs font-semibold text-ink-soft"
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {product.name}
                      </span>
                      <span className="text-xs text-ink-muted">
                        {product.flavor}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-sm">
                      <span className="block font-semibold tabular-nums">
                        {product.units} units
                      </span>
                      <span className="text-xs text-ink-muted tabular-nums">
                        {formatMinor(product.valueMinor)}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardBody>
        </Card>
      </section>

      {/* -------------------------------------------------- Customers and B2B */}
      <section aria-labelledby="people-heading" className="mt-10">
        <h2 id="people-heading" className="text-lg font-semibold">
          Customers and B2B
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Users}
            label="Registered customers"
            value={String(metrics.customers.total)}
            hint={`${metrics.customers.newInWindow} new in ${metrics.windowDays} days`}
          />
          <StatCard
            label="Repeat customers"
            value={String(metrics.customers.repeat)}
            hint="More than one order placed"
          />
          <StatCard
            label="Guest orders"
            value={String(metrics.customers.guestOrders)}
            hint="Placed without an account"
          />
          <StatCard
            icon={Building2}
            label="B2B enquiries"
            value={String(metrics.b2b.total)}
            hint={
              metrics.b2b.conversionRate === null
                ? "No enquiries yet"
                : `${metrics.b2b.converted} converted · ${metrics.b2b.conversionRate}%`
            }
          />
        </div>
      </section>

      {/* ------------------------------------------------ Honesty about gaps */}
      <section aria-labelledby="unavailable-heading" className="mt-10">
        <Card>
          <CardHeader>
            <CardTitle>
              <span id="unavailable-heading">Not calculated yet</span>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-ink-muted">
              These are deliberately blank rather than estimated. Each needs data
              the application does not hold.
            </p>
            <ul className="mt-4 space-y-3">
              {UNAVAILABLE_METRICS.map((item) => (
                <li key={item.metric} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Badge tone="neutral">Unavailable</Badge>
                  <span className="font-medium">{item.metric}</span>
                  <span className="text-sm text-ink-muted">{item.needs}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>
    </>
  );
}
