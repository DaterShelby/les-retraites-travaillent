"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageAt: string | null;
  lastMessage?: string;
  participantName?: string;
  participantAvatar?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  userId: string;
}

export function ConversationList({
  conversations,
  userId,
}: ConversationListProps) {
  const searchParams = useSearchParams();
  const activeConversationId = searchParams.get("conversation");

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;

    return date.toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-serif font-bold text-lg text-neutral-text">
          Messages
        </h2>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-600 text-center px-4">
              Aucune conversation pour le moment
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/dashboard/messages/${conversation.id}`}
            >
              <div
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  activeConversationId === conversation.id
                    ? "bg-primary-50 border-l-4 border-l-primary"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {conversation.participantAvatar ? (
                      <img
                        src={conversation.participantAvatar}
                        alt={conversation.participantName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-gray-600">
                        {conversation.participantName
                          ?.charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm text-neutral-text truncate">
                        {conversation.participantName || "Utilisateur"}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {conversation.lastMessage ||
                        "Aucun message pour le moment"}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
