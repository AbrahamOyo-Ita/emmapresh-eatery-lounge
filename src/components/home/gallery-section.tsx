import { SectionHeading } from "./section-heading";
import { FoodImage } from "@/components/ui/food-image";
import { galleryImages } from "@/data/gallery";
import { iconForCategory } from "@/lib/food-icon";

const categoryIcon = {
  food: iconForCategory("local-meals"),
  cakes: "cake" as const,
  events: "event" as const,
  academy: "academy" as const,
  lounge: "drink" as const,
};

export function GallerySection() {
  const images = galleryImages.slice(0, 10);
  return (
    <section className="motion-section mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading eyebrow="Moments" title="EmmaPresh Gallery" cta={{ label: "View Full Gallery", href: "/gallery" }} />
      <div className="motion-grid grid grid-cols-2 gap-3 sm:grid-cols-5">
        {images.map((image) => (
          <FoodImage
            key={image.id}
            name={image.alt}
            icon={categoryIcon[image.category]}
            className="aspect-square w-full rounded-card"
          />
        ))}
      </div>
    </section>
  );
}
