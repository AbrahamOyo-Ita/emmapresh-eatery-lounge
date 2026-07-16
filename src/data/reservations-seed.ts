import type { Reservation } from "@/types";
import { generateOrderReference } from "@/lib/utils";

const raw: Omit<Reservation, "id" | "reference">[] = [
  { branchSlug: "lagos", customerName: "Mary Luketch", phone: "08181117777", email: "mary.luketch@example.com", date: "2026-07-20", time: "19:00", guestCount: 4, seating: "lounge", occasion: "Birthday", status: "confirmed", createdAt: "2026-07-14T09:00:00.000Z" },
  { branchSlug: "abuja", customerName: "Peace Effiong", phone: "08191118888", email: "peace.effiong@example.com", date: "2026-07-18", time: "13:00", guestCount: 2, seating: "indoor", status: "confirmed", createdAt: "2026-07-13T10:00:00.000Z" },
  { branchSlug: "lagos", customerName: "Yusuf Bello", phone: "08201119999", email: "yusuf.bello@example.com", date: "2026-07-25", time: "20:00", guestCount: 6, seating: "lounge", occasion: "Anniversary", status: "pending", createdAt: "2026-07-15T08:00:00.000Z" },
  { branchSlug: "badagry", customerName: "Ngozi Adeyemi", phone: "08211110000", email: "ngozi.adeyemi@example.com", date: "2026-07-22", time: "17:00", guestCount: 3, seating: "indoor", status: "pending", createdAt: "2026-07-15T09:00:00.000Z" },
  { branchSlug: "abuja", customerName: "Chinedu Uche", phone: "08221111111", email: "chinedu.uche@example.com", date: "2026-07-19", time: "12:30", guestCount: 5, seating: "indoor", status: "completed", createdAt: "2026-07-10T11:00:00.000Z" },
  { branchSlug: "lagos", customerName: "Amaka Nwosu", phone: "08231112222", email: "amaka.nwosu@example.com", date: "2026-07-21", time: "18:30", guestCount: 2, seating: "lounge", status: "confirmed", createdAt: "2026-07-14T12:00:00.000Z" },
  { branchSlug: "abuja", customerName: "Ibrahim Musa", phone: "08241113333", email: "ibrahim.musa@example.com", date: "2026-07-23", time: "19:30", guestCount: 8, seating: "lounge", occasion: "Work celebration", status: "pending", createdAt: "2026-07-15T13:00:00.000Z" },
  { branchSlug: "lagos", customerName: "Ronke Ajayi", phone: "08251114444", email: "ronke.ajayi@example.com", date: "2026-07-17", time: "13:30", guestCount: 4, seating: "indoor", status: "cancelled", createdAt: "2026-07-09T14:00:00.000Z" },
];

export const seedReservations: Reservation[] = raw.map((r, i) => ({
  ...r,
  id: `reservation-seed-${i + 1}`,
  reference: generateOrderReference("RSV"),
}));
