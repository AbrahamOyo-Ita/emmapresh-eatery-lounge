import Link from "next/link";
import { SectionHeading } from "./section-heading";
import { FoodImage } from "@/components/ui/food-image";
import { buttonVariants } from "@/components/ui/button";
import { galleryImages } from "@/data/gallery";
import { iconForCategory } from "@/lib/food-icon";
import { cn } from "@/lib/utils";

const categoryIcon = {
  food: iconForCategory("local-meals"),
  cakes: "cake" as const,
  events: "event" as const,
  academy: "academy" as const,
  lounge: "drink" as const,
};

export function GallerySection() {
  const previewImages = galleryImages.slice(0, 9);

  return (
    <section className="motion-section mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading eyebrow="Moments" title="EmmaPresh Gallery" />
      <div className="motion-grid grid grid-cols-3 gap-3 sm:grid-cols-5">
        {previewImages.map((image) => (
          <FoodImage
            key={image.id}
            name={image.alt}
            src={image.src}
            icon={categoryIcon[image.category]}
            className="aspect-square w-full rounded-card"
          />
        ))}
      </div>
      <div className="mt-7 text-center">
        <Link href="/gallery" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
          View Full Gallery
        </Link>
      </div>
    </section>
  );
}
