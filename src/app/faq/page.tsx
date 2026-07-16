import type { Metadata } from "next";
import { faqs } from "@/data/faqs";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about ordering, payment, delivery, cakes, catering, academy and event halls.",
};

const categoryLabels: Record<string, string> = {
  ordering: "Ordering",
  payment: "Payment",
  delivery: "Delivery",
  cakes: "Cakes",
  catering: "Catering",
  academy: "Academy",
  halls: "Event Halls",
};

export default function FaqPage() {
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <JsonLd data={faqJsonLd} />
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Frequently Asked Questions</h1>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-10">
          <h2 className="mb-4 font-display text-lg text-charcoal">{categoryLabels[category] ?? category}</h2>
          <div className="space-y-3">
            {faqs
              .filter((f) => f.category === category)
              .map((faq) => (
                <details key={faq.id} className="group rounded-2xl border border-border/60 bg-white p-5 open:border-charcoal">
                  <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm text-charcoal marker:content-none">
                    {faq.question}
                    <span className="shrink-0 text-lg text-body transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-body">{faq.answer}</p>
                </details>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
