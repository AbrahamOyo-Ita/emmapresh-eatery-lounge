import type { BranchSlug, MenuItem } from "@/types";

export function priceForBranch(item: MenuItem, branchSlug: BranchSlug | null) {
  if (branchSlug && item.branchPrices?.[branchSlug] != null) {
    return item.branchPrices[branchSlug]!;
  }
  return item.price;
}
