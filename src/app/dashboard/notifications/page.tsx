"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { Database } from "@/types/database";
import { Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  notificationIcons,
  formatTimeAgo,
  groupNotificationsByDate,
} from "@/lib/notifications";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

const dateLabels: Record<string, string> = {
  "Aujourd'hui": "Today",
  Hier: "Yesterday",
  "Cette semaine": "This Week",
  "Plus ancien": "Older",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();

    // Setup realtime subscription
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

  async function fetchNotifications() {
    try {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }

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
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }

  async function markAllAsRead() {
    try {
      const supabase = createBrowserSupabaseClient();
      const unreadNotifications = notifications.filter((n) => !n.read_at);

      if (unreadNotifications.length === 0) return;

      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .in(
          "id",
          unreadNotifications.map((n) => n.id)
        );

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read_at: n.read_at || new Date().toISOString(),
        }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }

  const getIcon = (type: string) => {
    return (notificationIcons[type as keyof typeof notificationIcons] || "📌");
  };

  if (loading) {
    return <LoadingState message="Chargement de vos notifications…" />;
  }

  const unreadCount = notifications.filter((n) => !n.read_at).length;
  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Notifications
          </h1>
          <p className="text-base text-gray-600">
            {unreadCount > 0
              ? `Vous avez ${unreadCount} notification${
                  unreadCount > 1 ? "s" : ""
                } non lue${unreadCount > 1 ? "s" : ""}`
              : "Vous êtes à jour !"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="default"
            onClick={markAllAsRead}
            className="font-semibold"
          >
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200/50">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aucune notification
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            Vous êtes tous à jour ! Les notifications apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedNotifications).map(
            ([dateGroup, items]) =>
              items.length > 0 && (
                <div key={dateGroup}>
                  {/* Date Group Label */}
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
                    {dateGroup}
                  </h2>

                  {/* Notification Cards */}
                  <div className="space-y-3">
                    {items.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "group relative rounded-2xl border border-gray-200/50 transition-all duration-200",
                          "hover:shadow-lg hover:border-gray-300/50",
                          !notification.read_at
                            ? "bg-gradient-to-br from-primary/5 to-primary/2 border-primary/20"
                            : "bg-white hover:bg-gray-50/50"
                        )}
                      >
                        <div className="flex items-start gap-4 p-5">
                          {/* Icon */}
                          <div className="flex-shrink-0 text-2xl pt-0.5">
                            {getIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 text-base leading-tight flex-1">
                                {notification.title}
                              </h3>
                              {!notification.read_at && (
                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-secondary mt-1.5 animate-pulse" />
                              )}
                            </div>

                            {notification.body && (
                              <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                                {notification.body}
                              </p>
                            )}

                            <p className="text-xs text-gray-500">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex-shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read_at && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                title="Marquer comme lu"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
