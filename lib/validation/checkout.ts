import { z } from "zod";
import { cartLineSchema } from "@/lib/validation/cart";
import { phoneSchema } from "@/lib/validation/auth";

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Enter the name the order is for")
    .max(100, "That name is too long"),
  customerEmail: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(200)
    .email("Enter a valid email address")
    .transform((value) => value.toLowerCase()),
  customerPhone: phoneSchema,
  addressLine1: z
    .string()
    .trim()
    .min(5, "Enter the street address")
    .max(200, "That address is too long"),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2, "Enter the city").max(80),
  postalCode: z
    .string()
    .trim()
    .min(4, "Enter a valid PIN code")
    .max(12, "Enter a valid PIN code")
    .regex(/^[0-9A-Za-z\s-]+$/, "Enter a valid PIN code"),
  deliveryNotes: z
    .string()
    .trim()
    .max(500, "Keep delivery notes under 500 characters")
    .optional()
    .or(z.literal("")),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "MANUAL_TRANSFER"]),
  lines: z.array(cartLineSchema).min(1, "Your cart is empty").max(50),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
