"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary.
 *
 * Shows a useful message and a way out. The underlying error is logged, never
 * rendered — a stack trace is not something a customer should see.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-danger-soft text-danger">
        <AlertTriangle className="size-5" aria-hidden />
      </span>
      <h1 className="mt-5 text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-ink-muted">
        We hit an unexpected problem loading this page. Trying again usually
        works; if it does not, get in touch and we will sort it out.
      </p>
      {error.digest ? (
        <p className="mt-3 text-xs text-ink-muted">
          Reference: <span className="font-mono">{error.digest}</span>
        </p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back to the homepage</Link>
        </Button>
      </div>
    </div>
  );
}
