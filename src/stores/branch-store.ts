import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BranchSlug } from "@/types";

interface BranchState {
  selectedBranch: BranchSlug | null;
  hasChosenBranch: boolean;
  setBranch: (branch: BranchSlug) => void;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      selectedBranch: null,
      hasChosenBranch: false,
      setBranch: (branch) => set({ selectedBranch: branch, hasChosenBranch: true }),
    }),
    { name: "emmapresh-branch" }
  )
);
