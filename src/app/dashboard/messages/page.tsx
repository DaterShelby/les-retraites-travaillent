import { Suspense } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ConversationList } from "@/components/messaging/conversation-list";
import { LoadingState } from "@/components/shared/loading-state";
import { redirect } from "next/navigation";

async function ConversationsContent({ userId }: { userId: string }) {
  const supabase = createServerSupabaseClient();

  const { data: conversations = [] } = await supabase
    .from("conversations")
    .select(
      `
      id,
      participant_ids,
      last_message_at,
      messages(id, content, created_at, sender_id, read_at)
    `
    )
    .contains("participant_ids", [userId])
    .order("last_message_at", { ascending: false });

  // Enrich conversations with participant data
  const enrichedConversations = await Promise.all(
    (conversations ?? []).map(async (conv: any) => {
      const otherUserId = conv.participant_ids.find((id: string) => id !== userId);

      let participantName = "Utilisateur";
      let participantAvatar = null;
      let participantId = "";

      if (otherUserId) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id, first_name, avatar_url")
          .eq("id", otherUserId)
          .single();

        if (profile) {
          participantName = profile.first_name;
          participantAvatar = profile.avatar_url;
          participantId = profile.id;
        }
      }

      const messages = conv.messages || [];
      const lastMessage = messages.length > 0 ? messages[messages.length - 1]?.content : null;

      // Count unread messages (where read_at is null and sender is not current user)
      const unreadCount = messages.filter(
        (msg: any) => msg.read_at === null && msg.sender_id !== userId
      ).length;

      return {
        id: conv.id,
        participantIds: conv.participant_ids,
        participantId,
        lastMessageAt: conv.last_message_at,
        lastMessage,
        participantName,
        participantAvatar,
        unreadCount,
      };
    })
  );

  return (
    <ConversationList
      conversations={enrichedConversations}
      userId={userId}
    />
  );
}

export default async function MessagesPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <ConversationsContent userId={user.id} />
    </Suspense>
  );
}
