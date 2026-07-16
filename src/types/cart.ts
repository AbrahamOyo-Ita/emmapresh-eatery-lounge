import type { BranchSlug } from "./branch";

export interface CartItemSelectedOption {
  groupId: string;
  groupLabel: string;
  choiceId: string;
  choiceLabel: string;
  priceModifier: number;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  slug: string;
  name: string;
  image: string;
  branchSlug: BranchSlug;
  unitPrice: number;
  quantity: number;
  selectedOptions: CartItemSelectedOption[];
  specialInstructions?: string;
  lineTotal: number;
}

export type FulfilmentMethod = "delivery" | "pickup" | "dine-in";
