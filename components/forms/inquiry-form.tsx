"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { useFormAction } from "@/components/forms/use-form-action";
import { submitInquiryAction } from "@/app/(site)/b2b/actions";
import { BUSINESS_TYPES } from "@/lib/business-types";

export function InquiryForm() {
  const form = useFormAction(submitInquiryAction);

  if (form.status === "success") {
    return (
      <div className="rounded-card border border-mint-deep/25 bg-mint/10 p-8 text-center">
        <CheckCircle2
          className="mx-auto size-8 text-mint-deep"
          aria-hidden
        />
        <h3 className="mt-4 text-xl font-semibold">Enquiry received</h3>
        {/* We record it. We do not claim an email went anywhere, because no
            messaging integration is configured. */}
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          Your enquiry is logged and someone from IcePlease will get back to you
          on the phone number or email you gave us.
        </p>
        <Button variant="outline" className="mt-6" onClick={form.reset}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.submit} noValidate className="space-y-5">
      {form.status === "error" && form.message ? (
        <Alert tone="error" title="Your enquiry was not sent">
          {form.message}
        </Alert>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="businessName"
          label="Business name"
          error={form.fieldErrors.businessName}
        >
          {(props) => <Input {...props} autoComplete="organization" required />}
        </Field>
        <Field
          name="businessType"
          label="Type of business"
          error={form.fieldErrors.businessType}
        >
          {(props) => (
            <Select {...props} defaultValue="CAFE">
              {BUSINESS_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="contactPerson"
          label="Contact person"
          error={form.fieldErrors.contactPerson}
        >
          {(props) => <Input {...props} autoComplete="name" required />}
        </Field>
        <Field name="phone" label="Phone" error={form.fieldErrors.phone}>
          {(props) => (
            <Input {...props} type="tel" inputMode="tel" autoComplete="tel" required />
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="email" label="Email" error={form.fieldErrors.email}>
          {(props) => (
            <Input {...props} type="email" inputMode="email" autoComplete="email" required />
          )}
        </Field>
        <Field name="city" label="City" error={form.fieldErrors.city}>
          {(props) => (
            <Input {...props} autoComplete="address-level2" required />
          )}
        </Field>
      </div>

      <Field
        name="location"
        label="Area or outlet address"
        hint="optional"
        error={form.fieldErrors.location}
      >
        {(props) => <Input {...props} />}
      </Field>

      <Field
        name="estimatedQuantity"
        label="Roughly how much would you need?"
        hint="in your own units"
        error={form.fieldErrors.estimatedQuantity}
      >
        {(props) => (
          <Input
            {...props}
            placeholder="e.g. around 200 cubes a week, or 3 trays a day"
            required
          />
        )}
      </Field>

      <Field
        name="preferredFlavors"
        label="Flavors you are interested in"
        hint="optional"
        error={form.fieldErrors.preferredFlavors}
      >
        {(props) => <Input {...props} placeholder="e.g. coffee, lime, mint" />}
      </Field>

      <Field
        name="message"
        label="Anything else we should know?"
        hint="optional"
        error={form.fieldErrors.message}
      >
        {(props) => (
          <Textarea
            {...props}
            rows={4}
            placeholder="What you serve, how often you would want delivery, whether you want to trial it first."
          />
        )}
      </Field>

      <Button type="submit" size="lg" disabled={form.isPending} className="w-full sm:w-auto">
        {form.isPending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          "Send enquiry"
        )}
      </Button>
    </form>
  );
}
