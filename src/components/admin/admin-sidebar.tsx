"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Wallet, ChefHat, UtensilsCrossed, CakeSlice,
  GraduationCap, Building2, CalendarCheck, Users, Megaphone, FileText,
  Settings, PanelTop, ContactRound, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
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

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-5">
        <span className="font-display text-lg">EMMA<span className="text-primary">PRESH</span></span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide">Admin</span>
        {onClose && (
          <button type="button" onClick={onClose} className="focus-ring ml-auto flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10" aria-label="Close admin menu">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-5" aria-label="Admin navigation">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-3 text-[0.65rem] font-bold uppercase tracking-wider text-white/40">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link href={item.href} onClick={onClose} aria-current={active ? "page" : undefined} className={cn(
                      "focus-ring flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-primary text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}>
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
    </>
  );
}

export function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  React.useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose?.();
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen, onClose]);

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-charcoal text-white lg:flex lg:flex-col">
        <SidebarContent />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <button type="button" className="absolute inset-0 bg-charcoal/55 backdrop-blur-sm" onClick={onClose} aria-label="Close admin menu" />
          <aside className="relative flex h-full w-[min(86vw,20rem)] flex-col bg-charcoal text-white shadow-2xl">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
