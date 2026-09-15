import type { Metadata } from "next";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import {
  listGuestCustomers,
  listRegisteredCustomers,
} from "@/lib/server/customers";
import { formatMinor } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Table, TableWrap, Td, Th, Tr } from "@/components/admin/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";

export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const [registered, guests] = await Promise.all([
    listRegisteredCustomers(query),
    listGuestCustomers(query),
  ]);

  const repeatCount = registered.filter(
    (customer) => customer.orderCount > 1,
  ).length;

  return (
    <>
      <AdminPageHeader
        title="Customers"
        description="Registered accounts and guest orders are listed separately — a guest has no account, only an order history under their email."
      />

      <form className="mb-6 flex max-w-md gap-2" role="search">
        <Input
          name="q"
          defaultValue={query}
          placeholder="Name, email or phone"
          aria-label="Search customers"
        />
        <Button type="submit" variant="outline">
          <Search aria-hidden />
          Search
        </Button>
        {query ? (
          <Button asChild variant="ghost">
            <Link href="/admin/customers">Clear</Link>
          </Button>
        ) : null}
      </form>

      <section aria-labelledby="registered-heading">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 id="registered-heading" className="text-lg font-semibold">
            Registered accounts
          </h2>
          <p className="text-sm text-ink-muted">
            {registered.length} shown · {repeatCount} with more than one order
          </p>
        </div>

        {registered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={query ? "No matching accounts" : "No registered customers yet"}
            description={
              query
                ? "Try a different search term."
                : "Customers who create an account will be listed here."
            }
          />
        ) : (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th>Customer</Th>
                  <Th>Contact</Th>
                  <Th>City</Th>
                  <Th align="right">Orders</Th>
                  <Th align="right">Total</Th>
                  <Th>Last order</Th>
                  <Th>Joined</Th>
                </tr>
              </thead>
              <tbody>
                {registered.map((customer) => (
                  <Tr key={customer.id}>
                    <Td>
                      <span className="flex items-center gap-2">
                        <span className="font-medium">
                          {customer.name ?? "Unnamed"}
                        </span>
                        {customer.orderCount > 1 ? (
                          <Badge tone="mint">Repeat</Badge>
                        ) : null}
                      </span>
                    </Td>
                    <Td>
                      <a
                        href={`mailto:${customer.email}`}
                        className="block text-ink-soft hover:text-ice-deep"
                      >
                        {customer.email}
                      </a>
                      {customer.phone ? (
                        <span className="block text-xs text-ink-muted">
                          {customer.phone}
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      <span className="text-ink-muted">
                        {customer.city ?? "—"}
                      </span>
                    </Td>
                    <Td align="right">
                      {customer.orderCount > 0 ? (
                        <Link
                          href={`/admin/orders?q=${encodeURIComponent(customer.email)}`}
                          className="font-medium hover:text-ice-deep"
                        >
                          {customer.orderCount}
                        </Link>
                      ) : (
                        <span className="text-ink-muted">0</span>
                      )}
                    </Td>
                    <Td align="right">
                      {formatMinor(customer.totalSpentMinor)}
                    </Td>
                    <Td>
                      <span className="whitespace-nowrap text-ink-muted">
                        {customer.lastOrderAt
                          ? formatDate(customer.lastOrderAt)
                          : "—"}
                      </span>
                    </Td>
                    <Td>
                      <span className="whitespace-nowrap text-ink-muted">
                        {formatDate(customer.createdAt)}
                      </span>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        )}
      </section>

      <section aria-labelledby="guests-heading" className="mt-10">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 id="guests-heading" className="text-lg font-semibold">
            Guest orders
          </h2>
          <p className="text-sm text-ink-muted">
            Grouped by the email given at checkout
          </p>
        </div>

        {guests.length === 0 ? (
          <EmptyState
            icon={Users}
            title={query ? "No matching guests" : "No guest orders yet"}
            description={
              query
                ? "Try a different search term."
                : "Orders placed without an account will be grouped here."
            }
          />
        ) : (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Contact</Th>
                  <Th align="right">Orders</Th>
                  <Th align="right">Total</Th>
                  <Th>Last order</Th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <Tr key={guest.email}>
                    <Td>
                      <span className="flex items-center gap-2">
                        <span className="font-medium">{guest.name}</span>
                        {guest.orderCount > 1 ? (
                          <Badge tone="mint">Repeat</Badge>
                        ) : null}
                      </span>
                    </Td>
                    <Td>
                      <a
                        href={`mailto:${guest.email}`}
                        className="block text-ink-soft hover:text-ice-deep"
                      >
                        {guest.email}
                      </a>
                      <span className="block text-xs text-ink-muted">
                        {guest.phone}
                      </span>
                    </Td>
                    <Td align="right">
                      <Link
                        href={`/admin/orders?q=${encodeURIComponent(guest.email)}`}
                        className="font-medium hover:text-ice-deep"
                      >
                        {guest.orderCount}
                      </Link>
                    </Td>
                    <Td align="right">{formatMinor(guest.totalSpentMinor)}</Td>
                    <Td>
                      <span className="whitespace-nowrap text-ink-muted">
                        {formatDate(guest.lastOrderAt)}
                      </span>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        )}
      </section>
    </>
  );
}
