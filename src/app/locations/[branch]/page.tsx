import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, PhoneCall, Mail, ChefHat, Building2, CakeSlice, GraduationCap } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { buttonVariants } from "@/components/ui/button";
import { getBranchBySlug } from "@/services/branch-service";
import { branches } from "@/data/branches";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";

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
    title: `Restaurant & Lounge in ${branch.city} | Nigerian Food & Catering`,
    description: `${branch.name} at ${branch.address}. Order Nigerian food, cakes and drinks, book catering${branch.hasEventHall ? ", an event hall" : ""}, or reserve a table in ${branch.city}.`,
    alternates: { canonical: `/locations/${branch.slug}` },
    openGraph: {
      title: `${branch.name} | Restaurant in ${branch.city}`,
      description: `Nigerian food, catering, cakes and lounge services at ${branch.address}.`,
      url: `/locations/${branch.slug}`,
      type: "website",
      images: [{ url: branch.image, alt: `${branch.name} location` }],
    },
  };
}

export default async function BranchDetailPage({ params }: PageProps) {
  const { branch: slug } = await params;
  const branch = await getBranchBySlug(slug);
  if (!branch) notFound();

  const branchJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "@id": `${siteConfig.url}/locations/${branch.slug}#restaurant`,
    name: branch.name,
    url: `${siteConfig.url}/locations/${branch.slug}`,
    image: `${siteConfig.url}${branch.image}`,
    telephone: branch.phone,
    contactPoint: branch.secondaryPhone
      ? { "@type": "ContactPoint", telephone: branch.secondaryPhone, contactType: "customer service" }
      : undefined,
    email: branch.email,
    priceRange: "₦₦",
    servesCuisine: ["Nigerian", "African", "Continental"],
    acceptsReservations: true,
    hasMenu: `${siteConfig.url}/menu?branch=${branch.slug}`,
    foundingDate: branch.establishedDate,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressLocality: branch.city,
      addressRegion: branch.state,
      addressCountry: "NG",
    },
    openingHoursSpecification: branch.openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      description: `${hours.days}: ${hours.hours}`,
    })),
    parentOrganization: { "@id": `${siteConfig.url}/#organization` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Locations", item: `${siteConfig.url}/locations` },
      { "@type": "ListItem", position: 3, name: branch.city, item: `${siteConfig.url}/locations/${branch.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <JsonLd data={branchJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-body">
        <Link href="/locations" className="hover:text-primary">Locations</Link> <span aria-hidden="true">/</span>{" "}
        <span className="text-charcoal">{branch.city}</span>
      </nav>

      <FoodImage name={branch.name} src={branch.image} icon="hall" className="h-64 w-full rounded-card" iconClassName="h-16 w-16" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="font-display text-3xl text-charcoal">{branch.name}</h1>
          {branch.establishedDate && (
            <p className="mt-2 text-sm font-semibold text-primary">Established February 14, 2026</p>
          )}
          <p className="mt-2 flex items-start gap-2 text-sm text-body">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {branch.address}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-body">
            Come and enjoy freshly prepared Nigerian meals, rice dishes, soups, grills and all kinds of snacks at
            {` ${branch.name}`}. We open daily from 9:00 AM to 10:00 PM and prepare food for indoor and outdoor events.
            Order for delivery or pickup, reserve a table, or contact our catering team in {branch.city}.
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
                {branch.secondaryPhone ? ` / ${branch.secondaryPhone}` : ""}
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
