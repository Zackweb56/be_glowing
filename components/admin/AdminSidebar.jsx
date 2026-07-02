"use client";

import { Separator } from "@/components/ui/separator";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar({ collapsed = false }) {
  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 bg-card border-r border-border transition-all duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center gap-2.5 px-4 py-4 min-h-[60px] shrink-0",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight truncate">
            Be Glowing
          </span>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <AdminSidebarNav collapsed={collapsed} />
      </div>

      <Separator />

      {/* Footer hint */}
      {!collapsed && (
        <div className="px-4 py-3">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            Admin Panel v1.0
          </p>
        </div>
      )}
    </aside>
  );
}
