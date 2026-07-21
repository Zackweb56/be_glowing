"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard as LayoutDashboard, MdLayers as Layers, MdShoppingCart as ShoppingCart, MdSettings as Settings, MdGridOn as LayoutGrid, MdFormatListBulleted as LayoutList } from 'react-icons/md';
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const navGroups = [
  {
    label: "Main",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/catalog", label: "Catalog Builder", icon: LayoutGrid },
      { href: "/admin/stock", label: "Stock", icon: Layers, badge: true },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/home-content", label: "Home Content", icon: LayoutList },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebarNav({ collapsed = false, stockBadgeCount = 0 }) {
  const pathname = usePathname();

  const isActive = (href, exact) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-6 px-2">
      {navGroups.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {group.label}
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {group.items.map(({ href, label, icon: Icon, exact, badge }) => {
              const active = isActive(href, exact);
              const showBadge = badge && stockBadgeCount > 0;

              const linkEl = (
                <Link
                  href={href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  />
                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between">
                      <span>{label}</span>
                      {showBadge && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                          {stockBadgeCount > 9 ? "9+" : stockBadgeCount}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Collapsed dot badge */}
                  {collapsed && showBadge && (
                    <span className="absolute right-1 top-1.5 flex h-2 w-2 rounded-full bg-destructive" />
                  )}
                </Link>
              );

              return (
                <li key={href}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                      <TooltipContent side="right">
                        {label}
                        {showBadge && ` (${stockBadgeCount} needs attention)`}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkEl
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
