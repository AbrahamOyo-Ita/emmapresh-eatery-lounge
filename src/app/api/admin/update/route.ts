import { NextResponse } from "next/server";
import { requireStaffAccess } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { notify } from "@/lib/notifications";
import { siteConfig } from "@/config/site";

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
  const { data, error } = await supabase.from(target.table).update(toRowPatch(patch)).eq(target.key, id).select("*").maybeSingle();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  if (entity === "orders" && data?.customer?.email && ("status" in patch || "payment" in patch)) {
    const paymentStatus = data.payment?.status as string | undefined;
    const status = String(data.status ?? patch.status ?? "updated");
    const paymentMessage = paymentStatus === "payment-verified"
      ? "Your payment has been verified successfully. Your order is now confirmed and will move to preparation."
      : paymentStatus === "payment-rejected"
        ? `We could not verify your payment receipt. ${data.payment?.verification?.rejectionReason ?? "Please contact us or upload a clearer receipt."}`
        : null;
    await notify({
      channel: "email",
      recipient: data.customer.email,
      subject: paymentStatus === "payment-verified"
        ? `Payment confirmed — ${id}`
        : paymentStatus === "payment-rejected"
          ? `Payment needs attention — ${id}`
          : `Order update — ${id}`,
      message: paymentMessage ?? `Your order ${id} status is now: ${status.replace(/-/g, " ")}.`,
      entityType: "orders",
      entityReference: id,
      actionUrl: `${siteConfig.url}/orders/${id}`,
      actionLabel: "View order status",
    });
  }
  return NextResponse.json({ ok: true });
}
