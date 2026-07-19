import type {
  BranchSlug,
  DietaryLabel,
  MenuCategorySlug,
  MenuItem,
  MenuItemOptionGroup,
  StockStatus,
} from "@/types";

const ALL_BRANCHES: BranchSlug[] = ["abuja", "lagos", "badagry"];

const spiceLevelGroup: MenuItemOptionGroup = {
  id: "spice-level",
  label: "Spice Level",
  required: true,
  multiple: false,
  choices: [
    { id: "mild", label: "Mild", priceModifier: 0 },
    { id: "regular", label: "Regular", priceModifier: 0 },
    { id: "extra-hot", label: "Extra Hot", priceModifier: 0 },
  ],
};

const proteinGroup: MenuItemOptionGroup = {
  id: "protein",
  label: "Choose Protein",
  required: true,
  multiple: false,
  choices: [
    { id: "chicken", label: "Chicken", priceModifier: 0 },
    { id: "beef", label: "Beef", priceModifier: 500 },
    { id: "goat-meat", label: "Goat Meat", priceModifier: 800 },
    { id: "fish", label: "Fish", priceModifier: 700 },
    { id: "assorted", label: "Assorted", priceModifier: 1000 },
  ],
};

const extrasGroup: MenuItemOptionGroup = {
  id: "extras",
  label: "Add Extras",
  required: false,
  multiple: true,
  choices: [
    { id: "extra-protein", label: "Extra Protein", priceModifier: 1200 },
    { id: "plantain", label: "Fried Plantain", priceModifier: 800 },
    { id: "coleslaw", label: "Coleslaw", priceModifier: 500 },
    { id: "extra-sauce", label: "Extra Sauce", priceModifier: 300 },
  ],
};

interface RawItem {
  name: string;
  description: string;
  categorySlug: MenuCategorySlug;
  price: number;
  prepTimeMinutes: number;
  dietaryLabels?: DietaryLabel[];
  ingredients: string[];
  allergens?: string[];
  optionGroups?: MenuItemOptionGroup[];
  branchAvailability?: BranchSlug[];
  stockStatus?: StockStatus;
  isPopular?: boolean;
  isNew?: boolean;
  requiresAgeConfirmation?: boolean;
  image: string;
  gallery?: string[];
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const raw: RawItem[] = [
  { name: "Jollof Rice & Grilled Chicken", description: "Smoky party-style jollof rice served with a juicy grilled chicken thigh and fried plantain.", categorySlug: "rice-dishes", price: 4500, prepTimeMinutes: 20, ingredients: ["Rice", "Tomato stew", "Chicken", "Plantain"], optionGroups: [proteinGroup, spiceLevelGroup, extrasGroup], isPopular: true, image: "/jollof Rice.jpeg", gallery: ["/jollof Rice.jpeg", "/jollof1.jpeg", "/jollof2.jpeg"] },
  { name: "Native Jollof Rice", description: "Smoked native rice cooked in palm oil with dried fish and ponmo.", categorySlug: "rice-dishes", price: 4200, prepTimeMinutes: 25, ingredients: ["Rice", "Palm oil", "Dried fish", "Ponmo"], optionGroups: [spiceLevelGroup], image: "/Native Jollof Rice.jpeg" },
  { name: "Fried Rice & Turkey", description: "Vegetable-loaded fried rice paired with a crispy turkey portion.", categorySlug: "rice-dishes", price: 4800, prepTimeMinutes: 20, ingredients: ["Rice", "Mixed vegetables", "Turkey"], optionGroups: [proteinGroup, extrasGroup], isPopular: true, image: "/Fried rice and turkey (2).jpeg", gallery: ["/Fried rice and turkey (2).jpeg", "/Fried rice and turkey (3).jpeg", "/Fried Rice.jpeg"] },
  { name: "Ofada Rice & Ayamase Sauce", description: "Local ofada rice with fiery green pepper ayamase sauce and assorted meat.", categorySlug: "rice-dishes", price: 5200, prepTimeMinutes: 25, ingredients: ["Ofada rice", "Green pepper", "Assorted meat"], dietaryLabels: ["spicy"], image: "/Ofada Rice & Ayamase Sauce.jpeg" },
  { name: "Coconut Rice", description: "Fragrant coconut milk rice with mixed vegetables and prawns.", categorySlug: "rice-dishes", price: 4600, prepTimeMinutes: 20, ingredients: ["Rice", "Coconut milk", "Prawns"], optionGroups: [proteinGroup], image: "/coconut rice.jpeg", gallery: ["/coconut rice.jpeg", "/coconut rice2.jpeg"] },
  { name: "Egusi Soup & Pounded Yam", description: "Melon seed soup with spinach, stockfish and assorted meat, served with pounded yam.", categorySlug: "soups", price: 5000, prepTimeMinutes: 25, ingredients: ["Egusi", "Spinach", "Stockfish", "Pounded yam"], optionGroups: [proteinGroup], isPopular: true, image: "/Pounded Yam and Egusi.jpeg", gallery: ["/Pounded Yam and Egusi.jpeg", "/Egusi Soup Recipe - How to cook egusi soup.jpeg"] },
  { name: "Oha Soup & Eba", description: "Traditional Igbo oha soup with cocoyam thickener, served with eba.", categorySlug: "soups", price: 5200, prepTimeMinutes: 25, ingredients: ["Oha leaves", "Cocoyam", "Eba"], optionGroups: [proteinGroup], image: "/oha soup and eba.jpeg" },
  { name: "Afang Soup & Fufu", description: "Rich vegetable soup made with afang leaves and waterleaf, served with fufu.", categorySlug: "soups", price: 5300, prepTimeMinutes: 25, ingredients: ["Afang leaves", "Waterleaf", "Fufu"], optionGroups: [proteinGroup], image: "/afang soup and fufu.jpeg" },
  { name: "Banga Soup & Starch", description: "Palm-fruit soup with native spices, served with starch.", categorySlug: "soups", price: 5100, prepTimeMinutes: 25, ingredients: ["Palm fruit", "Native spices", "Starch"], optionGroups: [proteinGroup], image: "/banga soup ans starch.jpeg" },
  { name: "Pounded Yam", description: "Smooth, stretchy pounded yam. Pair with any soup.", categorySlug: "swallow", price: 1500, prepTimeMinutes: 10, ingredients: ["Yam"], image: "/pounded yam.jpeg", gallery: ["/pounded yam.jpeg", "/pounded yam copy.jpeg"] },
  { name: "Amala & Ewedu", description: "Soft amala served with ewedu soup and gbegiri.", categorySlug: "swallow", price: 3800, prepTimeMinutes: 20, ingredients: ["Amala", "Ewedu", "Gbegiri"], optionGroups: [proteinGroup], image: "/Amala with Ewedu Food.jpeg", gallery: ["/Amala with Ewedu Food.jpeg", "/Amala.jpeg"] },
  { name: "Eba", description: "Classic garri swallow, smooth and firm.", categorySlug: "swallow", price: 1200, prepTimeMinutes: 8, ingredients: ["Garri"], image: "/Nigerian Eba.jpeg" },
  { name: "Suya Platter", description: "Spicy grilled beef suya with onions, tomato and yaji spice.", categorySlug: "grills", price: 6000, prepTimeMinutes: 20, ingredients: ["Beef", "Yaji spice", "Onions"], dietaryLabels: ["spicy"], isPopular: true, image: "/grilledmeat.jpg", gallery: ["/grilledmeat.jpg", "/stick meat.jpeg"] },
  { name: "Grilled Tilapia Fish", description: "Whole tilapia grilled with pepper sauce, served with plantain.", categorySlug: "grills", price: 7500, prepTimeMinutes: 25, ingredients: ["Tilapia fish", "Pepper sauce", "Plantain"], image: "/Grilled Whole Catfish.jpeg" },
  { name: "Peppered Goat Meat", description: "Tender goat meat tossed in a rich pepper sauce.", categorySlug: "grills", price: 6500, prepTimeMinutes: 20, ingredients: ["Goat meat", "Pepper sauce"], dietaryLabels: ["spicy"], image: "/images/menu/peppered-goat-meat.jpg" },
  { name: "Asun (Spicy Goat Meat)", description: "Smoky, chopped spicy goat meat — a lounge favourite.", categorySlug: "grills", price: 6800, prepTimeMinutes: 20, ingredients: ["Goat meat", "Scotch bonnet", "Onions"], dietaryLabels: ["spicy"], isPopular: true, image: "/images/menu/asun.jpg" },
  { name: "Grilled Prawns", description: "Jumbo prawns grilled in garlic butter sauce.", categorySlug: "seafood", price: 8500, prepTimeMinutes: 20, ingredients: ["Prawns", "Garlic butter"], image: "/Seafood platter.jpeg", gallery: ["/Seafood platter.jpeg", "/Seafood platter2.jpeg", "/Spicy seafood.jpeg"] },
  { name: "Seafood Okro Soup", description: "Okro soup loaded with prawns, crab and periwinkle.", categorySlug: "seafood", price: 7200, prepTimeMinutes: 25, ingredients: ["Okro", "Prawns", "Crab", "Periwinkle"], image: "/Nigerian Okra Soup Step By Step Recipe - Dream Africa.jpeg" },
  { name: "Peppered Snails", description: "Giant snails simmered in a fiery pepper sauce.", categorySlug: "seafood", price: 7800, prepTimeMinutes: 20, ingredients: ["Snails", "Pepper sauce"], dietaryLabels: ["spicy"], image: "/Hot Peppered Snails.jpeg" },
  { name: "Akara & Pap", description: "Fluffy bean cakes served with warm corn pap.", categorySlug: "breakfast", price: 2500, prepTimeMinutes: 15, ingredients: ["Beans", "Corn pap"], dietaryLabels: ["vegetarian"], image: "/papandakara.jpeg", gallery: ["/papandakara.jpeg", "/bread and akara.jpeg"] },
  { name: "Yam & Egg Sauce", description: "Boiled yam served with a rich pepper egg sauce.", categorySlug: "breakfast", price: 3000, prepTimeMinutes: 15, ingredients: ["Yam", "Eggs", "Pepper sauce"], dietaryLabels: ["vegetarian"], image: "/Yam and Egg Sauce.jpeg", gallery: ["/Yam and Egg Sauce.jpeg", "/fried plantain and egg.jpeg"] },
  { name: "Custard & Moin Moin", description: "Warm custard paired with steamed bean pudding.", categorySlug: "breakfast", price: 2800, prepTimeMinutes: 15, ingredients: ["Custard", "Beans"], dietaryLabels: ["vegetarian"], image: "/moi moi.jpeg" },
  { name: "Small Chops Platter", description: "Spring rolls, samosa, puff puff, chicken bites and fish rolls.", categorySlug: "snacks", price: 8000, prepTimeMinutes: 20, ingredients: ["Spring rolls", "Samosa", "Puff puff", "Chicken bites"], isPopular: true, image: "/small chops.jpeg", gallery: ["/small chops.jpeg", "/smallchops.jpeg", "/smallchops2.jpeg", "/SMALL CHOPS (1).jpeg", "/Nigerian small chops ideas.jpeg"] },
  { name: "Chicken Wings (8 pcs)", description: "Crispy fried wings tossed in your choice of sauce.", categorySlug: "snacks", price: 5000, prepTimeMinutes: 18, ingredients: ["Chicken wings"], optionGroups: [spiceLevelGroup], image: "/images/menu/chicken-wings.jpg" },
  { name: "Loaded Fries", description: "Crispy fries loaded with beef floss, cheese sauce and jalapenos.", categorySlug: "snacks", price: 4200, prepTimeMinutes: 15, ingredients: ["Potato fries", "Beef floss", "Cheese sauce"], isNew: true, image: "/images/menu/loaded-fries.jpg" },
  { name: "Classic Pepperoni Pizza (12\")", description: "Wood-fired pizza loaded with pepperoni and mozzarella.", categorySlug: "pizza", price: 9500, prepTimeMinutes: 25, ingredients: ["Pizza dough", "Pepperoni", "Mozzarella"], isPopular: true, image: "/pizza.jpeg" },
  { name: "Chicken Suya Pizza (12\")", description: "A Nigerian twist — suya-spiced chicken, peppers and onions.", categorySlug: "pizza", price: 10200, prepTimeMinutes: 25, ingredients: ["Pizza dough", "Suya chicken", "Peppers"], dietaryLabels: ["spicy"], isNew: true, image: "/images/menu/suya-pizza.jpg" },
  { name: "Four Cheese Pizza (12\")", description: "Mozzarella, cheddar, parmesan and gouda on a crisp base.", categorySlug: "pizza", price: 9800, prepTimeMinutes: 25, ingredients: ["Pizza dough", "Four cheese blend"], dietaryLabels: ["vegetarian"], image: "/images/menu/cheese-pizza.jpg" },
  { name: "Veggie Supreme Pizza (12\")", description: "Bell peppers, mushroom, sweetcorn, olives and onions.", categorySlug: "pizza", price: 9200, prepTimeMinutes: 25, ingredients: ["Pizza dough", "Mixed vegetables"], dietaryLabels: ["vegetarian"], image: "/Veggie Supreme Pizza (12\").jpeg" },
  { name: "Crispy Chicken Burger", description: "Crunchy fried chicken fillet with spicy mayo and pickles.", categorySlug: "burgers", price: 5200, prepTimeMinutes: 15, ingredients: ["Chicken fillet", "Spicy mayo", "Brioche bun"], image: "/images/menu/chicken-burger.jpg" },
  { name: "Smoky BBQ Beef Burger", description: "Beef patty glazed in smoky BBQ sauce with crispy onions.", categorySlug: "burgers", price: 5800, prepTimeMinutes: 15, ingredients: ["Beef patty", "BBQ sauce", "Crispy onions"], image: "/images/menu/bbq-burger.jpg" },
  { name: "Chicken Shawarma", description: "Grilled chicken shawarma wrapped with garlic sauce, coleslaw and fries.", categorySlug: "shawarma", price: 4200, prepTimeMinutes: 12, ingredients: ["Chicken", "Garlic sauce", "Tortilla wrap"], isPopular: true, image: "/shawarma.jpeg" },
  { name: "Beef Shawarma", description: "Sliced beef shawarma with spicy sauce and crunchy vegetables.", categorySlug: "shawarma", price: 4500, prepTimeMinutes: 12, ingredients: ["Beef", "Spicy sauce", "Tortilla wrap"], image: "/images/menu/beef-shawarma.jpg" },
  { name: "Mixed Shawarma (Chicken & Beef)", description: "The best of both — chicken and beef in one loaded wrap.", categorySlug: "shawarma", price: 5000, prepTimeMinutes: 12, ingredients: ["Chicken", "Beef", "Tortilla wrap"], isNew: true, image: "/images/menu/mixed-shawarma.jpg" },
  { name: "Glazed Doughnuts (Box of 6)", description: "Soft, pillowy doughnuts finished with sweet glaze.", categorySlug: "doughnuts", price: 3000, prepTimeMinutes: 10, ingredients: ["Flour", "Sugar glaze"], dietaryLabels: ["vegetarian"], image: "/doughnut.jpeg" },
  { name: "Chocolate Filled Doughnuts (Box of 6)", description: "Filled with rich Belgian chocolate cream.", categorySlug: "doughnuts", price: 3500, prepTimeMinutes: 10, ingredients: ["Flour", "Chocolate cream"], dietaryLabels: ["vegetarian"], image: "/Chocolate doughnuts.jpeg" },
  { name: "Meat Pie (Pack of 4)", description: "Flaky pastry filled with seasoned minced meat and potatoes.", categorySlug: "pastries", price: 2400, prepTimeMinutes: 10, ingredients: ["Pastry", "Minced meat", "Potatoes"], image: "/Nigerian Meat Pie.jpeg", gallery: ["/Nigerian Meat Pie.jpeg", "/meatpie.jpeg"] },
  { name: "Sausage Rolls (Pack of 6)", description: "Golden pastry rolled around seasoned sausage filling.", categorySlug: "pastries", price: 3000, prepTimeMinutes: 10, ingredients: ["Pastry", "Sausage filling"], image: "/images/menu/sausage-rolls.jpg" },
  { name: "Chin Chin (500g)", description: "Crunchy, lightly sweetened fried pastry snack.", categorySlug: "pastries", price: 2000, prepTimeMinutes: 5, ingredients: ["Flour", "Sugar", "Nutmeg"], dietaryLabels: ["vegetarian"], image: "/chin chin.jpeg" },
  { name: "Red Velvet Cupcakes (Box of 4)", description: "Moist red velvet cupcakes with cream cheese frosting.", categorySlug: "desserts", price: 4500, prepTimeMinutes: 5, ingredients: ["Red velvet sponge", "Cream cheese frosting"], dietaryLabels: ["vegetarian"], image: "/Red Velvet Cupcakes (Box of 4).jpeg" },
  { name: "Chocolate Fudge Slice", description: "Decadent chocolate fudge cake slice.", categorySlug: "desserts", price: 2500, prepTimeMinutes: 5, ingredients: ["Chocolate sponge", "Fudge"], dietaryLabels: ["vegetarian"], image: "/Chocolate Fudge Slice.jpeg", gallery: ["/Chocolate Fudge Slice.jpeg", "/Chocolate Fudge Slice copy.jpeg", "/Chocolate Eclairs.jpeg"] },
  { name: "Fresh Watermelon Juice", description: "Cold-pressed watermelon juice, no added sugar.", categorySlug: "drinks", price: 2000, prepTimeMinutes: 5, ingredients: ["Watermelon"], dietaryLabels: ["vegan"], image: "/Fresh Watermelon Juice.jpeg", gallery: ["/Fresh Watermelon Juice.jpeg", "/Juices and drinks.jpeg"] },
  { name: "Tropical Smoothie", description: "Blended mango, pineapple and passionfruit smoothie.", categorySlug: "drinks", price: 2800, prepTimeMinutes: 6, ingredients: ["Mango", "Pineapple", "Passionfruit"], dietaryLabels: ["vegan"], isPopular: true, image: "/Tropical Smoothie.jpg", gallery: ["/Tropical Smoothie.jpg", "/Milkshake.jpeg"] },
  { name: "Chapman Mocktail", description: "Nigeria's favourite fruity mocktail, served chilled.", categorySlug: "drinks", price: 2500, prepTimeMinutes: 6, ingredients: ["Grenadine", "Fruit juices", "Soda"], image: "/Chapman Mocktail.jpeg", gallery: ["/Chapman Mocktail.jpeg", "/Juices and drinks2.jpeg"] },
  { name: "Chilled Lager (Bottle)", description: "Ice-cold Nigerian lager beer.", categorySlug: "drinks", price: 1500, prepTimeMinutes: 2, ingredients: ["Beer"], dietaryLabels: ["contains-alcohol"], requiresAgeConfirmation: true, image: "/Juices and drinks4.jpeg" },
  { name: "House Red Wine (Glass)", description: "A smooth, medium-bodied red wine by the glass.", categorySlug: "drinks", price: 3500, prepTimeMinutes: 2, ingredients: ["Red wine"], dietaryLabels: ["contains-alcohol"], requiresAgeConfirmation: true, image: "/Juices and drinks5.jpeg" },
  { name: "Nigerian Breakfast Tea", description: "Freshly brewed tea served with milk and sugar on request.", categorySlug: "drinks", price: 1200, prepTimeMinutes: 5, ingredients: ["Tea leaves"], dietaryLabels: ["vegetarian"], image: "/images/menu/tea.jpg" },
  { name: "Espresso Coffee", description: "Rich, bold espresso shot.", categorySlug: "drinks", price: 1800, prepTimeMinutes: 4, ingredients: ["Coffee beans"], dietaryLabels: ["vegan"], image: "/Espresso Coffee.jpeg" },
  { name: "Family Jollof Combo (Serves 6)", description: "A generous family-size jollof rice combo with grilled chicken and plantain, feeds up to six people.", categorySlug: "family-meals", price: 22000, prepTimeMinutes: 35, ingredients: ["Rice", "Chicken", "Plantain"], optionGroups: [proteinGroup], isPopular: true, image: "/Family meal platter.jpeg", gallery: ["/Family meal platter.jpeg", "/Family meal platter2.jpeg", "/Family meal platter3.jpeg", "/Family meal platter4.jpeg", "/Family meal platter6.jpeg"] },
  { name: "Family Small Chops Party Pack", description: "A large party tray of assorted small chops, perfect for gatherings.", categorySlug: "family-meals", price: 25000, prepTimeMinutes: 35, ingredients: ["Spring rolls", "Samosa", "Puff puff", "Chicken bites"], image: "/Family meal platter2 copy.jpeg", gallery: ["/Family meal platter2 copy.jpeg", "/Family meal platter3 copy.jpeg", "/Family meal platter4 copy.jpeg", "/Family meal platter6 copy.jpeg"] },
];

export const menuItems: MenuItem[] = raw.map((item, index) => ({
  id: `item-${index + 1}`,
  slug: slugify(item.name),
  name: item.name,
  description: item.description,
  categorySlug: item.categorySlug,
  image: item.image,
  gallery: item.gallery ?? [item.image],
  price: item.price,
  branchAvailability: item.branchAvailability ?? ALL_BRANCHES,
  rating: Math.round((4.2 + ((index * 7) % 8) / 10) * 10) / 10,
  reviewCount: 18 + ((index * 13) % 140),
  prepTimeMinutes: item.prepTimeMinutes,
  dietaryLabels: item.dietaryLabels ?? [],
  ingredients: item.ingredients,
  allergens: item.allergens ?? [],
  optionGroups: item.optionGroups ?? [],
  stockStatus: item.stockStatus ?? "available",
  isPopular: item.isPopular ?? false,
  isNew: item.isNew ?? false,
  requiresAgeConfirmation: item.requiresAgeConfirmation ?? false,
}));

export function getMenuItemBySlug(slug: string) {
  return menuItems.find((item) => item.slug === slug);
}

export function getMenuItemsByCategory(categorySlug: string) {
  return menuItems.filter((item) => item.categorySlug === categorySlug);
}

export function getPopularMenuItems() {
  return menuItems.filter((item) => item.isPopular);
}
