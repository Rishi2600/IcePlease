import "server-only";
import { OrderStatus, Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Customer views for the admin.
 *
 * Two kinds of people order: registered accounts and guests. Guests have no
 * user row, so their history is grouped by the email on the order. Both are
 * shown, labelled for what they are — collapsing them would overstate how many
 * accounts exist.
 */

export type RegisteredCustomer = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  createdAt: Date;
  orderCount: number;
  totalSpentMinor: number;
  lastOrderAt: Date | null;
};

export type GuestCustomer = {
  email: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpentMinor: number;
  lastOrderAt: Date;
};

const COUNTED = { status: { not: OrderStatus.CANCELLED } } as const;

export async function listRegisteredCustomers(
  query: string,
): Promise<RegisteredCustomer[]> {
  const where: Prisma.UserWhereInput = {
    role: Role.CUSTOMER,
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { phone: { contains: query } },
          ],
        }
      : {}),
  };

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      city: true,
      createdAt: true,
      orders: {
        where: COUNTED,
        select: { totalMinor: true, createdAt: true },
      },
    },
  });

  return users
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      createdAt: user.createdAt,
      orderCount: user.orders.length,
      totalSpentMinor: user.orders.reduce(
        (sum, order) => sum + order.totalMinor,
        0,
      ),
      lastOrderAt:
        user.orders.length > 0
          ? user.orders.reduce(
              (latest, order) =>
                order.createdAt > latest ? order.createdAt : latest,
              user.orders[0].createdAt,
            )
          : null,
    }))
    .sort((a, b) => b.orderCount - a.orderCount || +b.createdAt - +a.createdAt);
}

export async function listGuestCustomers(
  query: string,
): Promise<GuestCustomer[]> {
  const orders = await prisma.order.findMany({
    where: {
      userId: null,
      ...COUNTED,
      ...(query
        ? {
            OR: [
              { customerName: { contains: query, mode: "insensitive" } },
              { customerEmail: { contains: query, mode: "insensitive" } },
              { customerPhone: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      customerEmail: true,
      customerName: true,
      customerPhone: true,
      totalMinor: true,
      createdAt: true,
    },
  });

  const byEmail = new Map<string, GuestCustomer>();
  for (const order of orders) {
    const existing = byEmail.get(order.customerEmail);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpentMinor += order.totalMinor;
      if (order.createdAt > existing.lastOrderAt) {
        existing.lastOrderAt = order.createdAt;
      }
    } else {
      byEmail.set(order.customerEmail, {
        email: order.customerEmail,
        name: order.customerName,
        phone: order.customerPhone,
        orderCount: 1,
        totalSpentMinor: order.totalMinor,
        lastOrderAt: order.createdAt,
      });
    }
  }

  return [...byEmail.values()].sort(
    (a, b) => b.orderCount - a.orderCount || +b.lastOrderAt - +a.lastOrderAt,
  );
}
