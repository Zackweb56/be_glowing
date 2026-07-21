import Image from "next/image";
import { notFound } from "next/navigation";
import { getStoreProductBySlug, getStoreSettings } from "@/lib/services/store";
import { StockBadge } from "@/components/store/StockBadge";
import { MdVerifiedUser as ShieldCheck, MdLocalShipping as Truck, MdArrowBack as ArrowLeft } from 'react-icons/md';
import Link from "next/link";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { WhatsAppOrderButton } from "@/components/store/WhatsAppOrderButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getStoreProductBySlug(slug),
    getStoreSettings()
  ]);

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock?.quantity === 0;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 sm:py-12 bg-background">
      <Link href="/store" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white border border-border flex items-center justify-center">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground">No image available</span>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-[2px]">
                <span className="rounded-full bg-background px-6 py-2 text-lg font-bold tracking-widest text-foreground uppercase border border-border">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          
          {/* Thumbnails if > 1 image */}
          {product.images?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button key={i} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${i === 0 ? 'border-primary' : 'border-transparent hover:border-border'} transition-colors`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4">
            {product.category && (
              <Link href={`/store?category=${product.category._id}`} className="text-sm font-semibold tracking-wider text-primary uppercase">
                {product.category.name}
              </Link>
            )}
            <StockBadge stock={product.stock} />
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-serif">{product.name}</h1>
          
          <div className="mt-4 flex items-center gap-4">
            <span className="text-3xl font-medium tracking-tight text-foreground">{product.price?.toFixed(2)} MAD</span>
            {product.compareAtPrice > product.price && (
              <span className="text-xl text-muted-foreground line-through">{product.compareAtPrice.toFixed(2)} MAD</span>
            )}
            {product.compareAtPrice > product.price && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                Save {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
              </span>
            )}
          </div>

          <div className="mt-8 space-y-6">
            <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {product.description || "No description provided."}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <AddToCartButton product={product} isOutOfStock={isOutOfStock} />
            <WhatsAppOrderButton 
              product={product} 
              whatsappNumber={settings.whatsapp} 
              className="flex-1 h-14 text-base shadow-none"
            />
          </div>

          {/* Benefits */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border/40 pt-8">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" />
              <span>Fast Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
