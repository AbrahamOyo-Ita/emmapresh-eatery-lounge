"use client";

import * as React from "react";
import { useOrdersStore } from "@/stores/orders-store";
import { formatCurrency } from "@/lib/utils";

export default function AdminCustomersPage() {
  const orders = useOrdersStore((s) => s.orders);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  const customerMap = new Map<string, { name: string; phone: string; email: string; orderCount: number; totalSpend: number }>();
  orders.forEach((order) => {
    const existing = customerMap.get(order.customer.email);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpend += order.total;
    } else {
      customerMap.set(order.customer.email, {
        name: order.customer.name,
        phone: order.customer.phone,
        email: order.customer.email,
        orderCount: 1,
        totalSpend: order.total,
      });
    }
  });
  const customers = [...customerMap.values()].sort((a, b) => b.totalSpend - a.totalSpend);

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Customers</h1>
      <p className="mt-1 mb-6 text-sm text-body">{customers.length} customers derived from order history.</p>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Orders</th>
              <th className="px-4 py-3 font-semibold">Total Spend</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.email} className="border-b border-border/60 last:border-0 hover:bg-cream-soft/30">
                <td className="px-4 py-3 font-semibold text-charcoal">{customer.name}</td>
                <td className="px-4 py-3 text-body">
                  {customer.phone}
                  <br />
                  {customer.email}
                </td>
                <td className="px-4 py-3 text-charcoal">{customer.orderCount}</td>
                <td className="px-4 py-3 font-semibold text-charcoal">{formatCurrency(customer.totalSpend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
