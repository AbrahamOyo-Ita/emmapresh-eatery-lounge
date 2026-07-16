"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { useBranchStore } from "@/stores/branch-store";
import { formatCurrency } from "@/lib/utils";
import type { Cake } from "@/types";
import * as React from "react";

export function CakeCard({ cake }: { cake: Cake }) {
  const addItem = useCartStore((s) => s.addItem);
  const branchSlug = useBranchStore((s) => s.selectedBranch) ?? "lagos";
  const [added, setAdded] = React.useState(false);

  function handleAdd() {
    addItem({
      menuItemId: cake.id,
      slug: cake.slug,
      name: cake.name,
      image: cake.image,
      branchSlug,
      unitPrice: cake.price,
      quantity: 1,
      selectedOptions: [],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group overflow-hidden rounded-card border border-border/60 bg-white shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1">
      <Link href={`/cakes/${cake.slug}`}>
        <div className="relative">
          <FoodImage name={cake.name} icon="cake" className="h-40 w-full" />
          {cake.sameDayPickup && (
            <span className="absolute left-2.5 top-2.5">
              <Badge variant="accent">Same-Day Pickup</Badge>
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/cakes/${cake.slug}`}>
          <h3 className="font-display text-sm text-charcoal">{cake.name}</h3>
        </Link>
        <p className="mt-1 text-xs text-body">{cake.sizeLabel} · {cake.flavour}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-body">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
          {cake.rating}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-base text-charcoal">{formatCurrency(cake.price)}</span>
          <button
            onClick={handleAdd}
            className={`focus-ring rounded-full px-3 py-2 text-xs font-semibold text-white ${added ? "bg-success" : "bg-primary hover:bg-primary-deep"}`}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
