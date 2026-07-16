import type { Metadata } from "next";
import * as React from "react";
import { HallRequestForm } from "@/components/halls/hall-request-form";

export const metadata: Metadata = {
  title: "Request Hall Availability",
  description: "Check availability and request a quotation for an EmmaPresh event hall.",
};

export default function HallRequestBookingPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-charcoal">Request Hall Availability</h1>
        <p className="mt-2 text-sm text-body">Tell us about your event and we&apos;ll confirm availability.</p>
      </div>
      <React.Suspense fallback={null}>
        <HallRequestForm />
      </React.Suspense>
    </div>
  );
}
