"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useCartStore } from "@/stores/cart-store";
import { useBranchStore } from "@/stores/branch-store";
import { formatCurrency } from "@/lib/utils";
import type { Cake } from "@/types";

export function CakeAddToCart({ cake }: { cake: Cake }) {
  const addItem = useCartStore((s) => s.addItem);
  const branchSlug = useBranchStore((s) => s.selectedBranch) ?? "lagos";
  const [quantity, setQuantity] = React.useState(1);
  const [inscription, setInscription] = React.useState("");
  const [added, setAdded] = React.useState(false);

  function handleAdd() {
    addItem({
      menuItemId: cake.id,
      slug: cake.slug,
      name: cake.name,
      image: cake.image,
      branchSlug,
      unitPrice: cake.price,
      quantity,
      selectedOptions: [],
      specialInstructions: inscription ? `Inscription: "${inscription}"` : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div>
      <div className="mb-4">
        <Label htmlFor="inscription">Cake Inscription (optional)</Label>
        <Input id="inscription" value={inscription} onChange={(e) => setInscription(e.target.value)} placeholder="E.g. Happy Birthday Amara" maxLength={40} />
      </div>
      <div className="mb-6 flex items-center gap-4">
        <span className="text-sm font-semibold text-charcoal">Quantity</span>
        <div className="flex items-center gap-1 rounded-full border border-border">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="focus-ring flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-soft">
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <span className="w-8 text-center text-sm font-bold" aria-live="polite">{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity" className="focus-ring flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-soft">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <span className="ml-auto font-display text-lg text-charcoal">{formatCurrency(cake.price * quantity)}</span>
      </div>
      <Button size="lg" variant={added ? "outline" : "primary"} className="w-full" onClick={handleAdd}>
        {added ? "Added to Cart ✓" : "Add to Cart"}
      </Button>
    </div>
  );
}
