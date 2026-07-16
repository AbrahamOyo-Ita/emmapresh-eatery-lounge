import type { Order, OrderStatus, BranchSlug, FulfilmentMethod } from "@/types";
import { menuItems } from "./menu-items";
import { branches } from "./branches";
import { generateOrderReference } from "@/lib/utils";

const customerNames = [
  "Ada Eze", "Kunle Adisa", "Grace Okonkwo", "Yusuf Bello", "Amaka Nwosu",
  "David Okafor", "Fatima Sani", "Chinedu Uche", "Peace Effiong", "Sam Adebayo",
  "Ifeoma Chukwu", "Bashir Umar", "Joy Okoro", "Emeka Nnamdi", "Ronke Ajayi",
];

const statuses: OrderStatus[] = [
  "awaiting-payment", "payment-submitted", "payment-under-review", "payment-verified",
  "order-accepted", "preparing", "preparing", "ready-for-pickup", "out-for-delivery",
  "delivered", "completed", "completed", "completed", "cancelled", "refunded",
];

const fulfilments: FulfilmentMethod[] = ["delivery", "pickup", "dine-in"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function buildOrder(index: number): Order {
  const branch: BranchSlug = pick(branches, index).slug;
  const status = pick(statuses, index);
  const fulfilmentMethod = pick(fulfilments, index);
  const item1 = pick(menuItems, index);
  const item2 = pick(menuItems, index + 5);
  const quantity1 = 1 + (index % 3);
  const quantity2 = 1 + ((index + 1) % 2);
  const unitPrice1 = item1.branchPrices?.[branch] ?? item1.price;
  const unitPrice2 = item2.branchPrices?.[branch] ?? item2.price;
  const line1 = unitPrice1 * quantity1;
  const line2 = unitPrice2 * quantity2;
  const subtotal = line1 + line2;
  const deliveryFee = fulfilmentMethod === "delivery" ? (branches.find((b) => b.slug === branch)?.deliveryFee ?? 1500) : 0;
  const serviceCharge = Math.round(subtotal * 0.02);
  const total = subtotal + deliveryFee + serviceCharge;
  const createdAt = new Date(Date.now() - (index + 1) * 1000 * 60 * 60 * 6).toISOString();

  const paymentStatus =
    status === "awaiting-payment" ? "awaiting-payment" :
    status === "payment-submitted" ? "payment-submitted" :
    status === "payment-under-review" ? "payment-under-review" :
    status === "cancelled" ? "payment-rejected" :
    status === "refunded" ? "refunded" :
    "payment-verified";

  return {
    reference: generateOrderReference(),
    branchSlug: branch,
    items: [
      {
        cartItemId: `seed-${index}-1`,
        menuItemId: item1.id,
        slug: item1.slug,
        name: item1.name,
        image: item1.image,
        branchSlug: branch,
        unitPrice: unitPrice1,
        quantity: quantity1,
        selectedOptions: [],
        lineTotal: line1,
      },
      {
        cartItemId: `seed-${index}-2`,
        menuItemId: item2.id,
        slug: item2.slug,
        name: item2.name,
        image: item2.image,
        branchSlug: branch,
        unitPrice: unitPrice2,
        quantity: quantity2,
        selectedOptions: [],
        lineTotal: line2,
      },
    ],
    customer: {
      name: pick(customerNames, index),
      phone: `080${(10000000 + index * 137).toString().slice(0, 8)}`,
      email: `${pick(customerNames, index).toLowerCase().replace(/\s+/g, ".")}@example.com`,
    },
    fulfilmentMethod,
    delivery:
      fulfilmentMethod === "delivery"
        ? { address: `${10 + index} Garki Street`, city: branch, landmark: "Near the market" }
        : fulfilmentMethod === "dine-in"
          ? { tableNumber: String(1 + (index % 12)) }
          : undefined,
    requestedTime: "As soon as possible",
    subtotal,
    deliveryFee,
    serviceCharge,
    discount: 0,
    total,
    payment: {
      method: "bank-transfer",
      status: paymentStatus,
      amountExpected: total,
      receipt:
        paymentStatus !== "awaiting-payment"
          ? {
              fileName: "receipt.jpg",
              fileType: "image/jpeg",
              fileSizeBytes: 240000,
              dataUrl: "",
              uploadedAt: createdAt,
            }
          : undefined,
      verification:
        paymentStatus === "payment-verified"
          ? {
              verifiedBy: "Finance Officer",
              verifiedAt: createdAt,
              amountReceived: total,
              paymentReference: `TRX${1000 + index}`,
              paymentDate: createdAt,
            }
          : undefined,
    },
    status,
    statusHistory: [{ status: "order-created", timestamp: createdAt }],
    createdAt,
    updatedAt: createdAt,
  };
}

export const seedOrders: Order[] = Array.from({ length: 15 }).map((_, i) => buildOrder(i));
