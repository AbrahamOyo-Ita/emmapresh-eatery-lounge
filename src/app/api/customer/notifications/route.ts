import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const schema = z.object({ email: z.string().email(), phone: z.string().trim().min(7).max(30) });

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) return NextResponse.json({ ok: false, error: "Notifications are not configured" }, { status: 503 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid account details" }, { status: 400 });
  const email = parsed.data.email.trim().toLowerCase();
  const supabase = createAdminClient();
  const { data: order } = await supabase.from("orders").select("reference").contains("customer", { email, phone: parsed.data.phone }).limit(1).maybeSingle();
  if (!order) return NextResponse.json({ ok: false, error: "No matching customer account found" }, { status: 403 });
  const { data, error } = await supabase.from("notifications").select("id,subject,message,action_url,entity_reference,created_at").eq("recipient", email).order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ ok: false, error: "Unable to load notifications" }, { status: 500 });
  return NextResponse.json({ ok: true, notifications: data ?? [] });
}
