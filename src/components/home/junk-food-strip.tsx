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
    <section className="motion-section bg-primary-deep py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Cravings" title="Junk Food & Cravings" cta={{ label: "See All", href: "/menu/pizza" }} tone="dark" />
        <div className="motion-grid grid grid-cols-4 gap-3 sm:grid-cols-8">
          {junkFood.map((food) => (
            <Link key={food.name} href={food.href} className="focus-ring group flex flex-col items-center gap-2 text-center">
              <FoodImage name={food.name} icon={food.icon} className="h-14 w-14 rounded-card transition-transform group-hover:-translate-y-0.5 sm:h-16 sm:w-16" iconClassName="h-6 w-6" />
              <span className="text-xs font-semibold text-white/85">{food.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
