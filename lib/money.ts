/**
 * Money handling.
 *
 * Every monetary value in this application is an integer number of paise.
 * Rupees only ever exist as a formatted string at the display edge. There is
 * no float arithmetic on money anywhere, by design.
 */

export const CURRENCY = "INR";

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const rupeeFormatterWithPaise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 19900 -> "₹199". Whole rupees stay clean; paise are shown only when present. */
export function formatMinor(minor: number): string {
  const rupees = minor / 100;
  return Number.isInteger(rupees)
    ? rupeeFormatter.format(rupees)
    : rupeeFormatterWithPaise.format(rupees);
}

/** "199" or "199.50" -> 19900 / 19950. Returns null if not a valid amount. */
export function parseRupeesToMinor(input: string): number | null {
  const trimmed = input.trim().replace(/[₹,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const [whole, fraction = ""] = trimmed.split(".");
  const paise = Number(fraction.padEnd(2, "0"));
  return Number(whole) * 100 + paise;
}

/** 19900 -> "199.00", for prefilling a rupee-denominated form field. */
export function minorToRupeeInput(minor: number): string {
  return (minor / 100).toFixed(2);
}
