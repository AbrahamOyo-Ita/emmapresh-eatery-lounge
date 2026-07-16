"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu as MenuIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const initials = email ? email.slice(0, 2).toUpperCase() : "SA";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 lg:hidden"
          aria-label="Open admin menu"
        >
          <MenuIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div>
          <p className="text-xs text-body">Welcome back,</p>
          <p className="truncate text-sm font-semibold text-charcoal">{email ?? "Staff"}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5" aria-label="Notifications">
          <Bell className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
        </button>
        <Link href="/" className="focus-ring hidden text-xs font-semibold text-body hover:text-primary sm:block">
          View Storefront →
        </Link>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initials}
        </span>
        <button
          onClick={handleSignOut}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
