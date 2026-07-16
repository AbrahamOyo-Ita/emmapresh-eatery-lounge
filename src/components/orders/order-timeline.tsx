import { Check } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const trackSteps: OrderStatus[] = [
  "order-created",
  "payment-verified",
  "order-accepted",
  "preparing",
  "ready-for-pickup",
  "out-for-delivery",
  "delivered",
];

const labels: Partial<Record<OrderStatus, string>> = {
  "order-created": "Order Placed",
  "payment-verified": "Payment Verified",
  "order-accepted": "Order Accepted",
  preparing: "Preparing",
  "ready-for-pickup": "Ready for Pickup",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
};

export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === "cancelled" || order.status === "refunded") {
    return (
      <div className="rounded-2xl bg-error/10 px-5 py-4 text-sm font-semibold text-error">
        This order was {order.status}. Contact support if you have questions.
      </div>
    );
  }

  const relevantSteps = order.fulfilmentMethod === "delivery" ? trackSteps : trackSteps.filter((s) => s !== "out-for-delivery" && s !== "delivered");
  const finalSteps = order.fulfilmentMethod !== "delivery" ? [...relevantSteps, "completed" as OrderStatus] : relevantSteps;
  const currentIndex = Math.max(
    finalSteps.findIndex((s) => s === order.status),
    order.status === "completed" ? finalSteps.length - 1 : -1
  );

  return (
    <ol className="space-y-0">
      {finalSteps.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === finalSteps.length - 1;
        return (
          <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={cn("absolute left-3.5 top-8 h-full w-0.5 -translate-x-1/2", done ? "bg-success" : "bg-border")}
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                done ? "bg-success text-white" : "bg-cream-soft text-body"
              )}
            >
              {done && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
            </span>
            <div>
              <p className={cn("text-sm font-semibold", done ? "text-charcoal" : "text-body")}>
                {labels[step] ?? step}
              </p>
              {i === currentIndex && (
                <p className="mt-0.5 text-xs text-body">Current status</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
