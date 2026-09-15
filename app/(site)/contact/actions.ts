"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation/contact";
import {
  type ActionResult,
  fail,
  fieldErrorsOf,
  ok,
  toActionError,
} from "@/lib/server/action-result";

/**
 * Records a contact message.
 *
 * No email provider is configured, so the message is stored for the admin to
 * read. The UI says exactly that rather than claiming a message was delivered.
 */
export async function submitContactAction(
  raw: unknown,
): Promise<ActionResult<undefined>> {
  try {
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(
        "Please check the highlighted fields.",
        fieldErrorsOf(parsed.error),
      );
    }

    const { name, email, phone, subject, message } = parsed.data;
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    });

    return ok();
  } catch (error) {
    return toActionError(error);
  }
}
