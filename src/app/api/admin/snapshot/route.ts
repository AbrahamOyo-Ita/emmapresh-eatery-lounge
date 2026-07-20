import { NextResponse } from "next/server";
import { requireStaffAccess } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  academyApplicationFromRow,
  cakeRequestFromRow,
  cateringRequestFromRow,
  contactFromRow,
  hallEnquiryFromRow,
  mealPlanFromRow,
  orderFromRow,
  reservationFromRow,
} from "@/lib/supabase/mappers";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: true, skipped: "supabase-env-missing" });
  }
  const denied = await requireStaffAccess();
  if (denied) return denied;

  const supabase = createAdminClient();
  const [
    orders,
    catering,
    cakeRequests,
    academy,
    halls,
    reservations,
    mealPlans,
    contact,
  ] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("catering_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("custom_cake_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("academy_applications").select("*").order("created_at", { ascending: false }),
    supabase.from("hall_enquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("reservations").select("*").order("created_at", { ascending: false }),
    supabase.from("meal_plan_subscriptions").select("*").order("created_at", { ascending: false }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
  ]);

  const failures = [orders, catering, cakeRequests, academy, halls, reservations, mealPlans, contact]
    .map((result) => result.error?.message)
    .filter((message): message is string => Boolean(message));
  if (failures.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Unable to load the admin snapshot", details: failures },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      orders: (orders.data ?? []).map(orderFromRow),
      catering: (catering.data ?? []).map(cateringRequestFromRow),
      cakeRequests: (cakeRequests.data ?? []).map(cakeRequestFromRow),
      academy: (academy.data ?? []).map(academyApplicationFromRow),
      halls: (halls.data ?? []).map(hallEnquiryFromRow),
      reservations: (reservations.data ?? []).map(reservationFromRow),
      mealPlans: (mealPlans.data ?? []).map(mealPlanFromRow),
      contact: (contact.data ?? []).map(contactFromRow),
    },
  });
}
