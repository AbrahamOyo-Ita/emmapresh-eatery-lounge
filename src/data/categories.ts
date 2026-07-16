import type { MenuCategory } from "@/types";

export const menuCategories: MenuCategory[] = [
  { slug: "local-meals", name: "Local Meals", description: "Nigerian classics made fresh daily.", image: "/images/categories/local-meals.jpg", group: "food" },
  { slug: "rice-dishes", name: "Rice Dishes", description: "Jollof, fried rice, native rice and more.", image: "/images/categories/rice.jpg", group: "food" },
  { slug: "soups", name: "Soups", description: "Rich, hearty Nigerian soups.", image: "/images/categories/soups.jpg", group: "food" },
  { slug: "swallow", name: "Swallow", description: "Eba, pounded yam, semo and fufu.", image: "/images/categories/swallow.jpg", group: "food" },
  { slug: "grills", name: "Grills", description: "Smoky grilled meat and fish.", image: "/images/categories/grills.jpg", group: "food" },
  { slug: "seafood", name: "Seafood", description: "Fresh catch, expertly prepared.", image: "/images/categories/seafood.jpg", group: "food" },
  { slug: "breakfast", name: "Breakfast", description: "Start the day right.", image: "/images/categories/breakfast.jpg", group: "food" },
  { slug: "snacks", name: "Snacks & Small Chops", description: "Perfect for sharing.", image: "/images/categories/snacks.jpg", group: "junk" },
  { slug: "pizza", name: "Pizza", description: "Wood-fired, loaded with toppings.", image: "/images/categories/pizza.jpg", group: "junk" },
  { slug: "burgers", name: "Burgers", description: "Juicy, stacked, unforgettable.", image: "/images/categories/burgers.jpg", group: "junk" },
  { slug: "shawarma", name: "Shawarma", description: "Wrapped fresh, grilled to order.", image: "/images/categories/shawarma.jpg", group: "junk" },
  { slug: "doughnuts", name: "Doughnuts", description: "Soft, glazed, freshly fried.", image: "/images/categories/doughnuts.jpg", group: "junk" },
  { slug: "pastries", name: "Pastries", description: "Meat pies, sausage rolls and puff puff.", image: "/images/categories/pastries.jpg", group: "junk" },
  { slug: "desserts", name: "Desserts & Cakes", description: "Sweet endings and celebration cakes.", image: "/images/categories/desserts.jpg", group: "junk" },
  { slug: "drinks", name: "Drinks", description: "Juices, smoothies, mocktails and more.", image: "/images/categories/drinks.jpg", group: "drinks" },
  { slug: "family-meals", name: "Family Meals", description: "Generous portions for the whole family.", image: "/images/categories/family.jpg", group: "family" },
];

export function getCategoryBySlug(slug: string) {
  return menuCategories.find((c) => c.slug === slug);
}
