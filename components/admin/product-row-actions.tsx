"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import {
  deleteProductAction,
  setProductActiveAction,
  updateStockAction,
} from "@/app/admin/products/actions";

/** Inline stock edit. Saves on blur or Enter, and reports failure. */
export function StockControl({
  productId,
  productName,
  stock,
}: {
  productId: string;
  productName: string;
  stock: number;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(String(stock));
  const [state, setState] = React.useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  React.useEffect(() => setValue(String(stock)), [stock]);

  React.useEffect(() => {
    if (state !== "saved") return;
    const timer = window.setTimeout(() => setState("idle"), 1800);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function save() {
    if (value === String(stock)) return;
    setState("saving");
    const result = await updateStockAction({ id: productId, stock: value });
    if (result.ok) {
      setState("saved");
      router.refresh();
    } else {
      setState("error");
      setValue(String(stock));
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
          }
        }}
        inputMode="numeric"
        aria-label={`Stock for ${productName}`}
        aria-invalid={state === "error"}
        className="w-20 px-2 py-1 text-right"
      />
      <span aria-live="polite" className="w-4">
        {state === "saving" ? (
          <Loader2 className="size-3.5 animate-spin text-ink-muted" aria-hidden />
        ) : state === "saved" ? (
          <Check className="size-3.5 text-mint-deep" aria-hidden />
        ) : state === "error" ? (
          <span className="text-xs font-semibold text-danger">!</span>
        ) : null}
      </span>
    </span>
  );
}

export function ActiveToggle({
  productId,
  productName,
  isActive,
}: {
  productId: string;
  productName: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await setProductActiveAction({
          id: productId,
          isActive: isActive ? "false" : "true",
        });
        setPending(false);
        router.refresh();
      }}
    >
      {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
      {isActive ? "Deactivate" : "Activate"}
      <span className="sr-only"> {productName}</span>
    </Button>
  );
}

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (error) {
    return (
      <span className="text-xs text-danger" role="alert">
        {error}
      </span>
    );
  }

  if (!confirming) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${productName}`}
      >
        <Trash2 aria-hidden />
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <Button
        variant="danger"
        size="sm"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          const result = await deleteProductAction({ id: productId });
          if (result.ok) {
            router.refresh();
          } else {
            setPending(false);
            setError(result.message);
          }
        }}
      >
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
        Delete
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </span>
  );
}
