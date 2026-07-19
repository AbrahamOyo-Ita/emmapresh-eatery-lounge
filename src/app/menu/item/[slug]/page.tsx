import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star, Clock, ShieldCheck } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { Badge } from "@/components/ui/badge";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { ProductOptions } from "@/components/menu/product-options";
import { getMenuItemBySlug, getRelatedItems } from "@/services/menu-service";
import { iconForCategory } from "@/lib/food-icon";
import { formatCurrency } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMenuItemBySlug(slug);
  if (!item) return {};
  return {
    title: item.name,
    description: item.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getMenuItemBySlug(slug);
  if (!item) notFound();

  const related = await getRelatedItems(item);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-body">
        <span>Menu</span> <span aria-hidden="true">/</span>{" "}
        <span className="text-charcoal">{item.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <FoodImage name={item.name} src={item.image} icon={iconForCategory(item.categorySlug)} className="aspect-square w-full rounded-card" iconClassName="h-28 w-28" />
        </div>

        <div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {item.isPopular && <Badge variant="primary">Popular</Badge>}
            {item.isNew && <Badge variant="accent">New</Badge>}
            {item.stockStatus === "low-stock" && <Badge variant="warning">Low Stock</Badge>}
            {item.stockStatus === "sold-out" && <Badge variant="error">Sold Out</Badge>}
          </div>
          <h1 className="font-display text-3xl text-charcoal">{item.name}</h1>
          <p className="mt-3 text-sm text-body">{item.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-body">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
              {item.rating} ({item.reviewCount} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {item.prepTimeMinutes} min prep time
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Available at {item.branchAvailability.length} branch{item.branchAvailability.length > 1 ? "es" : ""}
            </span>
          </div>

          {item.dietaryLabels.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.dietaryLabels.map((label) => (
                <Badge key={label} variant="outline">
                  {label.replace("-", " ")}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-body">Ingredients</p>
              <p className="text-sm text-charcoal">{item.ingredients.join(", ")}</p>
            </div>
            {item.allergens.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-body">Allergens</p>
                <p className="text-sm text-charcoal">{item.allergens.join(", ")}</p>
              </div>
            )}
          </div>

          <p className="mt-6 font-display text-2xl text-charcoal">{formatCurrency(item.price)}</p>

          <div className="mt-6 border-t border-border pt-6">
            {item.stockStatus === "sold-out" ? (
              <div className="rounded-2xl bg-error/10 px-5 py-4 text-sm font-semibold text-error">
                This item is currently sold out. Please check back later or explore related items below.
              </div>
            ) : (
              <ProductOptions item={item} />
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-display text-2xl text-charcoal">You Might Also Like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((relatedItem) => (
              <MenuItemCard key={relatedItem.id} item={relatedItem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
