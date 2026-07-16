import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FoodImage } from "@/components/ui/food-image";
import { Badge } from "@/components/ui/badge";
import { CakeAddToCart } from "@/components/cakes/cake-add-to-cart";
import { getCakeBySlug } from "@/services/cake-service";
import { cakes } from "@/data/cakes";
import { formatCurrency } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return cakes.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cake = await getCakeBySlug(slug);
  if (!cake) return {};
  return { title: cake.name, description: cake.description };
}

export default async function CakeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cake = await getCakeBySlug(slug);
  if (!cake) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <FoodImage name={cake.name} icon="cake" className="aspect-square w-full rounded-card" iconClassName="h-24 w-24" />
        <div>
          {cake.sameDayPickup && <Badge variant="accent">Same-Day Pickup</Badge>}
          <h1 className="mt-3 font-display text-3xl text-charcoal">{cake.name}</h1>
          <p className="mt-3 text-sm text-body">{cake.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-body">Size</p>
              <p className="text-charcoal">{cake.sizeLabel}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-body">Flavour</p>
              <p className="text-charcoal">{cake.flavour}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-body">Occasion</p>
              <p className="capitalize text-charcoal">{cake.occasion.replace("-", " ")}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-body">Quantity Available</p>
              <p className="text-charcoal">{cake.quantityAvailable} in stock</p>
            </div>
          </div>
          <p className="mt-6 font-display text-2xl text-charcoal">{formatCurrency(cake.price)}</p>
          <div className="mt-6 border-t border-border pt-6">
            <CakeAddToCart cake={cake} />
          </div>
        </div>
      </div>
    </div>
  );
}
