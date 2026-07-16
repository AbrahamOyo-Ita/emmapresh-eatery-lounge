import type { Metadata } from "next";
import { ReservationForm } from "@/components/reservations/reservation-form";

export const metadata: Metadata = {
  title: "Reserve a Table",
  description: "Reserve a table at EmmaPresh Eatery & Lounge in Abuja, Lagos or Badagry.",
};

export default function ReservationsPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-charcoal">Reserve a Table</h1>
        <p className="mt-2 text-sm text-body">Book indoor or lounge seating at your preferred branch.</p>
      </div>
      <ReservationForm />
    </div>
  );
}
