import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(10, "Enter a valid phone number")
  .regex(/^[0-9+()\s-]+$/, "Enter a valid phone number");

export const customerInfoSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: phoneSchema,
  email: z.string().email("Enter a valid email address"),
});

export const deliveryInfoSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  landmark: z.string().optional(),
});

export const checkoutSchema = z
  .object({
    fulfilmentMethod: z.enum(["delivery", "pickup", "dine-in"]),
    customer: customerInfoSchema,
    delivery: deliveryInfoSchema.optional(),
    tableNumber: z.string().optional(),
    requestedTime: z.string().min(1, "Select a preferred time"),
    paymentMethod: z.enum(["bank-transfer", "pay-on-delivery", "pay-at-pickup"]),
  })
  .superRefine((data, ctx) => {
    if (data.fulfilmentMethod === "delivery") {
      if (!data.delivery?.address || data.delivery.address.length < 6) {
        ctx.addIssue({
          code: "custom",
          path: ["delivery", "address"],
          message: "Enter your delivery address",
        });
      }
      if (!data.delivery?.city || data.delivery.city.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["delivery", "city"],
          message: "Enter your city",
        });
      }
    }
    if (data.fulfilmentMethod === "dine-in" && !data.tableNumber) {
      ctx.addIssue({
        code: "custom",
        path: ["tableNumber"],
        message: "Enter your table number",
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const receiptUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File must be smaller than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type),
      "Only JPG, PNG, WEBP or PDF files are accepted"
    ),
});
