import { create } from "zustand";
import { persist } from "zustand/middleware";
import { promotions as initialPromotions, type Promotion } from "@/data/promotions";
import { generateId } from "@/lib/utils";

interface PromotionsState {
  promotions: Promotion[];
  setPromotions: (promotions: Promotion[]) => void;
  addPromotion: (promotion: Omit<Promotion, "id">) => void;
  removePromotion: (id: string) => void;
}

export const usePromotionsStore = create<PromotionsState>()(
  persist(
    (set, get) => ({
      promotions: initialPromotions,
      setPromotions: (promotions) => set({ promotions }),
      addPromotion: (promotion) => { const item = { ...promotion, id: generateId("promo") }; set({ promotions: [item, ...get().promotions] }); void fetch("/api/admin/workspace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table: "promotions", operation: "upsert", data: { id: item.id, title: item.title, description: item.description, code: item.code, discount: item.discount, valid_until: item.validUntil, active: true } }) }); },
      removePromotion: (id) => { set({ promotions: get().promotions.filter((promotion) => promotion.id !== id) }); void fetch("/api/admin/workspace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table: "promotions", operation: "delete", data: { id } }) }); },
    }),
    { name: "emmapresh-promotions" }
  )
);
