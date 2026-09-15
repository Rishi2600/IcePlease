import "server-only";
import type { BusinessType, InquiryStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { InquiryInput } from "@/lib/validation/inquiry";

/**
 * B2B enquiries.
 *
 * B2B is enquiry-first: quantities, trial quantities and recurring terms are
 * negotiated by a person. Nothing here quotes a price or promises a delivery
 * schedule — it captures enough for the founder to have a real conversation.
 */

export function createInquiry(input: InquiryInput) {
  return prisma.b2BInquiry.create({
    data: {
      businessName: input.businessName,
      businessType: input.businessType as BusinessType,
      contactPerson: input.contactPerson,
      phone: input.phone,
      email: input.email,
      city: input.city,
      location: input.location || null,
      estimatedQuantity: input.estimatedQuantity,
      preferredFlavors: input.preferredFlavors || null,
      message: input.message || null,
      // Status is always NEW on creation. It is never taken from the request.
    },
    select: { id: true, status: true },
  });
}

export function listInquiries(status?: InquiryStatus) {
  return prisma.b2BInquiry.findMany({
    where: status ? { status } : undefined,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export function getInquiry(id: string) {
  return prisma.b2BInquiry.findUnique({ where: { id } });
}

export function updateInquiry(
  id: string,
  data: Prisma.B2BInquiryUpdateInput,
) {
  return prisma.b2BInquiry.update({ where: { id }, data });
}

export async function inquiryCountsByStatus(): Promise<
  Record<InquiryStatus, number>
> {
  const rows = await prisma.b2BInquiry.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const counts = {
    NEW: 0,
    CONTACTED: 0,
    QUOTED: 0,
    CONVERTED: 0,
    CLOSED: 0,
  } satisfies Record<InquiryStatus, number>;
  for (const row of rows) counts[row.status] = row._count._all;
  return counts;
}
