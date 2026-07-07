import { StoreNavbar } from "@/components/store/StoreNavbar";
import { StoreFooter } from "@/components/store/StoreFooter";

export const metadata = {
  title: "Be Glowing | Premium Skincare",
  description: "Elevate your skincare routine with premium beauty products crafted for your natural glow.",
};

export default function StoreLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <StoreNavbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <StoreFooter />
    </div>
  );
}
