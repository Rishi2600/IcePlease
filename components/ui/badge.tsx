import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
  {
    variants: {
      tone: {
        neutral: "bg-ink/10 text-ink",
        ice: "bg-tint text-ink",
        mint: "bg-forest text-lime",
        citrus: "bg-orange text-ink",
        danger: "bg-danger text-white",
        solid: "bg-ink text-white",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
