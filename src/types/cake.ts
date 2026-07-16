import type { BranchSlug } from "./branch";

export type CakeOccasion =
  | "birthday"
  | "wedding"
  | "anniversary"
  | "corporate"
  | "graduation"
  | "baby-shower";

export interface Cake {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  gallery: string[];
  price: number;
  sizeLabel: string;
  flavour: string;
  occasion: CakeOccasion;
  branchAvailability: BranchSlug[];
  quantityAvailable: number;
  sameDayPickup: boolean;
  rating: number;
}

export type CakeOrderStatus =
  | "request-received"
  | "under-review"
  | "more-info-required"
  | "quotation-sent"
  | "awaiting-approval"
  | "awaiting-payment"
  | "payment-submitted"
  | "payment-verified"
  | "design-confirmed"
  | "in-production"
  | "quality-check"
  | "ready-for-pickup"
  | "out-for-delivery"
  | "completed"
  | "cancelled";

export interface CustomCakeRequest {
  id: string;
  reference: string;
  branchSlug: BranchSlug;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  requiredDate: string;
  sizeLabel: string;
  layers: number;
  flavour: string;
  colour: string;
  shape: string;
  theme?: string;
  inscription?: string;
  dietaryRequirements?: string;
  budgetRange: string;
  fulfilmentMethod: "delivery" | "pickup";
  deliveryAddress?: string;
  additionalNotes?: string;
  referenceImages: string[];
  status: CakeOrderStatus;
  quotedAmount?: number;
  createdAt: string;
}
