import type { Metadata } from "next";
import { OffersList } from "@/components/offers/offers-list";

export const metadata: Metadata = {
  title: "Offers & Promotions",
  description: "Current discounts and promotions at EmmaPresh Eatery & Lounge.",
};

export default function OffersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Offers &amp; Promotions</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-body">Apply these codes at checkout or academy/catering booking.</p>
      </div>
      <OffersList />
    </div>
  );
}
