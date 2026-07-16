import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updatedAt="16 July 2026"
      sections={[
        {
          heading: "Information We Collect",
          body: [
            "We collect the information you provide when placing an order, making a reservation, or submitting a catering, cake, academy or event hall request — including your name, phone number, email address, delivery address, and payment receipt.",
            "We also collect information automatically, such as your selected branch, order history, and general usage data to improve our service.",
          ],
        },
        {
          heading: "How We Use Your Information",
          body: [
            "Your information is used to process and fulfil orders, verify payments, communicate order and booking updates, and respond to enquiries. We do not sell your personal information to third parties.",
          ],
        },
        {
          heading: "Payment Receipts",
          body: [
            "Uploaded payment receipts are stored securely and are only accessible to authorised finance staff for the purpose of verifying your payment. Receipts are never shared publicly.",
          ],
        },
        {
          heading: "Your Rights",
          body: [
            "You may request access to, correction of, or deletion of your personal data by contacting us through the Contact page. We will respond within a reasonable timeframe.",
          ],
        },
      ]}
    />
  );
}
