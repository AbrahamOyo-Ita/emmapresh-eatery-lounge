import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "neutral" | "primary" | "success" | "warning";
  hint?: string;
}) {
  const toneClasses = {
    neutral: "bg-charcoal/5 text-charcoal",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  }[tone];

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-full", toneClasses)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 font-display text-2xl text-charcoal">{value}</p>
      <p className="mt-1 text-xs text-body">{label}</p>
      {hint && <p className="mt-1 text-[0.7rem] text-body/70">{hint}</p>}
    </div>
  );
}
