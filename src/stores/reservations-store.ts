import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Reservation, ReservationStatus } from "@/types";
import { generateOrderReference, generateId } from "@/lib/utils";
import { seedReservations } from "@/data/reservations-seed";

interface ReservationsState {
  reservations: Reservation[];
  createReservation: (input: Omit<Reservation, "id" | "reference" | "status" | "createdAt">) => Reservation;
  updateStatus: (id: string, status: ReservationStatus) => void;
}

export const useReservationsStore = create<ReservationsState>()(
  persist(
    (set, get) => ({
      reservations: seedReservations,
      createReservation: (input) => {
        const reservation: Reservation = {
          ...input,
          id: generateId("reservation"),
          reference: generateOrderReference("RSV"),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set({ reservations: [reservation, ...get().reservations] });
        return reservation;
      },
      updateStatus: (id, status) => {
        set({ reservations: get().reservations.map((r) => (r.id === id ? { ...r, status } : r)) });
      },
    }),
    { name: "emmapresh-reservations" }
  )
);
