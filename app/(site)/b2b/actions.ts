"use server";

import { inquirySchema } from "@/lib/validation/inquiry";
import { createInquiry } from "@/lib/server/inquiries";
import {
  type ActionResult,
  fail,
  fieldErrorsOf,
  ok,
  toActionError,
} from "@/lib/server/action-result";

/**
 * Records a B2B enquiry.
 *
 * It writes to the database and says so. No email or WhatsApp integration is
 * configured, so nothing here tells the business that a message was sent —
 * only that the enquiry was received.
 */
export async function submitInquiryAction(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = inquirySchema.safeParse(raw);
    if (!parsed.success) {
      return fail(
        "Please check the highlighted fields.",
        fieldErrorsOf(parsed.error),
      );
    }

    const inquiry = await createInquiry(parsed.data);
    return ok({ id: inquiry.id });
  } catch (error) {
    return toActionError(error);
  }
}
