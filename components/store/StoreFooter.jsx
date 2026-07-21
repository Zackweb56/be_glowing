import { getStoreSettings } from "@/lib/services/store";
import Link from "next/link";
import { MdOutlineChat as MessageCircle, MdPhone as Phone, MdMailOutline as Mail } from 'react-icons/md';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export async function StoreFooter() {
  const settings = await getStoreSettings();
  
  // Clean WhatsApp number to generate a direct link
  const waNumberClean = settings.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, "") : "";
  const waLink = waNumberClean ? `https://wa.me/${waNumberClean}` : null;

  return (
    <footer className="w-full border-t border-border/40 bg-muted/20 py-12 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-border/25">
          {/* Brand Col */}
          <div className="space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="font-bold text-xl tracking-tighter uppercase text-primary">
              {settings.storeName || "BE GLOWING"}
            </Link>
            <p className="text-xs text-muted-foreground max-w-xs">
              Elevate your look with our premium collection of jewelry and accessories, handcrafted to highlight your natural glow.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-background border border-border/40 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors shadow-sm" aria-label="Instagram">
                  <FaInstagram className="h-4 w-4" />
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-background border border-border/40 flex items-center justify-center text-muted-foreground hover:text-blue-500 transition-colors shadow-sm" aria-label="Facebook">
                  <FaFacebook className="h-4 w-4" />
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-background border border-border/40 flex items-center justify-center text-muted-foreground hover:text-black dark:hover:text-white transition-colors shadow-sm" aria-label="TikTok">
                  <FaTiktok className="h-4 w-4" />
                </a>
              )}
              {waLink && (
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-background border border-border/40 flex items-center justify-center text-muted-foreground hover:text-emerald-500 transition-colors shadow-sm" aria-label="WhatsApp">
                  <FaWhatsapp className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links Col */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Navigation</h4>
            <div className="flex flex-col gap-2 text-xs font-medium text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/store" className="hover:text-primary transition-colors">Shop</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* Policies Col */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground font-semibold">Policies</h4>
            <div className="flex flex-col gap-2 text-xs font-medium text-muted-foreground">
              <Link href="/politique-expedition" className="hover:text-primary transition-colors">Shipping Policy</Link>
              <Link href="/politique-retour" className="hover:text-primary transition-colors">Return Policy</Link>
              <Link href="/politique-confidentialite" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
          <p>© {new Date().getFullYear()} {settings.storeName || "Be Glowing"}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {settings.contactPhone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {settings.contactPhone}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> {settings.contactEmail}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
