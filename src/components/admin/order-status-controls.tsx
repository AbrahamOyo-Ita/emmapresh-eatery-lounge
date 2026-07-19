"use client";

import { Button } from "@/components/ui/button";
import { useOrdersStore } from "@/stores/orders-store";
import type { Order, OrderStatus } from "@/types";

function getNextActions(order: Order): { label: string; status: OrderStatus; variant?: "primary" | "outline" }[] {
  const { status, fulfilmentMethod } = order;
  const actions: { label: string; status: OrderStatus; variant?: "primary" | "outline" }[] = [];

  switch (status) {
    case "order-created":
    case "payment-verified":
      actions.push({ label: "Accept Order", status: "order-accepted" });
      break;
    case "order-accepted":
      actions.push({ label: "Start Preparing", status: "preparing" });
      break;
    case "preparing":
      if (fulfilmentMethod === "dine-in") {
        actions.push({ label: "Mark Completed", status: "completed" });
      } else {
        actions.push({ label: "Mark Ready", status: "ready-for-pickup" });
      }
      break;
    case "ready-for-pickup":
      if (fulfilmentMethod === "delivery") {
        actions.push({ label: "Send Out for Delivery", status: "out-for-delivery" });
      } else {
        actions.push({ label: "Mark Completed (Picked Up)", status: "completed" });
      }
      break;
    case "out-for-delivery":
      actions.push({ label: "Mark Delivered", status: "delivered" });
      break;
    case "delivered":
      actions.push({ label: "Mark Completed", status: "completed" });
      break;
    default:
      break;
  }

  const cancellable = !["completed", "cancelled", "refunded", "delivered"].includes(status);
  if (cancellable) {
    actions.push({ label: "Cancel Order", status: "cancelled", variant: "outline" });
  }

  return actions;
}

export function OrderStatusControls({ order }: { order: Order }) {
  const updateOrderStatus = useOrdersStore((s) => s.updateOrderStatus);
  const actions = getNextActions(order);

  if (actions.length === 0) {
    return <p className="text-sm text-body">No further actions available for this order.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.status}
          variant={action.variant ?? "primary"}
          size="sm"
          onClick={() => updateOrderStatus(order.reference, action.status, `Staff moved order to ${action.status}`)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
