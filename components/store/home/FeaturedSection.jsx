import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedCarousel } from "@/components/store/FeaturedCarousel";

export function FeaturedSection({ products, whatsappNumber }) {
  return (
    <section className="bg-white border-y border-border py-16 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Featured Pieces</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Discover our best sellers and most loved accessories.
            </p>
          </div>
          <Link href="/store">
            <Button variant="ghost" className="text-primary hover:text-primary/80 font-semibold p-0">
              View all collections →
            </Button>
          </Link>
        </div>
        <FeaturedCarousel products={products} whatsappNumber={whatsappNumber} />
      </div>
    </section>
  );
}
