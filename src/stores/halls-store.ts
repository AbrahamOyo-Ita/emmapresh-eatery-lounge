import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HallEnquiry, HallBookingStatus } from "@/types";
import { generateOrderReference, generateId } from "@/lib/utils";
import { seedHallEnquiries } from "@/data/hall-enquiries-seed";

interface HallsState {
  enquiries: HallEnquiry[];
  createEnquiry: (input: Omit<HallEnquiry, "id" | "reference" | "status" | "createdAt">) => HallEnquiry;
  updateStatus: (id: string, status: HallBookingStatus) => void;
}

export const useHallsStore = create<HallsState>()(
  persist(
    (set, get) => ({
      enquiries: seedHallEnquiries,
      createEnquiry: (input) => {
        const enquiry: HallEnquiry = {
          ...input,
          id: generateId("hall"),
          reference: generateOrderReference("EV"),
          status: "enquiry-received",
          createdAt: new Date().toISOString(),
        };
        set({ enquiries: [enquiry, ...get().enquiries] });
        return enquiry;
      },
      updateStatus: (id, status) => {
        set({ enquiries: get().enquiries.map((e) => (e.id === id ? { ...e, status } : e)) });
      },
    }),
    { name: "emmapresh-halls" }
  )
);
