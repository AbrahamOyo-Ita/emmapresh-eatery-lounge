import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavouritesState {
  itemIds: string[];
  toggle: (itemId: string) => void;
  isFavourited: (itemId: string) => boolean;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      itemIds: [],
      toggle: (itemId) => {
        const current = get().itemIds;
        set({ itemIds: current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId] });
      },
      isFavourited: (itemId) => get().itemIds.includes(itemId),
    }),
    { name: "emmapresh-favourites" }
  )
);
