import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { notify } from "@/lib/notifications";
import { siteConfig } from "@/config/site";
import { academyCourses } from "@/data/academy-courses";
import { halls } from "@/data/halls";
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
  status?: string;
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
  const isReceipt = entity === "orders" && payload.status === "payment-submitted";
  const subject = isReceipt
    ? `Payment receipt received — ${reference}`
    : entity === "orders"
      ? `Order ${reference} received`
      : `EmmaPresh request ${reference} received`;
  return {
    channel: "email" as const,
    recipient: customerEmail,
    subject,
    message: isReceipt
      ? `We received the payment receipt for order ${reference}. Our finance team will review it and email you when verification is complete.`
      : `Thank you for choosing EmmaPresh. We received your ${entity.replace("-", " ")} request.\n\nReference: ${reference}. Keep this reference for tracking and support.`,
    entityType: entity,
    entityReference: reference,
    actionUrl: entity === "orders" ? `${siteConfig.url}/orders/${reference}` : undefined,
    actionLabel: entity === "orders" ? "Track your order" : undefined,
  };
}

export async function POST(request: Request) {
  const { entity, payload } = await request.json();
  const table = tableByEntity[entity as keyof typeof tableByEntity];
  const row = toRow(entity, payload);

  if (!table || !row) {
    return NextResponse.json({ ok: false, error: "Unsupported entity" }, { status: 400 });
  }

  if (hasSupabaseEnv()) {
    const supabase = createAdminClient();
    const databaseRow = { ...(row as Record<string, unknown>) };

    if (entity === "academy") {
      const localCourse = academyCourses.find((course) => course.id === (payload as NotificationPayload & { courseId?: string }).courseId);
      if (!localCourse) return NextResponse.json({ ok: false, error: "Course not found" }, { status: 400 });
      const { data: course, error: courseError } = await supabase.from("academy_courses").select("id").eq("slug", localCourse.slug).maybeSingle();
      if (courseError || !course) return NextResponse.json({ ok: false, error: courseError?.message ?? "Course is not configured" }, { status: 500 });
      databaseRow.course_id = course.id;
    }

    if (entity === "halls") {
      const localHall = halls.find((hall) => hall.id === (payload as NotificationPayload & { hallId?: string }).hallId);
      if (!localHall) return NextResponse.json({ ok: false, error: "Hall not found" }, { status: 400 });
      const { data: hall, error: hallError } = await supabase.from("halls").select("id").eq("slug", localHall.slug).maybeSingle();
      if (hallError || !hall) return NextResponse.json({ ok: false, error: hallError?.message ?? "Hall is not configured" }, { status: 500 });
      databaseRow.hall_id = hall.id;
    }

    const { error } = await supabase.from(table as never).upsert(databaseRow as never);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
  }

  const notification = notificationFor(entity, payload as NotificationPayload);
  if (notification) await notify(notification);
  return NextResponse.json({ ok: true, persisted: hasSupabaseEnv() });
}
