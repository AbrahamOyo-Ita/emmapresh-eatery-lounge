import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { requireStaffAccess } from "@/lib/admin-auth";
import { sendEmail } from "@/lib/email";
import { sendPushNotifications } from "@/lib/push";
import { createAdminClient } from "@/lib/supabase/admin";

const payloadSchema = z.object({ title: z.string().min(1).max(120), body: z.string().min(1).max(500), recipient: z.string().max(320).optional(), url: z.string().max(2048).optional(), image: z.string().max(2048).optional(), tag: z.string().max(120).optional(), actionLabel: z.string().max(40).optional() });
const automationRecordSchema = z.object({
  id: z.string().uuid(),
  automation_key: z.string().min(1),
  channel: z.enum(["email", "admin"]),
  recipient: z.string().email(),
  subject: z.string().min(1).max(120),
  message: z.string().min(1).max(1000),
  entity_type: z.string().nullable().optional(),
  entity_reference: z.string().nullable().optional(),
  action_url: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const secret = request.headers.get("x-push-webhook-secret");
  const trustedWebhook = Boolean(process.env.PUSH_WEBHOOK_SECRET && secret === process.env.PUSH_WEBHOOK_SECRET);
  if (!trustedWebhook) { const denied = await requireStaffAccess(); if (denied) return denied; }
  const raw = await request.json();
  if (raw?.record) {
    const parsedRecord = automationRecordSchema.safeParse(raw.record);
    if (!parsedRecord.success) return NextResponse.json({ ok: true, skipped: "Application notification or invalid automation record" });
    const record = parsedRecord.data;
    const actionUrl = record.action_url
      ? new URL(record.action_url, siteConfig.url).toString()
      : undefined;
    try {
      if (record.channel === "email" || record.channel === "admin") {
        await sendEmail({
          to: record.recipient,
          subject: record.subject,
          text: record.message,
          actionUrl,
          actionLabel: "View details",
          category: record.entity_type ?? undefined,
          reference: record.entity_reference ?? undefined,
        });
      }
      const push = await sendPushNotifications({
        title: record.subject,
        body: record.message,
        url: actionUrl,
        tag: record.entity_reference ?? undefined,
        actionLabel: "View details",
      }, record.recipient);
      await createAdminClient().from("notifications").update({ status: "sent" }).eq("id", record.id);
      return NextResponse.json({ ok: true, automated: true, ...push });
    } catch (error) {
      await createAdminClient().from("notifications").update({ status: "failed" }).eq("id", record.id);
      return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Automation delivery failed" }, { status: 500 });
    }
  }
  const source = raw;
  const parsed = payloadSchema.safeParse(source);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid push payload" }, { status: 400 });
  try { const result = await sendPushNotifications(parsed.data, parsed.data.recipient); return NextResponse.json({ ok: true, ...result }); }
  catch (error) { return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Push delivery failed" }, { status: 500 }); }
}
