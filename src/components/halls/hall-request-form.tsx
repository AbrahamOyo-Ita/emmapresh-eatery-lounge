"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHallsStore } from "@/stores/halls-store";
import { halls } from "@/data/halls";

export function HallRequestForm() {
  const searchParams = useSearchParams();
  const createEnquiry = useHallsStore((s) => s.createEnquiry);
  const [hallId, setHallId] = React.useState(halls.find((h) => h.slug === searchParams.get("hall"))?.id ?? halls[0].id);
  const [customerName, setCustomerName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [eventType, setEventType] = React.useState("");
  const [eventDate, setEventDate] = React.useState("");
  const [guestCount, setGuestCount] = React.useState(50);
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const enquiry = createEnquiry({ hallId, customerName, phone, email, eventType, eventDate, guestCount });
    setSubmitted(enquiry.reference);
  }

  if (submitted) {
    return (
      <div className="rounded-card border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl text-charcoal">Enquiry Received</h2>
        <p className="mt-2 text-sm text-body">
          Your reference is <strong>{submitted}</strong>. Our hall manager will confirm availability and send a
          quotation shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="hall">Preferred Hall</Label>
        <Select id="hall" value={hallId} onChange={(e) => setHallId(e.target.value)}>
          {halls.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="customerName">Full Name</Label>
        <Input id="customerName" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="eventType">Event Type</Label>
          <Input id="eventType" required placeholder="Wedding, conference..." value={eventType} onChange={(e) => setEventType(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="eventDate">Preferred Date</Label>
          <Input id="eventDate" type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="guestCount">Number of Guests</Label>
        <Input id="guestCount" type="number" min={1} required value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} />
      </div>
      <Button type="submit" size="lg" className="w-full">Submit Enquiry</Button>
    </form>
  );
}
