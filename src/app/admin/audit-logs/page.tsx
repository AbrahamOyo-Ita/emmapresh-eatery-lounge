"use client";

import * as React from "react";
import { useOrdersStore } from "@/stores/orders-store";

interface LogEntry {
  reference: string;
  event: string;
  timestamp: string;
}

export default function AdminAuditLogsPage() {
  const orders = useOrdersStore((s) => s.orders);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  const entries: LogEntry[] = orders.flatMap((order) =>
    order.statusHistory.map((event) => ({
      reference: order.reference,
      event: event.note ?? `Status changed to ${event.status.replace(/-/g, " ")}`,
      timestamp: event.timestamp,
    }))
  );
  entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Audit Logs</h1>
      <p className="mt-1 mb-6 text-sm text-body">A chronological record of order and payment actions across the platform.</p>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Event</th>
              <th className="px-4 py-3 font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {entries.slice(0, 100).map((entry, i) => (
              <tr key={i} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-semibold text-charcoal">{entry.reference}</td>
                <td className="px-4 py-3 capitalize text-body">{entry.event}</td>
                <td className="px-4 py-3 text-body">{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
