/**
 * B2B business types.
 *
 * Kept apart from the Zod schema so the public enquiry form can render the
 * options without pulling the validation library into the browser bundle.
 * The values mirror the `BusinessType` enum in the Prisma schema.
 */

export const BUSINESS_TYPE_VALUES = [
  "CAFE",
  "RESTAURANT",
  "BAR",
  "CLOUD_KITCHEN",
  "CATERER",
  "EVENTS",
  "RETAIL",
  "OTHER",
] as const;

export type BusinessTypeValue = (typeof BUSINESS_TYPE_VALUES)[number];

export const BUSINESS_TYPE_LABELS: Record<BusinessTypeValue, string> = {
  CAFE: "Café / coffee bar",
  RESTAURANT: "Restaurant",
  BAR: "Bar / cocktail bar",
  CLOUD_KITCHEN: "Cloud kitchen",
  CATERER: "Caterer",
  EVENTS: "Events",
  RETAIL: "Retail / store",
  OTHER: "Something else",
};

export const BUSINESS_TYPES = BUSINESS_TYPE_VALUES.map((value) => ({
  value,
  label: BUSINESS_TYPE_LABELS[value],
}));
