import { z } from "zod";
import { phoneSchema } from "./checkout";

export const customCakeRequestSchema = z.object({
  customerName: z.string().min(2, "Enter your full name"),
  phone: phoneSchema,
  email: z.string().email("Enter a valid email address"),
  eventType: z.string().min(2, "Enter the event type"),
  eventDate: z.string().min(1, "Select an event date"),
  requiredDate: z.string().min(1, "Select the required delivery/pickup date"),
  sizeLabel: z.string().min(1, "Select a cake size"),
  layers: z.number().min(1).max(5),
  flavour: z.string().min(1, "Select a flavour"),
  colour: z.string().min(1, "Enter a preferred colour"),
  shape: z.string().min(1, "Select a shape"),
  theme: z.string().optional(),
  inscription: z.string().optional(),
  dietaryRequirements: z.string().optional(),
  budgetRange: z.string().min(1, "Select a budget range"),
  fulfilmentMethod: z.enum(["delivery", "pickup"]),
  deliveryAddress: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type CustomCakeRequestFormValues = z.infer<typeof customCakeRequestSchema>;
