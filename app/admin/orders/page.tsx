import type { Metadata } from "next";
import Link from "next/link";
import { ReceiptText, Search } from "lucide-react";
import { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatMinor } from "@/lib/money";
import { formatDateTime } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Table, TableWrap, Td, Th, Tr } from "@/components/admin/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  orderStatusLabel,
} from "@/components/site/status-badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders" };

const STATUS_VALUES = Object.values(OrderStatus);

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const activeStatus = STATUS_VALUES.includes(status as OrderStatus)
    ? (status as OrderStatus)
    : null;
  const query = q?.trim() ?? "";

  const where: Prisma.OrderWhereInput = {
    ...(activeStatus ? { status: activeStatus } : {}),
    ...(query
      ? {
          OR: [
            { orderNumber: { contains: query, mode: "insensitive" } },
            { customerName: { contains: query, mode: "insensitive" } },
            { customerEmail: { contains: query, mode: "insensitive" } },
            { customerPhone: { contains: query } },
          ],
        }
      : {}),
  };

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { items: { select: { quantity: true, productName: true } } },
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countFor = (value: OrderStatus) =>
    counts.find((row) => row.status === value)?._count._all ?? 0;
  const total = counts.reduce((sum, row) => sum + row._count._all, 0);

  return (
    <>
      <AdminPageHeader
        title="Orders"
        description="Newest first, capped at 100 results. Use the filters or search to narrow it down."
      />

      <div className="mb-5 space-y-4">
        <nav aria-label="Filter by status">
          <ul className="flex flex-wrap gap-2">
            <li>
              <FilterChip
                href={buildHref(null, query)}
                active={!activeStatus}
                count={total}
              >
                All
              </FilterChip>
            </li>
            {STATUS_VALUES.map((value) => (
              <li key={value}>
                <FilterChip
                  href={buildHref(value, query)}
                  active={activeStatus === value}
                  count={countFor(value)}
                >
                  {orderStatusLabel(value)}
                </FilterChip>
              </li>
            ))}
          </ul>
        </nav>

        <form className="flex max-w-md gap-2" role="search">
          {activeStatus ? (
            <input type="hidden" name="status" value={activeStatus} />
          ) : null}
          <Input
            name="q"
            defaultValue={query}
            placeholder="Order number, name, email or phone"
            aria-label="Search orders"
          />
          <Button type="submit" variant="outline">
            <Search aria-hidden />
            Search
          </Button>
        </form>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title={
            query || activeStatus ? "No matching orders" : "No orders yet"
          }
          description={
            query || activeStatus
              ? "Try a different status or search term."
              : "Orders placed through the shop will appear here."
          }
          action={
            query || activeStatus ? (
              <Button asChild variant="outline">
                <Link href="/admin/orders">Clear filters</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Items</Th>
                <Th align="right">Total</Th>
                <Th>Status</Th>
                <Th>Payment</Th>
                <Th>Placed</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Tr key={order.orderNumber}>
                  <Td>
                    <Link
                      href={`/admin/orders/${order.orderNumber}`}
                      className="font-medium hover:text-ice-deep"
                    >
                      {order.orderNumber}
                    </Link>
                  </Td>
                  <Td>
                    <span className="block font-medium">{order.customerName}</span>
                    <span className="block text-xs text-ink-muted">
                      {order.customerEmail}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-ink-soft">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      ×{" "}
                      <span className="text-ink-muted">
                        {order.items.length === 1
                          ? order.items[0].productName
                          : `${order.items.length} products`}
                      </span>
                    </span>
                  </Td>
                  <Td align="right">{formatMinor(order.totalMinor)}</Td>
                  <Td>
                    <OrderStatusBadge status={order.status} />
                  </Td>
                  <Td>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </Td>
                  <Td>
                    <span className="whitespace-nowrap text-ink-muted">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </>
  );
}

function buildHref(status: OrderStatus | null, query: string): string {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (query) params.set("q", query);
  const search = params.toString();
  return search ? `/admin/orders?${search}` : "/admin/orders";
}

function FilterChip({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink",
      )}
    >
      {children}
      <span className={cn("tabular-nums", active ? "text-white/70" : "text-ink-muted")}>
        {count}
      </span>
    </Link>
  );
}
