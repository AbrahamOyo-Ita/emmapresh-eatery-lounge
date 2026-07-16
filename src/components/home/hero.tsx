"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Truck, ChevronRight } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { BranchSelector } from "@/components/layout/branch-selector";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Abuja · Lagos · Badagry
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] text-charcoal sm:text-5xl lg:text-6xl">
            Good Food, Cakes, Catering &amp; Events, All in One Place
          </h1>
          <p className="mt-5 max-w-md text-base text-body">
            Order meals, plan catering, book custom cakes, reserve event spaces and learn
            professional cooking — one connected experience across three locations.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
              Order Food
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/catering" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Explore Services
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <BranchSelector />
            <span className="flex items-center gap-1.5 text-xs font-medium text-body">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" /> Ready in ~25 min
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-body">
              <Truck className="h-4 w-4 text-primary" aria-hidden="true" /> Delivery &amp; pickup available
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary to-accent opacity-90 blur-2xl" aria-hidden="true" />
          <FoodImage
            name="EmmaPresh signature platter"
            icon="grill"
            className="relative h-full w-full rounded-[2.5rem] shadow-[var(--shadow-lift)]"
            iconClassName="h-24 w-24"
          />
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-8 hidden sm:block"
          >
            <FoodImage name="Fresh juice" icon="drink" className="h-20 w-20 rounded-2xl shadow-[var(--shadow-lift)]" iconClassName="h-8 w-8" />
          </motion.div>
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 bottom-10 hidden sm:block"
          >
            <FoodImage name="Celebration cake" icon="cake" className="h-24 w-24 rounded-2xl shadow-[var(--shadow-lift)]" iconClassName="h-9 w-9" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
