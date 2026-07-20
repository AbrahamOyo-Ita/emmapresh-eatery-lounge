import { NextResponse } from "next/server";
import { requireStaffAccess } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = await requireStaffAccess();
  if (denied) return denied;
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: false, error: "Receipt storage is not configured" }, { status: 404 });
  }

  const path = new URL(request.url).searchParams.get("path")?.trim();
  if (!path || path.includes("..") || path.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "Invalid receipt path" }, { status: 400 });
  }

  const { data, error } = await createAdminClient().storage.from("receipts").createSignedUrl(path, 60 * 10);
  if (error || !data?.signedUrl) {
    return NextResponse.json({ ok: false, error: error?.message ?? "Receipt not found" }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}
