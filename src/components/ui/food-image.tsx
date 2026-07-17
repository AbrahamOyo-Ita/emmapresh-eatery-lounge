import {
  UtensilsCrossed,
  Pizza,
  Beef,
  Soup,
  Sandwich,
  CakeSlice,
  IceCreamCone,
  CupSoda,
  Cookie,
  Fish,
  Coffee,
  Wheat,
  PartyPopper,
  GraduationCap,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-primary/90 to-deep-red",
  "from-deep-red to-primary",
  "from-charcoal to-soft-black",
  "from-primary to-charcoal",
  "from-deep-red to-charcoal",
];

const ICONS = {
  pizza: Pizza,
  burger: Sandwich,
  grill: Beef,
  soup: Soup,
  cake: CakeSlice,
  dessert: IceCreamCone,
  drink: CupSoda,
  pastry: Cookie,
  seafood: Fish,
  coffee: Coffee,
  swallow: Wheat,
  event: PartyPopper,
  academy: GraduationCap,
  hall: Building2,
  default: UtensilsCrossed,
} as const;

export type FoodIconKey = keyof typeof ICONS;

function hashSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface FoodImageProps {
  name: string;
  icon?: FoodIconKey;
  className?: string;
  iconClassName?: string;
}

export function FoodImage({ name, icon = "default", className, iconClassName }: FoodImageProps) {
  const gradient = GRADIENTS[hashSeed(name) % GRADIENTS.length];
  const Icon = ICONS[icon];

  return (
    <div
      className={cn(
        "food-image-art relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
      role="img"
      aria-label={name}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 0%, transparent 35%), radial-gradient(circle at 80% 70%, white 0%, transparent 30%)",
        }}
        aria-hidden="true"
      />
      <Icon className={cn("food-image-icon relative h-10 w-10 text-white/90", iconClassName)} strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}
