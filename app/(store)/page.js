import { getStoreCatalog } from "@/lib/services/store";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function StoreHomePage() {
  const catalog = await getStoreCatalog();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-muted/30 py-20 sm:py-32">
        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mx-auto max-w-4xl font-serif text-5xl font-bold tracking-tight sm:text-7xl">
            Reveal Your Natural <span className="text-primary">Glow</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Premium skincare and beauty essentials crafted to elevate your daily routine. Experience luxury in every drop.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" className="rounded-full px-8">Shop Now</Button>
            <Button size="lg" variant="outline" className="rounded-full px-8">View Collections</Button>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
        <div className="flex flex-col gap-20">
          {catalog.map(category => (
            <div key={category._id} className="flex flex-col gap-8">
              <div className="flex items-end justify-between border-b border-border/40 pb-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-bold tracking-tight">{category.name}</h2>
                  {category.description && <p className="text-muted-foreground">{category.description}</p>}
                </div>
              </div>
              
              {category.products.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
                  {category.products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground bg-accent/20 rounded-xl border border-border/40">
                  <p>New products coming soon to this collection!</p>
                </div>
              )}
            </div>
          ))}
          {catalog.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-lg text-muted-foreground">Our store is currently being updated. Please check back later!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
