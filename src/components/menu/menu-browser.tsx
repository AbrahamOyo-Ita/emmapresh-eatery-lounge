"use client";

import * as React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { MenuItemCard } from "./menu-item-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useBranchStore } from "@/stores/branch-store";
import { priceForBranch } from "@/services/menu-service";
import type { MenuCategory, MenuItem, DietaryLabel } from "@/types";
import { cn } from "@/lib/utils";

type SortOption = "popularity" | "price-asc" | "price-desc" | "rating";

const dietaryOptions: { value: DietaryLabel; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "spicy", label: "Spicy" },
  { value: "gluten-free", label: "Gluten-Free" },
];

export function MenuBrowser({
  items,
  categories,
  initialCategory,
}: {
  items: MenuItem[];
  categories: MenuCategory[];
  initialCategory?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>(initialCategory ?? "all");
  const [sort, setSort] = React.useState<SortOption>("popularity");
  const [dietary, setDietary] = React.useState<DietaryLabel[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const branchSlug = useBranchStore((s) => s.selectedBranch);

  function toggleDietary(label: DietaryLabel) {
    setDietary((prev) => (prev.includes(label) ? prev.filter((d) => d !== label) : [...prev, label]));
  }

  const filtered = React.useMemo(() => {
    let result = items;
    if (branchSlug) {
      result = result.filter((item) => item.branchAvailability.includes(branchSlug));
    }
    if (activeCategory !== "all") {
      result = result.filter((item) => item.categorySlug === activeCategory);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      );
    }
    if (dietary.length > 0) {
      result = result.filter((item) => dietary.every((d) => item.dietaryLabels.includes(d)));
    }

    const withPrice = result.map((item) => ({ item, price: priceForBranch(item, branchSlug) }));
    withPrice.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.item.rating - a.item.rating;
        default:
          return Number(b.item.isPopular) - Number(a.item.isPopular) || b.item.rating - a.item.rating;
      }
    });
    return withPrice.map((w) => w.item);
  }, [items, branchSlug, activeCategory, query, dietary, sort]);

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-body">Dietary</p>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => toggleDietary(option.value)}
              className={cn(
                "focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                dietary.includes(option.value)
                  ? "border-primary bg-primary text-white"
                  : "border-border text-charcoal hover:border-charcoal"
              )}
              aria-pressed={dietary.includes(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-body">Sort By</p>
        <Select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} aria-label="Sort menu items">
          <option value="popularity">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </Select>
      </div>
    </div>
  );

  return (
    <div>
      <div className="sticky top-16 z-20 border-y border-border bg-white/95 px-4 py-5 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-body" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu..."
              aria-label="Search menu"
              className="pl-10"
            />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-border lg:hidden"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mx-auto mt-5 flex max-w-7xl gap-2.5 overflow-x-auto pb-1.5">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "focus-ring shrink-0 rounded-control px-4 py-2 text-xs font-semibold transition-colors",
              activeCategory === "all" ? "bg-charcoal text-white" : "bg-white text-charcoal border border-border"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "focus-ring shrink-0 rounded-control px-4 py-2 text-xs font-semibold transition-colors",
                activeCategory === cat.slug ? "bg-charcoal text-white" : "bg-white text-charcoal border border-border"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:py-16">
        <aside className="hidden lg:block">
          <div className="sticky top-40">{FilterPanel}</div>
        </aside>

        <div>
          {!branchSlug && (
            <p className="mb-4 rounded-xl bg-info/10 px-4 py-2.5 text-xs font-medium text-info">
              Select a branch to see accurate prices and availability for your location.
            </p>
          )}
          <p className="mb-6 text-sm text-body">{filtered.length} items found</p>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border py-16 text-center">
              <p className="font-display text-lg text-charcoal">No items match your filters</p>
              <p className="max-w-sm text-sm text-body">
                Try clearing your search or removing a dietary filter to see more results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-7 xl:grid-cols-3">
              {filtered.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/50" onClick={() => setMobileFiltersOpen(false)} aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" className="focus-ring rounded-full p-2 hover:bg-black/5">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}

export function DietaryBadgeList({ labels }: { labels: DietaryLabel[] }) {
  if (labels.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {labels.map((label) => (
        <Badge key={label} variant="outline">
          {label.replace("-", " ")}
        </Badge>
      ))}
    </div>
  );
}
