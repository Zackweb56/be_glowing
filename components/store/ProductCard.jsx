import Link from 'next/link';
import { StockBadge } from './StockBadge';

export function ProductCard({ product }) {
  const isOutOfStock = product.stock?.quantity === 0;

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-accent/20 border border-border/40">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} 
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/30">No image</div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.featured && (
            <span className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground shadow-sm">
              Featured
            </span>
          )}
          <StockBadge stock={product.stock} />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">${product.price?.toFixed(2)}</span>
          {product.compareAtPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">${product.compareAtPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
