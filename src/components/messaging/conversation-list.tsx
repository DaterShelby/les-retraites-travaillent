"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Conversation {
  id: string;
  participantIds: string[];
  participantId: string;
  lastMessageAt: string | null;
  lastMessage?: string;
  participantName?: string;
  participantAvatar?: string;
  unreadCount: number;
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
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100/50">
        <h2 className="font-serif font-bold text-xl text-[#2C3E50]">
          Messages
        </h2>
        <p className="text-xs text-gray-500 mt-1">Conversations directes</p>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Vous n'avez pas encore de conversations
              </p>
              <p className="text-xs text-gray-500">
                Démarrez une conversation en parcourant les annonces ou profils
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100/50">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/dashboard/messages/${conversation.id}`}
              >
                <div
                  className={`px-4 py-3 hover:bg-gray-50/80 transition-all duration-200 cursor-pointer group ${
                    activeConversationId === conversation.id
                      ? "bg-gradient-to-r from-gray-50 to-transparent border-l-3 border-l-[#CC8800]"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar with status indicator */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38761D] to-[#CC8800] flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
                        {conversation.participantAvatar ? (
                          <img
                            src={conversation.participantAvatar}
                            alt={conversation.participantName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-white">
                            {conversation.participantName
                              ?.charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm truncate ${
                          conversation.unreadCount > 0
                            ? "font-semibold text-[#2C3E50]"
                            : "font-medium text-gray-700"
                        }`}>
                          {conversation.participantName || "Utilisateur"}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageAt)}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[#CC8800] text-white text-xs font-semibold">
                              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`text-xs truncate ${
                        conversation.unreadCount > 0
                          ? "text-gray-700 font-medium"
                          : "text-gray-500"
                      }`}>
                        {conversation.lastMessage ||
                          "Aucun message pour le moment"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
