"use client";

import { useState } from "react";
import { MdChevronLeft as ChevronLeft, MdChevronRight as ChevronRight } from 'react-icons/md';
import { ProductCard } from "./ProductCard";

export function FeaturedCarousel({ products = [], whatsappNumber }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground bg-accent/20 rounded-xl border border-border/40">
        <p>No featured products available at the moment.</p>
      </div>
    );
  }

  // Carousel calculation: visible items is 3 on large desktop, 2 on tablet, 1 on mobile.
  // To keep it simple, robust and elegant:
  // We can let CSS grid and flex handle the layout, and use a state to translate or slice items.
  // Slicing is simple and bug-free (doesn't have layout overflow/hydration glitches on resize).
  // Alternatively, we can show a grid that transitions, or a slice of products.
  // Let's do a sliding translation layout using Tailwind to make it feel premium, or a standard slide slice.
  // A slide slice is highly responsive and clean:
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= products.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 3 < 0 ? Math.max(0, products.length - 3) : prevIndex - 3
    );
  };

  const displayedProducts = products.slice(currentIndex, currentIndex + 3);
  // Ensure we display up to 3 items even if we are near the end of the array
  if (displayedProducts.length < 3 && products.length >= 3) {
    const extraNeeded = 3 - displayedProducts.length;
    displayedProducts.push(...products.slice(0, extraNeeded));
  }

  return (
    <div className="relative w-full">
      {/* Carousel Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {displayedProducts.map((product, idx) => (
          <div 
            key={`${product._id}-${idx}`}
            className="transition-all duration-500 ease-in-out transform hover:scale-[1.01]"
          >
            <ProductCard product={product} whatsappNumber={whatsappNumber} />
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {products.length > 3 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={prevSlide}
            className="flex items-center justify-center h-10 w-10 rounded-full border border-border/60 bg-background/80 hover:bg-accent text-foreground shadow-md transition-all active:scale-95"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">
            Page {Math.floor(currentIndex / 3) + 1} / {Math.ceil(products.length / 3)}
          </span>

          <button
            onClick={nextSlide}
            className="flex items-center justify-center h-10 w-10 rounded-full border border-border/60 bg-background/80 hover:bg-accent text-foreground shadow-md transition-all active:scale-95"
            aria-label="Next products"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
