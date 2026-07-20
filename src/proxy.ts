import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isBootstrapAdmin } from "@/lib/admin-access";

/**
 * Refreshes the Supabase auth session on every request, and gates every
 * /admin/* route behind a signed-in session (staff accounts only — customers
 * never get one). /admin/login itself must stay reachable while signed out.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }

    const { data: staff } = isBootstrapAdmin(user.email) ? { data: { user_id: user.id } } : await supabase
      .from("staff_profiles").select("user_id").eq("user_id", user.id).maybeSingle();

    if (!staff) {
      await supabase.auth.signOut();
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "staff-access-required");
      return NextResponse.redirect(loginUrl);
    }
  }

  if (request.nextUrl.pathname === "/admin/login" && user) {
    const { data: staff } = isBootstrapAdmin(user.email) ? { data: { user_id: user.id } } : await supabase
      .from("staff_profiles").select("user_id").eq("user_id", user.id).maybeSingle();
    if (staff) return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
