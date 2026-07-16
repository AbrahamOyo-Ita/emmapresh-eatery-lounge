import { SectionHeading } from "./section-heading";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import type { MenuItem } from "@/types";

export function PopularMenu({ items }: { items: MenuItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeading
        eyebrow="Best Sellers"
        title="Our Popular Meals"
        description="The dishes our customers order again and again, across all three branches."
        cta={{ label: "View Full Menu", href: "/menu" }}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.slice(0, 8).map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
