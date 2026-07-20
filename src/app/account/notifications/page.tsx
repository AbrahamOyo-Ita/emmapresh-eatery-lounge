"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { AccountNav } from "@/components/account/account-nav";
import { Button } from "@/components/ui/button";
import { useCustomerSessionStore } from "@/stores/customer-session-store";
import { useNotificationsStore } from "@/stores/notifications-store";

export default function NotificationsPage() {
  const session = useCustomerSessionStore((state) => state.session);
  const { notifications, readIds, loading, refresh, markAllRead } = useNotificationsStore();
  React.useEffect(() => { if (session) void refresh(session.email, session.phone); }, [refresh, session]);
  React.useEffect(() => { if (notifications.length) markAllRead(); }, [markAllRead, notifications.length]);
  if (!session) return <div className="mx-auto max-w-3xl px-4 py-20 text-center"><p className="font-display text-xl">Open your account first</p><Link href="/account" className="mt-3 inline-block font-bold text-primary">Go to My Account</Link></div>;
  return <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6"><div className="mb-6 flex items-end justify-between gap-3"><div><h1 className="font-display text-3xl text-charcoal">Notifications</h1><p className="mt-1 text-sm text-body">Payment confirmations and live order updates.</p></div><Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck className="h-4 w-4" />Mark read</Button></div><AccountNav /><div className="mt-8 space-y-3">{loading && notifications.length === 0 ? <p className="text-sm text-body">Loading updates…</p> : notifications.length === 0 ? <div className="rounded-2xl border border-border bg-white p-10 text-center"><Bell className="mx-auto h-8 w-8 text-body" /><p className="mt-3 font-semibold">No notifications yet</p></div> : notifications.map((item) => { const read = readIds.includes(item.id); const content = <><div className="flex items-start justify-between gap-4"><p className="font-semibold text-charcoal">{item.subject}</p>{!read && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}</div><p className="mt-2 text-sm leading-6 text-body">{item.message}</p><p className="mt-3 text-xs text-body">{new Date(item.createdAt).toLocaleString()}</p></>; return item.actionUrl ? <Link key={item.id} href={item.actionUrl} className="block rounded-2xl border border-border bg-white p-5 hover:border-primary">{content}</Link> : <article key={item.id} className="rounded-2xl border border-border bg-white p-5">{content}</article>; })}</div></div>;
}
