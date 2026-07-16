import type { CateringRequest } from "@/types";
import { generateOrderReference } from "@/lib/utils";

const raw: Omit<CateringRequest, "id" | "reference">[] = [
  { branchSlug: "lagos", customerName: "Tunde Bakare", phone: "08031112222", email: "tunde.bakare@example.com", cateringType: "wedding", eventDate: "2026-09-12", startTime: "12:00", endTime: "18:00", eventLocation: "Landmark Event Centre, Victoria Island", guestCount: 250, serviceStyle: "buffet", drinksRequired: true, serversRequired: true, equipmentRequired: true, decorationRequired: true, budgetRange: "₦3,000,000 - ₦5,000,000", status: "quotation-sent", quotedAmount: 4200000, createdAt: "2026-06-20T09:00:00.000Z" },
  { branchSlug: "abuja", customerName: "Grace Okonkwo", phone: "08041113333", email: "grace.okonkwo@example.com", cateringType: "corporate", eventDate: "2026-08-05", startTime: "09:00", endTime: "16:00", eventLocation: "Transcorp Hilton Conference Hall, Abuja", guestCount: 120, serviceStyle: "plated", drinksRequired: true, serversRequired: true, equipmentRequired: false, decorationRequired: false, budgetRange: "₦1,500,000 - ₦2,500,000", status: "under-review", createdAt: "2026-07-01T11:00:00.000Z" },
  { branchSlug: "lagos", customerName: "Ifeoma Chukwu", phone: "08051114444", email: "ifeoma.chukwu@example.com", cateringType: "birthday", eventDate: "2026-07-28", startTime: "14:00", endTime: "20:00", eventLocation: "Private residence, Ikoyi", guestCount: 60, serviceStyle: "buffet", drinksRequired: true, serversRequired: false, equipmentRequired: false, decorationRequired: true, budgetRange: "₦800,000 - ₦1,200,000", status: "booking-confirmed", quotedAmount: 950000, createdAt: "2026-06-15T14:30:00.000Z" },
  { branchSlug: "badagry", customerName: "Sam Adebayo", phone: "08061115555", email: "sam.adebayo@example.com", cateringType: "outdoor", eventDate: "2026-08-20", startTime: "10:00", endTime: "17:00", eventLocation: "Badagry Beach Resort", guestCount: 90, serviceStyle: "buffet", drinksRequired: true, serversRequired: true, equipmentRequired: true, decorationRequired: false, budgetRange: "₦1,000,000 - ₦1,800,000", status: "enquiry-received", createdAt: "2026-07-10T08:00:00.000Z" },
  { branchSlug: "abuja", customerName: "Bashir Umar", phone: "08071116666", email: "bashir.umar@example.com", cateringType: "conference", eventDate: "2026-09-02", startTime: "08:00", endTime: "18:00", eventLocation: "Sheraton Abuja", guestCount: 300, serviceStyle: "buffet", drinksRequired: true, serversRequired: true, equipmentRequired: true, decorationRequired: false, budgetRange: "₦4,000,000+", status: "awaiting-deposit", quotedAmount: 5800000, createdAt: "2026-06-28T10:00:00.000Z" },
];

export const seedCateringRequests: CateringRequest[] = raw.map((r, i) => ({
  ...r,
  id: `catering-seed-${i + 1}`,
  reference: generateOrderReference("CT"),
}));
