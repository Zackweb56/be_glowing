"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdLocalShipping as Truck, MdSecurity as Shield, MdCreditCard as CreditCard, MdHeadset as Headphones, MdAutorenew as RefreshCw } from 'react-icons/md';

const trustIndicators = [
  { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
  { icon: Shield, title: "Secure Payment", description: "100% protected checkout" },
  { icon: CreditCard, title: "Easy Returns", description: "30-day guarantee" },
  { icon: Headphones, title: "24/7 Support", description: "Dedicated customer care" },
  { icon: RefreshCw, title: "Ethical Sourcing", description: "Sustainable materials" },
];

export function SimpleHeroSection({ title, subtitle, backgroundImage }) {
  const defaultBg = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920&auto=format&fit=crop";
  const bgUrl = backgroundImage || defaultBg;

  return (
    <section className="relative w-full overflow-hidden bg-background border-b border-border">
      {/* Hero Content with Background Image */}
      <div className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl drop-shadow-md">
            {title || "Reveal Your Natural Glow"}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow">
            {subtitle || "Premium jewelry & accessories crafted to elevate your style."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/store">
              <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg border-none h-12 text-base">
                Shop Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="border-t border-border bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {trustIndicators.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center space-y-2">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
