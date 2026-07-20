import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, Flame, Truck } from "lucide-react";
import { BranchSelector } from "@/components/layout/branch-selector";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative flex min-h-[min(760px,calc(100svh-4rem))] overflow-hidden bg-charcoal text-white">
      <Image src="/jollof1.jpeg" alt="EmmaPresh signature Nigerian cuisine" fill priority fetchPriority="high" sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/78 to-charcoal/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-4 py-14 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-control bg-white/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm"><Flame className="h-3.5 w-3.5 text-primary" />Abuja · Lagos · Badagry</span>
          <h1 className="mt-5 max-w-2xl font-display text-[clamp(2.25rem,11vw,4.25rem)] font-semibold leading-[1.02] text-white">Good Food, Cakes, Catering &amp; Events,<span className="block text-primary sm:whitespace-nowrap">All in One Place</span></h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/80">Order meals, plan catering, book custom cakes, reserve event spaces and learn professional cooking in one connected EmmaPresh experience.</p>
          <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap"><Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full sm:w-auto")}>Order Food<ChevronRight className="h-4 w-4" /></Link><Link href="/catering" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full border-white/50 bg-white/10 text-white hover:bg-white hover:text-charcoal sm:w-auto")}>Explore Services</Link></div>
          <div className="mt-7 flex flex-wrap items-center gap-4"><BranchSelector /><span className="flex items-center gap-1.5 text-xs font-medium text-white/80"><Clock className="h-4 w-4 text-primary" />Ready in ~25 min</span><span className="flex items-center gap-1.5 text-xs font-medium text-white/80"><Truck className="h-4 w-4 text-primary" />Delivery &amp; pickup available</span></div>
        </div>
      </div>
    </section>
  );
}
