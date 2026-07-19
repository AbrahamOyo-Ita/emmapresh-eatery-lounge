"use client";

import * as React from "react";
import { CalendarDays, Megaphone, Percent, Plus } from "lucide-react";
import { promotions } from "@/data/promotions";
import { Button } from "@/components/ui/button";

function daysLeft(validUntil: string, now: number) {
  const end = new Date(`${validUntil}T23:59:59`);
  return Math.ceil((end.getTime() - now) / 86400000);
}

export default function AdminPromotionsPage() {
  const [hydrated, setHydrated] = React.useState(false);
  const [now, setNow] = React.useState(0);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHydrated(true);
      setNow(Date.now());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!hydrated) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Promotions</h1>
          <p className="mt-1 text-sm text-body">Manage active demo offers, expiry dates and customer-facing codes.</p>
        </div>
        <Button size="md" disabled>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Promo
        </Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-white p-4">
          <Megaphone className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-3 text-2xl font-bold text-charcoal">{promotions.length}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-body">Active offers</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-white p-4">
          <Percent className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-3 text-2xl font-bold text-charcoal">6</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-body">Discount codes</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-white p-4">
          <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-3 text-2xl font-bold text-charcoal">
            {Math.min(...promotions.map((promo) => daysLeft(promo.validUntil, now)))}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-body">Days to nearest expiry</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white">
        <div className="grid grid-cols-[1.1fr_0.7fr_0.7fr_0.6fr] border-b border-border bg-cream-soft/60 px-4 py-3 text-xs font-bold uppercase tracking-wide text-body">
          <span>Offer</span>
          <span>Code</span>
          <span>Discount</span>
          <span>Expires</span>
        </div>
        {promotions.map((promo) => {
          const remaining = daysLeft(promo.validUntil, now);
          return (
            <div
              key={promo.id}
              className="grid grid-cols-[1.1fr_0.7fr_0.7fr_0.6fr] items-center gap-3 border-b border-border/70 px-4 py-4 last:border-0"
            >
              <div>
                <p className="font-semibold text-charcoal">{promo.title}</p>
                <p className="mt-1 text-xs text-body">{promo.description}</p>
              </div>
              <code className="w-fit rounded-full bg-charcoal px-2.5 py-1 text-xs font-bold text-white">{promo.code}</code>
              <span className="text-sm font-semibold text-charcoal">{promo.discount}</span>
              <span className={remaining <= 30 ? "text-sm font-semibold text-primary" : "text-sm text-body"}>
                {promo.validUntil}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
