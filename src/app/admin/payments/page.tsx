"use client";

import * as React from "react";
import Link from "next/link";
import { PaymentStatusBadge } from "@/components/ui/status-badge";
import { useOrdersStore } from "@/stores/orders-store";
import { formatCurrency } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const orders = useOrdersStore((s) => s.orders);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (!hydrated) return null;

  const pending = orders
    .filter((o) => ["payment-submitted", "payment-under-review"].includes(o.payment.status))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const processed = orders
    .filter((o) => ["payment-verified", "payment-rejected"].includes(o.payment.status))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Payment Verification</h1>
      <p className="mt-1 mb-6 text-sm text-body">{pending.length} payment{pending.length !== 1 ? "s" : ""} awaiting review.</p>

      <div className="mb-8 overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
              <th className="px-4 py-3 font-semibold">Reference</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Submitted</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {pending.map((order) => (
              <tr key={order.reference} className="border-b border-border/60 last:border-0 hover:bg-cream-soft/30">
                <td className="px-4 py-3 font-semibold text-charcoal">{order.reference}</td>
                <td className="px-4 py-3 text-body">{order.customer.name}</td>
                <td className="px-4 py-3 font-semibold text-charcoal">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3 text-body">{order.payment.receipt ? new Date(order.payment.receipt.uploadedAt).toLocaleString() : "—"}</td>
                <td className="px-4 py-3">
                  <PaymentStatusBadge status={order.payment.status} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.reference}`} className="focus-ring text-xs font-semibold text-primary hover:underline">
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {pending.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-body">
                  No payments awaiting verification.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 font-display text-lg text-charcoal">Recently Processed</h2>
      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
              <th className="px-4 py-3 font-semibold">Reference</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {processed.map((order) => (
              <tr key={order.reference} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.reference}`} className="focus-ring font-semibold text-charcoal hover:text-primary">
                    {order.reference}
                  </Link>
                </td>
                <td className="px-4 py-3 text-body">{order.customer.name}</td>
                <td className="px-4 py-3 font-semibold text-charcoal">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3">
                  <PaymentStatusBadge status={order.payment.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
