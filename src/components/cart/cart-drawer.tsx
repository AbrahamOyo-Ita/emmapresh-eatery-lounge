"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { buttonVariants } from "@/components/ui/button";
import { FoodImage } from "@/components/ui/food-image";
import { useCartStore } from "@/stores/cart-store";
import { formatCurrency, cn } from "@/lib/utils";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <Drawer open={open} onClose={onClose} title={`Your Cart (${items.length})`}>
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-soft">
            <ShoppingBag className="h-7 w-7 text-body" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-lg">Your cart is empty</p>
            <p className="mt-1 text-sm text-body">Add something delicious from the menu to get started.</p>
          </div>
          <Link href="/menu" onClick={onClose} className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {items.map((item) => (
              <li key={item.cartItemId} className="flex gap-3 rounded-2xl border border-border/70 p-3">
                <FoodImage name={item.name} className="h-16 w-16 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-charcoal">{item.name}</p>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      aria-label={`Remove ${item.name}`}
                      className="focus-ring shrink-0 text-body hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  {item.selectedOptions.length > 0 && (
                    <p className="mt-0.5 truncate text-xs text-body">
                      {item.selectedOptions.map((o) => o.choiceLabel).join(", ")}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-full border border-border">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease quantity"
                        className="focus-ring flex h-7 w-7 items-center justify-center rounded-full hover:bg-cream-soft"
                      >
                        <Minus className="h-3 w-3" aria-hidden="true" />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="focus-ring flex h-7 w-7 items-center justify-center rounded-full hover:bg-cream-soft"
                      >
                        <Plus className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-charcoal">{formatCurrency(item.lineTotal)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border p-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-body">Subtotal</span>
              <span className="font-display text-lg">{formatCurrency(subtotal())}</span>
            </div>
            <p className="mb-4 text-xs text-body">Delivery fee and service charge are calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={onClose}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}
