"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Wallet,
  ChefHat,
  Truck,
  TrendingUp,
  Building2,
  CakeSlice,
  GraduationCap,
} from "lucide-react";
import { StatTile } from "@/components/admin/stat-tile";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { useOrdersStore } from "@/stores/orders-store";
import { useCateringStore } from "@/stores/catering-store";
import { useCakeRequestsStore } from "@/stores/cake-requests-store";
import { useHallsStore } from "@/stores/halls-store";
import { useAcademyStore } from "@/stores/academy-store";
import { branches } from "@/data/branches";
import { formatCurrency } from "@/lib/utils";

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default function AdminOverviewPage() {
  const orders = useOrdersStore((s) => s.orders);
  const cateringRequests = useCateringStore((s) => s.requests);
  const cakeRequests = useCakeRequestsStore((s) => s.requests);
  const hallEnquiries = useHallsStore((s) => s.enquiries);
  const academyApplications = useAcademyStore((s) => s.applications);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const ordersToday = orders.filter((o) => isToday(o.createdAt));
  const revenueToday = ordersToday
    .filter((o) => o.payment.status === "payment-verified" || o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);
  const awaitingVerification = orders.filter(
    (o) => o.payment.status === "payment-submitted" || o.payment.status === "payment-under-review"
  ).length;
  const preparing = orders.filter((o) => o.status === "preparing").length;
  const awaitingDelivery = orders.filter((o) =>
    ["ready-for-pickup", "awaiting-dispatch", "out-for-delivery"].includes(o.status)
  ).length;

  const itemCounts = new Map<string, number>();
  orders.forEach((o) => o.items.forEach((item) => itemCounts.set(item.name, (itemCounts.get(item.name) ?? 0) + item.quantity)));
  const topItems = [...itemCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const branchRevenue = new Map<string, number>();
  orders.forEach((o) => branchRevenue.set(o.branchSlug, (branchRevenue.get(o.branchSlug) ?? 0) + o.total));
  const topBranchSlug = [...branchRevenue.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const topBranch = branches.find((b) => b.slug === topBranchSlug);

  const verifiedCount = orders.filter((o) => o.payment.status === "payment-verified").length;
  const rejectedCount = orders.filter((o) => o.payment.status === "payment-rejected").length;
  const approvalRate = verifiedCount + rejectedCount > 0 ? Math.round((verifiedCount / (verifiedCount + rejectedCount)) * 100) : 100;

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  if (!hydrated) return null;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-body">A live snapshot of orders and payments across all branches.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Orders Today" value={String(ordersToday.length)} icon={ShoppingBag} tone="primary" />
        <StatTile label="Revenue Today" value={formatCurrency(revenueToday)} icon={TrendingUp} tone="success" />
        <StatTile label="Awaiting Payment Verification" value={String(awaitingVerification)} icon={Wallet} tone="warning" />
        <StatTile label="Orders Preparing" value={String(preparing)} icon={ChefHat} tone="primary" />
        <StatTile label="Awaiting Delivery/Pickup" value={String(awaitingDelivery)} icon={Truck} tone="neutral" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base text-charcoal">Recent Orders</h2>
            <Link href="/admin/orders" className="focus-ring text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-body">
                  <th className="pb-2 font-semibold">Reference</th>
                  <th className="pb-2 font-semibold">Branch</th>
                  <th className="pb-2 font-semibold">Total</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.reference} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5">
                      <Link href={`/admin/orders/${order.reference}`} className="focus-ring font-semibold text-charcoal hover:text-primary">
                        {order.reference}
                      </Link>
                    </td>
                    <td className="py-2.5 capitalize text-body">{order.branchSlug}</td>
                    <td className="py-2.5 text-charcoal">{formatCurrency(order.total)}</td>
                    <td className="py-2.5">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="mb-3 font-display text-base text-charcoal">Top-Selling Meals</h2>
            <ul className="space-y-2 text-sm">
              {topItems.map(([name, qty], i) => (
                <li key={name} className="flex items-center justify-between">
                  <span className="text-charcoal">{i + 1}. {name}</span>
                  <span className="font-semibold text-body">{qty} sold</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="mb-3 font-display text-base text-charcoal">Top-Performing Branch</h2>
            <p className="font-display text-lg text-charcoal">{topBranch?.name ?? "—"}</p>
            <p className="text-xs text-body">{formatCurrency(branchRevenue.get(topBranchSlug ?? "") ?? 0)} in total revenue</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="mb-3 font-display text-base text-charcoal">Payment Approval Rate</h2>
            <p className="font-display text-2xl text-success">{approvalRate}%</p>
            <p className="text-xs text-body">{verifiedCount} verified · {rejectedCount} rejected</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-base text-charcoal">Other Requests Across the Business</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link href="/admin/catering" className="rounded-2xl border border-border/60 bg-white p-5 hover:border-primary">
            <ChefHat className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-xl text-charcoal">{cateringRequests.length}</p>
            <p className="text-xs text-body">Catering Requests</p>
          </Link>
          <Link href="/admin/cakes" className="rounded-2xl border border-border/60 bg-white p-5 hover:border-primary">
            <CakeSlice className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-xl text-charcoal">{cakeRequests.length}</p>
            <p className="text-xs text-body">Custom Cake Requests</p>
          </Link>
          <Link href="/admin/halls" className="rounded-2xl border border-border/60 bg-white p-5 hover:border-primary">
            <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-xl text-charcoal">{hallEnquiries.length}</p>
            <p className="text-xs text-body">Hall Enquiries</p>
          </Link>
          <Link href="/admin/academy" className="rounded-2xl border border-border/60 bg-white p-5 hover:border-primary">
            <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-xl text-charcoal">{academyApplications.length}</p>
            <p className="text-xs text-body">Academy Applications</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
