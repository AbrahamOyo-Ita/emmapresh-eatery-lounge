import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId, generateOrderReference } from "@/lib/utils";
import type { BranchSlug } from "@/types";
import { patchEntity, persistEntity } from "@/lib/backend-client";

export type MealPlanStatus = "active" | "paused" | "cancelled";

export interface MealPlanSubscription {
  id: string;
  reference: string;
  branchSlug: BranchSlug;
  customerName: string;
  phone: string;
  email: string;
  mealsPerWeek: number;
  preferredDays: string;
  budgetRange: string;
  allergies?: string;
  status: MealPlanStatus;
  createdAt: string;
}

interface MealPlansState {
  subscriptions: MealPlanSubscription[];
  setSubscriptions: (subscriptions: MealPlanSubscription[]) => void;
  createSubscription: (input: Omit<MealPlanSubscription, "id" | "reference" | "status" | "createdAt">) => MealPlanSubscription;
  updateStatus: (id: string, status: MealPlanStatus) => void;
}

export const useMealPlansStore = create<MealPlansState>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      setSubscriptions: (subscriptions) => set({ subscriptions }),
      createSubscription: (input) => {
        const subscription: MealPlanSubscription = {
          ...input,
          id: generateId("mealplan"),
          reference: generateOrderReference("MP"),
          status: "active",
          createdAt: new Date().toISOString(),
        };
        set({ subscriptions: [subscription, ...get().subscriptions] });
        persistEntity("meal-plans", subscription);
        return subscription;
      },
      updateStatus: (id, status) => {
        set({ subscriptions: get().subscriptions.map((s) => (s.id === id ? { ...s, status } : s)) });
        patchEntity("meal-plans", id, { status });
      },
    }),
    { name: "emmapresh-meal-plans" }
  )
);
