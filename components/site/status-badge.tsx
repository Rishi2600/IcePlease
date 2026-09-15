import type { OrderStatus, PaymentStatus, InquiryStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

/**
 * Status vocabulary in one place, so the customer-facing confirmation and the
 * admin tables always use the same words for the same state.
 *
 * Every badge carries a label, not just a colour.
 */

type Tone = React.ComponentProps<typeof Badge>["tone"];

const ORDER_STATUS: Record<OrderStatus, { label: string; tone: Tone }> = {
  PENDING: { label: "Awaiting confirmation", tone: "citrus" },
  CONFIRMED: { label: "Confirmed", tone: "ice" },
  PREPARING: { label: "Preparing", tone: "ice" },
  READY: { label: "Ready", tone: "ice" },
  DISPATCHED: { label: "Out for delivery", tone: "ice" },
  DELIVERED: { label: "Delivered", tone: "mint" },
  CANCELLED: { label: "Cancelled", tone: "danger" },
};

const PAYMENT_STATUS: Record<PaymentStatus, { label: string; tone: Tone }> = {
  PENDING: { label: "Payment pending", tone: "citrus" },
  PAID: { label: "Paid", tone: "mint" },
  FAILED: { label: "Payment failed", tone: "danger" },
  REFUNDED: { label: "Refunded", tone: "neutral" },
};

const INQUIRY_STATUS: Record<InquiryStatus, { label: string; tone: Tone }> = {
  NEW: { label: "New", tone: "citrus" },
  CONTACTED: { label: "Contacted", tone: "ice" },
  QUOTED: { label: "Quoted", tone: "ice" },
  CONVERTED: { label: "Converted", tone: "mint" },
  CLOSED: { label: "Closed", tone: "neutral" },
};

export function orderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS[status].label;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, tone } = ORDER_STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, tone } = PAYMENT_STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const { label, tone } = INQUIRY_STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export const INQUIRY_STATUS_LABELS = Object.fromEntries(
  Object.entries(INQUIRY_STATUS).map(([key, value]) => [key, value.label]),
) as Record<InquiryStatus, string>;
