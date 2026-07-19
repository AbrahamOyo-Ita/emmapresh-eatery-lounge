import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Reservation, ReservationStatus } from "@/types";
import { generateOrderReference, generateId } from "@/lib/utils";
import { seedReservations } from "@/data/reservations-seed";
import { patchEntity, persistEntity } from "@/lib/backend-client";

interface ReservationsState {
  reservations: Reservation[];
  setReservations: (reservations: Reservation[]) => void;
  createReservation: (input: Omit<Reservation, "id" | "reference" | "status" | "createdAt">) => Reservation;
  updateStatus: (id: string, status: ReservationStatus) => void;
}

export const useReservationsStore = create<ReservationsState>()(
  persist(
    (set, get) => ({
      reservations: seedReservations,
      setReservations: (reservations) => set({ reservations }),
      createReservation: (input) => {
        const reservation: Reservation = {
          ...input,
          id: generateId("reservation"),
          reference: generateOrderReference("RSV"),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set({ reservations: [reservation, ...get().reservations] });
        persistEntity("reservations", reservation);
        return reservation;
      },
      updateStatus: (id, status) => {
        set({ reservations: get().reservations.map((r) => (r.id === id ? { ...r, status } : r)) });
        patchEntity("reservations", id, { status });
      },
    }),
    { name: "emmapresh-reservations" }
  )
);
