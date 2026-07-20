"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, ShoppingBag, User, Menu as MenuIcon, X } from "lucide-react";
import { Logo } from "./logo";
import { BranchSelector } from "./branch-selector";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { mainNav } from "@/config/site";
import { useCartStore } from "@/stores/cart-store";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCustomerSessionStore } from "@/stores/customer-session-store";
import { useNotificationsStore } from "@/stores/notifications-store";

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const items = useCartStore((s) => s.items);
  const pathname = usePathname();
  const session = useCustomerSessionStore((state) => state.session);
  const notifications = useNotificationsStore((state) => state.notifications);
  const readIds = useNotificationsStore((state) => state.readIds);
  const refreshNotifications = useNotificationsStore((state) => state.refresh);

  React.useEffect(() => {
    if (!session) return;
    void refreshNotifications(session.email, session.phone);
    const interval = window.setInterval(() => void refreshNotifications(session.email, session.phone), 30_000);
    return () => window.clearInterval(interval);
  }, [refreshNotifications, session]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMobileOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const unreadCount = notifications.filter((item) => !readIds.includes(item.id)).length;

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-charcoal focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b border-transparent bg-white/95 backdrop-blur transition-all",
          scrolled && "border-border shadow-[var(--shadow-soft)]"
        )}
      >
        <div className={cn("mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all sm:px-6", scrolled ? "h-14" : "h-16")}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-control hover:bg-black/5 lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <Logo />
          </div>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {mainNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring text-xs font-semibold text-charcoal/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block">
              <BranchSelector compact={scrolled} />
            </div>
            <Link
              href="/account/notifications"
              className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-control hover:bg-black/5"
              aria-label={`${unreadCount} unread notifications`}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </Link>
            <Link
              href="/search"
              className="focus-ring hidden h-9 w-9 items-center justify-center rounded-control hover:bg-black/5 sm:flex"
              aria-label="Search"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/account"
              className="focus-ring hidden h-9 w-9 items-center justify-center rounded-control hover:bg-black/5 sm:flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-control hover:bg-black/5"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
            <Link href="/menu" className={cn(buttonVariants({ variant: "primary", size: "sm" }), "hidden sm:inline-flex")}>
              Order Now
            </Link>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/50" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="relative z-10 flex h-full w-4/5 max-w-xs flex-col bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-control hover:bg-black/5"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mb-6">
              <BranchSelector />
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {mainNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="focus-ring rounded-control px-3 py-2.5 text-sm font-semibold text-charcoal hover:bg-cream-soft"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/account" className="focus-ring rounded-control px-3 py-2.5 text-sm font-semibold text-charcoal hover:bg-cream-soft">
                Account
              </Link>
              <Link href="/search" className="focus-ring rounded-control px-3 py-2.5 text-sm font-semibold text-charcoal hover:bg-cream-soft">
                Search
              </Link>
              <Link href="/contact" className="focus-ring rounded-control px-3 py-2.5 text-sm font-semibold text-charcoal hover:bg-cream-soft">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
