import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { notify } from "@/lib/notifications";
import {
  academyApplicationToRow,
  cakeRequestToRow,
  cateringRequestToRow,
  contactToRow,
  hallEnquiryToRow,
  mealPlanToRow,
  orderToRow,
  reservationToRow,
} from "@/lib/supabase/mappers";

export const dynamic = "force-dynamic";

const tableByEntity = {
  orders: "orders",
  catering: "catering_requests",
  "cake-requests": "custom_cake_requests",
  academy: "academy_applications",
  halls: "hall_enquiries",
  reservations: "reservations",
  "meal-plans": "meal_plan_subscriptions",
  contact: "contact_messages",
} as const;

type NotificationPayload = {
  id?: string;
  reference?: string;
  email?: string;
  customer?: { email?: string };
};

function toRow(entity: string, payload: unknown) {
  switch (entity) {
    case "orders":
      return orderToRow(payload as Parameters<typeof orderToRow>[0]);
    case "catering":
      return cateringRequestToRow(payload as Parameters<typeof cateringRequestToRow>[0]);
    case "cake-requests":
      return cakeRequestToRow(payload as Parameters<typeof cakeRequestToRow>[0]);
    case "academy":
      return academyApplicationToRow(payload as Parameters<typeof academyApplicationToRow>[0]);
    case "halls":
      return hallEnquiryToRow(payload as Parameters<typeof hallEnquiryToRow>[0]);
    case "reservations":
      return reservationToRow(payload as Parameters<typeof reservationToRow>[0]);
    case "meal-plans":
      return mealPlanToRow(payload as Parameters<typeof mealPlanToRow>[0]);
    case "contact":
      return contactToRow(payload as Parameters<typeof contactToRow>[0]);
    default:
      return null;
  }
}

function notificationFor(entity: string, payload: NotificationPayload) {
  const reference = payload.reference ?? payload.id;
  const customerEmail = payload.customer?.email ?? payload.email;
  if (!customerEmail || !reference) return null;
  const subject = entity === "orders" ? `Order ${reference} received` : `EmmaPresh request ${reference} received`;
  return {
    channel: "email" as const,
    recipient: customerEmail,
    subject,
    message: `We received your ${entity.replace("-", " ")} request. Reference: ${reference}.`,
    entityType: entity,
    entityReference: reference,
  };
}

export async function POST(request: Request) {
  const { entity, payload } = await request.json();
  const table = tableByEntity[entity as keyof typeof tableByEntity];
  const row = toRow(entity, payload);

  if (!table || !row) {
    return NextResponse.json({ ok: false, error: "Unsupported entity" }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: true, skipped: "supabase-env-missing" });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from(table as never).upsert(row as never);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const notification = notificationFor(entity, payload as NotificationPayload);
  if (notification) await notify(notification);
  return NextResponse.json({ ok: true });
}
