export default function AdminLayout({ children }) {
  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      {children}
    </div>
  );
}
