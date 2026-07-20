import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { isBootstrapAdmin, normalizeAdminEmail } from "@/lib/admin-access";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });

  const email = normalizeAdminEmail(parsed.data.email);
  if (!isBootstrapAdmin(email)) {
    return NextResponse.json({ ok: false, error: "This email is not authorised for dashboard access." }, { status: 403 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.json({ ok: false, error: "Authentication is not configured." }, { status: 503 });

  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) {
    console.error("Admin OTP request failed", { message: error.message, status: error.status });
    return NextResponse.json({ ok: false, error: "We could not send the passcode. Please wait a moment and try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
