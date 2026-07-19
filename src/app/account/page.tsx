"use client";

import * as React from "react";
import { User, LogOut } from "lucide-react";
import Link from "next/link";
import { AccountNav } from "@/components/account/account-nav";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCustomerSessionStore } from "@/stores/customer-session-store";
import { useOrdersStore } from "@/stores/orders-store";
import { useFavouritesStore } from "@/stores/favourites-store";
import { menuItems } from "@/data/menu-items";
import { formatCurrency } from "@/lib/utils";

export default function AccountPage() {
  const { session, setSession, clearSession } = useCustomerSessionStore();
  const orders = useOrdersStore((s) => s.orders);
  const favouriteIds = useFavouritesStore((s) => s.itemIds);
  const [hydrated, setHydrated] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!hydrated) return null;

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setSession({ name, phone, email });
  }

  const myOrders = session ? orders.filter((order) => order.customer.email === session.email) : [];
  const totalSpend = myOrders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = myOrders.filter((order) => !["completed", "delivered", "cancelled", "refunded"].includes(order.status)).length;
  const favouriteItems = menuItems.filter((item) => favouriteIds.includes(item.id));
  const lastOrder = myOrders[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="mb-6 font-display text-3xl text-charcoal">My Account</h1>
      {session && <AccountNav />}

      {!session ? (
        <div className="mt-8 rounded-card border border-border/60 bg-white p-6">
          <p className="mb-4 text-sm text-body">
            EmmaPresh uses guest checkout — enter the details you used when ordering to view your order history and
            favourites.
          </p>
          <form onSubmit={handleLookup} className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="sm:col-span-3">Continue</Button>
          </form>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <section className="rounded-card border border-border/60 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-lg text-charcoal">{session.name}</p>
              <p className="text-sm text-body">{session.email}</p>
              <p className="text-sm text-body">{session.phone}</p>
            </div>
              </div>
              <button
                onClick={clearSession}
                className="focus-ring flex items-center gap-1.5 text-sm font-semibold text-body hover:text-error"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Switch Account
              </button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-body">Orders</p>
              <p className="mt-2 font-display text-2xl text-charcoal">{myOrders.length}</p>
              <p className="mt-1 text-xs text-body">{activeOrders} active right now</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-body">Total Spend</p>
              <p className="mt-2 font-display text-2xl text-charcoal">{formatCurrency(totalSpend)}</p>
              <p className="mt-1 text-xs text-body">From saved order history</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-body">Favourites</p>
              <p className="mt-2 font-display text-2xl text-charcoal">{favouriteItems.length}</p>
              <p className="mt-1 text-xs text-body">Saved menu items</p>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-border/60 bg-white p-5">
              <h2 className="font-display text-base text-charcoal">Recent Activity</h2>
              {lastOrder ? (
                <div className="mt-4 rounded-xl bg-cream-soft/70 p-4">
                  <p className="text-sm font-semibold text-charcoal">{lastOrder.reference}</p>
                  <p className="mt-1 text-xs text-body">
                    {lastOrder.items.length} items · {formatCurrency(lastOrder.total)} · {lastOrder.status.replace(/-/g, " ")}
                  </p>
                  <Link href={`/orders/${lastOrder.reference}`} className="mt-3 inline-block text-xs font-bold text-primary hover:underline">
                    Track order
                  </Link>
                </div>
              ) : (
                <p className="mt-4 text-sm text-body">No recent order activity for this email yet.</p>
              )}
            </div>
            <div className="rounded-2xl border border-border/60 bg-white p-5">
              <h2 className="font-display text-base text-charcoal">Quick Actions</h2>
              <div className="mt-4 grid gap-2">
                <Link href="/menu" className="focus-ring rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-deep">Order food</Link>
                <Link href="/account/orders" className="focus-ring rounded-xl bg-cream-soft px-4 py-3 text-sm font-semibold text-charcoal hover:bg-border">View all activity</Link>
                <Link href="/account/favourites" className="focus-ring rounded-xl bg-cream-soft px-4 py-3 text-sm font-semibold text-charcoal hover:bg-border">Open favourites</Link>
              </div>
            </div>
          </section>
          </div>
      )}
    </div>
  );
}
