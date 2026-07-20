import "server-only";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isBootstrapAdmin } from "@/lib/admin-access";

export async function requireStaffAccess() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
  }

  if (isBootstrapAdmin(user.email)) return null;

  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("user_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!staff) {
    return NextResponse.json({ ok: false, error: "Staff access required" }, { status: 403 });
  }

  return null;
}
