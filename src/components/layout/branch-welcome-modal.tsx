"use client";

import * as React from "react";
import { MapPin, Clock, PhoneCall } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useBranchStore } from "@/stores/branch-store";
import { branches } from "@/data/branches";

export function BranchWelcomeModal() {
  const { hasChosenBranch, setBranch } = useBranchStore();
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!hydrated || hasChosenBranch) return null;

  return (
    <Dialog open={!hasChosenBranch} onClose={() => setBranch("lagos")} title="Welcome to EmmaPresh" widthClassName="max-w-2xl">
      <div className="p-6">
        <p className="mb-6 text-sm text-body">
          Choose your nearest branch so we can show you accurate menus, prices, delivery areas and availability.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {branches.map((branch) => (
            <button
              key={branch.slug}
              onClick={() => setBranch(branch.slug)}
              className="focus-ring group rounded-2xl border border-border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-lift)]"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="block font-display text-base">{branch.city}</span>
              <span className="mt-1 flex items-start gap-1.5 text-xs text-body">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {branch.openingHours[0].hours}
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-xs text-body">
                <PhoneCall className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {branch.phone}
                {branch.secondaryPhone ? ` / ${branch.secondaryPhone}` : ""}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
