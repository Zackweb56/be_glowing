import Link from "next/link";
import { MdSettings as Settings } from 'react-icons/md';
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-background">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6 animate-none">
        <Settings className="h-8 w-8" />
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">Under Maintenance</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        We are currently upgrading our store to bring you the best jewelry & accessories shopping experience. We'll be back shortly!
      </p>
      <Link href="/store">
        <Button size="lg" variant="outline" className="rounded-full border-border hover:bg-muted/50 text-foreground">
          Go to Shop Catalog
        </Button>
      </Link>
    </div>
  );
}
