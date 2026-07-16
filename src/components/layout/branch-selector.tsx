"use client";

import * as React from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { useBranchStore } from "@/stores/branch-store";
import { branches } from "@/data/branches";
import { cn } from "@/lib/utils";

export function BranchSelector({ compact = false }: { compact?: boolean }) {
  const { selectedBranch, setBranch } = useBranchStore();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = branches.find((b) => b.slug === selectedBranch);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "focus-ring flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-2 text-sm font-semibold text-charcoal hover:border-charcoal",
          compact && "px-2.5 py-1.5 text-xs"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>{current ? current.city : "Choose Branch"}</span>
        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-white py-1 shadow-[var(--shadow-lift)]"
        >
          {branches.map((branch) => (
            <li key={branch.slug}>
              <button
                role="option"
                aria-selected={branch.slug === selectedBranch}
                onClick={() => {
                  setBranch(branch.slug);
                  setOpen(false);
                }}
                className="focus-ring flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-cream-soft"
              >
                <span>
                  <span className="block font-semibold text-charcoal">{branch.name}</span>
                  <span className="block text-xs text-body">{branch.address}</span>
                </span>
                {branch.slug === selectedBranch && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
