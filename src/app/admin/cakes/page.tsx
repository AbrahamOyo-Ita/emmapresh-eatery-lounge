"use client";

import * as React from "react";
import { Select, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCakeRequestsStore } from "@/stores/cake-requests-store";
import { cakes } from "@/data/cakes";
import { formatCurrency } from "@/lib/utils";
import type { CakeOrderStatus } from "@/types";

const statuses: CakeOrderStatus[] = [
  "request-received", "under-review", "more-info-required", "quotation-sent", "awaiting-approval",
  "awaiting-payment", "payment-submitted", "payment-verified", "design-confirmed", "in-production",
  "quality-check", "ready-for-pickup", "out-for-delivery", "completed", "cancelled",
];

export default function AdminCakesPage() {
  const { requests, updateStatus, setQuote } = useCakeRequestsStore();
  const [hydrated, setHydrated] = React.useState(false);
  const [quoteDrafts, setQuoteDrafts] = React.useState<Record<string, string>>({});
  React.useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Bakery &amp; Cakes</h1>
      <p className="mt-1 mb-6 text-sm text-body">{cakes.length} ready cakes in stock · {requests.length} custom requests.</p>

      <h2 className="mb-3 font-display text-lg text-charcoal">Ready Cake Inventory</h2>
      <div className="mb-8 overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
              <th className="px-4 py-3 font-semibold">Cake</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Quantity Available</th>
            </tr>
          </thead>
          <tbody>
            {cakes.map((cake) => (
              <tr key={cake.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-semibold text-charcoal">{cake.name}</td>
                <td className="px-4 py-3 text-charcoal">{formatCurrency(cake.price)}</td>
                <td className="px-4 py-3 text-body">{cake.quantityAvailable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 font-display text-lg text-charcoal">Custom Cake Requests</h2>
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="rounded-2xl border border-border/60 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base text-charcoal">{request.reference}</p>
                <p className="text-sm text-body">{request.customerName} · {request.phone} · {request.email}</p>
                <p className="mt-1 text-sm text-charcoal">{request.eventType} — {request.sizeLabel} — {request.flavour}</p>
                {request.referenceImages.length > 0 && (
                  <p className="text-xs text-body">{request.referenceImages.length} reference image(s) attached</p>
                )}
              </div>
              <Select value={request.status} onChange={(e) => updateStatus(request.id, e.target.value as CakeOrderStatus)} className="w-auto">
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
