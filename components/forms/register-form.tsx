"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input } from "@/components/ui/field";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallback(searchParams.get("callbackUrl"));

  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {},
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);
    setFieldErrors({});

    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      password: String(data.get("password") ?? ""),
    };

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
        fieldErrors?: Record<string, string>;
      };
      setPending(false);
      setError(body.message ?? "We could not create your account.");
      setFieldErrors(body.fieldErrors ?? {});
      return;
    }

    // Registration succeeded, so sign the new account straight in.
    const signedIn = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    if (!signedIn?.ok) {
      setPending(false);
      setError("Your account was created. Please sign in.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error ? (
        <Alert tone="error" title="Could not create your account">
          {error}
        </Alert>
      ) : null}

      <Field name="name" label="Your name" error={fieldErrors.name}>
        {(props) => <Input {...props} autoComplete="name" required autoFocus />}
      </Field>

      <Field name="email" label="Email" error={fieldErrors.email}>
        {(props) => (
          <Input
            {...props}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
          />
        )}
      </Field>

      <Field name="phone" label="Phone" hint="optional" error={fieldErrors.phone}>
        {(props) => <Input {...props} type="tel" autoComplete="tel" />}
      </Field>

      <Field
        name="password"
        label="Password"
        hint="at least 8 characters"
        error={fieldErrors.password}
      >
        {(props) => (
          <Input
            {...props}
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        )}
      </Field>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-medium text-ice-deep underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

function safeCallback(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
