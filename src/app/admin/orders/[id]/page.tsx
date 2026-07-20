"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, MapPin, Phone, Mail } from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/status-badge";
import { OrderStatusControls } from "@/components/admin/order-status-controls";
import { PaymentVerificationForm } from "@/components/admin/payment-verification-form";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrdersStore } from "@/stores/orders-store";
import { branches } from "@/data/branches";
import { formatCurrency } from "@/lib/utils";

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orders = useOrdersStore((s) => s.orders);
  const setInternalNotes = useOrdersStore((s) => s.setInternalNotes);
  const [hydrated, setHydrated] = React.useState(false);
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const order = orders.find((o) => o.reference === params.id);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setNotes(order?.internalNotes ?? ""));
    return () => window.cancelAnimationFrame(frame);
  }, [order?.internalNotes]);

  if (!hydrated) return null;

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="font-display text-xl text-charcoal">Order not found</p>
        <Link href="/admin/orders" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const branch = branches.find((b) => b.slug === order.branchSlug)!;

  return (
    <div>
      <Link href="/admin/orders" className="focus-ring mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-body hover:text-primary">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to Orders
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal">{order.reference}</h1>
          <p className="mt-1 text-sm text-body">Placed {new Date(order.createdAt).toLocaleString()} · {branch.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="mb-3 font-display text-base text-charcoal">Items</h2>
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.cartItemId} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="text-charcoal">{item.quantity} × {item.name}</p>
                    {item.selectedOptions.length > 0 && (
                      <p className="text-xs text-body">{item.selectedOptions.map((o) => o.choiceLabel).join(", ")}</p>
                    )}
                    {item.specialInstructions && <p className="text-xs italic text-body">Note: {item.specialInstructions}</p>}
                  </div>
                  <span className="shrink-0 font-semibold text-charcoal">{formatCurrency(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between text-body">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-body">
                <span>Delivery Fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-body">
                <span>Service Charge</span>
                <span>{formatCurrency(order.serviceCharge)}</span>
              </div>
              <div className="flex justify-between font-display text-base text-charcoal">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="mb-3 font-display text-base text-charcoal">Payment Verification</h2>
            <PaymentVerificationForm order={order} />
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="mb-3 font-display text-base text-charcoal">Update Order Status</h2>
            <OrderStatusControls order={order} />
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="mb-3 font-display text-base text-charcoal">Status History</h2>
            <ul className="space-y-2 text-sm">
              {order.statusHistory.map((event, i) => (
                <li key={i} className="flex flex-col gap-1 text-body sm:flex-row sm:items-center sm:justify-between">
                  <span className="capitalize text-charcoal">{event.status.replace(/-/g, " ")}</span>
                  <span>{new Date(event.timestamp).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="mb-3 font-display text-base text-charcoal">Customer</h2>
            <p className="text-sm font-semibold text-charcoal">{order.customer.name}</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-body">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {order.customer.phone}
            </p>
            <p className="mt-1 flex min-w-0 items-start gap-1.5 break-all text-sm text-body">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {order.customer.email}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="mb-3 font-display text-base text-charcoal">Fulfilment</h2>
            <p className="text-sm capitalize text-charcoal">{order.fulfilmentMethod}</p>
            {order.delivery?.address && (
              <p className="mt-2 flex items-start gap-1.5 text-sm text-body">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {order.delivery.address}, {order.delivery.city}
              </p>
            )}
            {order.delivery?.tableNumber && <p className="mt-2 text-sm text-body">Table {order.delivery.tableNumber}</p>}
            <p className="mt-2 text-sm text-body">Requested time: {order.requestedTime}</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-5">
            <h2 className="mb-3 font-display text-base text-charcoal">Internal Notes</h2>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add a note visible only to staff..." />
            <Button size="sm" className="mt-2" onClick={() => setInternalNotes(order.reference, notes)}>
              Save Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
