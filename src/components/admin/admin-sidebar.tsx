"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  ChefHat,
  UtensilsCrossed,
  CakeSlice,
  GraduationCap,
  Building2,
  CalendarCheck,
  Users,
  Megaphone,
  FileText,
  Settings,
  PanelTop,
  ContactRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Payments", href: "/admin/payments", icon: Wallet },
      { label: "Kitchen", href: "/admin/kitchen", icon: ChefHat },
      { label: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
    ],
  },
  {
    label: "Business Units",
    items: [
      { label: "Bakery & Cakes", href: "/admin/cakes", icon: CakeSlice },
      { label: "Catering", href: "/admin/catering", icon: ChefHat },
      { label: "Academy", href: "/admin/academy", icon: GraduationCap },
      { label: "Event Halls", href: "/admin/halls", icon: Building2 },
      { label: "Reservations", href: "/admin/reservations", icon: CalendarCheck },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "CRM", href: "/admin/crm", icon: ContactRound },
      { label: "CMS", href: "/admin/cms", icon: PanelTop },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Promotions", href: "/admin/promotions", icon: Megaphone },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-charcoal text-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <span className="font-display text-lg">
          EMMA<span className="text-primary">PRESH</span>
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide">Admin</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-3 text-[0.65rem] font-bold uppercase tracking-wider text-white/40">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "focus-ring flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active ? "bg-primary text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
