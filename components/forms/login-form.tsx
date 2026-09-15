"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input } from "@/components/ui/field";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallback(searchParams.get("callbackUrl"));

  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      redirect: false,
    });

    if (!result?.ok) {
      setPending(false);
      // Deliberately the same message whether the address is unknown or the
      // password is wrong, so this form cannot be used to enumerate accounts.
      setError("That email and password combination did not work.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error ? (
        <Alert tone="error" title="Could not sign you in">
          {error}
        </Alert>
      ) : null}

      <Field name="email" label="Email">
        {(props) => (
          <Input
            {...props}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            autoFocus
          />
        )}
      </Field>

      <Field name="password" label="Password">
        {(props) => (
          <Input
            {...props}
            type="password"
            autoComplete="current-password"
            required
          />
        )}
      </Field>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        No account yet?{" "}
        <Link
          href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-medium text-ice-deep underline underline-offset-2"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}

/** Only same-site paths, so a crafted callbackUrl cannot bounce a user off-site. */
function safeCallback(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
