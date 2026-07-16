import Link from "next/link";
import { SectionHeading } from "./section-heading";
import { faqs } from "@/data/faqs";

export function FaqSection() {
  const featured = faqs.slice(0, 6);
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <SectionHeading eyebrow="Answers" title="Frequently Asked Questions" align="center" />
      <div className="space-y-3">
        {featured.map((faq) => (
          <details key={faq.id} className="group rounded-2xl border border-border/60 bg-white p-5 open:border-charcoal">
            <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm text-charcoal marker:content-none">
              {faq.question}
              <span className="shrink-0 text-lg text-body transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-body">{faq.answer}</p>
          </details>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/faq" className="focus-ring text-sm font-semibold text-primary hover:underline">
          View all frequently asked questions
        </Link>
      </div>
    </section>
  );
}
