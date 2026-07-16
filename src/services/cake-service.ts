import { cakes, getCakeBySlug as _getCakeBySlug } from "@/data/cakes";
import type { BranchSlug } from "@/types";

export async function getCakes(params?: { branchSlug?: BranchSlug }) {
  if (params?.branchSlug) {
    return cakes.filter((c) => c.branchAvailability.includes(params.branchSlug!));
  }
  return cakes;
}

export async function getCakeBySlug(slug: string) {
  return _getCakeBySlug(slug) ?? null;
}
