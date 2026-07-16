"use client";

import * as React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { AccountNav } from "@/components/account/account-nav";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { useFavouritesStore } from "@/stores/favourites-store";
import { menuItems } from "@/data/menu-items";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AccountFavouritesPage() {
  const itemIds = useFavouritesStore((s) => s.itemIds);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  const favourites = menuItems.filter((item) => itemIds.includes(item.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="mb-6 font-display text-3xl text-charcoal">My Account</h1>
      <AccountNav />

      <div className="mt-8">
        {favourites.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-soft">
              <Heart className="h-7 w-7 text-body" aria-hidden="true" />
            </span>
            <p className="font-display text-lg text-charcoal">No favourites yet</p>
            <p className="text-sm text-body">Tap the heart icon on any menu item to save it here.</p>
            <Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>Browse Menu</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {favourites.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
