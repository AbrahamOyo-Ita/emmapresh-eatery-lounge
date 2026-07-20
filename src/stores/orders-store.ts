import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, FulfilmentMethod, Order, OrderStatus, PaymentMethod, BranchSlug } from "@/types";
import { seedOrders } from "@/data/orders-seed";
import { generateOrderReference } from "@/lib/utils";
import { branches } from "@/data/branches";
import { patchEntity, persistEntity } from "@/lib/backend-client";

/**
 * This store is the in-memory + localStorage-persisted "database" for orders.
 * It simulates a shared backend so the customer checkout flow and the admin
 * dashboard read/write the same data within a browser session. In production
 * this entire module is replaced by Supabase tables + server actions — the
 * function signatures below are the integration contract to preserve.
 */

interface CreateOrderInput {
  branchSlug: BranchSlug;
  items: CartItem[];
  customer: Order["customer"];
  fulfilmentMethod: FulfilmentMethod;
  delivery?: Order["delivery"];
  requestedTime: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  discount: number;
  total: number;
}

interface OrdersState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  createOrder: (input: CreateOrderInput) => Order;
  getOrderByReference: (reference: string) => Order | undefined;
  submitReceipt: (reference: string, receipt: NonNullable<Order["payment"]["receipt"]>) => Promise<void>;
  verifyPayment: (
    reference: string,
    approve: boolean,
    verification: Order["payment"]["verification"] & { rejectionReason?: string }
  ) => void;
  updateOrderStatus: (reference: string, status: OrderStatus, note?: string) => void;
  setInternalNotes: (reference: string, notes: string) => void;
}

function pushStatus(order: Order, status: OrderStatus, note?: string): Order {
  return {
    ...order,
    status,
    updatedAt: new Date().toISOString(),
    statusHistory: [...order.statusHistory, { status, timestamp: new Date().toISOString(), note }],
  };
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      setOrders: (orders) => set({ orders }),
      createOrder: (input) => {
        const now = new Date().toISOString();
        const branch = branches.find((b) => b.slug === input.branchSlug);
        const order: Order = {
          reference: generateOrderReference(),
          branchSlug: input.branchSlug,
          items: input.items,
          customer: input.customer,
          fulfilmentMethod: input.fulfilmentMethod,
          delivery: input.delivery,
          requestedTime: input.requestedTime,
          subtotal: input.subtotal,
          deliveryFee: input.deliveryFee,
          serviceCharge: input.serviceCharge,
          discount: input.discount,
          total: input.total,
          payment: {
            method: input.paymentMethod,
            status: input.paymentMethod === "bank-transfer" ? "awaiting-payment" : "payment-verified",
            amountExpected: input.total,
          },
          status: input.paymentMethod === "bank-transfer" ? "awaiting-payment" : "order-created",
          statusHistory: [{ status: "order-created", timestamp: now }],
          createdAt: now,
          updatedAt: now,
        };
        void branch;
        set({ orders: [order, ...get().orders] });
        persistEntity("orders", order);
        return order;
      },
      getOrderByReference: (reference) => get().orders.find((o) => o.reference === reference),
      submitReceipt: async (reference, receipt) => {
        const existing = get().getOrderByReference(reference);
        if (!existing) return;
        const statusUpdated = pushStatus(existing, "payment-submitted", "Customer uploaded payment receipt");
        const updatedOrder: Order = {
          ...statusUpdated,
          payment: { ...statusUpdated.payment, status: "payment-submitted", receipt },
        };
        set({
          orders: get().orders.map((order) => (order.reference === reference ? updatedOrder : order)),
        });
        await persistEntity("orders", updatedOrder);
      },
      verifyPayment: (reference, approve, verification) => {
        set({
          orders: get().orders.map((order) => {
            if (order.reference !== reference) return order;
            if (approve) {
              const updated = pushStatus(order, "payment-verified", "Payment verified by finance");
              return {
                ...updated,
                payment: { ...updated.payment, status: "payment-verified", verification },
              };
            }
            const updated = pushStatus(order, "payment-under-review", verification.rejectionReason ?? "Payment rejected — clearer receipt requested");
            return {
              ...updated,
              payment: { ...updated.payment, status: "payment-rejected", verification },
            };
          }),
        });
        patchEntity("orders", reference, {
          status: get().getOrderByReference(reference)?.status,
          payment: get().getOrderByReference(reference)?.payment,
          statusHistory: get().getOrderByReference(reference)?.statusHistory,
        });
      },
      updateOrderStatus: (reference, status, note) => {
        set({
          orders: get().orders.map((order) =>
            order.reference === reference ? pushStatus(order, status, note) : order
          ),
        });
        patchEntity("orders", reference, {
          status,
          statusHistory: get().getOrderByReference(reference)?.statusHistory,
        });
      },
      setInternalNotes: (reference, notes) => {
        set({
          orders: get().orders.map((order) =>
            order.reference === reference ? { ...order, internalNotes: notes, updatedAt: new Date().toISOString() } : order
          ),
        });
        patchEntity("orders", reference, { internalNotes: notes });
      },
    }),
    { name: "emmapresh-orders" }
  )
);
