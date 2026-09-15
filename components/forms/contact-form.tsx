"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useFormAction } from "@/components/forms/use-form-action";
import { submitContactAction } from "@/app/(site)/contact/actions";

export function ContactForm() {
  const form = useFormAction(submitContactAction);

  if (form.status === "success") {
    return (
      <div className="rounded-card border border-mint-deep/25 bg-mint/10 p-8 text-center">
        <CheckCircle2 className="mx-auto size-8 text-mint-deep" aria-hidden />
        <h3 className="mt-4 text-xl font-semibold">Message received</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          Your message is with us and we will reply to the email address you
          gave.
        </p>
        <Button variant="outline" className="mt-6" onClick={form.reset}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.submit} noValidate className="space-y-5">
      {form.status === "error" && form.message ? (
        <Alert tone="error" title="Your message was not sent">
          {form.message}
        </Alert>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" error={form.fieldErrors.name}>
          {(props) => <Input {...props} autoComplete="name" required />}
        </Field>
        <Field name="email" label="Email" error={form.fieldErrors.email}>
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
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="phone"
          label="Phone"
          hint="optional"
          error={form.fieldErrors.phone}
        >
          {(props) => <Input {...props} type="tel" autoComplete="tel" />}
        </Field>
        <Field
          name="subject"
          label="Subject"
          hint="optional"
          error={form.fieldErrors.subject}
        >
          {(props) => <Input {...props} />}
        </Field>
      </div>

      <Field name="message" label="Message" error={form.fieldErrors.message}>
        {(props) => <Textarea {...props} rows={5} required />}
      </Field>

      <Button type="submit" size="lg" disabled={form.isPending} className="w-full sm:w-auto">
        {form.isPending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}
