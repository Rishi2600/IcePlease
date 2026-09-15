import { z } from "zod";
import { phoneSchema } from "@/lib/validation/auth";

export const BUSINESS_TYPES = [
  { value: "CAFE", label: "Café / coffee bar" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "BAR", label: "Bar / cocktail bar" },
  { value: "CLOUD_KITCHEN", label: "Cloud kitchen" },
  { value: "CATERER", label: "Caterer" },
  { value: "EVENTS", label: "Events" },
  { value: "RETAIL", label: "Retail / store" },
  { value: "OTHER", label: "Something else" },
] as const;

export const inquirySchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Enter your business name")
    .max(150, "That name is too long"),
  businessType: z.enum([
    "CAFE",
    "RESTAURANT",
    "BAR",
    "CLOUD_KITCHEN",
    "CATERER",
    "EVENTS",
    "RETAIL",
    "OTHER",
  ]),
  contactPerson: z
    .string()
    .trim()
    .min(2, "Enter a contact name")
    .max(100, "That name is too long"),
  phone: phoneSchema,
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(200)
    .email("Enter a valid email address")
    .transform((value) => value.toLowerCase()),
  city: z.string().trim().min(2, "Enter your city").max(80),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  estimatedQuantity: z
    .string()
    .trim()
    .min(2, "Roughly how much would you need?")
    .max(200, "Keep this under 200 characters"),
  preferredFlavors: z.string().trim().max(200).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, "Keep your message under 2000 characters")
    .optional()
    .or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export const inquiryStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "QUOTED",
  "CONVERTED",
  "CLOSED",
]);
