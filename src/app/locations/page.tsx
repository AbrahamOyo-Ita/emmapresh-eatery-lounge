import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, PhoneCall } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { Badge } from "@/components/ui/badge";
import { branches } from "@/data/branches";

export const metadata: Metadata = {
  title: "Restaurant Locations in Abuja, Lagos & Badagry",
  description: "Find EmmaPresh Eatery & Lounge in Abuja, Lagos and Badagry — addresses, opening hours and contact details.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Our Locations</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-body">
          EmmaPresh Eatery &amp; Lounge operates across three locations, each with its own menu availability, bank
          account and opening hours.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {branches.map((branch) => (
          <div key={branch.slug} className="overflow-hidden rounded-card border border-border/60 bg-white shadow-[var(--shadow-soft)]">
            <FoodImage name={branch.name} src={branch.image} icon="hall" className="h-44 w-full" />
            <div className="p-5">
              <h2 className="font-display text-lg text-charcoal">{branch.name}</h2>
              {branch.establishedDate && (
                <p className="mt-1 text-xs font-medium text-primary">Established February 14, 2026</p>
              )}
              <p className="mt-2 flex items-start gap-1.5 text-xs text-body">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {branch.address}
              </p>
              {branch.openingHours.map((oh) => (
                <p key={oh.days} className="mt-1.5 flex items-center gap-1.5 text-xs text-body">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {oh.days}: {oh.hours}
                </p>
              ))}
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-body">
                <PhoneCall className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {branch.phone}
                {branch.secondaryPhone ? ` / ${branch.secondaryPhone}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {branch.hasCatering && <Badge variant="outline">Catering</Badge>}
                {branch.hasEventHall && <Badge variant="outline">Event Hall</Badge>}
                {branch.hasBakery && <Badge variant="outline">Bakery</Badge>}
                {branch.hasAcademy && <Badge variant="outline">Academy</Badge>}
              </div>
              <Link
                href={`/locations/${branch.slug}`}
                className="focus-ring mt-4 block rounded-full bg-charcoal py-2.5 text-center text-sm font-semibold text-white hover:bg-soft-black"
              >
                View Branch Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
