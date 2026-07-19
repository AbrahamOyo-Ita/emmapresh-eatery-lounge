"use client";

import * as React from "react";
import { Select, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCateringStore } from "@/stores/catering-store";
import { formatCurrency } from "@/lib/utils";
import type { CateringStatus } from "@/types";

const statuses: CateringStatus[] = [
  "enquiry-received", "under-review", "quotation-sent", "awaiting-approval", "awaiting-deposit",
  "deposit-submitted", "deposit-verified", "booking-confirmed", "planning", "preparation",
  "event-in-progress", "completed", "cancelled",
];

export default function AdminCateringPage() {
  const { requests, updateStatus, setQuote } = useCateringStore();
  const [hydrated, setHydrated] = React.useState(false);
  const [quoteDrafts, setQuoteDrafts] = React.useState<Record<string, string>>({});
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (!hydrated) return null;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Catering Requests</h1>
      <p className="mt-1 mb-6 text-sm text-body">{requests.length} requests on file.</p>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="rounded-2xl border border-border/60 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base text-charcoal">{request.reference}</p>
                <p className="text-sm text-body">{request.customerName} · {request.phone} · {request.email}</p>
                <p className="mt-1 text-sm text-charcoal capitalize">
                  {request.cateringType} — {request.guestCount} guests — {new Date(request.eventDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-body">{request.eventLocation}</p>
              </div>
              <Select
                value={request.status}
                onChange={(e) => updateStatus(request.id, e.target.value as CateringStatus)}
                className="w-auto"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s.replace(/-/g, " ")}</option>
                ))}
              </Select>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
              {request.quotedAmount ? (
                <span className="text-sm font-semibold text-charcoal">Quoted: {formatCurrency(request.quotedAmount)}</span>
              ) : (
                <>
                  <Input
                    type="number"
                    placeholder="Quote amount (₦)"
                    className="w-48"
                    value={quoteDrafts[request.id] ?? ""}
                    onChange={(e) => setQuoteDrafts((prev) => ({ ...prev, [request.id]: e.target.value }))}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const amount = Number(quoteDrafts[request.id]);
                      if (amount > 0) setQuote(request.id, amount);
                    }}
                  >
                    Send Quote
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
