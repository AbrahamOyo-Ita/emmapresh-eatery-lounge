"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, PhoneCall, Download, RotateCcw } from "lucide-react";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { useOrdersStore } from "@/stores/orders-store";
import { useCartStore } from "@/stores/cart-store";
import { branches } from "@/data/branches";
import { formatCurrency, cn } from "@/lib/utils";

export default function OrderTrackingPage() {
  const params = useParams<{ reference: string }>();
  const orders = useOrdersStore((s) => s.orders);
  const addItem = useCartStore((s) => s.addItem);
  const [hydrated, setHydrated] = React.useState(false);
  const [repeated, setRepeated] = React.useState(false);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const order = orders.find((o) => o.reference === params.reference);

  if (!hydrated) return null;

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="font-display text-2xl text-charcoal">Order not found</p>
        <p className="mt-2 text-sm text-body">Double-check your order reference and try again.</p>
        <Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-6")}>
          Back to Menu
        </Link>
      </div>
    );
  }

  const branch = branches.find((b) => b.slug === order.branchSlug)!;

  function handleRepeatOrder() {
    order!.items.forEach((item) => {
      addItem({
        menuItemId: item.menuItemId,
        slug: item.slug,
        name: item.name,
        image: item.image,
        branchSlug: item.branchSlug,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions,
        specialInstructions: item.specialInstructions,
      });
    });
    setRepeated(true);
    setTimeout(() => setRepeated(false), 2000);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-body">Order Reference</p>
          <h1 className="font-display text-2xl text-charcoal">{order.reference}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment.status} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="rounded-card border border-border/60 bg-white p-6">
          <h2 className="mb-6 font-display text-lg text-charcoal">Order Progress</h2>
          <OrderTimeline order={order} />
        </div>

        <div className="space-y-6">
          <div className="rounded-card border border-border/60 bg-white p-6">
            <h2 className="mb-3 font-display text-base text-charcoal">Branch</h2>
            <p className="flex items-start gap-1.5 text-sm text-body">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {branch.name}, {branch.address}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-body">
              <PhoneCall className="h-4 w-4 shrink-0" aria-hidden="true" />
              {branch.phone}
            </p>
          </div>

          <div className="rounded-card border border-border/60 bg-white p-6">
            <h2 className="mb-3 font-display text-base text-charcoal">Order Summary</h2>
            <ul className="mb-3 space-y-2">
              {order.items.map((item) => (
                <li key={item.cartItemId} className="flex justify-between text-sm">
                  <span className="text-charcoal">{item.quantity} × {item.name}</span>
                  <span className="font-semibold text-charcoal">{formatCurrency(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-border pt-3 font-display text-base">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button className="focus-ring flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-charcoal hover:border-charcoal">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Invoice
            </button>
            <button
              onClick={handleRepeatOrder}
              className={cn(
                "focus-ring flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white",
                repeated ? "bg-success" : "bg-primary hover:bg-primary-deep"
              )}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {repeated ? "Added to Cart ✓" : "Repeat This Order"}
            </button>
            <Link href="/contact" className="focus-ring text-center text-sm font-semibold text-body hover:text-primary">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
