import { Badge } from "./badge";
import type { OrderStatus } from "@/types";
import type { PaymentStatus } from "@/types";

const orderStatusMap: Record<OrderStatus, { label: string; variant: "neutral" | "primary" | "accent" | "success" | "warning" | "error" | "info" }> = {
  "order-created": { label: "Order Created", variant: "info" },
  "awaiting-payment": { label: "Awaiting Payment", variant: "warning" },
  "payment-submitted": { label: "Payment Submitted", variant: "info" },
  "payment-under-review": { label: "Payment Under Review", variant: "warning" },
  "payment-verified": { label: "Payment Verified", variant: "success" },
  "order-accepted": { label: "Order Accepted", variant: "info" },
  preparing: { label: "Preparing", variant: "accent" },
  "ready-for-pickup": { label: "Ready for Pickup", variant: "success" },
  "awaiting-dispatch": { label: "Awaiting Dispatch", variant: "warning" },
  "out-for-delivery": { label: "Out for Delivery", variant: "info" },
  delivered: { label: "Delivered", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "error" },
  refunded: { label: "Refunded", variant: "neutral" },
};

const paymentStatusMap: Record<PaymentStatus, { label: string; variant: "neutral" | "primary" | "accent" | "success" | "warning" | "error" | "info" }> = {
  "awaiting-payment": { label: "Awaiting Payment", variant: "warning" },
  "payment-submitted": { label: "Receipt Submitted", variant: "info" },
  "payment-under-review": { label: "Under Review", variant: "warning" },
  "payment-verified": { label: "Verified", variant: "success" },
  "payment-rejected": { label: "Rejected", variant: "error" },
  "partial-payment": { label: "Partial Payment", variant: "warning" },
  refunded: { label: "Refunded", variant: "neutral" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = orderStatusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = paymentStatusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
