/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronRight, Clock, Flame, Truck } from "lucide-react";
import { BranchSelector } from "@/components/layout/branch-selector";
import { buttonVariants } from "@/components/ui/button";
import { galleryImages } from "@/data/gallery";
import { cn } from "@/lib/utils";

const imageColumns = galleryImages.reduce<string[][]>(
  (columns, image, index) => {
    columns[index % columns.length].push(image.src);
    return columns;
  },
  [[], [], []]
);

const featureImages = galleryImages.map((image) => image.src);

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion || featureImages.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % featureImages.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

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
    <section className="relative flex min-h-[calc(100svh-4rem)] overflow-hidden bg-charcoal text-white">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 grid grid-cols-3 gap-3 opacity-70 blur-[0.2px]">
          {imageColumns.map((column, columnIndex) => (
            <motion.div
              key={columnIndex}
              animate={
                reduceMotion
                  ? undefined
                  : { y: columnIndex === 1 ? ["-50%", "0%"] : ["0%", "-50%"] }
              }
              transition={{ duration: 150 + columnIndex * 12, repeat: Infinity, ease: "linear" }}
              className={cn("flex flex-col gap-3", columnIndex === 1 && "-mt-28")}
            >
              {[...column, ...column].map((src, index) => (
                <div key={`${src}-${index}`} className="h-44 overflow-hidden rounded-[0.9rem] bg-white/10 sm:h-56 lg:h-64">
                  <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
              ))}
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-r from-charcoal/92 via-charcoal/55 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          variants={contentVariants}
          className="max-w-2xl"
        >
          <motion.span variants={itemVariants} className="inline-flex items-center gap-2 rounded-control bg-white/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white">
            <Flame className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Abuja · Lagos · Badagry
          </motion.span>
          <motion.h1 variants={itemVariants} className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-6xl">
            Good Food, Cakes, Catering &amp; Events,
            <span className="block whitespace-nowrap text-primary">All in One Place</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-5 max-w-lg text-sm leading-7 text-white/76">
            Order meals, plan catering, book custom cakes, reserve event spaces and learn professional cooking in one connected EmmaPresh experience.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
              Order Food
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/catering" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/50 bg-white/8 text-white hover:bg-white hover:text-charcoal")}>
              Explore Services
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-7 flex flex-wrap items-center gap-4">
            <BranchSelector />
            <span className="flex items-center gap-1.5 text-xs font-medium text-white/76">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" /> Ready in ~25 min
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-white/76">
              <Truck className="h-4 w-4 text-primary" aria-hidden="true" /> Delivery &amp; pickup available
            </span>
          </motion.div>
        </motion.div>

        <div className="relative hidden min-h-[620px] lg:block">
          <motion.div
            animate={reduceMotion ? undefined : { rotate: [0, 360] }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[35rem] w-[35rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
            aria-hidden="true"
          />
          <motion.div
            animate={reduceMotion ? undefined : { scale: [1, 1.04, 1], y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 h-[31rem] w-[31rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[10px] border-white/80 bg-white/15 shadow-[0_34px_90px_-35px_rgba(0,0,0,0.9)] backdrop-blur-sm"
          >
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={featureImages[activeImageIndex]}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img
                  src={featureImages[activeImageIndex]}
                  alt="EmmaPresh gallery highlight"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
