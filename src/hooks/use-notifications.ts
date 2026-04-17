"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export function useNotifications(userId?: string) {
  const supabase = createClient();
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    unreadCount: 0,
    loading: true,
    error: null,
  });
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("notifications")
      .select("id, type, title, body, data, read_at, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      setState((s) => ({ ...s, loading: false, error: error.message }));
      return;
    }
    const notifications = (data ?? []) as AppNotification[];
    setState({
      notifications,
      unreadCount: notifications.filter((n) => !n.read_at).length,
      loading: false,
      error: null,
    });
  }, [supabase, userId]);

  useEffect(() => {
    if (!userId) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    refresh();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const n = payload.new as AppNotification;
          setState((s) => ({
            ...s,
            notifications: [n, ...s.notifications].slice(0, 50),
            unreadCount: s.unreadCount + (n.read_at ? 0 : 1),
          }));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as AppNotification;
          setState((s) => {
            const next = s.notifications.map((n) =>
              n.id === updated.id ? updated : n
            );
            return {
              ...s,
              notifications: next,
              unreadCount: next.filter((n) => !n.read_at).length,
            };
          });
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [supabase, userId, refresh]);

  const markRead = useCallback(
    async (id: string) => {
      await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", id);
    },
    [supabase]
  );

  const markAllRead = useCallback(async () => {
    if (!userId) return;
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_at", null);
  }, [supabase, userId]);

  return { ...state, refresh, markRead, markAllRead };
}
