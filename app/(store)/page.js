import { getStoreCatalog, getTestimonials, getFAQs } from "@/lib/services/store";
import { HeroSection } from "@/components/store/home/HeroSection";
import { SimpleHeroSection } from "@/components/store/home/SimpleHeroSection";
import { CategoriesSection } from "@/components/store/home/CategoriesSection";
import { FeaturedSection } from "@/components/store/home/FeaturedSection";
import { ShippingStepsSection } from "@/components/store/home/ShippingStepsSection";
import { TestimonialsSection } from "@/components/store/home/TestimonialsSection";
import { FAQsSection } from "@/components/store/home/FAQsSection";
import { InstagramSection } from "@/components/store/home/InstagramSection";
import { CTASection } from "@/components/store/home/CTASection";
import dbConnect from "@/lib/mongodb";
import StoreSettings from "@/lib/models/StoreSettings";

export const metadata = {
  title: "Be Glowing | Premium Jewelry & Accessories",
  description:
    "Discover timeless, premium jewelry and accessories crafted to elevate your style. Shop the latest collections from Be Glowing.",
};

export const dynamic = "force-dynamic";

export default async function StoreHomePage() {
  await dbConnect();
  const settings = await StoreSettings.findOne().lean() || {};
  const heroType = settings.heroType || "creative";

  const [catalog, testimonials, faqs] = await Promise.all([
    getStoreCatalog(),
    getTestimonials(),
    getFAQs(),
  ]);

  // Extract all products from catalog categories
  const allProducts = catalog.flatMap((category) => category.products || []);

  // Filter featured products
  const featuredProducts = allProducts.filter((p) => p.featured === true);

  // Extract categories for display
  const activeCategories = catalog.map((c) => ({
    _id: c._id,
    name: c.name,
    description: c.description,
    image: c.image || c.imageUrl || c.thumbnail || null,
    slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {heroType === "simple" ? (
        <SimpleHeroSection
          title={settings.heroTitle}
          subtitle={settings.heroSubtitle}
          backgroundImage={settings.heroBackgroundImage}
        />
      ) : (
        <HeroSection />
      )}
      <CategoriesSection categories={activeCategories} />
      <FeaturedSection products={featuredProducts} whatsappNumber={settings.whatsapp} />
      <ShippingStepsSection />
      <TestimonialsSection testimonials={testimonials} />
      <FAQsSection faqs={faqs} />
      <InstagramSection />
      <CTASection />
    </div>
  );
}
