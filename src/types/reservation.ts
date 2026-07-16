import type { BranchSlug } from "./branch";

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Reservation {
  id: string;
  reference: string;
  branchSlug: BranchSlug;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guestCount: number;
  seating: "indoor" | "lounge";
  occasion?: string;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
}
