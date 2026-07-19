"use client";

import * as React from "react";
import { Select } from "@/components/ui/input";
import { useReservationsStore } from "@/stores/reservations-store";
import { branches } from "@/data/branches";
import type { ReservationStatus } from "@/types";

const statuses: ReservationStatus[] = ["pending", "confirmed", "cancelled", "completed"];

export default function AdminReservationsPage() {
  const { reservations, updateStatus } = useReservationsStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (!hydrated) return null;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Table Reservations</h1>
      <p className="mt-1 mb-6 text-sm text-body">{reservations.length} reservations on file.</p>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Branch</th>
              <th className="px-4 py-3 font-semibold">Date &amp; Time</th>
              <th className="px-4 py-3 font-semibold">Guests</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-cream-soft/30">
                <td className="px-4 py-3">
                  <p className="font-semibold text-charcoal">{r.customerName}</p>
                  <p className="text-xs text-body">{r.phone}</p>
                </td>
                <td className="px-4 py-3 capitalize text-body">{branches.find((b) => b.slug === r.branchSlug)?.city}</td>
                <td className="px-4 py-3 text-body">{new Date(r.date).toLocaleDateString()} at {r.time}</td>
                <td className="px-4 py-3 text-body">{r.guestCount}</td>
                <td className="px-4 py-3">
                  <Select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value as ReservationStatus)} className="w-auto">
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
