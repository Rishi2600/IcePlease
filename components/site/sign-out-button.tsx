"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton({
  variant = "outline",
  className,
}: {
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      size="sm"
      className={className}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut aria-hidden />
      Sign out
    </Button>
  );
}
