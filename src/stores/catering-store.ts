import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CateringRequest, CateringStatus } from "@/types";
import { generateOrderReference, generateId } from "@/lib/utils";
import { seedCateringRequests } from "@/data/catering-seed";

interface CateringState {
  requests: CateringRequest[];
  createRequest: (input: Omit<CateringRequest, "id" | "reference" | "status" | "createdAt">) => CateringRequest;
  updateStatus: (id: string, status: CateringStatus) => void;
  setQuote: (id: string, amount: number) => void;
}

export const useCateringStore = create<CateringState>()(
  persist(
    (set, get) => ({
      requests: seedCateringRequests,
      createRequest: (input) => {
        const request: CateringRequest = {
          ...input,
          id: generateId("catering"),
          reference: generateOrderReference("CT"),
          status: "enquiry-received",
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
    { name: "emmapresh-catering" }
  )
);
