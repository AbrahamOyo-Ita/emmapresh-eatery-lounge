import { z } from "zod";
import { phoneSchema } from "./checkout";

export const cateringRequestSchema = z.object({
  customerName: z.string().min(2, "Enter your full name"),
  phone: phoneSchema,
  email: z.string().email("Enter a valid email address"),
  cateringType: z.enum([
    "indoor",
    "outdoor",
    "corporate",
    "wedding",
    "birthday",
    "conference",
    "private-event",
    "institutional",
  ]),
  eventDate: z.string().min(1, "Select an event date"),
  startTime: z.string().min(1, "Select a start time"),
  endTime: z.string().min(1, "Select an end time"),
  eventLocation: z.string().min(4, "Enter the event location"),
  guestCount: z.number().min(1, "Enter expected number of guests"),
  preferredDishes: z.string().optional(),
  serviceStyle: z.enum(["buffet", "plated"]),
  drinksRequired: z.boolean(),
  serversRequired: z.boolean(),
  equipmentRequired: z.boolean(),
  decorationRequired: z.boolean(),
  budgetRange: z.string().min(1, "Select a budget range"),
  additionalInfo: z.string().optional(),
});

export type CateringRequestFormValues = z.infer<typeof cateringRequestSchema>;
