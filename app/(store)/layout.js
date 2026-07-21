import { StoreNavbar } from "@/components/store/StoreNavbar";
import { StoreFooter } from "@/components/store/StoreFooter";
import { ThemeProvider } from "@/components/theme-provider";
import { TopAnnouncementBar } from "@/components/store/TopAnnouncementBar";
import { WhatsAppFloat } from "@/components/store/WhatsAppFloat";
import dbConnect from "@/lib/mongodb";
import StoreSettings from "@/lib/models/StoreSettings";

export async function generateMetadata() {
  await dbConnect();
  const settings = await StoreSettings.findOne().lean() || {};
  return {
    title: settings.siteTitle || "Be Glowing | Jewelry & Accessories",
    description: settings.seoDescription || "Discover premium handcrafted jewelry & accessories to elevate your look.",
    keywords: settings.seoKeywords || "jewelry, accessories, be glowing",
    icons: {
      icon: settings.logoUrl || "/favicon.ico",
    },
  };
}

export default async function StoreLayout({ children }) {
  await dbConnect();
  
  const settings = await StoreSettings.findOne().lean() || {};
  const announcements = settings.announcements || [];
  const whatsapp = settings.whatsapp || "+212";
  const logoUrl = settings.logoUrl || "";
  const storeName = settings.storeName || "Be Glowing";

  const primaryColor = settings.themePrimaryColor || "#B8963E";
  const secondaryColor = settings.themeSecondaryColor || "#E8E4DF";
  const primaryFont = settings.themePrimaryFont || "Inter";
  const secondaryFont = settings.themeSecondaryFont || "Inter";

  const fontsToLoad = Array.from(new Set([primaryFont, secondaryFont]));
  const fontFamilies = fontsToLoad.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`).join('&');
  const googleFontsUrl = `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap`;

  const customStyles = `
    @import url('${googleFontsUrl}');
    .store-light {
      --primary: ${primaryColor};
      --secondary: ${secondaryColor};
      --ring: ${primaryColor};
      --font-sans: '${secondaryFont}', system-ui, sans-serif;
    }
    .font-serif {
      font-family: '${primaryFont}', Georgia, serif !important;
    }
  `;

  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="store-light min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 relative">
        <TopAnnouncementBar announcements={JSON.parse(JSON.stringify(announcements))} />
        <StoreNavbar 
          logoUrl={logoUrl} 
          storeName={storeName}
          socialLinks={{
            instagram: settings.instagram,
            facebook: settings.facebook,
            tiktok: settings.tiktok,
            whatsapp: settings.whatsapp
          }} 
        />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <WhatsAppFloat whatsappNumber={whatsapp} />
        <StoreFooter />
      </div>
    </ThemeProvider>
  );
}
