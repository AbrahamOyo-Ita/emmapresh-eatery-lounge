import { menuItems, getMenuItemBySlug as _getMenuItemBySlug, getMenuItemsByCategory as _getMenuItemsByCategory, getPopularMenuItems } from "@/data/menu-items";
import { menuCategories, getCategoryBySlug as _getCategoryBySlug } from "@/data/categories";
import type { BranchSlug, MenuItem } from "@/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { menuCategoryFromRow, menuItemFromRow } from "@/lib/supabase/mappers";

const publishedMenuBySlug = new Map(menuItems.map((item) => [item.slug, item]));

function applyPublishedMenu(item: MenuItem) {
  const published = publishedMenuBySlug.get(item.slug);
  return published ? { ...item, image: published.image, gallery: published.gallery } : null;
}

function applyPublishedMenuList(items: MenuItem[]) {
  return items.map(applyPublishedMenu).filter((item): item is MenuItem => item !== null);
}

/**
 * Typed mock service. Swap the bodies of these functions for Supabase queries
 * (e.g. `supabase.from('menu_items').select()`) — call sites are unaffected.
 */

export async function getMenuCategories() {
  if (hasSupabaseEnv()) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { data, error } = await createAdminClient().from("menu_categories").select("*").order("name");
    if (!error && data) return data.map(menuCategoryFromRow);
  }
  return menuCategories;
}

export async function getCategoryBySlug(slug: string) {
  if (hasSupabaseEnv()) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { data, error } = await createAdminClient().from("menu_categories").select("*").eq("slug", slug).maybeSingle();
    if (!error && data) return menuCategoryFromRow(data);
  }
  return _getCategoryBySlug(slug) ?? null;
}

export async function getMenuItems(params?: { branchSlug?: BranchSlug; categorySlug?: string }) {
  if (hasSupabaseEnv()) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    let query = createAdminClient().from("menu_items").select("*").order("name");
    if (params?.categorySlug) query = query.eq("category_slug", params.categorySlug);
    const { data, error } = await query;
    if (!error && data) {
      let mapped = applyPublishedMenuList(data.map(menuItemFromRow));
      if (params?.branchSlug) mapped = mapped.filter((item) => item.branchAvailability.includes(params.branchSlug!));
      return mapped;
    }
  }
  let items: MenuItem[] = menuItems;
  if (params?.categorySlug) {
    items = _getMenuItemsByCategory(params.categorySlug);
  }
  if (params?.branchSlug) {
    items = items.filter((item) => item.branchAvailability.includes(params.branchSlug!));
  }
  return items;
}

export async function getMenuItemBySlug(slug: string) {
  if (hasSupabaseEnv()) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { data, error } = await createAdminClient().from("menu_items").select("*").eq("slug", slug).maybeSingle();
    if (!error && data) return applyPublishedMenu(menuItemFromRow(data));
  }
  return _getMenuItemBySlug(slug) ?? null;
}

export async function getPopularItems(branchSlug?: BranchSlug) {
  if (hasSupabaseEnv()) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { data, error } = await createAdminClient().from("menu_items").select("*").eq("is_popular", true).order("rating", { ascending: false });
    if (!error && data) {
      const items = applyPublishedMenuList(data.map(menuItemFromRow));
      return branchSlug ? items.filter((i) => i.branchAvailability.includes(branchSlug)) : items;
    }
  }
  const items = getPopularMenuItems();
  return branchSlug ? items.filter((i) => i.branchAvailability.includes(branchSlug)) : items;
}

export async function getRelatedItems(item: MenuItem) {
  if (hasSupabaseEnv()) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { data, error } = await createAdminClient()
      .from("menu_items")
      .select("*")
      .eq("category_slug", item.categorySlug)
      .neq("id", item.id)
      .limit(4);
    if (!error && data) return applyPublishedMenuList(data.map(menuItemFromRow));
  }
  return menuItems.filter((i) => i.categorySlug === item.categorySlug && i.id !== item.id).slice(0, 4);
}
