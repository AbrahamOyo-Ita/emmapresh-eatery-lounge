import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StockStatus } from "@/types";
import { patchEntity } from "@/lib/backend-client";

interface MenuStatusState {
  overrides: Record<string, StockStatus>;
  setOverrides: (overrides: Record<string, StockStatus>) => void;
  setStatus: (itemId: string, status: StockStatus) => void;
  statusFor: (itemId: string, fallback: StockStatus) => StockStatus;
}

export const useMenuStatusStore = create<MenuStatusState>()(
  persist(
    (set, get) => ({
      overrides: {},
      setOverrides: (overrides) => set({ overrides }),
      setStatus: (itemId, status) => {
        set({ overrides: { ...get().overrides, [itemId]: status } });
        patchEntity("menu-status", itemId, { stockStatus: status });
      },
      statusFor: (itemId, fallback) => get().overrides[itemId] ?? fallback,
    }),
    { name: "emmapresh-menu-status" }
  )
);
