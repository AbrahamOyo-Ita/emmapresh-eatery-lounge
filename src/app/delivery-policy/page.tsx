import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Delivery Policy" };

export default function DeliveryPolicyPage() {
  return (
    <LegalPage
      title="Delivery Policy"
      updatedAt="16 July 2026"
      sections={[
        {
          heading: "Delivery Areas & Fees",
          body: [
            "Delivery fees and coverage areas vary by branch — the fee for your address is shown before you confirm your order at checkout. Orders above each branch's free-delivery threshold qualify for free delivery.",
          ],
        },
        {
          heading: "Delivery Times",
          body: [
            "Estimated delivery times are shown at checkout and typically range from 35–70 minutes depending on your branch, order size and distance. Delivery times may be longer during peak hours or large catering orders.",
          ],
        },
        {
          heading: "Pickup Orders",
          body: [
            "Pickup orders can be collected from your selected branch once marked \"Ready for Pickup\" in your order tracking page. Please bring your order reference.",
          ],
        },
        {
          heading: "Failed Delivery Attempts",
          body: [
            "If our delivery rider cannot reach you at the provided address or phone number, we will attempt to contact you before returning the order to the branch. Repeated failed attempts may incur a re-delivery fee.",
          ],
        },
      ]}
    />
  );
}
