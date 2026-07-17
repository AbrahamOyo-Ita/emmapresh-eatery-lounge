import Link from "next/link";
import { MapPin, PhoneCall, Clock, ChefHat, Building2, CakeSlice } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { FoodImage } from "@/components/ui/food-image";
import { Badge } from "@/components/ui/badge";
import type { Branch } from "@/types";

export function LocationsSection({ branches }: { branches: Branch[] }) {
  return (
    <section className="motion-section mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading eyebrow="Where We Are" title="Visit a Branch Near You" align="center" />
      <div className="motion-grid grid gap-6 lg:grid-cols-3">
        {branches.map((branch) => (
          <div key={branch.slug} className="overflow-hidden rounded-card border border-border/60 bg-white shadow-[var(--shadow-soft)]">
            <FoodImage name={branch.name} icon="hall" className="h-32 w-full" />
            <div className="p-4">
              <h3 className="font-display text-base font-semibold text-charcoal">{branch.name}</h3>
              <p className="mt-2 flex items-start gap-1.5 text-xs text-body">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {branch.address}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-body">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {branch.openingHours[0].hours}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-body">
                <PhoneCall className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {branch.phone}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {branch.hasCatering && <Badge variant="outline"><ChefHat className="h-3 w-3" aria-hidden="true" />Catering</Badge>}
                {branch.hasEventHall && <Badge variant="outline"><Building2 className="h-3 w-3" aria-hidden="true" />Event Hall</Badge>}
                {branch.hasBakery && <Badge variant="outline"><CakeSlice className="h-3 w-3" aria-hidden="true" />Bakery</Badge>}
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/locations/${branch.slug}`} className="focus-ring flex-1 rounded-control bg-charcoal px-3 py-2 text-center text-xs font-semibold text-white hover:bg-soft-black">
                  View Branch
                </Link>
                <Link href={`/menu?branch=${branch.slug}`} className="focus-ring flex-1 rounded-control border border-border px-3 py-2 text-center text-xs font-semibold text-charcoal hover:border-charcoal">
                  See Menu
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
