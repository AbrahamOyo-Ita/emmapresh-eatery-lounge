import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updatedAt="16 July 2026"
      sections={[
        {
          heading: "Placing an Order",
          body: [
            "By placing an order through this platform, you confirm that the information you provide (name, contact details, delivery address) is accurate. Orders are confirmed only after payment has been verified by our finance team.",
          ],
        },
        {
          heading: "Pricing",
          body: [
            "Prices shown are specific to your selected branch and may vary between locations. All prices are in Nigerian Naira (₦) and are subject to change without prior notice, though your order total is locked in once payment is verified.",
          ],
        },
        {
          heading: "Age Restrictions",
          body: [
            "Alcoholic drinks require age confirmation at checkout. By confirming, you declare that you are 18 years or older. We reserve the right to refuse delivery of alcoholic items where age cannot be reasonably verified.",
          ],
        },
        {
          heading: "Account Use",
          body: [
            "Guest checkout is available for all orders. If you create an account, you are responsible for maintaining the confidentiality of your login details.",
          ],
        },
      ]}
    />
  );
}
