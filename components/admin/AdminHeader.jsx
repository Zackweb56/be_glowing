"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { PanelLeft, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navGroups } from "./AdminSidebarNav";

// Derive page title from current route
function usePageTitle() {
  const pathname = usePathname();
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.exact ? pathname === item.href : pathname.startsWith(item.href)) {
        return item.label;
      }
    }
  }
  return "Dashboard";
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AdminHeader({ collapsed, onToggleCollapse }) {
  const { data: session } = useSession();
  const pageTitle = usePageTitle();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = session?.user?.name || "Admin";
  const userEmail = session?.user?.email || "";
  const initials = getInitials(userName);

  return (
    <>
      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="dark w-[240px] p-0 bg-card border-r border-border">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {/* Brand */}
          <div className="flex items-center gap-2.5 px-4 py-4 min-h-[60px] border-b border-border">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Be Glowing</span>
          </div>
          <div className="py-4 overflow-y-auto h-full">
            <AdminSidebarNav collapsed={false} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 flex h-[60px] items-center gap-3 border-b border-border bg-card px-4 shrink-0">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        {/* Desktop collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex h-8 w-8"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        {/* Page title */}
        <h1 className="text-sm font-medium text-foreground truncate flex-1">
          {pageTitle}
        </h1>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-8 px-2 hover:bg-accent"
                aria-label="User menu"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                  {userName}
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-muted-foreground" disabled>
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
