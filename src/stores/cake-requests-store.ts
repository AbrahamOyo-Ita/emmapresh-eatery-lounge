import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CustomCakeRequest, CakeOrderStatus } from "@/types";
import { generateOrderReference, generateId } from "@/lib/utils";
import { seedCakeRequests } from "@/data/cake-requests-seed";

interface CakeRequestsState {
  requests: CustomCakeRequest[];
  createRequest: (input: Omit<CustomCakeRequest, "id" | "reference" | "status" | "createdAt">) => CustomCakeRequest;
  updateStatus: (id: string, status: CakeOrderStatus) => void;
  setQuote: (id: string, amount: number) => void;
}

export const useCakeRequestsStore = create<CakeRequestsState>()(
  persist(
    (set, get) => ({
      requests: seedCakeRequests,
      createRequest: (input) => {
        const request: CustomCakeRequest = {
          ...input,
          id: generateId("cakereq"),
          reference: generateOrderReference("CK"),
          status: "request-received",
          createdAt: new Date().toISOString(),
        };
        set({ requests: [request, ...get().requests] });
        return request;
      },
      updateStatus: (id, status) => {
        set({ requests: get().requests.map((r) => (r.id === id ? { ...r, status } : r)) });
      },
      setQuote: (id, amount) => {
        set({
          requests: get().requests.map((r) =>
            r.id === id ? { ...r, quotedAmount: amount, status: "quotation-sent" } : r
          ),
        });
      },
    }),
    { name: "emmapresh-cake-requests" }
  )
);
