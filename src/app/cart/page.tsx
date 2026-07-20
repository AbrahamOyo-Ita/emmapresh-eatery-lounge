"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useCartStore } from "@/stores/cart-store";
import { formatCurrency, cn } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, updateInstructions, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-soft">
          <ShoppingBag className="h-9 w-9 text-body" aria-hidden="true" />
        </span>
        <h1 className="font-display text-2xl text-charcoal">Your cart is empty</h1>
        <p className="text-sm text-body">Looks like you haven&apos;t added anything yet. Explore the menu to get started.</p>
        <Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl text-charcoal">Your Cart</h1>
      <p className="mt-1 text-sm text-body">{items.length} item{items.length > 1 ? "s" : ""} in your cart</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.cartItemId} className="flex gap-3 rounded-card border border-border/60 bg-white p-3 sm:gap-4 sm:p-4">
              <FoodImage name={item.name} src={item.image} className="h-20 w-20 shrink-0 rounded-2xl sm:h-24 sm:w-24" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-base text-charcoal">{item.name}</p>
                    {item.selectedOptions.length > 0 && (
                      <p className="mt-0.5 text-xs text-body">
                        {item.selectedOptions.map((o) => o.choiceLabel).join(", ")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    aria-label={`Remove ${item.name}`}
                    className="focus-ring shrink-0 text-body hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <Textarea
                  value={item.specialInstructions ?? ""}
                  onChange={(e) => updateInstructions(item.cartItemId, e.target.value)}
                  placeholder="Add special instructions (optional)"
                  className="mt-2 min-h-0 py-2 text-xs"
                  rows={1}
                />

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border border-border">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                      aria-label="Decrease quantity"
                      className="focus-ring flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream-soft"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="focus-ring flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream-soft"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <span className="font-display text-base text-charcoal">{formatCurrency(item.lineTotal)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-card border border-border/60 bg-white p-6">
          <h2 className="font-display text-lg text-charcoal">Order Summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-body">Subtotal</span>
            <span className="font-semibold text-charcoal">{formatCurrency(subtotal())}</span>
          </div>
          <p className="mt-2 text-xs text-body">Delivery fee and service charge are calculated at checkout based on your branch and fulfilment method.</p>
          <Link href="/checkout" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-5 w-full")}>
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/menu" className="focus-ring mt-3 block text-center text-sm font-semibold text-charcoal hover:text-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
