"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input } from "@/components/ui/field";
import { useFormAction } from "@/components/forms/use-form-action";
import { updateProfileAction } from "@/app/(site)/account/actions";

export type ProfileValues = {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
};

export function ProfileForm({ values }: { values: ProfileValues }) {
  const form = useFormAction(updateProfileAction, { clearOnSuccess: false });

  return (
    <form onSubmit={form.submit} noValidate className="space-y-5">
      {form.status === "error" && form.message ? (
        <Alert tone="error">{form.message}</Alert>
      ) : null}
      {form.status === "success" ? (
        <Alert tone="success">Your details are saved.</Alert>
      ) : null}

      <Field name="name" label="Name" error={form.fieldErrors.name}>
        {(props) => (
          <Input {...props} autoComplete="name" defaultValue={values.name} required />
        )}
      </Field>

      <Field name="phone" label="Phone" hint="optional" error={form.fieldErrors.phone}>
        {(props) => (
          <Input {...props} type="tel" autoComplete="tel" defaultValue={values.phone} />
        )}
      </Field>

      <fieldset className="space-y-5">
        <legend className="text-sm font-medium text-ink">
          Default delivery address
          <span className="ml-1.5 font-normal text-ink-muted">
            prefills checkout
          </span>
        </legend>

        <Field
          name="addressLine1"
          label="Address"
          error={form.fieldErrors.addressLine1}
        >
          {(props) => (
            <Input
              {...props}
              autoComplete="address-line1"
              defaultValue={values.addressLine1}
            />
          )}
        </Field>

        <Field
          name="addressLine2"
          label="Apartment, floor, landmark"
          hint="optional"
          error={form.fieldErrors.addressLine2}
        >
          {(props) => (
            <Input
              {...props}
              autoComplete="address-line2"
              defaultValue={values.addressLine2}
            />
          )}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="city" label="City" error={form.fieldErrors.city}>
            {(props) => (
              <Input
                {...props}
                autoComplete="address-level2"
                defaultValue={values.city}
              />
            )}
          </Field>
          <Field
            name="postalCode"
            label="PIN code"
            error={form.fieldErrors.postalCode}
          >
            {(props) => (
              <Input
                {...props}
                inputMode="numeric"
                autoComplete="postal-code"
                defaultValue={values.postalCode}
              />
            )}
          </Field>
        </div>
      </fieldset>

      <Button type="submit" disabled={form.isPending}>
        {form.isPending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          "Save details"
        )}
      </Button>
    </form>
  );
}
