import type { Metadata } from "next";
import { Check } from "lucide-react";
import { MealPlanForm } from "@/components/meal-plans/meal-plan-form";

export const metadata: Metadata = {
  title: "Weekly Meal Plans",
  description: "Set up a weekly or monthly meal plan with EmmaPresh Eatery & Lounge — pause, skip or renew anytime.",
};

const features = [
  "Choose how many meals you want delivered per week",
  "Pick your preferred delivery days",
  "Pause, skip a delivery, or renew anytime",
  "Tell us your allergies and preferences up front",
];

export default function MealPlansPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Weekly &amp; Monthly Meal Plans</h1>
          <p className="mt-3 text-sm text-body">
            Built for busy professionals and families — set a recurring schedule once, and let us handle the rest.
          </p>
          <ul className="mt-6 space-y-2.5">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-charcoal">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-card border border-border/60 bg-white p-6">
          <MealPlanForm />
        </div>
      </div>
    </div>
  );
}
