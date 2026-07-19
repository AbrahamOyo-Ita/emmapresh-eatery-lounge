import type { BranchSlug, Cake, CakeOccasion } from "@/types";

const ALL_BRANCHES: BranchSlug[] = ["abuja", "lagos", "badagry"];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface RawCake {
  name: string;
  description: string;
  price: number;
  sizeLabel: string;
  flavour: string;
  occasion: CakeOccasion;
  branchAvailability?: BranchSlug[];
  quantityAvailable: number;
  sameDayPickup?: boolean;
  image: string;
}

const raw: RawCake[] = [
  { name: "Classic Vanilla Birthday Cake", description: "Soft vanilla sponge layered with buttercream, finished with festive sprinkles.", price: 18000, sizeLabel: "8-inch, serves 12", flavour: "Vanilla", occasion: "birthday", quantityAvailable: 6, sameDayPickup: true, image: "/Cakes and desserts.jpeg" },
  { name: "Red Velvet Celebration Cake", description: "Rich red velvet layers with cream cheese frosting.", price: 22000, sizeLabel: "8-inch, serves 12", flavour: "Red Velvet", occasion: "birthday", quantityAvailable: 4, sameDayPickup: true, image: "/Red Velvet Cheesecake.jpeg" },
  { name: "Two-Tier Wedding Cake", description: "Elegant two-tier fondant wedding cake with sugar floral detailing.", price: 85000, sizeLabel: "Two-tier, serves 60", flavour: "Vanilla & Chocolate", occasion: "wedding", quantityAvailable: 2, sameDayPickup: false, image: "/images/cakes/wedding-two-tier.jpg" },
  { name: "Three-Tier Wedding Cake", description: "A grand three-tier fondant cake, fully customisable colours and toppers.", price: 150000, sizeLabel: "Three-tier, serves 100", flavour: "Vanilla, Chocolate & Red Velvet", occasion: "wedding", quantityAvailable: 1, sameDayPickup: false, image: "/images/cakes/wedding-three-tier.jpg" },
  { name: "Chocolate Fudge Anniversary Cake", description: "Decadent chocolate fudge cake with chocolate ganache drip.", price: 25000, sizeLabel: "8-inch, serves 14", flavour: "Chocolate Fudge", occasion: "anniversary", quantityAvailable: 5, sameDayPickup: true, image: "/CAKEchocolate.jpeg" },
  { name: "Golden Anniversary Cake", description: "Gold-dusted vanilla cake celebrating milestone anniversaries.", price: 32000, sizeLabel: "10-inch, serves 20", flavour: "Vanilla", occasion: "anniversary", quantityAvailable: 3, sameDayPickup: false, image: "/images/cakes/golden-anniversary.jpg" },
  { name: "Corporate Logo Cake", description: "Custom-branded cake featuring your company logo in edible print.", price: 40000, sizeLabel: "10-inch, serves 25", flavour: "Chocolate", occasion: "corporate", quantityAvailable: 3, sameDayPickup: false, image: "/chocolate cake.jpeg" },
  { name: "Corporate Launch Cupcake Tower", description: "A tiered display of 60 branded cupcakes for product launches.", price: 45000, sizeLabel: "60 cupcakes", flavour: "Assorted", occasion: "corporate", quantityAvailable: 2, sameDayPickup: false, image: "/images/cakes/cupcake-tower.jpg" },
  { name: "Graduation Cap Cake", description: "A fun graduation-cap themed cake to celebrate academic success.", price: 20000, sizeLabel: "8-inch, serves 12", flavour: "Vanilla", occasion: "graduation", quantityAvailable: 4, sameDayPickup: true, image: "/images/cakes/graduation.jpg" },
  { name: "Baby Shower Blush Cake", description: "Soft pink ombre buttercream cake with edible pearls.", price: 24000, sizeLabel: "8-inch, serves 14", flavour: "Strawberry Vanilla", occasion: "baby-shower", quantityAvailable: 3, sameDayPickup: true, image: "/images/cakes/baby-shower.jpg" },
  { name: "Kids Birthday Character Cake", description: "Playful character-themed cake, a favourite for kids' parties.", price: 21000, sizeLabel: "8-inch, serves 12", flavour: "Vanilla", occasion: "birthday", quantityAvailable: 5, sameDayPickup: true, image: "/images/cakes/kids-birthday.jpg" },
  { name: "Assorted Cupcake Box (12 pcs)", description: "A dozen mixed-flavour cupcakes, perfect for small celebrations.", price: 9000, sizeLabel: "Box of 12", flavour: "Assorted", occasion: "birthday", quantityAvailable: 10, sameDayPickup: true, image: "/Red Velvet Cupcakes (Box of 4).jpeg" },
];

export const cakes: Cake[] = raw.map((cake, index) => ({
  id: `cake-${index + 1}`,
  slug: slugify(cake.name),
  name: cake.name,
  description: cake.description,
  image: cake.image,
  gallery: [cake.image],
  price: cake.price,
  sizeLabel: cake.sizeLabel,
  flavour: cake.flavour,
  occasion: cake.occasion,
  branchAvailability: cake.branchAvailability ?? ALL_BRANCHES,
  quantityAvailable: cake.quantityAvailable,
  sameDayPickup: cake.sameDayPickup ?? false,
  rating: Math.round((4.3 + ((index * 5) % 7) / 10) * 10) / 10,
}));

export function getCakeBySlug(slug: string) {
  return cakes.find((c) => c.slug === slug);
}
