import "server-only";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AuthorizationError, BusinessRuleError } from "@/lib/server/errors";

/**
 * One shape for every server-action outcome, so forms handle results the same
 * way everywhere and no raw error ever reaches the browser.
 */
export type FieldErrors = Record<string, string>;

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

export function ok(): ActionResult<undefined>;
export function ok<T>(data: T): ActionResult<T>;
export function ok<T>(data?: T): ActionResult<T | undefined> {
  return { ok: true, data };
}

export function fail(
  message: string,
  fieldErrors?: FieldErrors,
): ActionResult<never> {
  return { ok: false, message, fieldErrors };
}

/** Flattens a ZodError into one message per field. */
export function fieldErrorsOf(error: ZodError): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

/**
 * Converts anything thrown inside a server action into a safe result.
 * Internal detail is logged server-side and never sent to the client.
 */
export function toActionError(error: unknown): ActionResult<never> {
  if (error instanceof ZodError) {
    return fail("Please check the highlighted fields.", fieldErrorsOf(error));
  }

  if (error instanceof AuthorizationError) {
    return fail(error.message);
  }

  if (error instanceof BusinessRuleError) {
    return fail(error.message, error.fieldErrors);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return fail("That value is already in use.");
    }
    if (error.code === "P2025") {
      return fail("That record no longer exists.");
    }
  }

  console.error("[action]", error);
  return fail("Something went wrong on our side. Please try again.");
}
