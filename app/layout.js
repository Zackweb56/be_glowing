// Font styling is handled globally via app/globals.css to ensure offline build support.
import "./globals.css";

import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Be Glowing - Admin Dashboard",
  description: "Admin dashboard for Be Glowing store",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
