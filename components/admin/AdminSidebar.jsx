"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { MdAutoAwesome as Sparkles } from 'react-icons/md';
import { cn } from "@/lib/utils";
import Image from "next/image";

export function AdminSidebar({ collapsed = false, stockBadgeCount = 0 }) {
  const [logoUrl, setLogoUrl] = useState("");
  const [storeName, setStoreName] = useState("Be Glowing");

  useEffect(() => {
    fetch("/api/store/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setLogoUrl(data.settings.logoUrl || "");
          setStoreName(data.settings.storeName || "Be Glowing");
        }
      })
      .catch(() => {});
  }, []);

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
        {logoUrl ? (
          <>
            <div className="h-7 w-7 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <Image src={logoUrl} alt={storeName} width={28} height={28} className="object-contain" />
            </div>
            {!collapsed && (
              <span className="text-sm font-semibold tracking-tight truncate">
                {storeName}
              </span>
            )}
          </>
        ) : (
          <>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-sm font-semibold tracking-tight truncate">
                {storeName}
              </span>
            )}
          </>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <AdminSidebarNav collapsed={collapsed} stockBadgeCount={stockBadgeCount} />
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
