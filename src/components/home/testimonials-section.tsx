import { Star } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { testimonials } from "@/data/testimonials";

export function TestimonialsSection() {
  return (
    <section className="bg-cream-soft py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Reviews" title="Our Customer Feedback" align="center" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-card border border-border/60 bg-white p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-border"}`} aria-hidden="true" />
                ))}
              </div>
              <p className="mt-3 text-sm text-charcoal">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                  <p className="text-xs text-body">{t.branch} Branch</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
