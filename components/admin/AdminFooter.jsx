export function AdminFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="shrink-0 border-t border-border px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p className="text-[11px] text-muted-foreground/50">
        © {year} Be Glowing · Admin Panel
      </p>
      <p className="text-[11px] text-muted-foreground/50">
        Developed by{" "}
        <a
          href="https://wa.me/212771615622"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground/70 hover:text-foreground/95 hover:underline transition-colors font-medium"
        >
          zackwebdev
        </a>
      </p>
    </footer>
  );
}
