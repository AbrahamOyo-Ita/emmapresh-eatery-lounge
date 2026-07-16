import type { MenuCategorySlug } from "@/types";
import type { FoodIconKey } from "@/components/ui/food-image";

export const categoryIconMap: Record<MenuCategorySlug, FoodIconKey> = {
  "local-meals": "soup",
  "rice-dishes": "soup",
  soups: "soup",
  swallow: "swallow",
  grills: "grill",
  seafood: "seafood",
  breakfast: "default",
  snacks: "pastry",
  pizza: "pizza",
  burgers: "burger",
  shawarma: "burger",
  doughnuts: "dessert",
  pastries: "pastry",
  desserts: "cake",
  drinks: "drink",
  "family-meals": "soup",
};

export function iconForCategory(category: MenuCategorySlug): FoodIconKey {
  return categoryIconMap[category] ?? "default";
}
