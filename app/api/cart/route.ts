import { NextResponse } from "next/server";
import { cartSchema } from "@/lib/validation/cart";
import { priceCart } from "@/lib/server/pricing";

/**
 * Prices a cart. The browser holds only product ids and quantities; this route
 * turns them into the names, prices and totals shown on screen, so the cart
 * display and the eventual order are priced by the same server code.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = cartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid cart." }, { status: 400 });
  }

  const cart = await priceCart(parsed.data.lines);
  return NextResponse.json(cart, {
    headers: { "Cache-Control": "no-store" },
  });
}
