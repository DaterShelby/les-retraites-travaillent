import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ChatWindow } from "@/components/messaging/chat-window";
import { ConversationList } from "@/components/messaging/conversation-list";
import { redirect } from "next/navigation";

interface ChatPageProps {
  params: {
    conversationId: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch conversation
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, participant_ids, last_message_at, messages(content, created_at)")
    .eq("id", params.conversationId)
    .single();

  if (!conversation || !(conversation.participant_ids as string[]).includes(user.id)) {
    redirect("/dashboard/messages");
  }

  // Get other participant
  const otherUserId = (conversation.participant_ids as string[]).find((id: string) => id !== user.id);

  let participantName = "Utilisateur";
  let participantId = "";

  if (otherUserId) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("id, first_name")
      .eq("id", otherUserId)
      .single();

    if (profile) {
      participantName = profile.first_name;
      participantId = profile.id;
    }
  }

  // Fetch all conversations for sidebar
  const { data: conversations = [] } = await supabase
    .from("conversations")
    .select(
      `
      id,
      participant_ids,
      last_message_at,
      messages(content, created_at)
    `
    )
    .contains("participant_ids", [user.id])
    .order("last_message_at", { ascending: false });

  const enrichedConversations = await Promise.all(
    (conversations ?? []).map(async (conv: any) => {
      const otherParticipantId = conv.participant_ids.find(
        (id: string) => id !== user.id
      );

      let name = "Utilisateur";
      let avatar = null;

      if (otherParticipantId) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("first_name, avatar_url")
          .eq("id", otherParticipantId)
          .single();

        if (profile) {
          name = profile.first_name;
          avatar = profile.avatar_url;
        }
      }

      const lastMessage = conv.messages?.[conv.messages.length - 1]?.content;

      return {
        id: conv.id,
        participantIds: conv.participant_ids,
        lastMessageAt: conv.last_message_at,
        lastMessage,
        participantName: name,
        participantAvatar: avatar,
      };
    })
  );

  return (
    <main className="flex h-screen bg-neutral-cream">
      {/* Sidebar - Conversations list */}
      <div className="hidden md:flex md:w-96 flex-col bg-white">
        <ConversationList
          conversations={enrichedConversations}
          userId={user.id}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <ChatWindow
          conversationId={params.conversationId}
          userId={user.id}
          participantName={participantName}
          participantId={participantId}
        />
      </div>
    </main>
  );
}
