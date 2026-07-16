"use client";

import * as React from "react";
import { Select } from "@/components/ui/input";
import { useHallsStore } from "@/stores/halls-store";
import { halls } from "@/data/halls";
import type { HallBookingStatus } from "@/types";

const statuses: HallBookingStatus[] = [
  "enquiry-received", "under-review", "quotation-sent", "date-held", "booking-confirmed", "completed", "cancelled",
];

export default function AdminHallsPage() {
  const { enquiries, updateStatus } = useHallsStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Event Hall Enquiries</h1>
      <p className="mt-1 mb-6 text-sm text-body">{enquiries.length} enquiries across {halls.length} halls.</p>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Hall</th>
              <th className="px-4 py-3 font-semibold">Event</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => {
              const hall = halls.find((h) => h.id === enquiry.hallId);
              return (
                <tr key={enquiry.id} className="border-b border-border/60 last:border-0 hover:bg-cream-soft/30">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-charcoal">{enquiry.customerName}</p>
                    <p className="text-xs text-body">{enquiry.phone} · {enquiry.email}</p>
                  </td>
                  <td className="px-4 py-3 text-body">{hall?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-body">{enquiry.eventType} ({enquiry.guestCount} guests)</td>
                  <td className="px-4 py-3 text-body">{new Date(enquiry.eventDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Select value={enquiry.status} onChange={(e) => updateStatus(enquiry.id, e.target.value as HallBookingStatus)} className="w-auto">
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s.replace(/-/g, " ")}</option>
                      ))}
                    </Select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
