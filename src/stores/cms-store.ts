import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";

export type CmsStatus = "draft" | "review" | "published";
export type CmsContentType = "page" | "hero" | "announcement" | "media";

export interface CmsEntry {
  id: string;
  type: CmsContentType;
  title: string;
  slug: string;
  status: CmsStatus;
  section: string;
  summary: string;
  imagePath?: string;
  updatedAt: string;
}

interface CmsState {
  entries: CmsEntry[];
  addEntry: (input: Omit<CmsEntry, "id" | "updatedAt">) => void;
  updateEntry: (id: string, patch: Partial<Omit<CmsEntry, "id">>) => void;
}

export const useCmsStore = create<CmsState>()(
  persist(
    (set, get) => ({
      entries: [
        {
          id: "cms-home-hero",
          type: "hero",
          title: "Homepage Hero",
          slug: "home-hero",
          status: "published",
          section: "Homepage",
          summary: "Primary first-screen copy and artwork slot for EmmaPresh.",
          imagePath: "/images/hero/emmapresh-hero.jpg",
          updatedAt: "2026-07-18T09:00:00.000Z",
        },
        {
          id: "cms-offers",
          type: "page",
          title: "Offers Page",
          slug: "offers",
          status: "published",
          section: "Marketing",
          summary: "Current promotions, discount messaging, and campaign blocks.",
          updatedAt: "2026-07-18T09:00:00.000Z",
        },
        {
          id: "cms-gallery",
          type: "media",
          title: "Gallery Collection",
          slug: "gallery",
          status: "review",
          section: "Media",
          summary: "Food, cakes, hall, academy and branch image inventory.",
          imagePath: "/images/gallery/",
          updatedAt: "2026-07-18T09:00:00.000Z",
        },
      ],
      addEntry: (input) =>
        set({
          entries: [{ ...input, id: generateId("cms"), updatedAt: new Date().toISOString() }, ...get().entries],
        }),
      updateEntry: (id, patch) =>
        set({
          entries: get().entries.map((entry) =>
            entry.id === id ? { ...entry, ...patch, updatedAt: new Date().toISOString() } : entry
          ),
        }),
    }),
    { name: "emmapresh-cms" }
  )
);
