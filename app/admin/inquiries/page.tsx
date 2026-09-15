import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { InquiryStatus } from "@prisma/client";
import {
  inquiryCountsByStatus,
  listInquiries,
} from "@/lib/server/inquiries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { InquiryCard } from "@/components/admin/inquiry-card";
import { INQUIRY_STATUS_LABELS } from "@/components/site/status-badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "B2B enquiries" };

const STATUS_VALUES = Object.values(InquiryStatus);

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = STATUS_VALUES.includes(status as InquiryStatus)
    ? (status as InquiryStatus)
    : null;

  const [inquiries, counts] = await Promise.all([
    listInquiries(activeStatus ?? undefined),
    inquiryCountsByStatus(),
  ]);

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <AdminPageHeader
        title="B2B enquiries"
        description="Every enquiry from the B2B form. Quoting and negotiation happen off-platform; this is the pipeline that tracks them."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Total enquiries"
          value={String(total)}
          hint={`${counts.NEW} awaiting first contact`}
        />
        <StatCard
          label="In conversation"
          value={String(counts.CONTACTED + counts.QUOTED)}
          hint={`${counts.QUOTED} quoted`}
        />
        <StatCard
          label="Converted"
          value={String(counts.CONVERTED)}
          hint={
            total > 0
              ? `${Math.round((counts.CONVERTED / total) * 100)}% of all enquiries`
              : "No enquiries yet"
          }
        />
        <StatCard
          label="Closed"
          value={String(counts.CLOSED)}
          hint="Did not go ahead"
        />
      </div>

      <nav aria-label="Filter by status" className="mb-6">
        <ul className="flex flex-wrap gap-2">
          <li>
            <FilterChip href="/admin/inquiries" active={!activeStatus} count={total}>
              All
            </FilterChip>
          </li>
          {STATUS_VALUES.map((value) => (
            <li key={value}>
              <FilterChip
                href={`/admin/inquiries?status=${value}`}
                active={activeStatus === value}
                count={counts[value]}
              >
                {INQUIRY_STATUS_LABELS[value]}
              </FilterChip>
            </li>
          ))}
        </ul>
      </nav>

      {inquiries.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={activeStatus ? "Nothing at this stage" : "No enquiries yet"}
          description={
            activeStatus
              ? "No enquiries are currently at this stage of the pipeline."
              : "Enquiries from the B2B form will appear here."
          }
        />
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </>
  );
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
