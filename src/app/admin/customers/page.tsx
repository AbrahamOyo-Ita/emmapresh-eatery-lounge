"use client";

import * as React from "react";
import Link from "next/link";
import { useOrdersStore } from "@/stores/orders-store";
import { useCateringStore } from "@/stores/catering-store";
import { useCakeRequestsStore } from "@/stores/cake-requests-store";
import { useAcademyStore } from "@/stores/academy-store";
import { useHallsStore } from "@/stores/halls-store";
import { useReservationsStore } from "@/stores/reservations-store";
import { useCrmStore } from "@/stores/crm-store";
import { buildCrmCustomers } from "@/lib/admin/crm";
import { formatCurrency } from "@/lib/utils";

export default function AdminCustomersPage() {
  const orders = useOrdersStore((s) => s.orders);
  const catering = useCateringStore((s) => s.requests);
  const cakes = useCakeRequestsStore((s) => s.requests);
  const academy = useAcademyStore((s) => s.applications);
  const halls = useHallsStore((s) => s.enquiries);
  const reservations = useReservationsStore((s) => s.reservations);
  const crm = useCrmStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (!hydrated) return null;

  const customers = buildCrmCustomers({
    orders,
    catering,
    cakes,
    academy,
    halls,
    reservations,
    overrides: crm.profileOverrides,
    notes: crm.notes,
    tasks: crm.tasks,
    deals: crm.deals,
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Customers</h1>
          <p className="mt-1 text-sm text-body">{customers.length} unified customer profiles from CRM and operations history.</p>
        </div>
        <Link href="/admin/crm" className="focus-ring rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-deep">
          Open CRM
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Stage</th>
              <th className="px-4 py-3 font-semibold">Orders</th>
              <th className="px-4 py-3 font-semibold">Total Spend</th>
              <th className="px-4 py-3 font-semibold">Tasks</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.email} className="border-b border-border/60 last:border-0 hover:bg-cream-soft/30">
                <td className="px-4 py-3">
                  <Link href={`/admin/crm/${encodeURIComponent(customer.email)}`} className="font-semibold text-charcoal hover:text-primary">
                    {customer.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-body">
                  {customer.phone}
                  <br />
                  {customer.email}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold capitalize text-primary">{customer.stage.replace(/-/g, " ")}</span>
                </td>
                <td className="px-4 py-3 text-charcoal">{customer.orderCount}</td>
                <td className="px-4 py-3 font-semibold text-charcoal">{formatCurrency(customer.totalSpend)}</td>
                <td className="px-4 py-3 text-charcoal">{customer.openTasks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
