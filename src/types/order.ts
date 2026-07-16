import type { BranchSlug } from "./branch";
import type { CartItem, FulfilmentMethod } from "./cart";
import type { Payment } from "./payment";

export type OrderStatus =
  | "order-created"
  | "awaiting-payment"
  | "payment-submitted"
  | "payment-under-review"
  | "payment-verified"
  | "order-accepted"
  | "preparing"
  | "ready-for-pickup"
  | "awaiting-dispatch"
  | "out-for-delivery"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded";

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string;
}

export interface OrderDeliveryInfo {
  address?: string;
  city?: string;
  landmark?: string;
  tableNumber?: string;
}

export interface Order {
  reference: string;
  branchSlug: BranchSlug;
  items: CartItem[];
  customer: OrderCustomer;
  fulfilmentMethod: FulfilmentMethod;
  delivery?: OrderDeliveryInfo;
  requestedTime?: string;
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  discount: number;
  total: number;
  payment: Payment;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  createdAt: string;
  updatedAt: string;
  internalNotes?: string;
}
