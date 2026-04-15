"use client";

import { Bell, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notificationIcons, formatTimeAgo } from "@/lib/notifications";
import { Database } from "@/types/database";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch unread count and recent notifications
  async function fetchNotifications() {
    try {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch latest 5 notifications
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      setNotifications(data || []);

      // Count unread
      const unread = data?.filter((n) => !n.read_at).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  // Setup initial fetch and realtime subscription
  useEffect(() => {
    fetchNotifications();

    const supabase = createBrowserSupabaseClient();
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle clicks outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  async function markAsRead(notificationId: string) {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  const getIcon = (type: string) => {
    return (notificationIcons[type as keyof typeof notificationIcons] || "📌");
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative inline-flex items-center justify-center w-12 h-12 transition-all duration-200",
          "rounded-2xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          isOpen
            ? "bg-primary/10 text-primary"
            : "text-gray-700 hover:bg-gray-100/80"
        )}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-secondary rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-3xl bg-white/95 shadow-lg backdrop-blur-xl border border-white/20"
        >
          {/* Header */}
          <div className="border-b border-gray-100/50 bg-gradient-to-br from-gray-50 to-gray-100/50 px-6 py-4">
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Chargement…
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Aucune notification
              </div>
            ) : (
              <div className="divide-y divide-gray-100/50">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => {
                      markAsRead(notification.id);
                      // Navigate to relevant page based on notification type
                      // TODO: Implement navigation based on notification.data
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-6 py-4 text-left transition-colors hover:bg-primary/5",
                      !notification.read_at && "bg-primary/5"
                    )}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 text-xl pt-0.5">
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.read_at && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-secondary mt-1.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100/50 bg-gradient-to-br from-gray-50/50 to-gray-100/30 px-6 py-3">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-block text-sm font-medium text-primary hover:text-primary-700 transition-colors"
            >
              Voir toutes les notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
