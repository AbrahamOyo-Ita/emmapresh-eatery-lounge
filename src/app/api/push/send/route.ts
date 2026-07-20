import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffAccess } from "@/lib/admin-auth";
import { sendPushNotifications } from "@/lib/push";

const payloadSchema = z.object({ title: z.string().min(1).max(120), body: z.string().min(1).max(500), recipient: z.string().max(320).optional(), url: z.string().max(2048).optional(), image: z.string().max(2048).optional(), tag: z.string().max(120).optional(), actionLabel: z.string().max(40).optional() });

export async function POST(request: Request) {
  const secret = request.headers.get("x-push-webhook-secret");
  const trustedWebhook = Boolean(process.env.PUSH_WEBHOOK_SECRET && secret === process.env.PUSH_WEBHOOK_SECRET);
  if (!trustedWebhook) { const denied = await requireStaffAccess(); if (denied) return denied; }
  const raw = await request.json();
  const source = raw?.record ? { title: raw.record.subject, body: raw.record.message, recipient: raw.record.recipient, url: raw.record.action_url, tag: raw.record.entity_reference } : raw;
  const parsed = payloadSchema.safeParse(source);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid push payload" }, { status: 400 });
  try { const result = await sendPushNotifications(parsed.data, parsed.data.recipient); return NextResponse.json({ ok: true, ...result }); }
  catch (error) { return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Push delivery failed" }, { status: 500 }); }
}
