import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CustomCakeRequest, CakeOrderStatus } from "@/types";
import { generateOrderReference, generateId } from "@/lib/utils";
import { seedCakeRequests } from "@/data/cake-requests-seed";
import { patchEntity, persistEntity } from "@/lib/backend-client";

interface CakeRequestsState {
  requests: CustomCakeRequest[];
  setRequests: (requests: CustomCakeRequest[]) => void;
  createRequest: (input: Omit<CustomCakeRequest, "id" | "reference" | "status" | "createdAt">) => CustomCakeRequest;
  setReferenceImages: (id: string, referenceImages: string[]) => void;
  updateStatus: (id: string, status: CakeOrderStatus) => void;
  setQuote: (id: string, amount: number) => void;
}

export const useCakeRequestsStore = create<CakeRequestsState>()(
  persist(
    (set, get) => ({
      requests: seedCakeRequests,
      setRequests: (requests) => set({ requests }),
      createRequest: (input) => {
        const request: CustomCakeRequest = {
          ...input,
          id: generateId("cakereq"),
          reference: generateOrderReference("CK"),
          status: "request-received",
          createdAt: new Date().toISOString(),
        };
        set({ requests: [request, ...get().requests] });
        persistEntity("cake-requests", request);
        return request;
      },
      setReferenceImages: (id, referenceImages) => {
        set({ requests: get().requests.map((r) => (r.id === id ? { ...r, referenceImages } : r)) });
        patchEntity("cake-requests", id, { referenceImages });
      },
      updateStatus: (id, status) => {
        set({ requests: get().requests.map((r) => (r.id === id ? { ...r, status } : r)) });
        patchEntity("cake-requests", id, { status });
      },
      setQuote: (id, amount) => {
        set({
          requests: get().requests.map((r) =>
            r.id === id ? { ...r, quotedAmount: amount, status: "quotation-sent" } : r
          ),
        });
        patchEntity("cake-requests", id, { quotedAmount: amount, status: "quotation-sent" });
      },
    }),
    { name: "emmapresh-cake-requests" }
  )
);
