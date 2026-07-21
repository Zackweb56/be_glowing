"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { MdViewSidebar as PanelLeft, MdLogout as LogOut, MdPersonOutline as User, MdExpandMore as ChevronDown, MdNotifications as Bell, MdDoneAll as CheckCheck, MdInventory2 as Package, MdClose as X } from 'react-icons/md';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { MdAutoAwesome as Sparkles } from 'react-icons/md';
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navGroups } from "./AdminSidebarNav";
import { cn } from "@/lib/utils";

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
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const NOTIF_ICON_MAP = {
  stock_alert: <Package className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />,
  system: <Bell className="h-4 w-4 text-primary shrink-0 mt-0.5" />,
};

export function AdminHeader({
  collapsed,
  onToggleCollapse,
  notifications = [],
  unreadCount = 0,
  stockBadgeCount = 0,
  onMarkRead,
  onMarkAllRead,
}) {
  const { data: session } = useSession();
  const pageTitle = usePageTitle();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const userName = session?.user?.name || "Admin";
  const userEmail = session?.user?.email || "";
  const initials = getInitials(userName);

  return (
    <>
      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="dark w-[240px] p-0 bg-card border-r border-border">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex items-center gap-2.5 px-4 py-4 min-h-[60px] border-b border-border">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Be Glowing</span>
          </div>
          <div className="py-4 overflow-y-auto h-full">
            <AdminSidebarNav collapsed={false} stockBadgeCount={stockBadgeCount} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 flex h-[60px] items-center gap-3 border-b border-border bg-card px-4 shrink-0">
        {/* Mobile hamburger */}
        <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
          <PanelLeft className="h-4 w-4" />
        </Button>

        {/* Desktop collapse toggle */}
        <Button variant="ghost" size="icon" className="hidden lg:flex h-8 w-8" onClick={onToggleCollapse} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <PanelLeft className="h-4 w-4" />
        </Button>

        {/* Page title */}
        <h1 className="text-sm font-medium text-foreground truncate flex-1">{pageTitle}</h1>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5">

          {/* Notifications */}
          <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 hover:bg-accent" aria-label="Notifications">
                <Bell className="h-4 w-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[340px] p-0 overflow-hidden" sideOffset={8}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.preventDefault(); onMarkAllRead(); }}
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Mark all as read</TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                    <CheckCheck className="h-8 w-8 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground/60">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className="group relative flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors"
                    >
                      {/* Icon */}
                      <div className="mt-0.5 shrink-0">
                        {NOTIF_ICON_MAP[notif.type] || <Bell className="h-4 w-4 text-muted-foreground" />}
                      </div>

                      {/* Content — clickable link */}
                      {notif.link ? (
                        <Link
                          href={notif.link}
                          className="flex-1 min-w-0"
                          onClick={() => { onMarkRead(notif._id); setNotifOpen(false); }}
                        >
                          <p className="text-sm font-semibold leading-tight">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-muted-foreground/50 mt-1">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                          </p>
                        </Link>
                      ) : (
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-tight">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-muted-foreground/50 mt-1">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      )}

                      {/* Mark as read icon */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="mt-0.5 shrink-0 p-1 rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.preventDefault(); onMarkRead(notif._id); }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left">Mark as read</TooltipContent>
                      </Tooltip>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-border/70 bg-muted/20">
                  <Link
                    href="/admin/stock"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => setNotifOpen(false)}
                  >
                    Go to Stock Management →
                  </Link>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-8 px-2 hover:bg-accent" aria-label="User menu">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">{userName}</span>
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
