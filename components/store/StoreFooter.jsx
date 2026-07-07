export function StoreFooter() {
  return (
    <footer className="w-full border-t border-border/40 bg-muted/20 py-8 sm:py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="font-bold text-xl tracking-tighter uppercase text-primary">BE GLOWING</span>
            <p className="text-sm text-muted-foreground max-w-sm text-center md:text-left">
              Elevate your skincare routine with premium beauty products crafted for your natural glow.
            </p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-8 text-center text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Be Glowing. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
