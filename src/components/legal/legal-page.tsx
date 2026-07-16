export function LegalPage({
  title,
  updatedAt,
  sections,
}: {
  title: string;
  updatedAt: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl text-charcoal">{title}</h1>
      <p className="mt-2 text-xs text-body">Last updated {updatedAt}</p>
      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-lg text-charcoal">{section.heading}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-body">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
