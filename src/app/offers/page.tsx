import type { Metadata } from "next";
import { Tag } from "lucide-react";
import { promotions } from "@/data/promotions";

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
      <div className="grid gap-5 sm:grid-cols-2">
        {promotions.map((promo) => (
          <div key={promo.id} className="rounded-card border border-border/60 bg-white p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Tag className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-3 font-display text-base text-charcoal">{promo.title}</h2>
            <p className="mt-1.5 text-sm text-body">{promo.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full bg-cream-soft px-3 py-1 font-mono text-xs font-bold text-charcoal">{promo.code}</span>
              <span className="text-xs text-body">Valid until {new Date(promo.validUntil).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
