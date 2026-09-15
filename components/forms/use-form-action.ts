"use client";

import * as React from "react";
import type { ActionResult } from "@/lib/server/action-result";

type Status = "idle" | "pending" | "success" | "error";

/**
 * Wires a plain <form> to a server action.
 *
 * Every form in the app reports the same four states, so a failure is never
 * silent and a pending submit can never be double-fired.
 */
export function useFormAction<T>(
  action: (payload: Record<string, string>) => Promise<ActionResult<T>>,
  options: {
    /**
     * Clear the fields after a successful submit. Right for forms that create
     * something new; wrong for forms that edit an existing record, where
     * clearing would show stale defaults.
     */
     clearOnSuccess?: boolean;
  } = {},
) {
  const { clearOnSuccess = true } = options;
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [data, setData] = React.useState<T | null>(null);

  const submit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === "pending") return;

      const form = event.currentTarget;
      const payload = Object.fromEntries(
        [...new FormData(form).entries()].map(([key, value]) => [
          key,
          typeof value === "string" ? value : "",
        ]),
      );

      setStatus("pending");
      setMessage(null);
      setFieldErrors({});

      const result = await action(payload);

      if (result.ok) {
        setData(result.data);
        setStatus("success");
        if (clearOnSuccess) form.reset();
      } else {
        setMessage(result.message);
        setFieldErrors(result.fieldErrors ?? {});
        setStatus("error");
      }
    },
    [action, status, clearOnSuccess],
  );

  return {
    submit,
    status,
    message,
    fieldErrors,
    data,
    isPending: status === "pending",
    reset: () => {
      setStatus("idle");
      setMessage(null);
      setFieldErrors({});
    },
  };
}
