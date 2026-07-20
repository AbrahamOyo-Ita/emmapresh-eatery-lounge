import Link from "next/link";
import { RefreshCw, WifiOff } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OfflinePage() {
  return <div className="mx-auto flex min-h-[70dvh] max-w-lg flex-col items-center justify-center px-5 py-16 text-center"><span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary"><WifiOff className="h-9 w-9" /></span><h1 className="mt-6 font-display text-3xl text-charcoal">You&apos;re offline</h1><p className="mt-3 text-sm leading-6 text-body">Previously visited pages and your local cart remain available. Reconnect to place orders or receive live updates.</p><Link href="/" className={cn(buttonVariants({ size: "lg" }),"mt-6")}><RefreshCw className="h-4 w-4" />Try again</Link></div>;
}
