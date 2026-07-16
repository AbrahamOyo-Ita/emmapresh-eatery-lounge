import type { LucideIcon } from "lucide-react";

interface ModuleRoadmapProps {
  title: string;
  description: string;
  icon: LucideIcon;
  seedCount: number;
  seedLabel: string;
  plannedFeatures: string[];
}

export function ModuleRoadmap({ title, description, icon: Icon, seedCount, seedLabel, plannedFeatures }: ModuleRoadmapProps) {
  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">{title}</h1>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-body">{description}</p>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-border/60 bg-white p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 font-display text-2xl text-charcoal">{seedCount}</p>
          <p className="text-xs text-body">{seedLabel}</p>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-white p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-body">Planned for This Module</p>
          <ul className="space-y-2 text-sm text-charcoal">
            {plannedFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-info/10 px-3 py-2 text-xs text-info">
            The data model for this module is fully defined in <code>src/types</code> — this admin view wires up to
            Supabase tables next, following the same pattern as Orders &amp; Payments.
          </p>
        </div>
      </div>
    </div>
  );
}
