"use client";

import * as React from "react";
import { Tag } from "lucide-react";
import { usePromotionsStore } from "@/stores/promotions-store";

export function OffersList() {
  const promotions = usePromotionsStore((state) => state.promotions);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const visible = hydrated ? promotions : [];

  if (!hydrated) return <div className="h-48 animate-pulse rounded-card bg-cream-soft" aria-label="Loading offers" />;
  if (visible.length === 0) return <p className="rounded-card border border-border bg-white p-8 text-center text-sm text-body">No active promotions right now. Please check back soon.</p>;

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {visible.map((promo) => (
        <article key={promo.id} className="min-w-0 rounded-card border border-border/60 bg-white p-5 shadow-[var(--shadow-soft)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Tag className="h-5 w-5" aria-hidden="true" /></span>
          <h2 className="mt-3 font-display text-base text-charcoal">{promo.title}</h2>
          <p className="mt-1.5 text-sm text-body">{promo.description}</p>
          <div className="mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="max-w-full break-all rounded-full bg-cream-soft px-3 py-1 font-mono text-xs font-bold text-charcoal">{promo.code}</span>
            <span className="text-xs text-body">Valid until {new Date(`${promo.validUntil}T00:00:00`).toLocaleDateString("en-NG")}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
