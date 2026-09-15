"use client";

import * as React from "react";
import type { PricedCart } from "@/lib/cart-types";
import { useCart } from "@/components/cart/cart-provider";

type State =
  | { status: "loading"; cart: null; error: null }
  | { status: "ready"; cart: PricedCart; error: null }
  | { status: "error"; cart: null; error: string };

const EMPTY_CART: PricedCart = {
  lines: [],
  issues: [],
  subtotalMinor: 0,
  deliveryFeeMinor: 0,
  totalMinor: 0,
  itemCount: 0,
  isEmpty: true,
};

/**
 * Prices the cart on the server whenever its contents change.
 *
 * If the server drops or reduces a line — a product went out of stock while
 * the tab sat open — the local cart is corrected to match, so the customer is
 * not told one thing here and something else at checkout.
 */
export function usePricedCart() {
  const { lines, hydrated, replaceLines } = useCart();
  const [state, setState] = React.useState<State>({
    status: "loading",
    cart: null,
    error: null,
  });

  const signature = JSON.stringify(lines);

  React.useEffect(() => {
    if (!hydrated) return;

    const parsedLines = JSON.parse(signature) as typeof lines;
    if (parsedLines.length === 0) {
      setState({ status: "ready", cart: EMPTY_CART, error: null });
      return;
    }

    const controller = new AbortController();
    setState((current) =>
      current.status === "ready"
        ? current
        : { status: "loading", cart: null, error: null },
    );

    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines: parsedLines }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not price the cart.");
        return (await response.json()) as PricedCart;
      })
      .then((cart) => {
        setState({ status: "ready", cart, error: null });

        // Keep the customer's original ordering; the server sorts for display.
        const allowed = new Map(
          cart.lines.map((line) => [line.productId, line.quantity]),
        );
        const corrected = parsedLines
          .filter((line) => allowed.has(line.productId))
          .map((line) => ({
            productId: line.productId,
            quantity: allowed.get(line.productId) as number,
          }));
        const changed =
          corrected.length !== parsedLines.length ||
          corrected.some(
            (line, index) => line.quantity !== parsedLines[index].quantity,
          );
        if (changed) replaceLines(corrected);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({
          status: "error",
          cart: null,
          error: "We could not load your cart. Please try again.",
        });
      });

    return () => controller.abort();
  }, [signature, hydrated, replaceLines]);

  return {
    ...state,
    /** Loading is only meaningful once localStorage has been read. */
    isLoading: !hydrated || state.status === "loading",
  };
}
