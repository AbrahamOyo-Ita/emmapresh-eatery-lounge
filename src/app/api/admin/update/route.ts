import { NextResponse } from "next/server";
import { requireStaffAccess } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

const tableByEntity = {
  orders: { table: "orders", key: "reference" },
  catering: { table: "catering_requests", key: "id" },
  "cake-requests": { table: "custom_cake_requests", key: "id" },
  academy: { table: "academy_applications", key: "id" },
  halls: { table: "hall_enquiries", key: "id" },
  reservations: { table: "reservations", key: "id" },
  "meal-plans": { table: "meal_plan_subscriptions", key: "id" },
  "menu-status": { table: "menu_items", key: "id" },
} as const;

function toRowPatch(patch: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  if ("status" in patch) row.status = patch.status;
  if ("stockStatus" in patch) row.stock_status = patch.stockStatus;
  if ("quotedAmount" in patch) row.quoted_amount = patch.quotedAmount;
  if ("internalNotes" in patch) row.internal_notes = patch.internalNotes;
  if ("payment" in patch) row.payment = patch.payment;
  if ("statusHistory" in patch) row.status_history = patch.statusHistory;
  return row;
}

export async function POST(request: Request) {
  const { entity, id, patch } = await request.json();
  const target = tableByEntity[entity as keyof typeof tableByEntity];
  if (!target) return NextResponse.json({ ok: false, error: "Unsupported entity" }, { status: 400 });
  if (!hasSupabaseEnv()) return NextResponse.json({ ok: true, skipped: "supabase-env-missing" });
  const denied = await requireStaffAccess();
  if (denied) return denied;

  const supabase = createAdminClient();
  const { error } = await supabase.from(target.table).update(toRowPatch(patch)).eq(target.key, id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
