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
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Our Full Menu</h1>
        <p className="mt-2 max-w-xl text-sm text-body">
          From local Nigerian classics to pizza, burgers and drinks — everything is prepared fresh at your selected branch.
        </p>
      </div>
      <MenuBrowser items={items} categories={categories} />
    </div>
  );
}
