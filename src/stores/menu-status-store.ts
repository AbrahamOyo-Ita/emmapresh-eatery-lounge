import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StockStatus } from "@/types";

interface MenuStatusState {
  overrides: Record<string, StockStatus>;
  setStatus: (itemId: string, status: StockStatus) => void;
  statusFor: (itemId: string, fallback: StockStatus) => StockStatus;
}

export const useMenuStatusStore = create<MenuStatusState>()(
  persist(
    (set, get) => ({
      overrides: {},
      setStatus: (itemId, status) => set({ overrides: { ...get().overrides, [itemId]: status } }),
      statusFor: (itemId, fallback) => get().overrides[itemId] ?? fallback,
    }),
    { name: "emmapresh-menu-status" }
  )
);
