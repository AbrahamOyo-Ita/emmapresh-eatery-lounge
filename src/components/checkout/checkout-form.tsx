"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bike, Store, UtensilsCrossed, Check, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Input, Label, FieldError, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { BranchSelector } from "@/components/layout/branch-selector";
import { checkoutSchema, type CheckoutFormValues } from "@/schemas/checkout";
import { useCartStore } from "@/stores/cart-store";
import { useBranchStore } from "@/stores/branch-store";
import { useOrdersStore } from "@/stores/orders-store";
import { useCustomerSessionStore } from "@/stores/customer-session-store";
import { branches } from "@/data/branches";
import { formatCurrency, cn } from "@/lib/utils";
import type { FulfilmentMethod, PaymentMethod } from "@/types";

const steps = ["Fulfilment", "Your Details", "Schedule", "Review", "Payment"] as const;

const timeSlots = ["As soon as possible", "In 1 hour", "Today, 2:00 PM", "Today, 5:00 PM", "Tomorrow, 12:00 PM"];

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const branchSlug = useBranchStore((s) => s.selectedBranch) ?? "lagos";
  const createOrder = useOrdersStore((s) => s.createOrder);
  const setCustomerSession = useCustomerSessionStore((s) => s.setSession);
  const branch = branches.find((b) => b.slug === branchSlug)!;

  const [stepIndex, setStepIndex] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [successOrder, setSuccessOrder] = React.useState<{ reference: string; paymentMethod: PaymentMethod } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fulfilmentMethod: "delivery",
      customer: { name: "", phone: "", email: "" },
      delivery: { address: "", city: branch.city, landmark: "" },
      requestedTime: "",
      paymentMethod: "bank-transfer",
    },
  });

  const fulfilmentMethod = watch("fulfilmentMethod");
  const paymentMethod = watch("paymentMethod");

  const subtotalAmount = subtotal();
  const deliveryFee = fulfilmentMethod === "delivery" ? branch.deliveryFee : 0;
  const serviceCharge = Math.round(subtotalAmount * 0.02);
  const total = subtotalAmount + deliveryFee + serviceCharge;

  async function goNext() {
    let fieldsToValidate: (keyof CheckoutFormValues | `customer.${string}` | `delivery.${string}`)[] = [];
    if (stepIndex === 1) fieldsToValidate = ["customer.name", "customer.phone", "customer.email"];
    if (stepIndex === 2) {
      fieldsToValidate =
        fulfilmentMethod === "delivery"
          ? ["delivery.address", "delivery.city", "requestedTime"]
          : fulfilmentMethod === "dine-in"
            ? ["tableNumber", "requestedTime"]
            : ["requestedTime"];
    }
    const valid = fieldsToValidate.length === 0 ? true : await trigger(fieldsToValidate as never);
    if (valid) setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function onSubmit(data: CheckoutFormValues) {
    if (items.length === 0) return;
    setSubmitting(true);
    const order = createOrder({
      branchSlug,
      items,
      customer: data.customer,
      fulfilmentMethod: data.fulfilmentMethod,
      delivery:
        data.fulfilmentMethod === "delivery"
          ? data.delivery
          : data.fulfilmentMethod === "dine-in"
            ? { tableNumber: data.tableNumber }
            : undefined,
      requestedTime: data.requestedTime,
      paymentMethod: data.paymentMethod,
      subtotal: subtotalAmount,
      deliveryFee,
      serviceCharge,
      discount: 0,
      total,
    });
    clearCart();
    setCustomerSession(data.customer);
    setSuccessOrder({ reference: order.reference, paymentMethod: data.paymentMethod });
    setSubmitting(false);
  }

  function continueAfterSuccess() {
    if (!successOrder) return;
    if (successOrder.paymentMethod === "bank-transfer") {
      router.push(`/payment/${successOrder.reference}`);
    } else {
      router.push(`/order-confirmation?ref=${successOrder.reference}`);
    }
  }

  if (items.length === 0 && !successOrder) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="font-display text-2xl text-charcoal">Your cart is empty</p>
        <p className="mt-2 text-sm text-body">Add items to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px]">
      <Dialog open={!!successOrder} onClose={() => {}} widthClassName="max-w-md">
        <div className="p-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-xl text-charcoal">Order Placed Successfully</h2>
          <p className="mt-2 text-sm leading-6 text-body">
            Your order has been received. We will confirm your order and keep you updated as our team reviews the
            details.
          </p>
          {successOrder && (
            <div className="mt-4 rounded-xl bg-cream-soft px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-body">Order Reference</p>
              <p className="mt-1 font-display text-lg text-primary">{successOrder.reference}</p>
            </div>
          )}
          <p className="mt-4 text-xs text-body">
            {successOrder?.paymentMethod === "bank-transfer"
              ? "Next, upload your transfer receipt so finance can verify the payment."
              : "You can now view your confirmation and track the order status."}
          </p>
          <Button className="mt-5 w-full" size="lg" onClick={continueAfterSuccess}>
            {successOrder?.paymentMethod === "bank-transfer" ? "Continue to Payment" : "View Confirmation"}
          </Button>
        </div>
      </Dialog>
      <div>
        <ol className="mb-8 flex flex-wrap items-center gap-2" aria-label="Checkout steps">
          {steps.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                  i < stepIndex ? "bg-success text-white" : i === stepIndex ? "bg-primary text-white" : "bg-cream-soft text-body"
                )}
              >
                {i < stepIndex ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
              </span>
              <span className={cn("hidden text-xs font-semibold sm:inline", i === stepIndex ? "text-charcoal" : "text-body")}>
                {step}
              </span>
              {i < steps.length - 1 && <span className="mx-1 h-px w-4 bg-border sm:mx-2" aria-hidden="true" />}
            </li>
          ))}
        </ol>

        <form onSubmit={handleSubmit(onSubmit)}>
          {stepIndex === 0 && (
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-semibold text-charcoal">Confirm your branch</p>
                <BranchSelector />
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-charcoal">How would you like to receive your order?</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      { value: "delivery", label: "Delivery", icon: Bike },
                      { value: "pickup", label: "Pickup", icon: Store },
                      { value: "dine-in", label: "Dine-In", icon: UtensilsCrossed },
                    ] as { value: FulfilmentMethod; label: string; icon: typeof Bike }[]
                  ).map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => setValue("fulfilmentMethod", option.value)}
                      className={cn(
                        "focus-ring flex flex-col items-center gap-2 rounded-2xl border p-5 transition-colors",
                        fulfilmentMethod === option.value ? "border-primary bg-primary/5" : "border-border hover:border-charcoal"
                      )}
                      aria-pressed={fulfilmentMethod === option.value}
                    >
                      <option.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      <span className="text-sm font-semibold text-charcoal">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer-name">Full Name</Label>
                <Input id="customer-name" {...register("customer.name")} error={errors.customer?.name?.message} />
                <FieldError>{errors.customer?.name?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="customer-phone">Phone Number</Label>
                <Input id="customer-phone" {...register("customer.phone")} error={errors.customer?.phone?.message} />
                <FieldError>{errors.customer?.phone?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="customer-email">Email Address</Label>
                <Input id="customer-email" type="email" {...register("customer.email")} error={errors.customer?.email?.message} />
                <FieldError>{errors.customer?.email?.message}</FieldError>
              </div>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-4">
              {fulfilmentMethod === "delivery" && (
                <>
                  <div>
                    <Label htmlFor="delivery-address">Delivery Address</Label>
                    <Textarea id="delivery-address" {...register("delivery.address")} error={errors.delivery?.address?.message} />
                    <FieldError>{errors.delivery?.address?.message}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="delivery-city">City</Label>
                    <Input id="delivery-city" {...register("delivery.city")} error={errors.delivery?.city?.message} />
                    <FieldError>{errors.delivery?.city?.message}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="delivery-landmark">Landmark (optional)</Label>
                    <Input id="delivery-landmark" {...register("delivery.landmark")} />
                  </div>
                </>
              )}
              {fulfilmentMethod === "dine-in" && (
                <div>
                  <Label htmlFor="table-number">Table Number</Label>
                  <Input id="table-number" {...register("tableNumber")} error={errors.tableNumber?.message} />
                  <FieldError>{errors.tableNumber?.message}</FieldError>
                </div>
              )}
              {fulfilmentMethod === "pickup" && (
                <p className="rounded-xl bg-cream-soft px-4 py-3 text-sm text-body">
                  You&apos;ll pick up your order at {branch.name}, {branch.address}.
                </p>
              )}
              <div>
                <Label htmlFor="requested-time">Preferred Time</Label>
                <Select
                  id="requested-time"
                  {...register("requestedTime")}
                  error={errors.requestedTime?.message}
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Select>
                <FieldError>{errors.requestedTime?.message}</FieldError>
              </div>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-charcoal">Review your order</p>
              <ul className="divide-y divide-border rounded-2xl border border-border">
                {items.map((item) => (
                  <li key={item.cartItemId} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-charcoal">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="font-semibold text-charcoal">{formatCurrency(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stepIndex === 4 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-charcoal">Choose a payment method</p>
              {(
                [
                  { value: "bank-transfer", label: "Bank Transfer", description: "Pay via transfer and upload your receipt for verification." },
                  { value: "pay-on-delivery", label: "Pay on Delivery", description: "Pay in cash or card when your order arrives." },
                  { value: "pay-at-pickup", label: "Pay at Pickup", description: "Pay in cash or card when you collect your order." },
                ] as { value: PaymentMethod; label: string; description: string }[]
              ).map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setValue("paymentMethod", option.value)}
                  className={cn(
                    "focus-ring flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition-colors",
                    paymentMethod === option.value ? "border-primary bg-primary/5" : "border-border hover:border-charcoal"
                  )}
                  aria-pressed={paymentMethod === option.value}
                >
                  <span>
                    <span className="block text-sm font-semibold text-charcoal">{option.label}</span>
                    <span className="block text-xs text-body">{option.description}</span>
                  </span>
                  {paymentMethod === option.value && <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            {stepIndex > 0 ? (
              <Button type="button" variant="outline" onClick={goBack}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </Button>
            ) : (
              <span />
            )}
            {stepIndex < steps.length - 1 ? (
              <Button key="continue-btn" type="button" onClick={goNext}>
                Continue
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button key="place-order-btn" type="submit" loading={submitting}>
                Place Order
              </Button>
            )}
          </div>
        </form>
      </div>

      <aside className="h-fit rounded-card border border-border/60 bg-white p-6">
        <h2 className="font-display text-lg text-charcoal">Order Summary</h2>
        <p className="mt-1 text-xs text-body">{branch.name}</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-body">Subtotal</span>
            <span className="text-charcoal">{formatCurrency(subtotalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-body">Delivery Fee</span>
            <span className="text-charcoal">{deliveryFee > 0 ? formatCurrency(deliveryFee) : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-body">Service Charge</span>
            <span className="text-charcoal">{formatCurrency(serviceCharge)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-display text-base">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
