import { createAdminClient } from "./supabase/admin";

export type NotificationType =
  | "new_message"
  | "new_booking"
  | "booking_confirmed"
  | "booking_cancelled"
  | "new_review"
  | "system";

export const notificationIcons: Record<NotificationType, string> = {
  new_message: "💬",
  new_booking: "📅",
  booking_confirmed: "✅",
  booking_cancelled: "❌",
  new_review: "⭐",
  system: "ℹ️",
};

interface NotificationData {
  [key: string]: string | number | boolean | null;
}

/**
 * Create a notification for a user (server-side function using admin client)
 * @param userId - The user ID to send the notification to
 * @param type - The notification type
 * @param title - The notification title
 * @param body - The notification body (optional)
 * @param data - Additional data to store with the notification (optional)
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body?: string | null,
  data?: NotificationData
) {
  try {
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        body: body || null,
        data: data || {},
        read_at: null,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error creating notification:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to create notification:", error);
    throw error;
  }
}

/**
 * Format relative time in French
 */
export function formatTimeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);

  if (diffMins < 1) return "à l'instant";
  if (diffMins < 60) return `il y a ${diffMins}m`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 7) return `il y a ${diffDays}j`;
  if (diffWeeks < 4) return `il y a ${diffWeeks}s`;

  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Group notifications by date
 */
export function groupNotificationsByDate(
  notifications: Array<{ created_at: string }>
) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 604800000);

  const groups: Record<
    string,
    Array<{ created_at: string; [key: string]: unknown }>
  > = {
    "Aujourd'hui": [],
    Hier: [],
    "Cette semaine": [],
    "Plus ancien": [],
  };

  for (const notification of notifications) {
    const notifDate = new Date(notification.created_at);
    const notifDay = new Date(
      notifDate.getFullYear(),
      notifDate.getMonth(),
      notifDate.getDate()
    );

    if (notifDay.getTime() === today.getTime()) {
      groups["Aujourd'hui"].push(notification);
    } else if (notifDay.getTime() === yesterday.getTime()) {
      groups["Hier"].push(notification);
    } else if (notifDate.getTime() > weekAgo.getTime()) {
      groups["Cette semaine"].push(notification);
    } else {
      groups["Plus ancien"].push(notification);
    }
  }

  return groups;
}
