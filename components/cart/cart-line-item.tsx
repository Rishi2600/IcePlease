"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatMinor } from "@/lib/money";
import type { PricedLine } from "@/lib/cart-types";
import { ProductVisual } from "@/components/product/product-visual";
import { QuantityStepper } from "@/components/cart/quantity-stepper";

export function CartLineItem({
  line,
  maxPerOrder,
  onQuantityChange,
  onRemove,
}: {
  line: PricedLine;
  maxPerOrder: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/shop/${line.slug}`}
        className="w-20 shrink-0 sm:w-24"
        tabIndex={-1}
        aria-hidden
      >
        <ProductVisual
          name={line.name}
          imageUrl={line.imageUrl}
          accentColor={line.accentColor}
          sizes="6rem"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <h3 className="font-semibold">
            <Link href={`/shop/${line.slug}`} className="hover:text-ice-deep">
              {line.name}
            </Link>
          </h3>
          <p className="font-semibold tabular-nums">
            {formatMinor(line.lineTotalMinor)}
          </p>
        </div>

        <p className="mt-0.5 text-sm text-ink-muted">
          {line.packSize} · {formatMinor(line.unitPriceMinor)} each
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
          <QuantityStepper
            value={line.quantity}
            max={Math.min(line.stock, maxPerOrder)}
            onChange={onQuantityChange}
            label={line.name}
            size="sm"
          />
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-ink-muted transition-colors hover:text-danger"
          >
            <Trash2 className="size-4" aria-hidden />
            Remove
            <span className="sr-only"> {line.name} from cart</span>
          </button>
        </div>
      </div>
    </li>
  );
}
