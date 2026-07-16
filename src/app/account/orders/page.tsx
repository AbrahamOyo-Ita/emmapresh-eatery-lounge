"use client";

import * as React from "react";
import Link from "next/link";
import { AccountNav } from "@/components/account/account-nav";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { useCustomerSessionStore } from "@/stores/customer-session-store";
import { useOrdersStore } from "@/stores/orders-store";
import { useCateringStore } from "@/stores/catering-store";
import { useCakeRequestsStore } from "@/stores/cake-requests-store";
import { useAcademyStore } from "@/stores/academy-store";
import { useHallsStore } from "@/stores/halls-store";
import { useReservationsStore } from "@/stores/reservations-store";
import { formatCurrency } from "@/lib/utils";

export default function AccountOrdersPage() {
  const { session } = useCustomerSessionStore();
  const orders = useOrdersStore((s) => s.orders);
  const catering = useCateringStore((s) => s.requests);
  const cakeRequests = useCakeRequestsStore((s) => s.requests);
  const academyApps = useAcademyStore((s) => s.applications);
  const hallEnquiries = useHallsStore((s) => s.enquiries);
  const reservations = useReservationsStore((s) => s.reservations);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
        <p className="font-display text-xl text-charcoal">Sign in to view your order history</p>
        <Link href="/account" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Go to My Account</Link>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.customer.email === session.email);
  const myCatering = catering.filter((r) => r.email === session.email);
  const myCakes = cakeRequests.filter((r) => r.email === session.email);
  const myAcademy = academyApps.filter((a) => a.email === session.email);
  const myHalls = hallEnquiries.filter((h) => h.email === session.email);
  const myReservations = reservations.filter((r) => r.email === session.email);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="mb-6 font-display text-3xl text-charcoal">My Account</h1>
      <AccountNav />

      <div className="mt-8 space-y-10">
        <section>
          <h2 className="mb-3 font-display text-lg text-charcoal">Food Orders</h2>
          {myOrders.length === 0 ? (
            <p className="text-sm text-body">No food orders yet.</p>
          ) : (
            <div className="space-y-2">
              {myOrders.map((order) => (
                <Link key={order.reference} href={`/orders/${order.reference}`} className="flex items-center justify-between rounded-2xl border border-border/60 bg-white p-4 hover:border-charcoal">
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{order.reference}</p>
                    <p className="text-xs text-body">{new Date(order.createdAt).toLocaleDateString()} · {formatCurrency(order.total)}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg text-charcoal">Catering Requests</h2>
          {myCatering.length === 0 ? <p className="text-sm text-body">No catering requests yet.</p> : (
            <div className="space-y-2">
              {myCatering.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border/60 bg-white p-4 text-sm">
                  <p className="font-semibold text-charcoal">{r.reference} — {r.cateringType}</p>
                  <p className="text-xs capitalize text-body">{r.status.replace(/-/g, " ")}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg text-charcoal">Custom Cake Requests</h2>
          {myCakes.length === 0 ? <p className="text-sm text-body">No custom cake requests yet.</p> : (
            <div className="space-y-2">
              {myCakes.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border/60 bg-white p-4 text-sm">
                  <p className="font-semibold text-charcoal">{r.reference} — {r.eventType}</p>
                  <p className="text-xs capitalize text-body">{r.status.replace(/-/g, " ")}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg text-charcoal">Academy Applications</h2>
          {myAcademy.length === 0 ? <p className="text-sm text-body">No academy applications yet.</p> : (
            <div className="space-y-2">
              {myAcademy.map((a) => (
                <div key={a.id} className="rounded-2xl border border-border/60 bg-white p-4 text-sm">
                  <p className="font-semibold text-charcoal">{a.reference}</p>
                  <p className="text-xs capitalize text-body">{a.status.replace(/-/g, " ")}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg text-charcoal">Event Hall Enquiries</h2>
          {myHalls.length === 0 ? <p className="text-sm text-body">No hall enquiries yet.</p> : (
            <div className="space-y-2">
              {myHalls.map((h) => (
                <div key={h.id} className="rounded-2xl border border-border/60 bg-white p-4 text-sm">
                  <p className="font-semibold text-charcoal">{h.reference} — {h.eventType}</p>
                  <p className="text-xs capitalize text-body">{h.status.replace(/-/g, " ")}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg text-charcoal">Table Reservations</h2>
          {myReservations.length === 0 ? <p className="text-sm text-body">No reservations yet.</p> : (
            <div className="space-y-2">
              {myReservations.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border/60 bg-white p-4 text-sm">
                  <p className="font-semibold text-charcoal">{r.reference} — {new Date(r.date).toLocaleDateString()} at {r.time}</p>
                  <p className="text-xs capitalize text-body">{r.status}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
