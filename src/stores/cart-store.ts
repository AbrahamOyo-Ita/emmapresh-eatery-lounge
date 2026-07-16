import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartItemSelectedOption } from "@/types";
import { generateId } from "@/lib/utils";

interface AddItemInput {
  menuItemId: string;
  slug: string;
  name: string;
  image: string;
  branchSlug: CartItem["branchSlug"];
  unitPrice: number;
  quantity: number;
  selectedOptions: CartItemSelectedOption[];
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (input: AddItemInput) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateInstructions: (cartItemId: string, instructions: string) => void;
  clearCart: () => void;
  subtotal: () => number;
}

function computeLineTotal(unitPrice: number, options: CartItemSelectedOption[], quantity: number) {
  const optionsTotal = options.reduce((sum, o) => sum + o.priceModifier, 0);
  return (unitPrice + optionsTotal) * quantity;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (input) => {
        const cartItemId = generateId("cart");
        const lineTotal = computeLineTotal(input.unitPrice, input.selectedOptions, input.quantity);
        const newItem: CartItem = { ...input, cartItemId, lineTotal };
        set({ items: [...get().items, newItem] });
      },
      removeItem: (cartItemId) => {
        set({ items: get().items.filter((i) => i.cartItemId !== cartItemId) });
      },
      updateQuantity: (cartItemId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.cartItemId === cartItemId
              ? {
                  ...item,
                  quantity,
                  lineTotal: computeLineTotal(item.unitPrice, item.selectedOptions, quantity),
                }
              : item
          ),
        });
      },
      updateInstructions: (cartItemId, instructions) => {
        set({
          items: get().items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, specialInstructions: instructions } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, item) => sum + item.lineTotal, 0),
    }),
    { name: "emmapresh-cart" }
  )
);
