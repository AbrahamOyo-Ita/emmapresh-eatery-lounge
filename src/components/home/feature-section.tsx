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
  tone?: "cream" | "white";
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
    <section className={cn("py-14", tone === "cream" && "bg-cream-soft")}>
      <div
        className={cn(
          "mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center",
          imageSide === "left" && "lg:[&>*:first-child]:order-2"
        )}
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</span>
          <h2 className="mt-2 font-display text-2xl text-charcoal sm:text-3xl">{title}</h2>
          <p className="mt-4 max-w-lg text-sm text-body">{description}</p>
          <ul className="mt-5 space-y-2.5">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-charcoal">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={cta.href} className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
              {cta.label}
            </Link>
            {secondaryCta && (
              <Link href={secondaryCta.href} className={cn(buttonVariants({ variant: "outline", size: "md" }))}>
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
        <FoodImage name={title} icon={icon} className="aspect-[4/3] w-full rounded-card" iconClassName="h-16 w-16" />
      </div>
    </section>
  );
}
