import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HallEnquiry, HallBookingStatus } from "@/types";
import { generateOrderReference, generateId } from "@/lib/utils";
import { seedHallEnquiries } from "@/data/hall-enquiries-seed";
import { patchEntity, persistEntity } from "@/lib/backend-client";

interface HallsState {
  enquiries: HallEnquiry[];
  setEnquiries: (enquiries: HallEnquiry[]) => void;
  createEnquiry: (input: Omit<HallEnquiry, "id" | "reference" | "status" | "createdAt">) => HallEnquiry;
  updateStatus: (id: string, status: HallBookingStatus) => void;
}

export const useHallsStore = create<HallsState>()(
  persist(
    (set, get) => ({
      enquiries: seedHallEnquiries,
      setEnquiries: (enquiries) => set({ enquiries }),
      createEnquiry: (input) => {
        const enquiry: HallEnquiry = {
          ...input,
          id: generateId("hall"),
          reference: generateOrderReference("EV"),
          status: "enquiry-received",
          createdAt: new Date().toISOString(),
        };
        set({ enquiries: [enquiry, ...get().enquiries] });
        persistEntity("halls", enquiry);
        return enquiry;
      },
      updateStatus: (id, status) => {
        set({ enquiries: get().enquiries.map((e) => (e.id === id ? { ...e, status } : e)) });
        patchEntity("halls", id, { status });
      },
    }),
    { name: "emmapresh-halls" }
  )
);
