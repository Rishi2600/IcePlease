"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/server/session";
import {
  type ActionResult,
  fail,
  ok,
  toActionError,
} from "@/lib/server/action-result";

const schema = z.object({
  id: z.string().min(1),
  handled: z.enum(["true", "false"]),
});

/** Marks a contact message dealt with, so the inbox count means something. */
export async function setMessageHandledAction(
  raw: unknown,
): Promise<ActionResult<undefined>> {
  try {
    await requireAdminAction();

    const parsed = schema.safeParse(raw);
    if (!parsed.success) return fail("Invalid request.");

    await prisma.contactMessage.update({
      where: { id: parsed.data.id },
      data: { handled: parsed.data.handled === "true" },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return ok();
  } catch (error) {
    return toActionError(error);
  }
}
