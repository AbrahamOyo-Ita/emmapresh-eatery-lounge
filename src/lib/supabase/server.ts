import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server client for Server Components / Server Actions / Route Handlers.
 * Reads the caller's session from cookies, so queries still run under RLS
 * as that user — use this for anything a signed-in customer or staff member
 * does themselves.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component during render — safe to ignore
            // when middleware is refreshing the session.
          }
        },
      },
    }
  );
}
