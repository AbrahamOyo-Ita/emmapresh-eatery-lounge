"use client";

import * as React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useOrdersStore } from "@/stores/orders-store";
import type { Order, OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const columns: { title: string; statuses: OrderStatus[]; nextStatus?: OrderStatus; nextLabel?: string }[] = [
  { title: "New", statuses: ["order-accepted"], nextStatus: "preparing", nextLabel: "Start Preparing" },
  { title: "Preparing", statuses: ["preparing"], nextStatus: "ready-for-pickup", nextLabel: "Mark Ready" },
  { title: "Ready", statuses: ["ready-for-pickup", "out-for-delivery"], nextStatus: "completed", nextLabel: "Complete" },
  { title: "Completed", statuses: ["completed", "delivered"] },
];

function KitchenCard({
  order,
  now,
  nextStatus,
  nextLabel,
}: {
  order: Order;
  now: number;
  nextStatus?: OrderStatus;
  nextLabel?: string;
}) {
  const updateOrderStatus = useOrdersStore((s) => s.updateOrderStatus);
  const minutesAgo = Math.max(0, Math.round((now - new Date(order.createdAt).getTime()) / 60000));

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <Link href={`/admin/orders/${order.reference}`} className="focus-ring font-display text-sm text-charcoal hover:text-primary">
          {order.reference}
        </Link>
        <span className="flex items-center gap-1 text-xs text-body">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {minutesAgo}m ago
        </span>
      </div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body capitalize">{order.branchSlug} · {order.fulfilmentMethod}</p>
      <ul className="space-y-1 text-sm text-charcoal">
        {order.items.map((item) => (
          <li key={item.cartItemId}>
            {item.quantity} × {item.name}
            {item.selectedOptions.length > 0 && (
              <span className="block text-xs text-body">{item.selectedOptions.map((o) => o.choiceLabel).join(", ")}</span>
            )}
          </li>
        ))}
      </ul>
      {order.items.some((i) => i.specialInstructions) && (
        <p className="mt-2 rounded-lg bg-warning/10 px-2 py-1 text-xs text-warning">
          {order.items.find((i) => i.specialInstructions)?.specialInstructions}
        </p>
      )}
      {nextStatus && (
        <button
          onClick={() => updateOrderStatus(order.reference, nextStatus, `Kitchen moved order to ${nextStatus}`)}
          className="focus-ring mt-3 w-full rounded-full bg-primary py-2 text-xs font-semibold text-white hover:bg-primary-deep"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}

export default function KitchenBoardPage() {
  const orders = useOrdersStore((s) => s.orders);
  const [hydrated, setHydrated] = React.useState(false);
  const [now, setNow] = React.useState(0);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHydrated(true);
      setNow(Date.now());
    });
    const interval = window.setInterval(() => setNow(Date.now()), 60000);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
    };
  }, []);
  if (!hydrated) return null;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Kitchen Board</h1>
      <p className="mt-1 mb-6 text-sm text-body">Live view of orders in progress across all branches.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => {
          const columnOrders = orders.filter((o) => col.statuses.includes(o.status));
          return (
            <div key={col.title} className="rounded-2xl bg-cream-soft/60 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="font-display text-sm text-charcoal">{col.title}</h2>
                <span className={cn("rounded-full bg-white px-2 py-0.5 text-xs font-bold text-charcoal")}>{columnOrders.length}</span>
              </div>
              <div className="space-y-3">
                {columnOrders.map((order) => (
                  <KitchenCard key={order.reference} order={order} now={now} nextStatus={col.nextStatus} nextLabel={col.nextLabel} />
                ))}
                {columnOrders.length === 0 && <p className="px-2 py-6 text-center text-xs text-body">No orders</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
