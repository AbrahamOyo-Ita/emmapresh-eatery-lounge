import type { HallEnquiry } from "@/types";
import { generateOrderReference } from "@/lib/utils";
import { halls } from "./halls";

const raw: Omit<HallEnquiry, "id" | "reference">[] = [
  { hallId: halls[0].id, customerName: "Bashir Umar", phone: "08071116666", email: "bashir.umar@example.com", eventType: "Conference", eventDate: "2026-09-02", guestCount: 300, status: "quotation-sent", createdAt: "2026-06-28T10:00:00.000Z" },
  { hallId: halls[1].id, customerName: "Ifeoma Chukwu", phone: "08051114444", email: "ifeoma.chukwu@example.com", eventType: "Birthday Party", eventDate: "2026-07-28", guestCount: 150, status: "booking-confirmed", createdAt: "2026-06-15T14:30:00.000Z" },
  { hallId: halls[2].id, customerName: "Grace Okonkwo", phone: "08041113333", email: "grace.okonkwo@example.com", eventType: "Corporate Training", eventDate: "2026-08-05", guestCount: 35, status: "under-review", createdAt: "2026-07-01T11:00:00.000Z" },
];

export const seedHallEnquiries: HallEnquiry[] = raw.map((r, i) => ({
  ...r,
  id: `hall-enquiry-seed-${i + 1}`,
  reference: generateOrderReference("EV"),
}));
