import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { buttonVariants } from "@/components/ui/button";
import { getHallBySlug } from "@/data/halls";
import { halls } from "@/data/halls";
import { branches } from "@/data/branches";
import { formatCurrency, cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return halls.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const hall = getHallBySlug(slug);
  if (!hall) return {};
  return { title: hall.name, description: hall.description };
}

export default async function HallDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const hall = getHallBySlug(slug);
  if (!hall) notFound();
  const branch = branches.find((b) => b.slug === hall.branchSlug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <FoodImage name={hall.name} src={hall.image} icon="hall" className="h-64 w-full rounded-card" iconClassName="h-16 w-16" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="font-display text-3xl text-charcoal">{hall.name}</h1>
          <p className="mt-1 text-sm text-body">{branch?.name}, {branch?.address}</p>
          <p className="mt-4 text-sm text-body">{hall.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Banquet", value: hall.capacity.banquet },
              { label: "Classroom", value: hall.capacity.classroom },
              { label: "Theatre", value: hall.capacity.theatre },
              { label: "Boardroom", value: hall.capacity.boardroom },
            ].map((layout) => (
              <div key={layout.label} className="rounded-2xl border border-border/60 p-3 text-center">
                <p className="font-display text-xl text-charcoal">{layout.value}</p>
                <p className="text-xs text-body">{layout.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-body">Facilities</p>
            <ul className="grid grid-cols-2 gap-2 text-sm text-charcoal">
              {hall.facilities.map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-fit space-y-3 rounded-card border border-border/60 bg-white p-5">
          <p className="text-sm text-body">Starting price</p>
          <p className="font-display text-2xl text-charcoal">{formatCurrency(hall.startingPrice)}</p>
          <Link href={`/halls/request-booking?hall=${hall.slug}`} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}>
            Request Availability
          </Link>
          <a href={`https://wa.me/${branch?.whatsapp}`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
