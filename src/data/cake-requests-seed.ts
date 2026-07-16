import type { CustomCakeRequest } from "@/types";
import { generateOrderReference } from "@/lib/utils";

const raw: Omit<CustomCakeRequest, "id" | "reference">[] = [
  { branchSlug: "lagos", customerName: "Chiamaka Obi", phone: "08081117777", email: "chiamaka.obi@example.com", eventType: "Wedding", eventDate: "2026-08-15", requiredDate: "2026-08-14", sizeLabel: "3-tier, serves 120", layers: 3, flavour: "Vanilla & Red Velvet", colour: "Ivory & Gold", shape: "Round", theme: "Classic elegance", inscription: "Chiamaka & David", budgetRange: "₦150,000 - ₦200,000", fulfilmentMethod: "delivery", deliveryAddress: "12 Admiralty Way, Lekki Phase 1", referenceImages: [], status: "quotation-sent", quotedAmount: 180000, createdAt: "2026-07-01T10:00:00.000Z" },
  { branchSlug: "abuja", customerName: "Joy Okoro", phone: "08091118888", email: "joy.okoro@example.com", eventType: "Birthday", eventDate: "2026-07-25", requiredDate: "2026-07-25", sizeLabel: "8-inch, serves 12", layers: 1, flavour: "Chocolate Fudge", colour: "Pink & White", shape: "Round", theme: "Princess theme", inscription: "Happy 7th Birthday Amara", budgetRange: "₦25,000 - ₦35,000", fulfilmentMethod: "pickup", referenceImages: [], status: "in-production", createdAt: "2026-07-12T09:00:00.000Z" },
  { branchSlug: "lagos", customerName: "Ronke Ajayi", phone: "08101119999", email: "ronke.ajayi@example.com", eventType: "Corporate", eventDate: "2026-08-01", requiredDate: "2026-08-01", sizeLabel: "10-inch, serves 25", layers: 1, flavour: "Vanilla", colour: "Brand colours", shape: "Square", theme: "Company logo", budgetRange: "₦40,000 - ₦60,000", fulfilmentMethod: "delivery", deliveryAddress: "Victoria Island, Lagos", referenceImages: [], status: "under-review", createdAt: "2026-07-14T13:00:00.000Z" },
  { branchSlug: "abuja", customerName: "Emeka Nnamdi", phone: "08111110000", email: "emeka.nnamdi@example.com", eventType: "Anniversary", eventDate: "2026-08-10", requiredDate: "2026-08-09", sizeLabel: "10-inch, serves 20", layers: 2, flavour: "Chocolate & Vanilla", colour: "Gold", shape: "Round", theme: "25th anniversary", inscription: "25 Years of Love", budgetRange: "₦60,000 - ₦90,000", fulfilmentMethod: "delivery", deliveryAddress: "Maitama, Abuja", referenceImages: [], status: "design-confirmed", quotedAmount: 75000, createdAt: "2026-06-30T15:00:00.000Z" },
  { branchSlug: "lagos", customerName: "Kunle Adisa", phone: "08121111111", email: "kunle.adisa@example.com", eventType: "Baby Shower", eventDate: "2026-07-30", requiredDate: "2026-07-30", sizeLabel: "8-inch, serves 14", layers: 1, flavour: "Strawberry Vanilla", colour: "Pastel blue", shape: "Round", theme: "Baby boy", budgetRange: "₦25,000 - ₦35,000", fulfilmentMethod: "pickup", referenceImages: [], status: "request-received", createdAt: "2026-07-15T11:00:00.000Z" },
];

export const seedCakeRequests: CustomCakeRequest[] = raw.map((r, i) => ({
  ...r,
  id: `cake-request-seed-${i + 1}`,
  reference: generateOrderReference("CK"),
}));
