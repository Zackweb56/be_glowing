// (auth) group layout — applies dark theme to login only.
// No sidebar or header; just the dark bg wrapper.
export default function AuthLayout({ children }) {
  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      {children}
    </div>
  );
}
