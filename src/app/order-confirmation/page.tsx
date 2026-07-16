"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PartyPopper } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/ui/status-badge";
import { useOrdersStore } from "@/stores/orders-store";
import { branches } from "@/data/branches";
import { formatCurrency, cn } from "@/lib/utils";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");
  const orders = useOrdersStore((s) => s.orders);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => setHydrated(true), []);

  const order = orders.find((o) => o.reference === reference);

  if (!hydrated) return null;

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="font-display text-2xl text-charcoal">No order found</p>
        <p className="mt-2 text-sm text-body">This confirmation link is invalid or has expired.</p>
        <Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-6")}>
          Back to Menu
        </Link>
      </div>
    );
  }

  const branch = branches.find((b) => b.slug === order.branchSlug)!;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <PartyPopper className="h-8 w-8 text-success" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-3xl text-charcoal">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-body">
          Thank you for ordering from {branch.name}. Your order reference is below — keep it handy for tracking.
        </p>
        <p className="mt-3 font-display text-xl text-primary">{order.reference}</p>
      </div>

      <div className="mt-8 rounded-card border border-border/60 bg-white p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="text-sm text-body">Payment Status</span>
          <PaymentStatusBadge status={order.payment.status} />
        </div>
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.cartItemId} className="flex items-center justify-between py-3 text-sm">
              <span className="text-charcoal">
                {item.quantity} × {item.name}
              </span>
              <span className="font-semibold text-charcoal">{formatCurrency(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-border pt-4 font-display text-lg">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={`/orders/${order.reference}`} className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
          Track My Order
        </Link>
        <Link href="/menu" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <React.Suspense fallback={null}>
      <OrderConfirmationContent />
    </React.Suspense>
  );
}
