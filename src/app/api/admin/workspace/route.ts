import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffAccess } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

const mutationSchema = z.object({
  table: z.enum(["crm_profiles", "crm_notes", "crm_tasks", "crm_deals", "promotions", "project_cards"]),
  operation: z.enum(["upsert", "delete"]),
  data: z.record(z.string(), z.unknown()),
});

export async function GET() {
  if (!hasSupabaseEnv()) return NextResponse.json({ ok: true, skipped: true });
  const denied = await requireStaffAccess();
  if (denied) return denied;
  const supabase = createAdminClient();
  const [profiles, notes, tasks, deals, promotions, projectCards] = await Promise.all([
    supabase.from("crm_profiles").select("*").order("updated_at", { ascending: false }),
    supabase.from("crm_notes").select("*").order("created_at", { ascending: false }),
    supabase.from("crm_tasks").select("*").order("due_date"),
    supabase.from("crm_deals").select("*").order("created_at", { ascending: false }),
    supabase.from("promotions").select("*").order("valid_until"),
    supabase.from("project_cards").select("*").order("position"),
  ]);
  const results = [profiles, notes, tasks, deals, promotions, projectCards];
  const failure = results.find((result) => result.error)?.error;
  if (failure) return NextResponse.json({ ok: false, error: failure.message }, { status: 500 });
  return NextResponse.json({ ok: true, data: {
    profiles: profiles.data, notes: notes.data, tasks: tasks.data, deals: deals.data,
    promotions: promotions.data, projectCards: projectCards.data,
  } });
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) return NextResponse.json({ ok: true, skipped: true });
  const denied = await requireStaffAccess();
  if (denied) return denied;
  const parsed = mutationSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid workspace mutation" }, { status: 400 });
  const supabase = createAdminClient();
  const { table, operation, data } = parsed.data;
  const result = operation === "delete"
    ? await supabase.from(table).delete().eq("id", String(data.id))
    : await supabase.from(table).upsert(data);
  if (result.error) return NextResponse.json({ ok: false, error: result.error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
