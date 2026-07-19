import { cakes, getCakeBySlug as _getCakeBySlug } from "@/data/cakes";
import type { BranchSlug } from "@/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { cakeFromRow } from "@/lib/supabase/mappers";

export async function getCakes(params?: { branchSlug?: BranchSlug }) {
  if (hasSupabaseEnv()) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { data, error } = await createAdminClient().from("cakes").select("*").order("name");
    if (!error && data) {
      const mapped = data.map(cakeFromRow);
      return params?.branchSlug ? mapped.filter((c) => c.branchAvailability.includes(params.branchSlug!)) : mapped;
    }
  }
  if (params?.branchSlug) {
    return cakes.filter((c) => c.branchAvailability.includes(params.branchSlug!));
  }
  return cakes;
}

export async function getCakeBySlug(slug: string) {
  if (hasSupabaseEnv()) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { data, error } = await createAdminClient().from("cakes").select("*").eq("slug", slug).maybeSingle();
    if (!error && data) return cakeFromRow(data);
  }
  return _getCakeBySlug(slug) ?? null;
}
