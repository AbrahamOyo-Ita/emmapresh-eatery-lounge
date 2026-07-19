"use client";

import * as React from "react";
import { menuItems } from "@/data/menu-items";
import { menuCategories } from "@/data/categories";
import { useMenuStatusStore } from "@/stores/menu-status-store";
import { formatCurrency, cn } from "@/lib/utils";
import type { StockStatus } from "@/types";

const statusCycle: StockStatus[] = ["available", "low-stock", "sold-out"];

const statusStyles: Record<StockStatus, string> = {
  available: "bg-success/10 text-success",
  "low-stock": "bg-warning/10 text-warning",
  "sold-out": "bg-error/10 text-error",
};

export default function AdminMenuPage() {
  const { overrides, setStatus, statusFor } = useMenuStatusStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function cycleStatus(itemId: string, current: StockStatus) {
    const idx = statusCycle.indexOf(current);
    setStatus(itemId, statusCycle[(idx + 1) % statusCycle.length]);
  }

  if (!hydrated) return null;
  void overrides;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Menu Management</h1>
      <p className="mt-1 mb-6 text-sm text-body">
        {menuItems.length} items across {menuCategories.length} categories. Click a status badge to update availability —
        changes reflect live on the storefront.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-soft/50 text-xs text-body">
              <th className="px-4 py-3 font-semibold">Item</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Prep Time</th>
              <th className="px-4 py-3 font-semibold">Availability</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => {
              const status = statusFor(item.id, item.stockStatus);
              return (
                <tr key={item.id} className="border-b border-border/60 last:border-0 hover:bg-cream-soft/30">
                  <td className="px-4 py-3 font-semibold text-charcoal">{item.name}</td>
                  <td className="px-4 py-3 capitalize text-body">{item.categorySlug.replace(/-/g, " ")}</td>
                  <td className="px-4 py-3 text-charcoal">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-3 text-body">{item.prepTimeMinutes} min</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => cycleStatus(item.id, status)}
                      className={cn("focus-ring rounded-full px-3 py-1 text-xs font-semibold capitalize", statusStyles[status])}
                    >
                      {status.replace("-", " ")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
