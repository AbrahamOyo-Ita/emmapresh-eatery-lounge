"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReservationsStore } from "@/stores/reservations-store";
import { useBranchStore } from "@/stores/branch-store";
import { branches } from "@/data/branches";
import type { BranchSlug } from "@/types";

export function ReservationForm() {
  const createReservation = useReservationsStore((s) => s.createReservation);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);
  const [branchSlug, setBranchSlug] = React.useState<BranchSlug>(selectedBranch ?? "lagos");
  const [customerName, setCustomerName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [guestCount, setGuestCount] = React.useState(2);
  const [seating, setSeating] = React.useState<"indoor" | "lounge">("indoor");
  const [occasion, setOccasion] = React.useState("");
  const [specialRequests, setSpecialRequests] = React.useState("");
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const reservation = createReservation({
      branchSlug, customerName, phone, email, date, time, guestCount, seating, occasion, specialRequests,
    });
    setSubmitted(reservation.reference);
  }

  if (submitted) {
    return (
      <div className="rounded-card border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl text-charcoal">Reservation Requested</h2>
        <p className="mt-2 text-sm text-body">
          Your reference is <strong>{submitted}</strong>. The branch will contact you shortly to confirm — final
          confirmation always comes from the branch directly.
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
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="guestCount">Guests</Label>
          <Input id="guestCount" type="number" min={1} required value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} />
        </div>
      </div>
      <div>
        <Label htmlFor="seating">Seating Preference</Label>
        <Select id="seating" value={seating} onChange={(e) => setSeating(e.target.value as "indoor" | "lounge")}>
          <option value="indoor">Indoor</option>
          <option value="lounge">Lounge</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="occasion">Occasion (optional)</Label>
        <Input id="occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="Birthday, anniversary..." />
      </div>
      <div>
        <Label htmlFor="specialRequests">Special Requests (optional)</Label>
        <Textarea id="specialRequests" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} />
      </div>
      <Button type="submit" size="lg" className="w-full">Request Reservation</Button>
    </form>
  );
}
