import { getStoreSettings } from "@/lib/services/store";
import { Card, CardContent } from "@/components/ui/card";
import { MdLocalShipping as Truck } from 'react-icons/md';

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shipping Policy | Be Glowing",
  description: "Read our shipping and delivery policy for your orders in Morocco.",
};

export default async function ShippingPolicyPage() {
  const settings = await getStoreSettings();
  const policyText = settings.shippingPolicy;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <Truck className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">Shipping Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Details on shipping methods, times, and rates in Morocco.
        </p>
      </div>

      <Card className="border border-border bg-white shadow-none">
        <CardContent className="p-6 sm:p-8">
          {policyText ? (
            <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {policyText}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <p className="text-sm text-muted-foreground">
                The shipping policy has not been configured yet.
              </p>
              <div className="text-left text-xs text-muted-foreground border-t border-border/50 pt-8 space-y-4">
                <h3 className="font-semibold text-foreground">Default Shipping Terms & Conditions:</h3>
                <ul className="list-disc pl-4 space-y-2">
                  <li><strong>Service Areas:</strong> Nationwide delivery across Morocco.</li>
                  <li><strong>Delivery Times:</strong> 24 to 48 business hours.</li>
                  <li><strong>Shipping Rates:</strong> Free shipping or calculated based on ongoing promotions.</li>
                  <li><strong>Payment Method:</strong> Cash on Delivery (CoD) in Moroccan Dirham (MAD).</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
