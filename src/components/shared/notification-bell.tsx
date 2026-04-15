"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUnreadNotifications() {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: notifications, error } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", user.id)
          .is("read_at", null);

        if (error) throw error;

        setUnreadCount(notifications?.length || 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUnreadNotifications();

    // Subscribe to real-time changes
    const supabase = createBrowserSupabaseClient();
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          fetchUnreadNotifications();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Link href="/dashboard/notifications">
      <button
        className={cn(
          "relative inline-flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
          "hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        )}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-primary" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-secondary rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    </Link>
  );
}
