"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import type { B2BInquiry, InquiryStatus } from "@prisma/client";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Select, Textarea, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { InquiryStatusBadge } from "@/components/site/status-badge";
import { BUSINESS_TYPE_LABELS, type BusinessTypeValue } from "@/lib/business-types";
import { formatDateTime } from "@/lib/utils";
import {
  updateInquiryNotesAction,
  updateInquiryStatusAction,
} from "@/app/admin/inquiries/actions";

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUOTED", label: "Quoted" },
  { value: "CONVERTED", label: "Converted" },
  { value: "CLOSED", label: "Closed" },
];

export function InquiryCard({ inquiry }: { inquiry: B2BInquiry }) {
  const router = useRouter();
  const [statusPending, setStatusPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState(inquiry.adminNotes ?? "");
  const [notesState, setNotesState] = React.useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  React.useEffect(() => {
    if (notesState !== "saved") return;
    const timer = window.setTimeout(() => setNotesState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [notesState]);

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">
            {inquiry.businessName}
          </h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            {BUSINESS_TYPE_LABELS[inquiry.businessType as BusinessTypeValue]} ·{" "}
            {inquiry.city}
            {inquiry.location ? `, ${inquiry.location}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InquiryStatusBadge status={inquiry.status} />
          <span className="text-xs text-ink-muted">
            {formatDateTime(inquiry.createdAt)}
          </span>
        </div>
      </CardHeader>

      <CardBody className="space-y-5">
        {error ? <Alert tone="error">{error}</Alert> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 text-sm">
            <p className="font-medium">{inquiry.contactPerson}</p>
            <a
              href={`mailto:${inquiry.email}`}
              className="flex items-center gap-2 text-ink-soft hover:text-ice-deep"
            >
              <Mail className="size-3.5 shrink-0" aria-hidden />
              {inquiry.email}
            </a>
            <a
              href={`tel:${inquiry.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-ink-soft hover:text-ice-deep"
            >
              <Phone className="size-3.5 shrink-0" aria-hidden />
              {inquiry.phone}
            </a>
            {inquiry.location ? (
              <p className="flex items-center gap-2 text-ink-muted">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {inquiry.location}
              </p>
            ) : null}
          </div>

          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink-muted">
                Estimated quantity
              </dt>
              <dd className="mt-0.5 font-medium">{inquiry.estimatedQuantity}</dd>
            </div>
            {inquiry.preferredFlavors ? (
              <div>
                <dt className="text-xs uppercase tracking-wider text-ink-muted">
                  Flavors
                </dt>
                <dd className="mt-0.5">{inquiry.preferredFlavors}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        {inquiry.message ? (
          <blockquote className="rounded-xl bg-surface-sunken p-4 text-sm leading-relaxed text-ink-soft">
            {inquiry.message}
          </blockquote>
        ) : null}

        <div className="grid gap-5 border-t border-line pt-5 sm:grid-cols-[14rem_1fr]">
          <div className="space-y-2">
            <Label htmlFor={`status-${inquiry.id}`}>Pipeline status</Label>
            <div className="flex items-center gap-2">
              <Select
                id={`status-${inquiry.id}`}
                value={inquiry.status}
                disabled={statusPending}
                onChange={async (event) => {
                  setStatusPending(true);
                  setError(null);
                  const result = await updateInquiryStatusAction({
                    id: inquiry.id,
                    status: event.target.value,
                  });
                  setStatusPending(false);
                  if (result.ok) {
                    router.refresh();
                  } else {
                    setError(result.message);
                  }
                }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {statusPending ? (
                <Loader2 className="size-4 animate-spin text-ink-muted" aria-hidden />
              ) : null}
            </div>
          </div>

          <form
            className="space-y-2"
            onSubmit={async (event) => {
              event.preventDefault();
              setNotesState("saving");
              const result = await updateInquiryNotesAction({
                id: inquiry.id,
                adminNotes: notes,
              });
              setNotesState(result.ok ? "saved" : "error");
              if (result.ok) router.refresh();
            }}
          >
            <Label htmlFor={`notes-${inquiry.id}`}>Notes</Label>
            <Textarea
              id={`notes-${inquiry.id}`}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="What was quoted, when you last spoke, what happens next."
            />
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                size="sm"
                variant="outline"
                disabled={notesState === "saving"}
              >
                {notesState === "saving" ? (
                  <Loader2 className="animate-spin" aria-hidden />
                ) : null}
                Save notes
              </Button>
              <span aria-live="polite" className="text-sm">
                {notesState === "saved" ? (
                  <span className="text-mint-deep">Saved</span>
                ) : notesState === "error" ? (
                  <span className="text-danger">Could not save</span>
                ) : null}
              </span>
            </div>
          </form>
        </div>
      </CardBody>
    </Card>
  );
}
