import { Suspense } from "react";
import { getStoreCatalog, getStoreSettings } from "@/lib/services/store";
import { ProductBrowser } from "@/components/store/ProductBrowser";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop | Be Glowing",
  description: "Explore our complete collection of premium jewelry and accessories.",
};

export default async function StorePage() {
  const [catalog, settings] = await Promise.all([
    getStoreCatalog(),
    getStoreSettings()
  ]);

  // Extract all products from the catalog categories
  const allProducts = catalog.flatMap(category => category.products || []);

  // Map category details
  const categories = catalog.map(c => ({
    _id: c._id,
    name: c.name,
  }));

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 bg-background">
      {/* Title */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">Our Shop</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Discover our curated, high-end jewelry pieces designed to highlight your natural glow.
        </p>
      </div>

      {/* Main product browser */}
      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading products...</div>}>
        <ProductBrowser categories={categories} initialProducts={allProducts} whatsappNumber={settings.whatsapp} />
      </Suspense>
    </div>
  );
}
