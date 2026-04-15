"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./use-auth";
import type { UserProfileRow } from "@/types/database";

interface UseProfileReturn {
  profile: UserProfileRow | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Simple in-memory cache to avoid multiple fetches
const profileCache = new Map<string, { data: UserProfileRow | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useProfile(): UseProfileReturn {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchProfile = async () => {
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      // Check cache first
      const cached = profileCache.get(user.id);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setProfile(cached.data);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Cache the result
      profileCache.set(user.id, { data: data as UserProfileRow, timestamp: Date.now() });
      setProfile(data as UserProfileRow);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch profile"));
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [user?.id, authLoading, supabase]);

  const refetch = async () => {
    if (user?.id) {
      profileCache.delete(user.id);
      setLoading(true);
      await fetchProfile();
    }
  };

  return { profile, loading, error, refetch };
}
