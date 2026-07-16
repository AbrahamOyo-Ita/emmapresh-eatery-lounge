import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  cta,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  cta?: { label: string; href: string };
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", align === "center" && "sm:flex-col sm:items-center sm:text-center")}>
      <div className={cn(align === "center" && "mx-auto max-w-xl")}>
        {eyebrow && (
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</span>
        )}
        <h2 className="mt-2 font-display text-2xl text-charcoal sm:text-3xl">{title}</h2>
        {description && <p className="mt-3 max-w-xl text-sm text-body">{description}</p>}
      </div>
      {cta && (
        <Link href={cta.href} className="focus-ring group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-charcoal hover:text-primary">
          {cta.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
