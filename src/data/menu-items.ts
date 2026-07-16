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
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const raw: RawItem[] = [
  { name: "Jollof Rice & Grilled Chicken", description: "Smoky party-style jollof rice served with a juicy grilled chicken thigh and fried plantain.", categorySlug: "rice-dishes", price: 4500, prepTimeMinutes: 20, ingredients: ["Rice", "Tomato stew", "Chicken", "Plantain"], optionGroups: [proteinGroup, spiceLevelGroup, extrasGroup], isPopular: true, image: "/images/menu/jollof-rice.jpg" },
  { name: "Native Jollof Rice", description: "Smoked native rice cooked in palm oil with dried fish and ponmo.", categorySlug: "rice-dishes", price: 4200, prepTimeMinutes: 25, ingredients: ["Rice", "Palm oil", "Dried fish", "Ponmo"], optionGroups: [spiceLevelGroup], image: "/images/menu/native-jollof.jpg" },
  { name: "Fried Rice & Turkey", description: "Vegetable-loaded fried rice paired with a crispy turkey portion.", categorySlug: "rice-dishes", price: 4800, prepTimeMinutes: 20, ingredients: ["Rice", "Mixed vegetables", "Turkey"], optionGroups: [proteinGroup, extrasGroup], isPopular: true, image: "/images/menu/fried-rice.jpg" },
  { name: "Ofada Rice & Ayamase Sauce", description: "Local ofada rice with fiery green pepper ayamase sauce and assorted meat.", categorySlug: "rice-dishes", price: 5200, prepTimeMinutes: 25, ingredients: ["Ofada rice", "Green pepper", "Assorted meat"], dietaryLabels: ["spicy"], image: "/images/menu/ofada-rice.jpg" },
  { name: "Coconut Rice", description: "Fragrant coconut milk rice with mixed vegetables and prawns.", categorySlug: "rice-dishes", price: 4600, prepTimeMinutes: 20, ingredients: ["Rice", "Coconut milk", "Prawns"], optionGroups: [proteinGroup], image: "/images/menu/coconut-rice.jpg" },
  { name: "Egusi Soup & Pounded Yam", description: "Melon seed soup with spinach, stockfish and assorted meat, served with pounded yam.", categorySlug: "soups", price: 5000, prepTimeMinutes: 25, ingredients: ["Egusi", "Spinach", "Stockfish", "Pounded yam"], optionGroups: [proteinGroup], isPopular: true, image: "/images/menu/egusi-soup.jpg" },
  { name: "Oha Soup & Eba", description: "Traditional Igbo oha soup with cocoyam thickener, served with eba.", categorySlug: "soups", price: 5200, prepTimeMinutes: 25, ingredients: ["Oha leaves", "Cocoyam", "Eba"], optionGroups: [proteinGroup], image: "/images/menu/oha-soup.jpg" },
  { name: "Afang Soup & Fufu", description: "Rich vegetable soup made with afang leaves and waterleaf, served with fufu.", categorySlug: "soups", price: 5300, prepTimeMinutes: 25, ingredients: ["Afang leaves", "Waterleaf", "Fufu"], optionGroups: [proteinGroup], image: "/images/menu/afang-soup.jpg" },
  { name: "Banga Soup & Starch", description: "Palm-fruit soup with native spices, served with starch.", categorySlug: "soups", price: 5100, prepTimeMinutes: 25, ingredients: ["Palm fruit", "Native spices", "Starch"], optionGroups: [proteinGroup], image: "/images/menu/banga-soup.jpg" },
  { name: "Pounded Yam", description: "Smooth, stretchy pounded yam. Pair with any soup.", categorySlug: "swallow", price: 1500, prepTimeMinutes: 10, ingredients: ["Yam"], image: "/images/menu/pounded-yam.jpg" },
  { name: "Amala & Ewedu", description: "Soft amala served with ewedu soup and gbegiri.", categorySlug: "swallow", price: 3800, prepTimeMinutes: 20, ingredients: ["Amala", "Ewedu", "Gbegiri"], optionGroups: [proteinGroup], image: "/images/menu/amala.jpg" },
  { name: "Eba", description: "Classic garri swallow, smooth and firm.", categorySlug: "swallow", price: 1200, prepTimeMinutes: 8, ingredients: ["Garri"], image: "/images/menu/eba.jpg" },
  { name: "Semo", description: "Soft semolina swallow.", categorySlug: "swallow", price: 1200, prepTimeMinutes: 8, ingredients: ["Semolina"], image: "/images/menu/semo.jpg" },
  { name: "Suya Platter", description: "Spicy grilled beef suya with onions, tomato and yaji spice.", categorySlug: "grills", price: 6000, prepTimeMinutes: 20, ingredients: ["Beef", "Yaji spice", "Onions"], dietaryLabels: ["spicy"], isPopular: true, image: "/images/menu/suya.jpg" },
  { name: "Grilled Tilapia Fish", description: "Whole tilapia grilled with pepper sauce, served with plantain.", categorySlug: "grills", price: 7500, prepTimeMinutes: 25, ingredients: ["Tilapia fish", "Pepper sauce", "Plantain"], image: "/images/menu/grilled-fish.jpg" },
  { name: "Peppered Goat Meat", description: "Tender goat meat tossed in a rich pepper sauce.", categorySlug: "grills", price: 6500, prepTimeMinutes: 20, ingredients: ["Goat meat", "Pepper sauce"], dietaryLabels: ["spicy"], image: "/images/menu/peppered-goat-meat.jpg" },
  { name: "Asun (Spicy Goat Meat)", description: "Smoky, chopped spicy goat meat — a lounge favourite.", categorySlug: "grills", price: 6800, prepTimeMinutes: 20, ingredients: ["Goat meat", "Scotch bonnet", "Onions"], dietaryLabels: ["spicy"], isPopular: true, image: "/images/menu/asun.jpg" },
  { name: "Grilled Prawns", description: "Jumbo prawns grilled in garlic butter sauce.", categorySlug: "seafood", price: 8500, prepTimeMinutes: 20, ingredients: ["Prawns", "Garlic butter"], image: "/images/menu/grilled-prawns.jpg" },
  { name: "Seafood Okro Soup", description: "Okro soup loaded with prawns, crab and periwinkle.", categorySlug: "seafood", price: 7200, prepTimeMinutes: 25, ingredients: ["Okro", "Prawns", "Crab", "Periwinkle"], image: "/images/menu/seafood-okro.jpg" },
  { name: "Peppered Snails", description: "Giant snails simmered in a fiery pepper sauce.", categorySlug: "seafood", price: 7800, prepTimeMinutes: 20, ingredients: ["Snails", "Pepper sauce"], dietaryLabels: ["spicy"], image: "/images/menu/peppered-snails.jpg" },
  { name: "Akara & Pap", description: "Fluffy bean cakes served with warm corn pap.", categorySlug: "breakfast", price: 2500, prepTimeMinutes: 15, ingredients: ["Beans", "Corn pap"], dietaryLabels: ["vegetarian"], image: "/images/menu/akara-pap.jpg" },
  { name: "Yam & Egg Sauce", description: "Boiled yam served with a rich pepper egg sauce.", categorySlug: "breakfast", price: 3000, prepTimeMinutes: 15, ingredients: ["Yam", "Eggs", "Pepper sauce"], dietaryLabels: ["vegetarian"], image: "/images/menu/yam-egg-sauce.jpg" },
  { name: "Custard & Moin Moin", description: "Warm custard paired with steamed bean pudding.", categorySlug: "breakfast", price: 2800, prepTimeMinutes: 15, ingredients: ["Custard", "Beans"], dietaryLabels: ["vegetarian"], image: "/images/menu/custard-moinmoin.jpg" },
  { name: "Small Chops Platter", description: "Spring rolls, samosa, puff puff, chicken bites and fish rolls.", categorySlug: "snacks", price: 8000, prepTimeMinutes: 20, ingredients: ["Spring rolls", "Samosa", "Puff puff", "Chicken bites"], isPopular: true, image: "/images/menu/small-chops.jpg" },
  { name: "Chicken Wings (8 pcs)", description: "Crispy fried wings tossed in your choice of sauce.", categorySlug: "snacks", price: 5000, prepTimeMinutes: 18, ingredients: ["Chicken wings"], optionGroups: [spiceLevelGroup], image: "/images/menu/chicken-wings.jpg" },
  { name: "Loaded Fries", description: "Crispy fries loaded with beef floss, cheese sauce and jalapenos.", categorySlug: "snacks", price: 4200, prepTimeMinutes: 15, ingredients: ["Potato fries", "Beef floss", "Cheese sauce"], isNew: true, image: "/images/menu/loaded-fries.jpg" },
  { name: "Classic Pepperoni Pizza (12\")", description: "Wood-fired pizza loaded with pepperoni and mozzarella.", categorySlug: "pizza", price: 9500, prepTimeMinutes: 25, ingredients: ["Pizza dough", "Pepperoni", "Mozzarella"], isPopular: true, image: "/images/menu/pepperoni-pizza.jpg" },
  { name: "Chicken Suya Pizza (12\")", description: "A Nigerian twist — suya-spiced chicken, peppers and onions.", categorySlug: "pizza", price: 10200, prepTimeMinutes: 25, ingredients: ["Pizza dough", "Suya chicken", "Peppers"], dietaryLabels: ["spicy"], isNew: true, image: "/images/menu/suya-pizza.jpg" },
  { name: "Four Cheese Pizza (12\")", description: "Mozzarella, cheddar, parmesan and gouda on a crisp base.", categorySlug: "pizza", price: 9800, prepTimeMinutes: 25, ingredients: ["Pizza dough", "Four cheese blend"], dietaryLabels: ["vegetarian"], image: "/images/menu/cheese-pizza.jpg" },
  { name: "Veggie Supreme Pizza (12\")", description: "Bell peppers, mushroom, sweetcorn, olives and onions.", categorySlug: "pizza", price: 9200, prepTimeMinutes: 25, ingredients: ["Pizza dough", "Mixed vegetables"], dietaryLabels: ["vegetarian"], image: "/images/menu/veggie-pizza.jpg" },
  { name: "EmmaPresh Classic Beef Burger", description: "Double beef patty, cheddar, lettuce, tomato and our signature sauce.", categorySlug: "burgers", price: 5500, prepTimeMinutes: 15, ingredients: ["Beef patty", "Cheddar", "Lettuce", "Brioche bun"], isPopular: true, image: "/images/menu/beef-burger.jpg" },
  { name: "Crispy Chicken Burger", description: "Crunchy fried chicken fillet with spicy mayo and pickles.", categorySlug: "burgers", price: 5200, prepTimeMinutes: 15, ingredients: ["Chicken fillet", "Spicy mayo", "Brioche bun"], image: "/images/menu/chicken-burger.jpg" },
  { name: "Smoky BBQ Beef Burger", description: "Beef patty glazed in smoky BBQ sauce with crispy onions.", categorySlug: "burgers", price: 5800, prepTimeMinutes: 15, ingredients: ["Beef patty", "BBQ sauce", "Crispy onions"], image: "/images/menu/bbq-burger.jpg" },
  { name: "Chicken Shawarma", description: "Grilled chicken shawarma wrapped with garlic sauce, coleslaw and fries.", categorySlug: "shawarma", price: 4200, prepTimeMinutes: 12, ingredients: ["Chicken", "Garlic sauce", "Tortilla wrap"], isPopular: true, image: "/images/menu/chicken-shawarma.jpg" },
  { name: "Beef Shawarma", description: "Sliced beef shawarma with spicy sauce and crunchy vegetables.", categorySlug: "shawarma", price: 4500, prepTimeMinutes: 12, ingredients: ["Beef", "Spicy sauce", "Tortilla wrap"], image: "/images/menu/beef-shawarma.jpg" },
  { name: "Mixed Shawarma (Chicken & Beef)", description: "The best of both — chicken and beef in one loaded wrap.", categorySlug: "shawarma", price: 5000, prepTimeMinutes: 12, ingredients: ["Chicken", "Beef", "Tortilla wrap"], isNew: true, image: "/images/menu/mixed-shawarma.jpg" },
  { name: "Glazed Doughnuts (Box of 6)", description: "Soft, pillowy doughnuts finished with sweet glaze.", categorySlug: "doughnuts", price: 3000, prepTimeMinutes: 10, ingredients: ["Flour", "Sugar glaze"], dietaryLabels: ["vegetarian"], image: "/images/menu/glazed-doughnuts.jpg" },
  { name: "Chocolate Filled Doughnuts (Box of 6)", description: "Filled with rich Belgian chocolate cream.", categorySlug: "doughnuts", price: 3500, prepTimeMinutes: 10, ingredients: ["Flour", "Chocolate cream"], dietaryLabels: ["vegetarian"], image: "/images/menu/chocolate-doughnuts.jpg" },
  { name: "Meat Pie (Pack of 4)", description: "Flaky pastry filled with seasoned minced meat and potatoes.", categorySlug: "pastries", price: 2400, prepTimeMinutes: 10, ingredients: ["Pastry", "Minced meat", "Potatoes"], image: "/images/menu/meat-pie.jpg" },
  { name: "Sausage Rolls (Pack of 6)", description: "Golden pastry rolled around seasoned sausage filling.", categorySlug: "pastries", price: 3000, prepTimeMinutes: 10, ingredients: ["Pastry", "Sausage filling"], image: "/images/menu/sausage-rolls.jpg" },
  { name: "Chin Chin (500g)", description: "Crunchy, lightly sweetened fried pastry snack.", categorySlug: "pastries", price: 2000, prepTimeMinutes: 5, ingredients: ["Flour", "Sugar", "Nutmeg"], dietaryLabels: ["vegetarian"], image: "/images/menu/chin-chin.jpg" },
  { name: "Red Velvet Cupcakes (Box of 4)", description: "Moist red velvet cupcakes with cream cheese frosting.", categorySlug: "desserts", price: 4500, prepTimeMinutes: 5, ingredients: ["Red velvet sponge", "Cream cheese frosting"], dietaryLabels: ["vegetarian"], image: "/images/menu/red-velvet-cupcakes.jpg" },
  { name: "Chocolate Fudge Slice", description: "Decadent chocolate fudge cake slice.", categorySlug: "desserts", price: 2500, prepTimeMinutes: 5, ingredients: ["Chocolate sponge", "Fudge"], dietaryLabels: ["vegetarian"], image: "/images/menu/chocolate-fudge.jpg" },
  { name: "Fresh Watermelon Juice", description: "Cold-pressed watermelon juice, no added sugar.", categorySlug: "drinks", price: 2000, prepTimeMinutes: 5, ingredients: ["Watermelon"], dietaryLabels: ["vegan"], image: "/images/menu/watermelon-juice.jpg" },
  { name: "Tropical Smoothie", description: "Blended mango, pineapple and passionfruit smoothie.", categorySlug: "drinks", price: 2800, prepTimeMinutes: 6, ingredients: ["Mango", "Pineapple", "Passionfruit"], dietaryLabels: ["vegan"], isPopular: true, image: "/images/menu/tropical-smoothie.jpg" },
  { name: "Chapman Mocktail", description: "Nigeria's favourite fruity mocktail, served chilled.", categorySlug: "drinks", price: 2500, prepTimeMinutes: 6, ingredients: ["Grenadine", "Fruit juices", "Soda"], image: "/images/menu/chapman.jpg" },
  { name: "EmmaPresh Signature Cocktail", description: "A citrus-forward house cocktail crafted at the lounge bar.", categorySlug: "drinks", price: 6500, prepTimeMinutes: 8, ingredients: ["Spirits", "Citrus", "Bitters"], dietaryLabels: ["contains-alcohol"], requiresAgeConfirmation: true, image: "/images/menu/signature-cocktail.jpg" },
  { name: "Chilled Lager (Bottle)", description: "Ice-cold Nigerian lager beer.", categorySlug: "drinks", price: 1500, prepTimeMinutes: 2, ingredients: ["Beer"], dietaryLabels: ["contains-alcohol"], requiresAgeConfirmation: true, image: "/images/menu/lager-beer.jpg" },
  { name: "House Red Wine (Glass)", description: "A smooth, medium-bodied red wine by the glass.", categorySlug: "drinks", price: 3500, prepTimeMinutes: 2, ingredients: ["Red wine"], dietaryLabels: ["contains-alcohol"], requiresAgeConfirmation: true, image: "/images/menu/red-wine.jpg" },
  { name: "Nigerian Breakfast Tea", description: "Freshly brewed tea served with milk and sugar on request.", categorySlug: "drinks", price: 1200, prepTimeMinutes: 5, ingredients: ["Tea leaves"], dietaryLabels: ["vegetarian"], image: "/images/menu/tea.jpg" },
  { name: "Espresso Coffee", description: "Rich, bold espresso shot.", categorySlug: "drinks", price: 1800, prepTimeMinutes: 4, ingredients: ["Coffee beans"], dietaryLabels: ["vegan"], image: "/images/menu/espresso.jpg" },
  { name: "Family Jollof Combo (Serves 6)", description: "A generous family-size jollof rice combo with grilled chicken and plantain, feeds up to six people.", categorySlug: "family-meals", price: 22000, prepTimeMinutes: 35, ingredients: ["Rice", "Chicken", "Plantain"], optionGroups: [proteinGroup], isPopular: true, image: "/images/menu/family-jollof.jpg" },
  { name: "Family Small Chops Party Pack", description: "A large party tray of assorted small chops, perfect for gatherings.", categorySlug: "family-meals", price: 25000, prepTimeMinutes: 35, ingredients: ["Spring rolls", "Samosa", "Puff puff", "Chicken bites"], image: "/images/menu/family-small-chops.jpg" },
];

export const menuItems: MenuItem[] = raw.map((item, index) => ({
  id: `item-${index + 1}`,
  slug: slugify(item.name),
  name: item.name,
  description: item.description,
  categorySlug: item.categorySlug,
  image: item.image,
  gallery: [item.image],
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
