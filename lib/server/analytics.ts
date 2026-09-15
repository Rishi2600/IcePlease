import "server-only";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Dashboard metrics.
 *
 * Every number here is computed from rows that actually exist. Where a metric
 * cannot be derived honestly from the data the application holds — acquisition
 * cost, gross margin, wastage — it is absent rather than estimated. The
 * dashboard says which ones those are and why, instead of showing a
 * plausible-looking figure nobody can act on.
 *
 * "Order value" and "collected" are kept apart on purpose. With no payment
 * provider configured, an order total is what was agreed, not what was
 * received.
 */

const DAY = 24 * 60 * 60 * 1000;

export type DashboardMetrics = Awaited<ReturnType<typeof getDashboardMetrics>>;

export async function getDashboardMetrics(windowDays = 30) {
  const since = new Date(Date.now() - windowDays * DAY);

  // Cancelled orders are excluded from value: they were not sold.
  const countedOrder = { status: { not: OrderStatus.CANCELLED } } as const;

  const [
    orderTotals,
    windowTotals,
    collectedTotals,
    statusGroups,
    productStats,
    customerCount,
    newCustomerCount,
    guestOrderCount,
    inquiryGroups,
    inquiriesInWindow,
    unhandledMessages,
    topProducts,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: countedOrder,
      _count: { _all: true },
      _sum: { totalMinor: true },
    }),
    prisma.order.aggregate({
      where: { ...countedOrder, createdAt: { gte: since } },
      _count: { _all: true },
      _sum: { totalMinor: true },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: PaymentStatus.PAID },
      _count: { _all: true },
      _sum: { totalMinor: true },
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.product.aggregate({
      _count: { _all: true },
      _sum: { stock: true },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({
      where: { role: "CUSTOMER", createdAt: { gte: since } },
    }),
    prisma.order.count({ where: { userId: null } }),
    prisma.b2BInquiry.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.b2BInquiry.count({ where: { createdAt: { gte: since } } }),
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.orderItem.groupBy({
      by: ["productName", "productFlavor"],
      where: { order: countedOrder },
      _sum: { quantity: true, lineTotalMinor: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const [activeProducts, outOfStock, lowStock] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, stock: 0 } }),
    prisma.product.count({
      where: { isActive: true, stock: { gt: 0, lte: 5 } },
    }),
  ]);

  const ordersByStatus = Object.fromEntries(
    Object.values(OrderStatus).map((status) => [status, 0]),
  ) as Record<OrderStatus, number>;
  for (const group of statusGroups) {
    ordersByStatus[group.status] = group._count._all;
  }

  const inquiriesByStatus = {
    NEW: 0,
    CONTACTED: 0,
    QUOTED: 0,
    CONVERTED: 0,
    CLOSED: 0,
  };
  for (const group of inquiryGroups) {
    inquiriesByStatus[group.status] = group._count._all;
  }
  const inquiryTotal = Object.values(inquiriesByStatus).reduce(
    (sum, count) => sum + count,
    0,
  );

  const orderCount = orderTotals._count._all;
  const orderValueMinor = orderTotals._sum.totalMinor ?? 0;

  const repeatCustomers = await countRepeatCustomers();

  return {
    windowDays,

    sales: {
      orderCount,
      orderValueMinor,
      /** Integer division keeps this in paise; no float money. */
      averageOrderValueMinor:
        orderCount > 0 ? Math.round(orderValueMinor / orderCount) : 0,
      windowOrderCount: windowTotals._count._all,
      windowOrderValueMinor: windowTotals._sum.totalMinor ?? 0,
      collectedOrderCount: collectedTotals._count._all,
      collectedValueMinor: collectedTotals._sum.totalMinor ?? 0,
      awaitingConfirmation: ordersByStatus.PENDING,
      readyForDispatch: ordersByStatus.READY,
      ordersByStatus,
    },

    catalogue: {
      total: productStats._count._all,
      active: activeProducts,
      outOfStock,
      lowStock,
      unitsInStock: productStats._sum.stock ?? 0,
      topProducts: topProducts.map((row) => ({
        name: row.productName,
        flavor: row.productFlavor,
        units: row._sum.quantity ?? 0,
        valueMinor: row._sum.lineTotalMinor ?? 0,
      })),
    },

    customers: {
      total: customerCount,
      newInWindow: newCustomerCount,
      repeat: repeatCustomers,
      guestOrders: guestOrderCount,
    },

    b2b: {
      total: inquiryTotal,
      newInWindow: inquiriesInWindow,
      byStatus: inquiriesByStatus,
      converted: inquiriesByStatus.CONVERTED,
      /** Null rather than 0% when there is nothing to divide by. */
      conversionRate:
        inquiryTotal > 0
          ? Math.round((inquiriesByStatus.CONVERTED / inquiryTotal) * 100)
          : null,
    },

    inbox: {
      unhandledMessages,
    },
  };
}

/** Customers with more than one non-cancelled order. */
async function countRepeatCustomers(): Promise<number> {
  const grouped = await prisma.order.groupBy({
    by: ["userId"],
    where: { userId: { not: null }, status: { not: OrderStatus.CANCELLED } },
    _count: { _all: true },
  });
  return grouped.filter((row) => row._count._all > 1).length;
}

/**
 * Metrics the business will eventually want that this application cannot
 * honestly calculate yet, and what each one is waiting on. Rendered on the
 * dashboard so the gap is explicit rather than quietly filled in.
 */
export const UNAVAILABLE_METRICS = [
  {
    metric: "Gross margin",
    needs: "Per-product cost of goods, which the catalogue does not record yet.",
  },
  {
    metric: "Customer acquisition cost",
    needs: "Marketing spend, which is not tracked in this application.",
  },
  {
    metric: "Wastage and spoilage",
    needs: "Production batch and stock write-off records.",
  },
  {
    metric: "Collected revenue",
    needs:
      "A payment provider. Until one is connected, 'paid' is whatever an admin has marked by hand.",
  },
] as const;
