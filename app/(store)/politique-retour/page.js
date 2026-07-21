import { getStoreSettings } from "@/lib/services/store";
import { Card, CardContent } from "@/components/ui/card";
import { MdVerifiedUser as ShieldCheck } from 'react-icons/md';

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Return Policy | Be Glowing",
  description: "Read our return and refund policy for your purchases on Be Glowing.",
};

export default async function ReturnPolicyPage() {
  const settings = await getStoreSettings();
  const policyText = settings.returnPolicy;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">Return Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Conditions for returns, exchanges, and refunds.
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
                The return policy has not been configured yet.
              </p>
              <div className="text-left text-xs text-muted-foreground border-t border-border/50 pt-8 space-y-4">
                <h3 className="font-semibold text-foreground">Default Return & Exchange Terms:</h3>
                <ul className="list-disc pl-4 space-y-2">
                  <li><strong>Return Window:</strong> You have 7 days after receiving your order to request a return or exchange.</li>
                  <li><strong>Product Condition:</strong> For hygiene reasons, jewelry must be unworn, in its original unused condition, and in its original packaging.</li>
                  <li><strong>Process:</strong> Contact our customer support on WhatsApp to arrange your return or exchange.</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
