"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO(security): Implement rate limiting for newsletter subscription endpoint.
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="container mx-auto max-w-6xl px-4 pb-20 pt-12">
      <div className="relative overflow-hidden rounded-2xl bg-white border border-border p-8 sm:p-16 text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-5xl max-w-2xl mx-auto leading-tight text-foreground">
          Ready to Elevate Your Style?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Subscribe to our newsletter for exclusive jewelry styling tips and 10% off your first purchase.
        </p>
        {submitted ? (
          <p className="mt-8 text-sm font-semibold text-emerald-600">
            🎉 Thank you! You're on the list.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="px-4 py-2.5 rounded-full border border-border bg-background placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50 flex-1 text-foreground"
            />
            <Button type="submit" className="rounded-full bg-primary text-white hover:bg-primary/95 px-6 font-semibold shadow-none shrink-0">
              Subscribe
            </Button>
          </form>
        )}
        <p className="text-[10px] text-muted-foreground/80 mt-3">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </section>
  );
}
