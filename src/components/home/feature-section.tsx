import Link from "next/link";
import { Check } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import type { FoodIconKey } from "@/components/ui/food-image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  icon: FoodIconKey;
  imageSide?: "left" | "right";
  tone?: "cream" | "white" | "red";
}

export function FeatureSection({
  eyebrow,
  title,
  description,
  bullets,
  cta,
  secondaryCta,
  icon,
  imageSide = "right",
  tone = "white",
}: FeatureSectionProps) {
  return (
    <section className={cn("motion-section py-10 sm:py-12", tone === "cream" && "bg-cream-soft", tone === "red" && "bg-primary")}>
      <div
        className={cn(
          "mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center",
          imageSide === "left" && "lg:[&>*:first-child]:order-2"
        )}
      >
        <div>
          <span className={cn("text-[0.68rem] font-bold uppercase tracking-[0.16em]", tone === "red" ? "text-white/70" : "text-primary")}>{eyebrow}</span>
          <h2 className={cn("mt-2 font-display text-xl font-semibold sm:text-2xl", tone === "red" ? "text-white" : "text-charcoal")}>{title}</h2>
          <p className={cn("mt-3 max-w-lg text-sm", tone === "red" ? "text-white/75" : "text-body")}>{description}</p>
          <ul className="mt-5 space-y-2">
            {bullets.map((bullet) => (
              <li key={bullet} className={cn("flex items-start gap-2.5 text-sm", tone === "red" ? "text-white/85" : "text-charcoal")}>
                <Check className={cn("mt-0.5 h-4 w-4 shrink-0", tone === "red" ? "text-white" : "text-success")} aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={cta.href} className={cn(buttonVariants({ variant: tone === "red" ? "light" : "primary", size: "md" }))}>
              {cta.label}
            </Link>
            {secondaryCta && (
              <Link href={secondaryCta.href} className={cn(buttonVariants({ variant: tone === "red" ? "outlineLight" : "outline", size: "md" }))}>
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
        <FoodImage name={title} icon={icon} className="aspect-[4/3] w-full rounded-card" iconClassName="h-14 w-14" />
      </div>
    </section>
  );
}
