"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Landmark, Clock, CheckCircle2 } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { ReceiptUpload } from "@/components/checkout/receipt-upload";
import { buttonVariants } from "@/components/ui/button";
import { useOrdersStore } from "@/stores/orders-store";
import { branches } from "@/data/branches";
import { formatCurrency, cn } from "@/lib/utils";

function useCountdown(minutes: number) {
  const [secondsLeft, setSecondsLeft] = React.useState(minutes * 60);
  React.useEffect(() => {
    const interval = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, []);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function PaymentPage() {
  const params = useParams<{ reference: string }>();
  const orders = useOrdersStore((s) => s.orders);
  const submitReceipt = useOrdersStore((s) => s.submitReceipt);
  const [hydrated, setHydrated] = React.useState(false);
  const countdown = useCountdown(30);

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
        <p className="mt-2 text-sm text-body">We couldn&apos;t find an order with this reference.</p>
        <Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-6")}>
          Back to Menu
        </Link>
      </div>
    );
  }

  const branch = branches.find((b) => b.slug === order.branchSlug)!;
  const isSubmitted = order.payment.status !== "awaiting-payment";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-charcoal">Complete Your Payment</h1>
        <p className="mt-2 text-sm text-body">Order reference</p>
        <p className="font-display text-xl text-primary">{order.reference}</p>
      </div>

      {isSubmitted ? (
        <div className="rounded-card border border-success/30 bg-success/5 p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
          <h2 className="mt-4 font-display text-xl text-charcoal">Receipt Submitted</h2>
          <p className="mt-2 text-sm text-body">
            Thanks! Our finance team is verifying your payment against the business account. You&apos;ll be notified
            once it&apos;s confirmed — this usually takes a few minutes during business hours.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={`/orders/${order.reference}`} className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
              Track My Order
            </Link>
            <Link href={`/order-confirmation?ref=${order.reference}`} className={cn(buttonVariants({ variant: "outline", size: "md" }))}>
              View Confirmation
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-center gap-2 rounded-full bg-warning/10 px-4 py-2 text-xs font-semibold text-warning">
            <Clock className="h-4 w-4" aria-hidden="true" />
            Please complete payment within {countdown} minutes
          </div>

          <div className="rounded-card border border-border/60 bg-white p-6">
            <div className="mb-5 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="font-display text-lg text-charcoal">Bank Transfer Details — {branch.name}</h2>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <dt className="text-body">Bank Name</dt>
                <dd className="font-semibold text-charcoal">{branch.bankAccount.bankName}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <dt className="text-body">Account Name</dt>
                <dd className="font-semibold text-charcoal">{branch.bankAccount.accountName}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <dt className="text-body">Account Number</dt>
                <dd className="flex items-center gap-2 font-semibold text-charcoal">
                  {branch.bankAccount.accountNumber}
                  <CopyButton value={branch.bankAccount.accountNumber} label="account number" />
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <dt className="text-body">Amount to Pay</dt>
                <dd className="font-display text-lg text-charcoal">{formatCurrency(order.total)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body">Transfer Narration</dt>
                <dd className="flex items-center gap-2 font-semibold text-charcoal">
                  {order.reference}
                  <CopyButton value={order.reference} label="order reference" />
                </dd>
              </div>
            </dl>
            <p className="mt-4 rounded-xl bg-info/10 px-4 py-3 text-xs font-medium text-info">
              Important: include your order reference in the transfer narration so we can match your payment quickly.
            </p>
          </div>

          <div className="mt-6 rounded-card border border-border/60 bg-white p-6">
            <h2 className="mb-1 font-display text-lg text-charcoal">Upload Payment Receipt</h2>
            <p className="mb-4 text-sm text-body">
              Uploading a receipt does not automatically confirm your order — our finance team verifies every payment
              against the account before your order is accepted.
            </p>
            <ReceiptUpload
              reference={order.reference}
              onSubmit={(receipt) => {
                submitReceipt(order.reference, { ...receipt, uploadedAt: new Date().toISOString() });
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
