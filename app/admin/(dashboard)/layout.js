"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminFooter } from "@/components/admin/AdminFooter";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [stockBadgeCount, setStockBadgeCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.count || 0);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchStockCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stock/count");
      if (res.ok) {
        const data = await res.json();
        setStockBadgeCount(data.count || 0);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchStockCount();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchStockCount();
    }, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchStockCount]);

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/admin/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    // Mark each unread as read
    await Promise.all(notifications.map((n) => markAsRead(n._id)));
  };

  return (
    <div className="dark flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <AdminSidebar collapsed={collapsed} stockBadgeCount={stockBadgeCount} />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminHeader
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          notifications={notifications}
          unreadCount={unreadCount}
          stockBadgeCount={stockBadgeCount}
          onMarkRead={markAsRead}
          onMarkAllRead={markAllAsRead}
        />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6">
            {children}
          </div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
