"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/status-badge";
import { Input, Select } from "@/components/ui/input";
import { useOrdersStore } from "@/stores/orders-store";
import { branches } from "@/data/branches";
import { formatCurrency } from "@/lib/utils";
import type { OrderStatus, BranchSlug } from "@/types";

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const orders = useOrdersStore((s) => s.orders);
  const [hydrated, setHydrated] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [branchFilter, setBranchFilter] = React.useState<BranchSlug | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<OrderStatus | "all">(
    (searchParams.get("status") as OrderStatus | null) ?? "all"
  );

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const filtered = orders
    .filter((o) => (branchFilter === "all" ? true : o.branchSlug === branchFilter))
    .filter((o) => (statusFilter === "all" ? true : o.status === statusFilter))
    .filter((o) =>
      query.trim()
        ? o.reference.toLowerCase().includes(query.toLowerCase()) || o.customer.name.toLowerCase().includes(query.toLowerCase())
        : true
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!hydrated) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Orders</h1>
          <p className="mt-1 text-sm text-body">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-[1_1_100%] sm:min-w-[220px] sm:flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-body" aria-hidden="true" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reference or customer..." className="pl-10" />
        </div>
        <Select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value as BranchSlug | "all")} className="w-full sm:w-auto" aria-label="Filter by branch">
          <option value="all">All Branches</option>
          {branches.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")} className="w-full sm:w-auto" aria-label="Filter by status">
          <option value="all">All Statuses</option>
          {(
            [
              "order-created",
              "awaiting-payment",
              "payment-submitted",
              "payment-under-review",
              "payment-verified",
              "order-accepted",
              "preparing",
              "ready-for-pickup",
              "out-for-delivery",
              "delivered",
              "completed",
              "cancelled",
              "refunded",
            ] as OrderStatus[]
          ).map((s) => (
            <option key={s} value={s}>
              {s.replace(/-/g, " ")}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
              <th className="px-4 py-3 font-semibold">Reference</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Branch</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Payment</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.reference} className="border-b border-border/60 last:border-0 hover:bg-cream-soft/30">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.reference}`} className="focus-ring font-semibold text-charcoal hover:text-primary">
                    {order.reference}
                  </Link>
                </td>
                <td className="px-4 py-3 text-body">{order.customer.name}</td>
                <td className="px-4 py-3 capitalize text-body">{order.branchSlug}</td>
                <td className="px-4 py-3 font-semibold text-charcoal">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3">
                  <PaymentStatusBadge status={order.payment.status} />
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-body">
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <React.Suspense fallback={null}>
      <AdminOrdersContent />
    </React.Suspense>
  );
}
