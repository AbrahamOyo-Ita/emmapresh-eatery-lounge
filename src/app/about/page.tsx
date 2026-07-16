import type { Metadata } from "next";
import Link from "next/link";
import { FoodImage } from "@/components/ui/food-image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind EmmaPresh Eatery & Lounge — restaurant, bakery, catering, academy and events across Abuja, Lagos and Badagry.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-charcoal sm:text-4xl">About EmmaPresh</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-body">
          One kitchen, many ways to enjoy it — food, cakes, catering, events and professional training, all under
          one roof.
        </p>
      </div>

      <FoodImage name="EmmaPresh team" icon="event" className="mt-10 h-64 w-full rounded-card" iconClassName="h-16 w-16" />

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-charcoal">Our Story</h2>
          <p className="mt-3 text-sm text-body">
            EmmaPresh Eatery &amp; Lounge began as a single restaurant serving honest, well-made Nigerian food. Over
            time, the same kitchen discipline grew into a bakery, a catering operation, a cooking and baking
            academy, and event spaces — all built around one idea: food should be reliable, well-priced and made
            with care, every single time.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl text-charcoal">Where We Are</h2>
          <p className="mt-3 text-sm text-body">
            Today we operate across Abuja, Lagos and Badagry, with each branch offering food ordering, and select
            branches offering catering, bakery, academy classes and event hall bookings. Every order — big or small
            — moves through the same transparent process: clear pricing, a verified payment, and a real person
            checking in on preparation and delivery.
          </p>
        </div>
      </div>

      <div className="mt-12 rounded-card bg-cream-soft/60 p-8 text-center">
        <h2 className="font-display text-xl text-charcoal">Ready to taste it yourself?</h2>
        <Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-5")}>
          Order Food
        </Link>
      </div>
    </div>
  );
}
