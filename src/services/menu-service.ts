import { menuItems, getMenuItemBySlug as _getMenuItemBySlug, getMenuItemsByCategory as _getMenuItemsByCategory, getPopularMenuItems } from "@/data/menu-items";
import { menuCategories, getCategoryBySlug as _getCategoryBySlug } from "@/data/categories";
import type { BranchSlug, MenuItem } from "@/types";

/**
 * Typed mock service. Swap the bodies of these functions for Supabase queries
 * (e.g. `supabase.from('menu_items').select()`) — call sites are unaffected.
 */

export async function getMenuCategories() {
  return menuCategories;
}

export async function getCategoryBySlug(slug: string) {
  return _getCategoryBySlug(slug) ?? null;
}

export async function getMenuItems(params?: { branchSlug?: BranchSlug; categorySlug?: string }) {
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
  return _getMenuItemBySlug(slug) ?? null;
}

export async function getPopularItems(branchSlug?: BranchSlug) {
  const items = getPopularMenuItems();
  return branchSlug ? items.filter((i) => i.branchAvailability.includes(branchSlug)) : items;
}

export async function getRelatedItems(item: MenuItem) {
  return menuItems.filter((i) => i.categorySlug === item.categorySlug && i.id !== item.id).slice(0, 4);
}

export function priceForBranch(item: MenuItem, branchSlug: BranchSlug | null) {
  if (branchSlug && item.branchPrices?.[branchSlug] != null) {
    return item.branchPrices[branchSlug]!;
  }
  return item.price;
}
