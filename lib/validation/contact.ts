import { z } from "zod";
import { phoneSchema } from "@/lib/validation/auth";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(200)
    .email("Enter a valid email address")
    .transform((value) => value.toLowerCase()),
  phone: phoneSchema.optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more")
    .max(2000, "Keep your message under 2000 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
