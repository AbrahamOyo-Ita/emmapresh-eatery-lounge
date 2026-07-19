import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CateringRequest, CateringStatus } from "@/types";
import { generateOrderReference, generateId } from "@/lib/utils";
import { seedCateringRequests } from "@/data/catering-seed";
import { patchEntity, persistEntity } from "@/lib/backend-client";

interface CateringState {
  requests: CateringRequest[];
  setRequests: (requests: CateringRequest[]) => void;
  createRequest: (input: Omit<CateringRequest, "id" | "reference" | "status" | "createdAt">) => CateringRequest;
  updateStatus: (id: string, status: CateringStatus) => void;
  setQuote: (id: string, amount: number) => void;
}

export const useCateringStore = create<CateringState>()(
  persist(
    (set, get) => ({
      requests: seedCateringRequests,
      setRequests: (requests) => set({ requests }),
      createRequest: (input) => {
        const request: CateringRequest = {
          ...input,
          id: generateId("catering"),
          reference: generateOrderReference("CT"),
          status: "enquiry-received",
          createdAt: new Date().toISOString(),
        };
        set({ requests: [request, ...get().requests] });
        persistEntity("catering", request);
        return request;
      },
      updateStatus: (id, status) => {
        set({ requests: get().requests.map((r) => (r.id === id ? { ...r, status } : r)) });
        patchEntity("catering", id, { status });
      },
      setQuote: (id, amount) => {
        set({
          requests: get().requests.map((r) =>
            r.id === id ? { ...r, quotedAmount: amount, status: "quotation-sent" } : r
          ),
        });
        patchEntity("catering", id, { quotedAmount: amount, status: "quotation-sent" });
      },
    }),
    { name: "emmapresh-catering" }
  )
);
