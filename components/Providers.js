"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }) {
  return (
    // refetchInterval=0 disables automatic session polling which causes navigation delays
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <TooltipProvider>{children}</TooltipProvider>
    </SessionProvider>
  );
}
