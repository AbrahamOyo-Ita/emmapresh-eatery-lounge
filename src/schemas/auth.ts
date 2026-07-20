import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export const adminOtpSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  token: z.string().regex(/^\d{6,10}$/, "Enter the complete passcode"),
});
