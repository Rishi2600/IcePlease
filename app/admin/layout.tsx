import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/server/session";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · IcePlease Admin" },
  robots: { index: false, follow: false },
};

// Admin screens are operational: they must always show current data.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authorization, not decoration. Middleware also guards /admin, but this
  // check is the one that runs next to the data.
  const admin = await requireAdminPage("/admin");

  const [orders, inquiries, messages] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.b2BInquiry.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count({ where: { handled: false } }),
  ]);

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <AdminNav
        counts={{ orders, inquiries, messages }}
        adminName={admin.name ?? admin.email}
      />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
