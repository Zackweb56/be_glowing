import { MdStar as Star, MdFormatQuote as MessageSquareQuote } from 'react-icons/md';

export function TestimonialsSection({ testimonials }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-white border-t border-border py-16 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">What Our Customers Say</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Discover why our customers trust Be Glowing for their premium accessories.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-white border border-border p-6 rounded-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-0.5 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.stars ? "fill-current" : "opacity-20"}`}
                    />
                  ))}
                </div>
                <p className="text-sm italic text-foreground/80">"{t.comment}"</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground">{t.name}</span>
                {t.location && (
                  <span className="text-xs text-muted-foreground bg-background px-2.5 py-1 rounded-full border border-border">
                    {t.location}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
