import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { getMenuItems, getMenuCategories, getCategoryBySlug } from "@/services/menu-service";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function MenuCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const [items, categories, category] = await Promise.all([
    getMenuItems(),
    getMenuCategories(),
    getCategoryBySlug(categorySlug),
  ]);

  if (!category) notFound();

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <h1 className="font-display text-3xl text-charcoal sm:text-4xl">{category.name}</h1>
        <p className="mt-2 max-w-xl text-sm text-body">{category.description}</p>
      </div>
      <MenuBrowser items={items} categories={categories} initialCategory={category.slug} />
    </div>
  );
}
