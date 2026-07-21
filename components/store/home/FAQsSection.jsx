export function FAQsSection({ faqs }) {
  if (faqs.length === 0) return null;

  return (
    <section className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2 text-foreground font-serif">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Clear answers to your questions about shipping, returns, and orders.
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq._id}
            className="group border border-border rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex items-center justify-between gap-4 p-5 font-semibold text-sm cursor-pointer select-none text-foreground">
              <span>{faq.question}</span>
              <span className="transition-transform duration-300 group-open:rotate-180 text-primary shrink-0">↓</span>
            </summary>
            <div className="p-5 pt-0 border-t border-border text-xs text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
