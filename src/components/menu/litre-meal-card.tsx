"use client";

import * as React from "react";
import { FoodImage } from "@/components/ui/food-image";
import { useCartStore } from "@/stores/cart-store";
import { useBranchStore } from "@/stores/branch-store";
import { priceForBranch } from "@/services/menu-service";
import { iconForCategory } from "@/lib/food-icon";
import { formatCurrency, cn } from "@/lib/utils";
import type { MenuItem } from "@/types";

const sizes = [
  { label: "1 Litre", multiplier: 1 },
  { label: "2 Litres", multiplier: 1.9 },
  { label: "3 Litres", multiplier: 2.7 },
  { label: "5 Litres", multiplier: 4.2 },
];

export function LitreMealCard({ item }: { item: MenuItem }) {
  const addItem = useCartStore((s) => s.addItem);
  const branchSlug = useBranchStore((s) => s.selectedBranch) ?? "lagos";
  const [sizeIndex, setSizeIndex] = React.useState(0);
  const [added, setAdded] = React.useState(false);

  const basePrice = priceForBranch(item, branchSlug);
  const price = Math.round((basePrice * sizes[sizeIndex].multiplier) / 100) * 100;

  function handleAdd() {
    addItem({
      menuItemId: item.id,
      slug: item.slug,
      name: item.name,
      image: item.image,
      branchSlug,
      unitPrice: price,
      quantity: 1,
      selectedOptions: [],
      specialInstructions: `Size: ${sizes[sizeIndex].label}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-card border border-border/60 bg-white shadow-[var(--shadow-soft)]">
      <FoodImage name={item.name} icon={iconForCategory(item.categorySlug)} className="h-36 w-full" />
      <div className="p-4">
        <h3 className="font-display text-sm text-charcoal">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-body">{item.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {sizes.map((size, i) => (
            <button
              key={size.label}
              onClick={() => setSizeIndex(i)}
              className={cn(
                "focus-ring rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold",
                i === sizeIndex ? "border-primary bg-primary text-white" : "border-border text-charcoal hover:border-charcoal"
              )}
            >
              {size.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-base text-charcoal">{formatCurrency(price)}</span>
          <button
            onClick={handleAdd}
            className={cn(
              "focus-ring rounded-full px-3 py-2 text-xs font-semibold text-white",
              added ? "bg-success" : "bg-primary hover:bg-primary-deep"
            )}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
