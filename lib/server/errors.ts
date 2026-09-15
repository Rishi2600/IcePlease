/**
 * Errors the server raises deliberately.
 *
 * Kept free of framework imports so business logic can be exercised outside a
 * request — the smoke test runs against these modules directly.
 */

/** The caller is not allowed to do this. */
export class AuthorizationError extends Error {
  constructor(message = "You are not allowed to do that.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * A rule the business defines, phrased for the customer — "Only 3 trays left",
 * not a stack trace. Safe to show as-is.
 */
export class BusinessRuleError extends Error {
  readonly fieldErrors?: Record<string, string>;

  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "BusinessRuleError";
    this.fieldErrors = fieldErrors;
  }
}
