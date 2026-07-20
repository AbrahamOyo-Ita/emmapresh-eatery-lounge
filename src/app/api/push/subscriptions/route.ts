import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const subscriptionSchema = z.object({ endpoint: z.string().url().max(2048), expirationTime: z.number().nullable().optional(), keys: z.object({ p256dh: z.string().min(20).max(500), auth: z.string().min(8).max(200) }), customerEmail: z.string().email().optional() });

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) return NextResponse.json({ ok: false, error: "Push storage is not configured" }, { status: 503 });
  const parsed = subscriptionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid push subscription" }, { status: 400 });
  const value = parsed.data;
  const { error } = await createAdminClient().from("push_subscriptions").upsert({ endpoint: value.endpoint, p256dh: value.keys.p256dh, auth: value.keys.auth, customer_email: value.customerEmail?.toLowerCase() || null, user_agent: request.headers.get("user-agent"), updated_at: new Date().toISOString() }, { onConflict: "endpoint" });
  if (error) return NextResponse.json({ ok: false, error: "Unable to save notification subscription" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const parsed = z.object({ endpoint: z.string().url() }).safeParse(await request.json());
  if (!parsed.success || !hasSupabaseEnv()) return NextResponse.json({ ok: false }, { status: 400 });
  await createAdminClient().from("push_subscriptions").delete().eq("endpoint", parsed.data.endpoint);
  return NextResponse.json({ ok: true });
}
