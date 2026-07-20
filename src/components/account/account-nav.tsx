"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { label: "Profile", href: "/account" },
  { label: "Order History", href: "/account/orders" },
  { label: "Notifications", href: "/account/notifications" },
  { label: "Favourites", href: "/account/favourites" },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-border pb-3" aria-label="Account navigation">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "focus-ring shrink-0 rounded-full px-4 py-2 text-sm font-semibold",
            pathname === link.href ? "bg-charcoal text-white" : "bg-cream-soft text-charcoal hover:bg-border"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
