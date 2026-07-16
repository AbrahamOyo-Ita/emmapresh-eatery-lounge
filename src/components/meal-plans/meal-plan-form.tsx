"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMealPlansStore } from "@/stores/meal-plans-store";
import { useBranchStore } from "@/stores/branch-store";
import { branches } from "@/data/branches";
import type { BranchSlug } from "@/types";

const budgetRanges = ["₦15,000 - ₦25,000 / week", "₦25,000 - ₦40,000 / week", "₦40,000+ / week"];

export function MealPlanForm() {
  const createSubscription = useMealPlansStore((s) => s.createSubscription);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);
  const [branchSlug, setBranchSlug] = React.useState<BranchSlug>(selectedBranch ?? "lagos");
  const [customerName, setCustomerName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mealsPerWeek, setMealsPerWeek] = React.useState(5);
  const [preferredDays, setPreferredDays] = React.useState("Monday, Wednesday, Friday");
  const [budgetRange, setBudgetRange] = React.useState(budgetRanges[0]);
  const [allergies, setAllergies] = React.useState("");
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sub = createSubscription({ branchSlug, customerName, phone, email, mealsPerWeek, preferredDays, budgetRange, allergies });
    setSubmitted(sub.reference);
  }

  if (submitted) {
    return (
      <div className="rounded-card border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl text-charcoal">Meal Plan Requested</h2>
        <p className="mt-2 text-sm text-body">
          Reference <strong>{submitted}</strong>. Our team will call you to confirm your weekly menu and delivery
          schedule.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="branch">Branch</Label>
        <Select id="branch" value={branchSlug} onChange={(e) => setBranchSlug(e.target.value as BranchSlug)}>
          {branches.map((b) => (
            <option key={b.slug} value={b.slug}>{b.name}</option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="customerName">Full Name</Label>
          <Input id="customerName" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="mealsPerWeek">Meals per Week</Label>
          <Input id="mealsPerWeek" type="number" min={1} max={21} required value={mealsPerWeek} onChange={(e) => setMealsPerWeek(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="budgetRange">Budget Range</Label>
          <Select id="budgetRange" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="preferredDays">Preferred Delivery Days</Label>
        <Input id="preferredDays" required value={preferredDays} onChange={(e) => setPreferredDays(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="allergies">Allergies or Dietary Notes (optional)</Label>
        <Input id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
      </div>
      <Button type="submit" size="lg" className="w-full">Request Meal Plan</Button>
    </form>
  );
}
