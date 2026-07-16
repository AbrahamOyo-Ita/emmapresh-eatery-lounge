import { branches, getBranchBySlug as _getBranchBySlug } from "@/data/branches";

export async function getBranches() {
  return branches;
}

export async function getBranchBySlug(slug: string) {
  return _getBranchBySlug(slug) ?? null;
}
