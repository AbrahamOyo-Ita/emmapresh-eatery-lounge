import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, PhoneCall, Mail, ChefHat, Building2, CakeSlice, GraduationCap } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { buttonVariants } from "@/components/ui/button";
import { getBranchBySlug } from "@/services/branch-service";
import { branches } from "@/data/branches";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ branch: string }>;
}

export function generateStaticParams() {
  return branches.map((b) => ({ branch: b.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { branch: slug } = await params;
  const branch = await getBranchBySlug(slug);
  if (!branch) return {};
  return {
    title: `${branch.name} — Restaurant, Catering & Events in ${branch.city}`,
    description: `Visit EmmaPresh ${branch.city}: ${branch.address}. Opening hours, menu, catering, bakery and event hall availability.`,
  };
}

export default async function BranchDetailPage({ params }: PageProps) {
  const { branch: slug } = await params;
  const branch = await getBranchBySlug(slug);
  if (!branch) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-body">
        <Link href="/locations" className="hover:text-primary">Locations</Link> <span aria-hidden="true">/</span>{" "}
        <span className="text-charcoal">{branch.city}</span>
      </nav>

      <FoodImage name={branch.name} icon="hall" className="h-64 w-full rounded-card" iconClassName="h-16 w-16" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="font-display text-3xl text-charcoal">{branch.name}</h1>
          <p className="mt-2 flex items-start gap-2 text-sm text-body">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {branch.address}, {branch.state}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-body">Opening Hours</p>
              {branch.openingHours.map((oh) => (
                <p key={oh.days} className="flex items-center gap-1.5 text-sm text-charcoal">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {oh.days}: {oh.hours}
                </p>
              ))}
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-body">Contact</p>
              <p className="flex items-center gap-1.5 text-sm text-charcoal">
                <PhoneCall className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {branch.phone}
              </p>
              <p className="flex items-center gap-1.5 text-sm text-charcoal">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {branch.email}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-body">Services at This Branch</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Catering", available: branch.hasCatering, icon: ChefHat },
                { label: "Event Hall", available: branch.hasEventHall, icon: Building2 },
                { label: "Bakery", available: branch.hasBakery, icon: CakeSlice },
                { label: "Academy", available: branch.hasAcademy, icon: GraduationCap },
              ].map((service) => (
                <div
                  key={service.label}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center",
                    service.available ? "border-success/30 bg-success/5" : "border-border bg-cream-soft/50 opacity-60"
                  )}
                >
                  <service.icon className="h-5 w-5 text-charcoal" aria-hidden="true" />
                  <span className="text-xs font-semibold text-charcoal">{service.label}</span>
                  <span className="text-[0.65rem] text-body">{service.available ? "Available" : "Not offered"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit space-y-3 rounded-card border border-border/60 bg-white p-5">
          <Link href={`/menu?branch=${branch.slug}`} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}>
            View Menu
          </Link>
          <a href={`https://wa.me/${branch.whatsapp}`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}>
            Chat on WhatsApp
          </a>
          <Link href="/reservations" className={cn(buttonVariants({ variant: "subtle", size: "lg" }), "w-full")}>
            Reserve a Table
          </Link>
          <div className="pt-2 text-center text-xs text-body">
            {branch.rating} ★ · {branch.reviewCount} reviews
          </div>
        </div>
      </div>
    </div>
  );
}
