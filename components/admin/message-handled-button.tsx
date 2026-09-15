"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setMessageHandledAction } from "@/app/admin/messages/actions";

export function MessageHandledButton({
  id,
  handled,
  from,
}: {
  id: string;
  handled: boolean;
  from: string;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  return (
    <Button
      variant={handled ? "ghost" : "outline"}
      size="sm"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await setMessageHandledAction({ id, handled: handled ? "false" : "true" });
        setPending(false);
        router.refresh();
      }}
    >
      {pending ? (
        <Loader2 className="animate-spin" aria-hidden />
      ) : handled ? (
        <Undo2 aria-hidden />
      ) : (
        <Check aria-hidden />
      )}
      {handled ? "Reopen" : "Mark handled"}
      <span className="sr-only"> message from {from}</span>
    </Button>
  );
}
