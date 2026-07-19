import type { Metadata } from "next";
import { MapPin, PhoneCall, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { branches } from "@/data/branches";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with EmmaPresh Eatery & Lounge — branch contact details and a general enquiry form.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Contact Us</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-body">
          Come and enjoy a good meal with us. We open daily from 9:00 AM to 10:00 PM, prepare food for indoor and
          outdoor events, and make all kinds of snacks. Call {siteConfig.phone} or {siteConfig.secondaryPhone}, or
          email {siteConfig.email}.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {branches.map((branch) => (
            <div key={branch.slug} className="rounded-2xl border border-border/60 bg-white p-5">
              <h2 className="font-display text-base text-charcoal">{branch.name}</h2>
              <p className="mt-2 flex items-start gap-1.5 text-xs text-body">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {branch.address}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-body">
                <PhoneCall className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {branch.phone}
                {branch.secondaryPhone ? ` / ${branch.secondaryPhone}` : ""}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-body">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {branch.email}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-card border border-border/60 bg-white p-6">
          <h2 className="mb-4 font-display text-lg text-charcoal">Send Us a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
