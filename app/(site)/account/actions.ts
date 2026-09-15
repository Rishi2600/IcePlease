"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server/session";
import { phoneSchema } from "@/lib/validation/auth";
import {
  type ActionResult,
  fail,
  fieldErrorsOf,
  ok,
  toActionError,
} from "@/lib/server/action-result";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  phone: phoneSchema.optional().or(z.literal("")),
  addressLine1: z.string().trim().max(200).optional().or(z.literal("")),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  postalCode: z.string().trim().max(12).optional().or(z.literal("")),
});

/**
 * Updates the signed-in customer's own details.
 *
 * The user id comes from the session, never from the form — so this cannot be
 * pointed at somebody else's record. Email and role are not editable here.
 */
export async function updateProfileAction(
  raw: unknown,
): Promise<ActionResult<undefined>> {
  try {
    const user = await getSessionUser();
    if (!user) return fail("Please sign in again.");

    const parsed = profileSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(
        "Please check the highlighted fields.",
        fieldErrorsOf(parsed.error),
      );
    }

    const { name, phone, addressLine1, addressLine2, city, postalCode } =
      parsed.data;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        phone: phone || null,
        addressLine1: addressLine1 || null,
        addressLine2: addressLine2 || null,
        city: city || null,
        postalCode: postalCode || null,
      },
    });

    revalidatePath("/account");
    return ok();
  } catch (error) {
    return toActionError(error);
  }
}
