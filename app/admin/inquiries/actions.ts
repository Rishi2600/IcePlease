"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { InquiryStatus } from "@prisma/client";
import { updateInquiry } from "@/lib/server/inquiries";
import { requireAdminAction } from "@/lib/server/session";
import {
  type ActionResult,
  fail,
  ok,
  toActionError,
} from "@/lib/server/action-result";

const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(InquiryStatus),
});

/** Moves an enquiry along the B2B pipeline: NEW → CONTACTED → QUOTED → … */
export async function updateInquiryStatusAction(
  raw: unknown,
): Promise<ActionResult<{ status: InquiryStatus }>> {
  try {
    await requireAdminAction();

    const parsed = statusSchema.safeParse(raw);
    if (!parsed.success) return fail("Invalid request.");

    await updateInquiry(parsed.data.id, { status: parsed.data.status });

    revalidatePath("/admin/inquiries");
    revalidatePath("/admin");
    return ok({ status: parsed.data.status });
  } catch (error) {
    return toActionError(error);
  }
}

const notesSchema = z.object({
  id: z.string().min(1),
  adminNotes: z.string().trim().max(2000),
});

export async function updateInquiryNotesAction(
  raw: unknown,
): Promise<ActionResult<undefined>> {
  try {
    await requireAdminAction();

    const parsed = notesSchema.safeParse(raw);
    if (!parsed.success) return fail("Keep notes under 2000 characters.");

    await updateInquiry(parsed.data.id, {
      adminNotes: parsed.data.adminNotes || null,
    });

    revalidatePath("/admin/inquiries");
    return ok();
  } catch (error) {
    return toActionError(error);
  }
}
