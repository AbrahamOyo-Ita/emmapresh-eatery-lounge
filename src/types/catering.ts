import type { BranchSlug } from "./branch";

export type CateringType =
  | "indoor"
  | "outdoor"
  | "corporate"
  | "wedding"
  | "birthday"
  | "conference"
  | "private-event"
  | "institutional";

export type CateringStatus =
  | "enquiry-received"
  | "under-review"
  | "quotation-sent"
  | "awaiting-approval"
  | "awaiting-deposit"
  | "deposit-submitted"
  | "deposit-verified"
  | "booking-confirmed"
  | "planning"
  | "preparation"
  | "event-in-progress"
  | "completed"
  | "cancelled";

export interface CateringPackage {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  startingPricePerHead: number;
  minGuests: number;
  cateringTypes: CateringType[];
  includes: string[];
}

export interface CateringRequest {
  id: string;
  reference: string;
  branchSlug: BranchSlug;
  customerName: string;
  phone: string;
  email: string;
  cateringType: CateringType;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventLocation: string;
  guestCount: number;
  preferredDishes?: string;
  serviceStyle: "buffet" | "plated";
  drinksRequired: boolean;
  serversRequired: boolean;
  equipmentRequired: boolean;
  decorationRequired: boolean;
  budgetRange: string;
  additionalInfo?: string;
  status: CateringStatus;
  quotedAmount?: number;
  createdAt: string;
}
