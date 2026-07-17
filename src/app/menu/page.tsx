import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { getMenuItems, getMenuCategories } from "@/services/menu-service";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse local Nigerian dishes, pizza, burgers, shawarma, drinks and more from EmmaPresh Eatery & Lounge.",
};

export default async function MenuPage() {
  const [items, categories] = await Promise.all([getMenuItems(), getMenuCategories()]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:pt-16">
        <h1 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">Our Full Menu</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-body">
          From local Nigerian classics to pizza, burgers and drinks — everything is prepared fresh at your selected branch.
        </p>
      </div>
      <MenuBrowser items={items} categories={categories} />
    </div>
  );
}
