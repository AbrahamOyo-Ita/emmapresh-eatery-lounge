import type { Metadata } from "next";
import { FoodImage } from "@/components/ui/food-image";
import { galleryImages } from "@/data/gallery";
import { iconForCategory } from "@/lib/food-icon";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from EmmaPresh Eatery & Lounge — food, cakes, events, academy classes and the lounge.",
};

const categoryIcon = {
  food: iconForCategory("local-meals"),
  cakes: "cake" as const,
  events: "event" as const,
  academy: "academy" as const,
  lounge: "drink" as const,
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Gallery</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-body">Moments from our kitchens, bakeries, events and academy classes.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {galleryImages.map((image) => (
          <FoodImage key={image.id} name={image.alt} icon={categoryIcon[image.category]} className="aspect-square w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
