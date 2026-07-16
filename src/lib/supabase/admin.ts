import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Privileged server-only client using the secret/service_role key — bypasses
 * Row Level Security entirely. Use only for trusted backend operations that
 * must act across all rows regardless of the caller (e.g. finance verifying
 * a payment, admin dashboards reading every branch's orders).
 *
 * The `server-only` import makes any accidental client-side import a build
 * error rather than a leaked secret.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
