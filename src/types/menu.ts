import type { BranchSlug } from "./branch";

export type MenuCategorySlug =
  | "local-meals"
  | "rice-dishes"
  | "soups"
  | "swallow"
  | "grills"
  | "seafood"
  | "breakfast"
  | "snacks"
  | "pizza"
  | "burgers"
  | "shawarma"
  | "doughnuts"
  | "pastries"
  | "desserts"
  | "drinks"
  | "family-meals";

export interface MenuCategory {
  slug: MenuCategorySlug;
  name: string;
  description: string;
  image: string;
  group: "food" | "junk" | "drinks" | "family";
}

export type DietaryLabel =
  | "vegetarian"
  | "vegan"
  | "spicy"
  | "gluten-free"
  | "contains-alcohol"
  | "contains-nuts"
  | "halal-friendly";

export interface MenuItemOptionChoice {
  id: string;
  label: string;
  priceModifier: number;
}

export interface MenuItemOptionGroup {
  id: string;
  label: string;
  required: boolean;
  multiple: boolean;
  choices: MenuItemOptionChoice[];
}

export type StockStatus = "available" | "low-stock" | "sold-out";

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  categorySlug: MenuCategorySlug;
  image: string;
  gallery: string[];
  price: number;
  branchPrices?: Partial<Record<BranchSlug, number>>;
  branchAvailability: BranchSlug[];
  rating: number;
  reviewCount: number;
  prepTimeMinutes: number;
  dietaryLabels: DietaryLabel[];
  ingredients: string[];
  allergens: string[];
  optionGroups: MenuItemOptionGroup[];
  stockStatus: StockStatus;
  isPopular: boolean;
  isNew: boolean;
  requiresAgeConfirmation: boolean;
}
