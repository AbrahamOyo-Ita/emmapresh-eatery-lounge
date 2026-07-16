import Link from "next/link";
import { SectionHeading } from "./section-heading";
import { FoodImage } from "@/components/ui/food-image";
import type { FoodIconKey } from "@/components/ui/food-image";

const junkFood: { name: string; href: string; icon: FoodIconKey }[] = [
  { name: "Pizza", href: "/menu/pizza", icon: "pizza" },
  { name: "Burgers", href: "/menu/burgers", icon: "burger" },
  { name: "Shawarma", href: "/menu/shawarma", icon: "burger" },
  { name: "Doughnuts", href: "/menu/doughnuts", icon: "dessert" },
  { name: "Chicken Wings", href: "/menu/snacks", icon: "grill" },
  { name: "Loaded Fries", href: "/menu/snacks", icon: "default" },
  { name: "Sandwiches", href: "/menu/burgers", icon: "burger" },
  { name: "Small Chops", href: "/menu/snacks", icon: "pastry" },
];

export function JunkFoodStrip() {
  return (
    <section className="bg-cream-soft py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Cravings" title="Junk Food & Cravings" cta={{ label: "See All", href: "/menu/pizza" }} />
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {junkFood.map((food) => (
            <Link key={food.name} href={food.href} className="focus-ring group flex flex-col items-center gap-2 text-center">
              <FoodImage name={food.name} icon={food.icon} className="h-16 w-16 rounded-2xl transition-transform group-hover:-translate-y-1 sm:h-20 sm:w-20" iconClassName="h-7 w-7" />
              <span className="text-xs font-semibold text-charcoal">{food.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
