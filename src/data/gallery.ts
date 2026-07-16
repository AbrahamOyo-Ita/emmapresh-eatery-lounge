export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "food" | "cakes" | "events" | "academy" | "lounge";
}

export const galleryImages: GalleryImage[] = Array.from({ length: 20 }).map((_, i) => {
  const categories: GalleryImage["category"][] = ["food", "cakes", "events", "academy", "lounge"];
  const category = categories[i % categories.length];
  return {
    id: `gallery-${i + 1}`,
    src: `/images/gallery/${category}-${(i % 4) + 1}.jpg`,
    alt: `EmmaPresh ${category} highlight ${i + 1}`,
    category,
  };
});
