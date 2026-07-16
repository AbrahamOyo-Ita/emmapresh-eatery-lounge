import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updatedAt="16 July 2026"
      sections={[
        {
          heading: "Order Cancellations",
          body: [
            "Orders can be cancelled free of charge before payment is verified. Once an order enters preparation, cancellations are reviewed on a case-by-case basis and may not be eligible for a full refund.",
          ],
        },
        {
          heading: "Incorrect or Missing Items",
          body: [
            "If your order arrives incomplete or incorrect, contact us within 2 hours of delivery with your order reference. We will arrange a replacement or a refund of the affected item.",
          ],
        },
        {
          heading: "Overpayment",
          body: [
            "If our finance team identifies an overpayment during verification, it will be recorded on your order and refunded to the original payment account, or applied as credit toward a future order at your preference.",
          ],
        },
        {
          heading: "Catering, Cakes, Academy & Hall Deposits",
          body: [
            "Deposits for catering, custom cakes, academy courses and event halls are refundable up to 7 days before the scheduled date, minus any costs already committed on your behalf (e.g. ingredients purchased for a custom cake).",
          ],
        },
      ]}
    />
  );
}
