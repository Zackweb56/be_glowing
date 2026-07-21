"use client";

import { useState } from "react";
import Link from 'next/link';
import { StockBadge } from './StockBadge';
import { WhatsAppOrderButton } from './WhatsAppOrderButton';
import { QuickViewModal } from './QuickViewModal';
import { MdVisibility as Eye } from 'react-icons/md';

export function ProductCard({ product, whatsappNumber }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const isOutOfStock = product.stock?.quantity === 0;

  return (
    <div className="group flex flex-col gap-3 p-4 bg-white border border-border rounded-xl transition-all duration-300 hover:border-primary relative h-full">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted shrink-0">
        <Link href={`/products/${product.slug}`} className="block w-full h-full cursor-pointer">
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-102 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} 
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground/30">No image</div>
          )}
        </Link>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[9px] font-semibold text-primary-foreground">
              Featured
            </span>
          )}
          <StockBadge stock={product.stock} />
        </div>

        {/* Quick View Button on Image */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsQuickViewOpen(true);
          }}
          className="absolute bottom-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-border text-foreground hover:bg-primary hover:text-white shadow-md transition-all duration-200 active:scale-90 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
          title="Quick View"
        >
          <Eye className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Info section */}
      <div className="flex flex-col gap-1 px-1 flex-grow">
        <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors cursor-pointer block">
          <h3 className="font-semibold text-sm line-clamp-1 product-title">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">{product.price?.toFixed(2)} MAD</span>
          {product.compareAtPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">{product.compareAtPrice.toFixed(2)} MAD</span>
          )}
        </div>
      </div>

      {/* Action Button: WhatsApp Order */}
      <div className="mt-auto pt-2 border-t border-border/40">
        <WhatsAppOrderButton
          product={product}
          whatsappNumber={whatsappNumber}
          size="sm"
          className="w-full text-xs h-9 font-medium shadow-none rounded-lg"
        />
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal 
          product={product} 
          whatsappNumber={whatsappNumber} 
          isOpen={isQuickViewOpen} 
          onClose={() => setIsQuickViewOpen(false)} 
        />
      )}
    </div>
  );
}
