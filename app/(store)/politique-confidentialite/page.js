import { getStoreSettings } from "@/lib/services/store";
import { Card, CardContent } from "@/components/ui/card";
import { MdDescription as FileText } from 'react-icons/md';

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Privacy Policy | Be Glowing",
  description: "Learn about our privacy policy and personal data management.",
};

export default async function PrivacyPolicyPage() {
  const settings = await getStoreSettings();
  const policyText = settings.privacyPolicy;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <FileText className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Rules governing the processing of personal data and privacy protection.
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
                The privacy policy has not been configured yet.
              </p>
              <div className="text-left text-xs text-muted-foreground border-t border-border/50 pt-8 space-y-4">
                <h3 className="font-semibold text-foreground">Standard Privacy Policy:</h3>
                <p className="mb-2">
                  At Be Glowing, we are committed to protecting your personal data.
                </p>
                <ul className="list-disc pl-4 space-y-2">
                  <li><strong>Data Collection:</strong> We collect only the information necessary to process and ship your orders (Name, shipping address, email, and phone number).</li>
                  <li><strong>Data Usage:</strong> Your information is never sold or shared with third parties. It is strictly used to fulfill and deliver your orders.</li>
                  <li><strong>Your Rights:</strong> You have the right to access, modify, or request the deletion of your personal data at any time.</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
