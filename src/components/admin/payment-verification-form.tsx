"use client";

import * as React from "react";
import { FileText, CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useOrdersStore } from "@/stores/orders-store";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types";

export function PaymentVerificationForm({ order }: { order: Order }) {
  const verifyPayment = useOrdersStore((s) => s.verifyPayment);
  const [amountReceived, setAmountReceived] = React.useState(String(order.total));
  const [paymentReference, setPaymentReference] = React.useState("");
  const [paymentDate, setPaymentDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = React.useState("");
  const [showReject, setShowReject] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  async function handleApprove() {
    setSubmitting(true); setSubmitError(null);
    try { await verifyPayment(order.reference, true, {
      verifiedBy: "Finance Officer",
      verifiedAt: new Date().toISOString(),
      amountReceived: Number(amountReceived),
      paymentReference,
      paymentDate,
      note,
    }); } catch (error) { setSubmitError(error instanceof Error ? error.message : "Approval failed."); } finally { setSubmitting(false); }
  }

  async function handleReject() {
    setSubmitting(true); setSubmitError(null);
    try { await verifyPayment(order.reference, false, {
      verifiedBy: "Finance Officer",
      verifiedAt: new Date().toISOString(),
      rejectionReason: rejectionReason || "Receipt unclear or amount does not match",
    }); } catch (error) { setSubmitError(error instanceof Error ? error.message : "Rejection failed."); } finally { setSubmitting(false); }
  }

  if (order.payment.method !== "bank-transfer") {
    return <p className="text-sm text-body">This order uses {order.payment.method.replace("-", " ")} — no receipt verification required.</p>;
  }

  if (!order.payment.receipt) {
    return <p className="text-sm text-body">Customer has not uploaded a payment receipt yet.</p>;
  }

  const alreadyProcessed = order.payment.status === "payment-verified" || order.payment.status === "payment-rejected";
  const receipt = order.payment.receipt;
  const receiptHref = receipt.storagePath
    ? `/api/admin/receipt?path=${encodeURIComponent(receipt.storagePath)}`
    : receipt.url || receipt.dataUrl;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border p-3">
        {receipt.fileType === "application/pdf" ? (
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-cream-soft">
            <FileText className="h-6 w-6 text-body" aria-hidden="true" />
          </span>
        ) : receipt.dataUrl || receipt.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={receipt.dataUrl || receipt.url} alt="Payment receipt" className="h-14 w-14 rounded-xl object-cover" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-cream-soft text-xs text-body">No preview</span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-charcoal">{receipt.fileName}</p>
          <p className="text-xs text-body">Uploaded {new Date(receipt.uploadedAt).toLocaleString()}</p>
        </div>
        {receiptHref && (
          <a
            href={receiptHref}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-full bg-charcoal px-3 py-2 text-xs font-semibold text-white hover:bg-soft-black"
          >
            Open receipt
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </div>

      {alreadyProcessed ? (
        <div className="rounded-2xl bg-cream-soft px-4 py-3 text-sm">
          {order.payment.status === "payment-verified" ? (
            <p className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Verified by {order.payment.verification?.verifiedBy} — {formatCurrency(order.payment.verification?.amountReceived ?? 0)} received.
            </p>
          ) : (
            <p className="flex items-center gap-2 text-error">
              <XCircle className="h-4 w-4" aria-hidden="true" /> Rejected: {order.payment.verification?.rejectionReason}
            </p>
          )}
        </div>
      ) : showReject ? (
        <div className="space-y-3">
          <div>
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea id="rejection-reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="E.g. amount does not match, receipt unclear..." />
          </div>
          <div className="grid gap-2 sm:flex">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => setShowReject(false)}>Cancel</Button>
            <Button className="w-full bg-error hover:bg-error/90 sm:w-auto" variant="primary" onClick={handleReject} loading={submitting}>Confirm Rejection</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="amount-received">Amount Received</Label>
              <Input id="amount-received" type="number" value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="payment-reference">Payment Reference</Label>
              <Input id="payment-reference" value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="Bank transaction ref" />
            </div>
            <div>
              <Label htmlFor="payment-date">Payment Date</Label>
              <Input id="payment-date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="verification-note">Verification Note (optional)</Label>
            <Textarea id="verification-note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div className="grid gap-2 sm:flex">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => setShowReject(true)}>
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Reject
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleApprove} loading={submitting}>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Approve Payment
            </Button>
          </div>
          {submitError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-error">{submitError}</p>}
        </div>
      )}
    </div>
  );
}
