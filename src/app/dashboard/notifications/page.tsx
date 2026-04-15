"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { Database } from "@/types/database";
import {
  MessageCircle,
  Calendar,
  Star,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
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
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="w-5 h-5" />;
      case "booking":
        return <Calendar className="w-5 h-5" />;
      case "review":
        return <Star className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return <LoadingState message="Chargement de vos notifications…" />;
  }

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Notifications
          </h1>
          <p className="text-body text-gray-600">
            {unreadCount > 0
              ? `Vous avez ${unreadCount} notification${
                  unreadCount > 1 ? "s" : ""
                } non lue${unreadCount > 1 ? "s" : ""}`
              : "Vous êtes à jour!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Marquer tout comme lu
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <p className="text-body text-gray-500">
              Aucune notification pour le moment
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "bg-white rounded-lg p-4 shadow-sm transition-all hover:shadow-md",
                !notification.read_at && "border-l-4 border-primary bg-blue-50"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 text-primary flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary text-body mb-1">
                    {notification.title}
                  </h3>
                  {notification.body && (
                    <p className="text-body text-gray-600 text-sm mb-2">
                      {notification.body}
                    </p>
                  )}
                  <p className="text-body-sm text-gray-400">
                    {new Date(notification.created_at).toLocaleDateString(
                      "fr-FR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!notification.read_at && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      title="Marquer comme lu"
                    >
                      ✓
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
