import { getStoreSettings } from "@/lib/services/store";
import { ContactForm } from "@/components/store/ContactForm";
import { MdMailOutline as Mail, MdPhone as Phone, MdLocationOn as MapPin, MdOutlineChat as MessageCircle } from 'react-icons/md';
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Us | Be Glowing",
  description: "Contact Be Glowing for any questions about our jewelry, accessories, or your order.",
};

export default async function ContactPage() {
  const settings = await getStoreSettings();

  // Clean WhatsApp number to generate a direct link
  const waNumberClean = settings.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, "") : "";
  const waLink = waNumberClean ? `https://wa.me/${waNumberClean}?text=Hello%20Be%20Glowing%2C%20I%20would%20like%20to%20get%20more%20information%20about%20your%20jewelry%20and%20accessories.` : null;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 bg-background">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground font-serif">Contact Us</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Have a question? Need styling advice? Our team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info Column */}
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
            <p className="text-xs text-muted-foreground">
              Feel free to call or write to us directly. We will do our best to reply as soon as possible.
            </p>
          </div>

          <div className="space-y-6">
            {/* Phone */}
            <div className="flex gap-4 items-start p-4 bg-white border border-border rounded-xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">Phone</h3>
                <p className="text-xs text-muted-foreground">
                  {settings.contactPhone || "Not configured"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 items-start p-4 bg-white border border-border rounded-xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">Support Email</h3>
                <p className="text-xs text-muted-foreground">
                  {settings.contactEmail || "contact@beglowing.com"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4 items-start p-4 bg-white border border-border rounded-xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">Address</h3>
                <p className="text-xs text-muted-foreground whitespace-pre-line">
                  {settings.address || "Morocco"}
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Connect */}
          {waLink && (
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <MessageCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">WhatsApp Support</h3>
                  <p className="text-[11px] text-muted-foreground">Chat directly with a Be Glowing representative</p>
                </div>
              </div>
              <a 
                href={waLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex w-full"
              >
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-xs font-semibold gap-1.5 shadow-none">
                  Chat on WhatsApp ({settings.whatsapp})
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Contact Form Column */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
