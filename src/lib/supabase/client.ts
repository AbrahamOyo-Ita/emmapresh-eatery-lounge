import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client — safe to import in Client Components. Uses the publishable
 * (anon) key, so every query is subject to Row Level Security.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
