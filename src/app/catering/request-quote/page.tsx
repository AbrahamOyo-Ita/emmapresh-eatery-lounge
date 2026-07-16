import type { Metadata } from "next";
import { CateringRequestForm } from "@/components/catering/catering-request-form";

export const metadata: Metadata = {
  title: "Request a Catering Quote",
  description: "Tell us about your event and receive a transparent catering quotation from EmmaPresh Eatery & Lounge.",
};

export default function CateringRequestQuotePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-charcoal">Request a Catering Quote</h1>
        <p className="mt-2 text-sm text-body">Tell us about your event and we&apos;ll send a detailed quotation.</p>
      </div>
      <CateringRequestForm />
    </div>
  );
}
