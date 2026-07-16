import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { getMenuItems, getMenuCategories } from "@/services/menu-service";

export const metadata: Metadata = {
  title: "Drinks",
  description: "Juices, smoothies, mocktails, cocktails and more from EmmaPresh Eatery & Lounge.",
};

export default async function DrinksPage() {
  const [items, categories] = await Promise.all([getMenuItems(), getMenuCategories()]);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Drinks</h1>
        <p className="mt-2 max-w-xl text-sm text-body">
          Fresh juices, smoothies, mocktails and cocktails — some items require age confirmation.
        </p>
      </div>
      <MenuBrowser items={items} categories={categories} initialCategory="drinks" />
    </div>
  );
}
