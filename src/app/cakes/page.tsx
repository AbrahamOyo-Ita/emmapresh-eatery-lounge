import type { Metadata } from "next";
import Link from "next/link";
import { CakeCard } from "@/components/cakes/cake-card";
import { buttonVariants } from "@/components/ui/button";
import { cakes } from "@/data/cakes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cakes & Bakery",
  description: "Browse ready-made cakes in stock or request a fully custom cake design from EmmaPresh Eatery & Lounge.",
};

export default function CakesPage() {
  return (
    <div>
      <div className="bg-cream-soft/60 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Cakes &amp; Bakery</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-body">
            Browse cakes currently in stock, ready for same-day pickup, or request a fully custom design with your
            own reference images.
          </p>
          <Link href="/cakes/custom-order" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-6")}>
            Request a Custom Cake
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="mb-6 font-display text-2xl text-charcoal">Ready Cakes in Stock</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cakes.map((cake) => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      </div>
    </div>
  );
}
