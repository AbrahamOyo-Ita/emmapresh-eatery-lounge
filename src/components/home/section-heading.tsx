import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  cta,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  cta?: { label: string; href: string };
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", align === "center" && "sm:flex-col sm:items-center sm:text-center")}>
      <div className={cn(align === "center" && "mx-auto max-w-xl")}>
        {eyebrow && (
          <span className={cn("text-[0.68rem] font-bold uppercase tracking-[0.16em]", tone === "dark" ? "text-white/70" : "text-primary")}>{eyebrow}</span>
        )}
        <h2 className={cn("mt-2 font-display text-xl font-semibold sm:text-2xl", tone === "dark" ? "text-white" : "text-charcoal")}>{title}</h2>
        {description && <p className={cn("mt-2 max-w-xl text-sm", tone === "dark" ? "text-white/70" : "text-body")}>{description}</p>}
      </div>
      {cta && (
        <Link href={cta.href} className={cn("focus-ring group flex shrink-0 items-center gap-1.5 text-sm font-semibold", tone === "dark" ? "text-white/85 hover:text-white" : "text-charcoal hover:text-primary")}>
          {cta.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
