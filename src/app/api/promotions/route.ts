import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasSupabaseEnv()) return NextResponse.json({ ok: true, data: [] });
  const { data, error } = await createAdminClient().from("promotions").select("id,title,description,code,discount,valid_until").eq("active", true).gte("valid_until", new Date().toISOString().slice(0, 10)).order("valid_until");
  if (error) return NextResponse.json({ ok: false, error: "Unable to load promotions" }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
