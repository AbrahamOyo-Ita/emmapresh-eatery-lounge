"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarCheck, CakeSlice, ChefHat, GraduationCap, ShoppingBag, UtensilsCrossed } from "lucide-react";
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

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
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
  const totalRequests = myOrders.length + myCatering.length + myCakes.length + myAcademy.length + myHalls.length + myReservations.length;
  const activeFoodOrders = myOrders.filter((o) => !["completed", "delivered", "cancelled", "refunded"].includes(o.status));
  const totalFoodSpend = myOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="mb-6 font-display text-3xl text-charcoal">My Account</h1>
      <AccountNav />

      <div className="mt-8 space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-body">All Requests</p>
            <p className="mt-2 font-display text-2xl text-charcoal">{totalRequests}</p>
            <p className="mt-1 text-xs text-body">Orders, bookings and applications</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-body">Active Food Orders</p>
            <p className="mt-2 font-display text-2xl text-charcoal">{activeFoodOrders.length}</p>
            <p className="mt-1 text-xs text-body">Still moving through operations</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-body">Food Spend</p>
            <p className="mt-2 font-display text-2xl text-charcoal">{formatCurrency(totalFoodSpend)}</p>
            <p className="mt-1 text-xs text-body">Across saved food orders</p>
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-white p-5">
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

        <section className="grid gap-4 lg:grid-cols-2">
          {[
            { title: "Catering Requests", icon: ChefHat, items: myCatering.map((r) => ({ id: r.id, title: `${r.reference} - ${r.cateringType}`, meta: `${r.guestCount} guests · ${r.eventDate}`, status: r.status })) },
            { title: "Custom Cake Requests", icon: CakeSlice, items: myCakes.map((r) => ({ id: r.id, title: `${r.reference} - ${r.eventType}`, meta: `${r.sizeLabel} · ${r.requiredDate}`, status: r.status })) },
            { title: "Academy Applications", icon: GraduationCap, items: myAcademy.map((a) => ({ id: a.id, title: a.reference, meta: a.preferredSchedule, status: a.status })) },
            { title: "Event Hall Enquiries", icon: UtensilsCrossed, items: myHalls.map((h) => ({ id: h.id, title: `${h.reference} - ${h.eventType}`, meta: `${h.guestCount} guests · ${h.eventDate}`, status: h.status })) },
            { title: "Table Reservations", icon: CalendarCheck, items: myReservations.map((r) => ({ id: r.id, title: `${r.reference} - ${r.guestCount} guests`, meta: `${r.date} at ${r.time}`, status: r.status })) },
            { title: "Next Steps", icon: ShoppingBag, items: [{ id: "menu", title: "Place another order", meta: "Food, cakes, catering and bookings are all connected here.", status: "ready" }] },
          ].map((group) => (
            <div key={group.title} className="rounded-2xl border border-border/60 bg-white p-5">
              <h2 className="mb-4 flex items-center gap-2 font-display text-base text-charcoal">
                <group.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {group.title}
              </h2>
              {group.items.length === 0 ? (
                <p className="text-sm text-body">No records yet.</p>
              ) : (
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div key={item.id} className="rounded-xl bg-cream-soft/60 p-3 text-sm">
                      <p className="font-semibold text-charcoal">{item.title}</p>
                      <p className="mt-1 text-xs text-body">{item.meta}</p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-primary">{item.status.replace(/-/g, " ")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
