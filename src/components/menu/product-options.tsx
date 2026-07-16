"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useCartStore } from "@/stores/cart-store";
import { useBranchStore } from "@/stores/branch-store";
import { priceForBranch } from "@/services/menu-service";
import { formatCurrency, cn } from "@/lib/utils";
import type { MenuItem } from "@/types";

export function ProductOptions({ item }: { item: MenuItem }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const branchSlug = useBranchStore((s) => s.selectedBranch) ?? "lagos";
  const basePrice = priceForBranch(item, branchSlug);

  const [selections, setSelections] = React.useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    for (const group of item.optionGroups) {
      if (group.required && !group.multiple) initial[group.id] = [group.choices[0].id];
    }
    return initial;
  });
  const [quantity, setQuantity] = React.useState(1);
  const [instructions, setInstructions] = React.useState("");
  const [ageConfirmOpen, setAgeConfirmOpen] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function toggleChoice(group: MenuItem["optionGroups"][number], choiceId: string) {
    setSelections((prev) => {
      const current = prev[group.id] ?? [];
      if (group.multiple) {
        const next = current.includes(choiceId) ? current.filter((c) => c !== choiceId) : [...current, choiceId];
        return { ...prev, [group.id]: next };
      }
      return { ...prev, [group.id]: [choiceId] };
    });
  }

  const selectedOptionDetails = item.optionGroups.flatMap((group) =>
    (selections[group.id] ?? []).map((choiceId) => {
      const choice = group.choices.find((c) => c.id === choiceId)!;
      return {
        groupId: group.id,
        groupLabel: group.label,
        choiceId: choice.id,
        choiceLabel: choice.label,
        priceModifier: choice.priceModifier,
      };
    })
  );

  const optionsTotal = selectedOptionDetails.reduce((sum, o) => sum + o.priceModifier, 0);
  const total = (basePrice + optionsTotal) * quantity;

  function validateRequired() {
    const missing = item.optionGroups.find((g) => g.required && (selections[g.id]?.length ?? 0) === 0);
    if (missing) {
      setError(`Please select an option for "${missing.label}".`);
      return false;
    }
    setError(null);
    return true;
  }

  function performAdd() {
    addItem({
      menuItemId: item.id,
      slug: item.slug,
      name: item.name,
      image: item.image,
      branchSlug,
      unitPrice: basePrice,
      quantity,
      selectedOptions: selectedOptionDetails,
      specialInstructions: instructions || undefined,
    });
  }

  function handleAddToCart() {
    if (!validateRequired()) return;
    if (item.requiresAgeConfirmation) {
      setAgeConfirmOpen(true);
      return;
    }
    performAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (!validateRequired()) return;
    if (item.requiresAgeConfirmation) {
      setAgeConfirmOpen(true);
      return;
    }
    performAdd();
    router.push("/checkout");
  }

  function confirmAge() {
    setAgeConfirmOpen(false);
    performAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div>
      {item.optionGroups.map((group) => (
        <div key={group.id} className="mb-6">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-charcoal">
            {group.label}
            {group.required && <span className="text-xs font-normal text-body">(required)</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.choices.map((choice) => {
              const isSelected = (selections[group.id] ?? []).includes(choice.id);
              return (
                <button
                  key={choice.id}
                  onClick={() => toggleChoice(group, choice.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "focus-ring rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                    isSelected ? "border-primary bg-primary text-white" : "border-border text-charcoal hover:border-charcoal"
                  )}
                >
                  {choice.label}
                  {choice.priceModifier > 0 && ` (+${formatCurrency(choice.priceModifier)})`}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mb-6">
        <label htmlFor="special-instructions" className="mb-2 block text-sm font-semibold text-charcoal">
          Special Instructions
        </label>
        <Textarea
          id="special-instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="E.g. less spicy, no onions..."
        />
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm font-medium text-error">
          {error}
        </p>
      )}

      <div className="mb-6 flex items-center gap-4">
        <span className="text-sm font-semibold text-charcoal">Quantity</span>
        <div className="flex items-center gap-1 rounded-full border border-border">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-soft"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <span className="w-8 text-center text-sm font-bold" aria-live="polite">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-soft"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between rounded-2xl bg-cream-soft px-5 py-4">
        <span className="text-sm font-semibold text-charcoal">Total</span>
        <span className="font-display text-xl text-charcoal">{formatCurrency(total)}</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" variant={added ? "outline" : "primary"} className="flex-1" onClick={handleAddToCart}>
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </Button>
        <Button size="lg" variant="accent" className="flex-1" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>

      <Dialog open={ageConfirmOpen} onClose={() => setAgeConfirmOpen(false)} title="Age Confirmation">
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3 text-warning">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
            <p className="font-display text-base text-charcoal">You must be 18+ to order this item</p>
          </div>
          <p className="mb-6 text-sm text-body">
            This item contains alcohol. By confirming, you declare that you are 18 years or older.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setAgeConfirmOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={confirmAge}>
              I am 18 or older
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
