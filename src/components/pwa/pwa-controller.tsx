"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Download, Home, Menu, ShoppingBag, UserRound, WifiOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCustomerSessionStore } from "@/stores/customer-session-store";

interface BeforeInstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> }
function urlBase64ToUint8Array(value: string) { const padding = "=".repeat((4 - value.length % 4) % 4); const base64 = (value + padding).replace(/-/g,"+").replace(/_/g,"/"); return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0)); }

export function PwaController() {
  const pathname = usePathname();
  const customerEmail = useCustomerSessionStore((state) => state.session?.email);
  const [installPrompt, setInstallPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = React.useState(false);
  const [offline, setOffline] = React.useState(false);
  const [pushState, setPushState] = React.useState<"idle"|"enabled"|"denied"|"unsupported">("idle");

  React.useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).then((registration) => registration.update()).catch(() => undefined);
    const onInstall = (event: Event) => { event.preventDefault(); setInstallPrompt(event as BeforeInstallPromptEvent); if (!sessionStorage.getItem("pwa-install-dismissed")) setShowInstall(true); };
    const updateNetwork = () => setOffline(!navigator.onLine);
    window.addEventListener("beforeinstallprompt", onInstall); window.addEventListener("online", updateNetwork); window.addEventListener("offline", updateNetwork); updateNetwork();
    const updatePushState = () => {
      if (!("PushManager" in window) || !("Notification" in window)) setPushState("unsupported");
      else if (Notification.permission === "granted") setPushState("enabled");
      else if (Notification.permission === "denied") setPushState("denied");
    };
    queueMicrotask(updatePushState);
    return () => { window.removeEventListener("beforeinstallprompt", onInstall); window.removeEventListener("online", updateNetwork); window.removeEventListener("offline", updateNetwork); };
  }, []);

  React.useEffect(() => {
    if (!customerEmail || !("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window) || Notification.permission !== "granted") return;
    let active = true;
    async function linkSubscriptionToCustomer() {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription || !active) return;
      await fetch("/api/push/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...subscription.toJSON(), customerEmail }),
      });
    }
    void linkSubscriptionToCustomer();
    return () => { active = false; };
  }, [customerEmail]);

  async function install() { if (!installPrompt) return; await installPrompt.prompt(); const choice = await installPrompt.userChoice; if (choice.outcome === "accepted") setShowInstall(false); setInstallPrompt(null); }
  async function enablePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return setPushState("unsupported");
    const permission = await Notification.requestPermission(); if (permission !== "granted") return setPushState("denied");
    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY; if (!key) return;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription() || await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) });
    const response = await fetch("/api/push/subscriptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...subscription.toJSON(), customerEmail }) });
    if (response.ok) setPushState("enabled");
  }
  if (pathname?.startsWith("/admin")) return null;
  const nav = [{href:"/",label:"Home",icon:Home},{href:"/menu",label:"Menu",icon:Menu},{href:"/cart",label:"Cart",icon:ShoppingBag},{href:"/account",label:"Account",icon:UserRound}];
  return <>
    {offline && <div className="fixed inset-x-0 top-0 z-[80] flex items-center justify-center gap-2 bg-charcoal px-4 py-2 text-xs font-semibold text-white"><WifiOff className="h-4 w-4" />Offline mode</div>}
    {showInstall && installPrompt && <div className="pwa-browser-only fixed inset-x-3 bottom-20 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-border bg-white p-3 shadow-2xl"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white"><Download className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold text-charcoal">Install EmmaPresh</p><p className="text-xs text-body">Faster access and an app-like experience.</p></div><button onClick={install} className="rounded-full bg-primary px-3 py-2 text-xs font-bold text-white">Install</button><button onClick={() => { setShowInstall(false); sessionStorage.setItem("pwa-install-dismissed","1"); }} aria-label="Dismiss install prompt"><X className="h-4 w-4" /></button></div>}
    {pushState === "idle" && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && <button onClick={enablePush} className="pwa-installed-only fixed bottom-24 left-4 z-40 items-center gap-2 rounded-full bg-charcoal px-4 py-3 text-xs font-bold text-white shadow-xl"><Bell className="h-4 w-4" />Enable updates</button>}
    <nav className="pwa-installed-only fixed inset-x-0 bottom-0 z-40 items-center justify-around border-t border-border bg-white/95 px-2 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl" aria-label="App navigation">{nav.map((item) => { const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href)); return <Link key={item.href} href={item.href} className={cn("flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[.65rem] font-bold",active?"text-primary":"text-body")}><item.icon className="h-5 w-5" />{item.label}</Link>; })}</nav>
  </>;
}
