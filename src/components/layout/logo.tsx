import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("focus-ring flex flex-col leading-none", className)}>
      <span className="font-display text-xl tracking-tight text-charcoal">
        EMMA<span className="text-primary">PRESH</span>
      </span>
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-body">
        Eatery &amp; Lounge
      </span>
    </Link>
  );
}
