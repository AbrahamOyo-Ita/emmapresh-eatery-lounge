"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Clock, Truck, ChevronRight } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { BranchSelector } from "@/components/layout/branch-selector";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const easeOut = [0.16, 1, 0.3, 1] as const;
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: easeOut, staggerChildren: 0.08 },
    },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
  };

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] overflow-hidden bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          variants={contentVariants}
        >
          <motion.span variants={itemVariants} className="inline-flex items-center rounded-control bg-primary/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary">
            Abuja · Lagos · Badagry
          </motion.span>
          <motion.h1 variants={itemVariants} className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-5xl">
            Good Food, Cakes, Catering &amp; Events, <span className="block whitespace-nowrap text-primary">All in One Place</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-4 max-w-md text-sm text-body">
            Order meals, plan catering, book custom cakes, reserve event spaces and learn
            professional cooking — one connected experience across three locations.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
              Order Food
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/catering" className={cn(buttonVariants({ variant: "outline", size: "md" }))}>
              Explore Services
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6 flex flex-wrap items-center gap-4">
            <BranchSelector />
            <span className="flex items-center gap-1.5 text-xs font-medium text-body">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" /> Ready in ~25 min
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-body">
              <Truck className="h-4 w-4 text-primary" aria-hidden="true" /> Delivery &amp; pickup available
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, x: 24, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto aspect-[5/4] w-full max-w-sm lg:max-w-md"
        >
          <FoodImage
            name="EmmaPresh signature platter"
            icon="grill"
            className="relative h-full w-full rounded-card shadow-[var(--shadow-lift)]"
            iconClassName="h-20 w-20"
          />
        </motion.div>
      </div>
    </section>
  );
}
