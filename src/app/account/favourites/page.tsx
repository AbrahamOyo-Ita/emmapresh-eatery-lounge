"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { AccountNav } from "@/components/account/account-nav";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { useFavouritesStore } from "@/stores/favourites-store";
import { menuItems } from "@/data/menu-items";
import { menuCategories } from "@/data/categories";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";

export default function AccountFavouritesPage() {
  const itemIds = useFavouritesStore((s) => s.itemIds);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (!hydrated) return null;

  const favourites = menuItems.filter((item) => itemIds.includes(item.id));
  const averagePrice = favourites.length > 0 ? favourites.reduce((sum, item) => sum + item.price, 0) / favourites.length : 0;
  const categories = menuCategories
    .map((category) => ({
      name: category.name,
      count: favourites.filter((item) => item.categorySlug === category.slug).length,
    }))
    .filter((category) => category.count > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="mb-6 font-display text-3xl text-charcoal">My Account</h1>
      <AccountNav />

      <div className="mt-8 space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-2xl text-charcoal">{favourites.length}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-body">Saved items</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <ShoppingBag className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-2xl text-charcoal">{categories.length}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-body">Categories</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <Star className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-2xl text-charcoal">{formatCurrency(Math.round(averagePrice))}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-body">Average item price</p>
          </div>
        </section>

        {favourites.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-white px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-soft">
              <Heart className="h-7 w-7 text-body" aria-hidden="true" />
            </span>
            <p className="mt-4 font-display text-lg text-charcoal">No favourites yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-body">Tap the heart icon on meals, drinks or cakes to build a quick reorder list.</p>
            <Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>Browse Menu</Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="rounded-2xl border border-border/60 bg-white p-5">
              <h2 className="font-display text-base text-charcoal">Saved Breakdown</h2>
              <div className="mt-4 space-y-2">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between rounded-xl bg-cream-soft/60 px-3 py-2 text-sm">
                    <span className="text-charcoal">{category.name}</span>
                    <span className="font-bold text-primary">{category.count}</span>
                  </div>
                ))}
              </div>
              <Link href="/menu" className="focus-ring mt-5 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-deep">
                Add more items
              </Link>
            </aside>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {favourites.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
