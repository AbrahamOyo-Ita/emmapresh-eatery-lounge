import type { BranchSlug } from "./branch";

export interface HallCapacity {
  banquet: number;
  classroom: number;
  theatre: number;
  boardroom: number;
}

export interface Hall {
  id: string;
  slug: string;
  name: string;
  branchSlug: BranchSlug;
  image: string;
  gallery: string[];
  capacity: HallCapacity;
  facilities: string[];
  startingPrice: number;
  description: string;
}

export type HallBookingStatus =
  | "enquiry-received"
  | "under-review"
  | "quotation-sent"
  | "date-held"
  | "booking-confirmed"
  | "completed"
  | "cancelled";

export interface HallEnquiry {
  id: string;
  reference: string;
  hallId: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  alternativeDate?: string;
  guestCount: number;
  status: HallBookingStatus;
  createdAt: string;
}
