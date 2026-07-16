import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { buttonVariants } from "@/components/ui/button";
import { cateringPackages } from "@/data/catering-packages";
import { formatCurrency, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Catering",
  description: "Indoor and outdoor catering packages for weddings, corporate events, birthdays and conferences across Abuja, Lagos and Badagry.",
};

export default function CateringPage() {
  return (
    <div>
      <div className="bg-cream-soft/60 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Indoor &amp; Outdoor Catering</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-body">
            From weddings and corporate events to birthdays and conferences — our catering team handles menu
            planning, staffing, equipment and delivery. Every request gets a transparent quotation before any
            payment is due.
          </p>
          <Link href="/catering/request-quote" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-6")}>
            Request a Quote
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="mb-6 font-display text-2xl text-charcoal">Catering Packages</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cateringPackages.map((pkg) => (
            <div key={pkg.id} className="overflow-hidden rounded-card border border-border/60 bg-white shadow-[var(--shadow-soft)]">
              <FoodImage name={pkg.name} icon="event" className="h-36 w-full" />
              <div className="p-5">
                <h3 className="font-display text-base text-charcoal">{pkg.name}</h3>
                <p className="mt-1.5 text-xs text-body">{pkg.description}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-body">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  Minimum {pkg.minGuests} guests
                </p>
                <p className="mt-2 font-display text-lg text-charcoal">
                  {formatCurrency(pkg.startingPricePerHead)} <span className="text-xs font-normal text-body">/ head</span>
                </p>
                <ul className="mt-3 space-y-1 text-xs text-body">
                  {pkg.includes.slice(0, 3).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <Link
                  href="/catering/request-quote"
                  className="focus-ring mt-4 block rounded-full bg-charcoal py-2.5 text-center text-xs font-semibold text-white hover:bg-soft-black"
                >
                  Request This Package
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
