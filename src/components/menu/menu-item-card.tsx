"use client";

import Link from "next/link";
import { Star, Clock, Plus, Heart } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { useBranchStore } from "@/stores/branch-store";
import { useMenuStatusStore } from "@/stores/menu-status-store";
import { useFavouritesStore } from "@/stores/favourites-store";
import { priceForBranch } from "@/services/menu-service";
import { iconForCategory } from "@/lib/food-icon";
import { formatCurrency, cn } from "@/lib/utils";
import * as React from "react";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const addItem = useCartStore((s) => s.addItem);
  const branchSlug = useBranchStore((s) => s.selectedBranch) ?? "lagos";
  const stockStatus = useMenuStatusStore((s) => s.statusFor(item.id, item.stockStatus));
  const favourited = useFavouritesStore((s) => s.isFavourited(item.id));
  const toggleFavourite = useFavouritesStore((s) => s.toggle);
  const [added, setAdded] = React.useState(false);

  const price = priceForBranch(item, branchSlug);
  const hasRequiredOptions = item.optionGroups.some((g) => g.required);
  const soldOut = stockStatus === "sold-out";

  function handleQuickAdd() {
    if (soldOut || hasRequiredOptions) return;
    addItem({
      menuItemId: item.id,
      slug: item.slug,
      name: item.name,
      image: item.image,
      branchSlug,
      unitPrice: price,
      quantity: 1,
      selectedOptions: [],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-card border border-border/60 bg-white shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <Link href={`/menu/item/${item.slug}`} className="focus-ring block">
        <div className="relative">
          <FoodImage name={item.name} icon={iconForCategory(item.categorySlug)} className="h-40 w-full" />
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            {item.isPopular && <Badge variant="primary">Popular</Badge>}
            {item.isNew && <Badge variant="accent">New</Badge>}
            {soldOut && <Badge variant="error">Sold Out</Badge>}
            {stockStatus === "low-stock" && <Badge variant="warning">Low Stock</Badge>}
          </div>
        </div>
      </Link>
      <button
        onClick={() => toggleFavourite(item.id)}
        aria-pressed={favourited}
        aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
        className="focus-ring absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm hover:scale-105"
      >
        <Heart className={cn("h-4 w-4", favourited && "fill-primary text-primary")} aria-hidden="true" />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/menu/item/${item.slug}`} className="focus-ring">
          <h3 className="font-display text-sm leading-snug text-charcoal">{item.name}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-xs text-body">{item.description}</p>

        <div className="mt-2 flex items-center gap-3 text-xs text-body">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
            {item.rating} ({item.reviewCount})
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {item.prepTimeMinutes} min
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-base text-charcoal">{formatCurrency(price)}</span>
          {soldOut ? (
            <span className="text-xs font-semibold text-error">Unavailable</span>
          ) : hasRequiredOptions ? (
            <Link
              href={`/menu/item/${item.slug}`}
              className="focus-ring rounded-full bg-cream-soft px-3 py-2 text-xs font-semibold text-charcoal hover:bg-border"
            >
              Customise
            </Link>
          ) : (
            <button
              onClick={handleQuickAdd}
              className={cn(
                "focus-ring flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors",
                added ? "bg-success" : "bg-primary hover:bg-primary-deep"
              )}
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
