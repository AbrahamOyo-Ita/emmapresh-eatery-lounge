import type { Metadata } from "next";
import Link from "next/link";
import { LitreMealCard } from "@/components/menu/litre-meal-card";
import { buttonVariants } from "@/components/ui/button";
import { menuItems } from "@/data/menu-items";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Meals by Litre",
  description: "Order soups, stews, rice and proteins by the litre — perfect for busy professionals and families.",
};

export default function LitreMealsPage() {
  const litreEligible = menuItems.filter((item) =>
    ["soups", "rice-dishes", "local-meals", "family-meals"].includes(item.categorySlug)
  );

  return (
    <div>
      <div className="bg-cream-soft/60 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Meals by Litre</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-body">
            Soups, stews, sauces and rice — portioned by the litre for busy professionals and families who don&apos;t
            have time to cook. Choose your size, add to cart, and pick your delivery date at checkout.
          </p>
          <Link href="/meal-plans" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-6")}>
            Explore Weekly Meal Plans
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {litreEligible.map((item) => (
            <LitreMealCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
