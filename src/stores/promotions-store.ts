import { create } from "zustand";
import { persist } from "zustand/middleware";
import { promotions as initialPromotions, type Promotion } from "@/data/promotions";
import { generateId } from "@/lib/utils";

interface PromotionsState {
  promotions: Promotion[];
  addPromotion: (promotion: Omit<Promotion, "id">) => void;
  removePromotion: (id: string) => void;
}

export const usePromotionsStore = create<PromotionsState>()(
  persist(
    (set, get) => ({
      promotions: initialPromotions,
      addPromotion: (promotion) => set({ promotions: [{ ...promotion, id: generateId("promo") }, ...get().promotions] }),
      removePromotion: (id) => set({ promotions: get().promotions.filter((promotion) => promotion.id !== id) }),
    }),
    { name: "emmapresh-promotions" }
  )
);
