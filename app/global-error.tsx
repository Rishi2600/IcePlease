"use client";

import * as React from "react";

/**
 * Last-resort boundary: it replaces the root layout, so it cannot rely on any
 * of the app's styling or providers and has to stand alone.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#0a0f1e",
          color: "#f2f6ff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <main>
          <h1 style={{ fontSize: "1.75rem", margin: 0 }}>
            IcePlease is temporarily unavailable
          </h1>
          <p style={{ marginTop: "0.75rem", color: "#a9b6d3" }}>
            Something went wrong at the very top of the application.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              border: 0,
              borderRadius: "999px",
              background: "#ffa45c",
              color: "#0a0f1e",
              padding: "0.75rem 1.5rem",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
