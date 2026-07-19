import type { MenuCategory } from "@/types";

export const menuCategories: MenuCategory[] = [
  { slug: "local-meals", name: "Local Meals", description: "Nigerian classics made fresh daily.", image: "/local meals.jpg", group: "food" },
  { slug: "rice-dishes", name: "Rice Dishes", description: "Jollof, fried rice, native rice and more.", image: "/jollof1.jpeg", group: "food" },
  { slug: "soups", name: "Soups", description: "Rich, hearty Nigerian soups.", image: "/Edikaikong soup.jpeg", group: "food" },
  { slug: "swallow", name: "Swallow", description: "Eba, pounded yam, semo and fufu.", image: "/Fufu .jpeg", group: "food" },
  { slug: "grills", name: "Grills", description: "Smoky grilled meat and fish.", image: "/grilledmeat.jpg", group: "food" },
  { slug: "seafood", name: "Seafood", description: "Fresh catch, expertly prepared.", image: "/seafood.jpeg", group: "food" },
  { slug: "breakfast", name: "Breakfast", description: "Start the day right.", image: "/pancake and tea.jpeg", group: "food" },
  { slug: "snacks", name: "Snacks & Small Chops", description: "Perfect for sharing.", image: "/smallchops.jpeg", group: "junk" },
  { slug: "pizza", name: "Pizza", description: "Wood-fired, loaded with toppings.", image: "/pizza.jpeg", group: "junk" },
  { slug: "burgers", name: "Burgers", description: "Juicy, stacked, unforgettable.", image: "/burger.jpeg", group: "junk" },
  { slug: "shawarma", name: "Shawarma", description: "Wrapped fresh, grilled to order.", image: "/shawarma.jpeg", group: "junk" },
  { slug: "doughnuts", name: "Doughnuts", description: "Soft, glazed, freshly fried.", image: "/doughnut.jpeg", group: "junk" },
  { slug: "pastries", name: "Pastries", description: "Meat pies, sausage rolls and puff puff.", image: "/Nigerian Meat Pie.jpeg", group: "junk" },
  { slug: "desserts", name: "Desserts & Cakes", description: "Sweet endings and celebration cakes.", image: "/Cakes and desserts.jpeg", group: "junk" },
  { slug: "drinks", name: "Drinks", description: "Juices, smoothies, mocktails and more.", image: "/Juices and drinks.jpeg", group: "drinks" },
  { slug: "family-meals", name: "Family Meals", description: "Generous portions for the whole family.", image: "/Family meal platter.jpeg", group: "family" },
];

export function getCategoryBySlug(slug: string) {
  return menuCategories.find((c) => c.slug === slug);
}
