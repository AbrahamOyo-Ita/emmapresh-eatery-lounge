import { branches, getBranchBySlug as _getBranchBySlug } from "@/data/branches";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { branchFromRow } from "@/lib/supabase/mappers";

function applyPublishedBranchImage(branch: ReturnType<typeof branchFromRow>) {
  const published = _getBranchBySlug(branch.slug);
  return published
    ? {
        ...branch,
        address: published.address,
        phone: published.phone,
        secondaryPhone: published.secondaryPhone,
        whatsapp: published.whatsapp,
        email: published.email,
        openingHours: published.openingHours,
        establishedDate: published.establishedDate,
        image: published.image,
        gallery: published.gallery,
      }
    : branch;
}

export async function getBranches() {
  if (hasSupabaseEnv()) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { data, error } = await createAdminClient().from("branches").select("*").order("name");
    if (!error && data) return data.map(branchFromRow).map(applyPublishedBranchImage);
  }
  return branches;
}

export async function getBranchBySlug(slug: string) {
  if (hasSupabaseEnv()) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { data, error } = await createAdminClient().from("branches").select("*").eq("slug", slug).maybeSingle();
    if (!error && data) return applyPublishedBranchImage(branchFromRow(data));
  }
  return _getBranchBySlug(slug) ?? null;
}
