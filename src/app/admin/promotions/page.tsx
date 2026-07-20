"use client";

import * as React from "react";
import { CalendarDays, Megaphone, Percent, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { usePromotionsStore } from "@/stores/promotions-store";

function daysLeft(validUntil: string, now: number) {
  const end = new Date(`${validUntil}T23:59:59`);
  return Math.ceil((end.getTime() - now) / 86400000);
}

export default function AdminPromotionsPage() {
  const [hydrated, setHydrated] = React.useState(false);
  const [now, setNow] = React.useState(0);
  const promotions = usePromotionsStore((state) => state.promotions);
  const addPromotion = usePromotionsStore((state) => state.addPromotion);
  const removePromotion = usePromotionsStore((state) => state.removePromotion);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", description: "", code: "", discount: "", validUntil: "" });

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHydrated(true);
      setNow(Date.now());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!hydrated) return null;

  function createPromotion(event: React.FormEvent) {
    event.preventDefault();
    addPromotion({ ...form, code: form.code.trim().toUpperCase() });
    setForm({ title: "", description: "", code: "", discount: "", validUntil: "" });
    setOpen(false);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Promotions</h1>
          <p className="mt-1 text-sm text-body">Manage active offers, expiry dates and customer-facing codes.</p>
        </div>
        <Button size="md" onClick={() => setOpen(true)}>
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
        <div className="hidden grid-cols-[1.1fr_0.7fr_0.7fr_0.6fr_auto] border-b border-border bg-cream-soft/60 px-4 py-3 text-xs font-bold uppercase tracking-wide text-body md:grid">
          <span>Offer</span>
          <span>Code</span>
          <span>Discount</span>
          <span>Expires</span>
          <span className="sr-only">Actions</span>
        </div>
        {promotions.map((promo) => {
          const remaining = daysLeft(promo.validUntil, now);
          return (
            <div
              key={promo.id}
              className="grid gap-3 border-b border-border/70 px-4 py-4 last:border-0 md:grid-cols-[1.1fr_0.7fr_0.7fr_0.6fr_auto] md:items-center"
            >
              <div>
                <p className="font-semibold text-charcoal">{promo.title}</p>
                <p className="mt-1 text-xs text-body">{promo.description}</p>
              </div>
              <div><span className="mb-1 block text-[0.65rem] font-bold uppercase text-body md:hidden">Code</span><code className="w-fit rounded-full bg-charcoal px-2.5 py-1 text-xs font-bold text-white">{promo.code}</code></div>
              <span className="text-sm font-semibold text-charcoal"><span className="mr-2 text-[0.65rem] uppercase text-body md:hidden">Discount</span>{promo.discount}</span>
              <span className={remaining <= 30 ? "text-sm font-semibold text-primary" : "text-sm text-body"}>
                <span className="mr-2 text-[0.65rem] uppercase text-body md:hidden">Expires</span>{promo.validUntil}
              </span>
              <Button type="button" size="icon" variant="ghost" onClick={() => removePromotion(promo.id)} aria-label={`Delete ${promo.title}`}><Trash2 className="h-4 w-4 text-error" aria-hidden="true" /></Button>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Create promotion">
        <form className="space-y-4 p-5" onSubmit={createPromotion}>
          <div><Label htmlFor="promo-title">Offer title</Label><Input id="promo-title" required value={form.title} onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))} /></div>
          <div><Label htmlFor="promo-description">Description</Label><Textarea id="promo-description" required value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="promo-code">Code</Label><Input id="promo-code" required value={form.code} onChange={(event) => setForm((value) => ({ ...value, code: event.target.value }))} /></div>
            <div><Label htmlFor="promo-discount">Discount</Label><Input id="promo-discount" required placeholder="15% off" value={form.discount} onChange={(event) => setForm((value) => ({ ...value, discount: event.target.value }))} /></div>
          </div>
          <div><Label htmlFor="promo-expiry">Expiry date</Label><Input id="promo-expiry" type="date" required value={form.validUntil} onChange={(event) => setForm((value) => ({ ...value, validUntil: event.target.value }))} /></div>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Publish promotion</Button></div>
        </form>
      </Dialog>
    </div>
  );
}
