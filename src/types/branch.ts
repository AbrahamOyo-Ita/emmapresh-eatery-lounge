export type BranchSlug = "abuja" | "lagos" | "badagry";

export interface BranchBankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface OpeningHours {
  days: string;
  hours: string;
}

export interface Branch {
  slug: BranchSlug;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  image: string;
  gallery: string[];
  openingHours: OpeningHours[];
  deliveryFee: number;
  freeDeliveryThreshold: number;
  hasEventHall: boolean;
  hasCatering: boolean;
  hasBakery: boolean;
  hasAcademy: boolean;
  bankAccount: BranchBankAccount;
  mapEmbedUrl?: string;
  rating: number;
  reviewCount: number;
}
