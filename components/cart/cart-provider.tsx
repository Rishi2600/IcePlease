"use client";

import * as React from "react";

/**
 * Cart state.
 *
 * The browser stores product ids and quantities only. It never stores a price:
 * prices come from the server every time the cart is shown, so a stale or
 * edited localStorage entry cannot change what anything costs.
 */

const STORAGE_KEY = "iceplease.cart.v1";
const MAX_LINES = 50;
const MAX_QUANTITY = 99;

export type CartLine = { productId: string; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  /** False until localStorage has been read, so SSR and first paint agree. */
  hydrated: boolean;
  itemCount: number;
  quantityOf: (productId: string) => number;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  /** Applies server corrections, e.g. a product that went out of stock. */
  replaceLines: (lines: CartLine[]) => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

function readStoredLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (line): line is CartLine =>
          typeof line === "object" &&
          line !== null &&
          typeof (line as CartLine).productId === "string" &&
          Number.isInteger((line as CartLine).quantity) &&
          (line as CartLine).quantity > 0,
      )
      .slice(0, MAX_LINES)
      .map((line) => ({
        productId: line.productId,
        quantity: Math.min(line.quantity, MAX_QUANTITY),
      }));
  } catch {
    // Private mode, disabled storage, or corrupt JSON. An empty cart is the
    // correct fallback; it must never break the page.
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setLines(readStoredLines());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage unavailable. The cart still works for this page session.
    }
  }, [lines, hydrated]);

  // Keep tabs in step, so adding from one tab is visible in another.
  React.useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setLines(readStoredLines());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = React.useMemo<CartContextValue>(() => {
    const clamp = (quantity: number) =>
      Math.max(1, Math.min(Math.trunc(quantity) || 1, MAX_QUANTITY));

    return {
      lines,
      hydrated,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      quantityOf: (productId) =>
        lines.find((line) => line.productId === productId)?.quantity ?? 0,
      addItem: (productId, quantity = 1) =>
        setLines((current) => {
          const existing = current.find((line) => line.productId === productId);
          if (existing) {
            return current.map((line) =>
              line.productId === productId
                ? { ...line, quantity: clamp(line.quantity + quantity) }
                : line,
            );
          }
          if (current.length >= MAX_LINES) return current;
          return [...current, { productId, quantity: clamp(quantity) }];
        }),
      setQuantity: (productId, quantity) =>
        setLines((current) =>
          quantity <= 0
            ? current.filter((line) => line.productId !== productId)
            : current.map((line) =>
                line.productId === productId
                  ? { ...line, quantity: clamp(quantity) }
                  : line,
              ),
        ),
      removeItem: (productId) =>
        setLines((current) =>
          current.filter((line) => line.productId !== productId),
        ),
      clear: () => setLines([]),
      replaceLines: (next) => setLines(next.slice(0, MAX_LINES)),
    };
  }, [lines, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }
  return context;
}
