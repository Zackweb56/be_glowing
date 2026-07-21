"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { StockBadge } from './StockBadge';
import { AddToCartButton } from './AddToCartButton';
import { WhatsAppOrderButton } from './WhatsAppOrderButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Swiper CSS imports (Next.js client-component support)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function QuickViewModal({ product, whatsappNumber, isOpen, onClose }) {
  if (!product) return null;

  const isOutOfStock = product.stock?.quantity === 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl w-[calc(100%-2rem)] md:w-full overflow-hidden p-0 rounded-2xl border border-border bg-background shadow-2xl transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Left: Image / Carousel section */}
          <div className="relative aspect-square w-full bg-muted border-b md:border-b-0 md:border-r border-border/60 flex items-center justify-center overflow-hidden">
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-[2px] z-20">
                <span className="rounded-full bg-background px-6 py-2 text-lg font-bold tracking-widest text-foreground uppercase border border-border">
                  Out of Stock
                </span>
              </div>
            )}

            {product.images?.length > 0 ? (
              product.images.length === 1 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="w-full h-full relative group">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={true}
                    pagination={{ clickable: true }}
                    className="w-full h-full [&_.swiper-button-next]:text-foreground [&_.swiper-button-prev]:text-foreground [&_.swiper-button-next]:after:text-lg [&_.swiper-button-prev]:after:text-lg [&_.swiper-button-next]:bg-white/85 [&_.swiper-button-prev]:bg-white/85 [&_.swiper-button-next]:w-8 [&_.swiper-button-prev]:w-8 [&_.swiper-button-next]:h-8 [&_.swiper-button-prev]:h-8 [&_.swiper-button-next]:rounded-full [&_.swiper-button-prev]:rounded-full [&_.swiper-pagination-bullet-active]:bg-primary"
                  >
                    {product.images.map((img, index) => (
                      <SwiperSlide key={index} className="flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={img} 
                          alt={`${product.name} - view ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )
            ) : (
              <span className="text-muted-foreground">No image available</span>
            )}
          </div>

          {/* Right: Product Info section */}
          <div className="flex flex-col p-6 md:p-8 max-h-[85vh] md:max-h-[600px] overflow-y-auto justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                {product.categoryName && (
                  <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                    {product.categoryName}
                  </span>
                )}
                <StockBadge stock={product.stock} />
              </div>

              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight text-foreground font-serif">
                  {product.name}
                </DialogTitle>
              </div>

              {/* Price Row */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-medium tracking-tight text-foreground">
                  {product.price?.toFixed(2)} MAD
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-base text-muted-foreground line-through">
                    {product.compareAtPrice.toFixed(2)} MAD
                  </span>
                )}
                {product.compareAtPrice > product.price && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                    Save {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                  </span>
                )}
              </div>

              <DialogDescription className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
                {product.description || "No description provided."}
              </DialogDescription>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-border/40">
              <AddToCartButton product={product} isOutOfStock={isOutOfStock} />
              <WhatsAppOrderButton 
                product={product} 
                whatsappNumber={whatsappNumber} 
                className="w-full h-14 text-base"
              />
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
