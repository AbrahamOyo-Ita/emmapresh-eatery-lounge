import type { Metadata } from "next";
import Link from "next/link";
import { Users, MapPin } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { buttonVariants } from "@/components/ui/button";
import { halls } from "@/data/halls";
import { branches } from "@/data/branches";
import { formatCurrency, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Event Halls",
  description: "Book an event hall for weddings, conferences and private celebrations across EmmaPresh branches.",
};

export default function HallsPage() {
  return (
    <div>
      <div className="bg-cream-soft/60 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Event Halls</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-body">
            Elegant, well-equipped venues for weddings, conferences and private celebrations — complete with
            catering, drinks and decoration support.
          </p>
          <Link href="/halls/request-booking" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-6")}>
            Request Availability
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {halls.map((hall) => {
            const branch = branches.find((b) => b.slug === hall.branchSlug);
            return (
              <div key={hall.id} className="overflow-hidden rounded-card border border-border/60 bg-white shadow-[var(--shadow-soft)]">
                <FoodImage name={hall.name} icon="hall" className="h-40 w-full" />
                <div className="p-5">
                  <h3 className="font-display text-base text-charcoal">{hall.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-body">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {branch?.name}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-body">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" /> Up to {hall.capacity.banquet} guests (banquet)
                  </p>
                  <p className="mt-2 text-xs text-body">{hall.description}</p>
                  <p className="mt-3 font-display text-lg text-charcoal">
                    From {formatCurrency(hall.startingPrice)}
                  </p>
                  <Link href={`/halls/${hall.slug}`} className={cn(buttonVariants({ variant: "primary", size: "sm" }), "mt-4 w-full")}>
                    View Hall
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
