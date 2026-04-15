"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./message-bubble";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
}

interface ChatWindowProps {
  conversationId: string;
  userId: string;
  participantName: string;
  participantId: string;
}

export function ChatWindow({
  conversationId,
  userId,
  participantName,
  participantId,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const channelRef = useRef<any>(null);

  // Mark message as read
  const markMessageAsRead = useCallback(
    async (messageId: string) => {
      const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("id", messageId)
        .eq("sender_id", participantId)
        .is("read_at", null);

      if (error) {
        console.error("Error marking message as read:", error);
      }
    },
    [supabase, participantId]
  );

  // Mark unread received messages as read
  const markReceivedMessagesAsRead = useCallback(() => {
    messages.forEach((msg) => {
      if (msg.senderId === participantId && msg.readAt === null) {
        markMessageAsRead(msg.id);
      }
    });
  }, [messages, participantId, markMessageAsRead]);

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("id, conversation_id, sender_id, content, created_at, read_at")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          return;
        }

        if (data) {
          const mappedMessages = data.map((msg) => ({
            id: msg.id,
            conversationId: msg.conversation_id,
            senderId: msg.sender_id,
            content: msg.content,
            createdAt: msg.created_at,
            readAt: msg.read_at,
          }));
          setMessages(mappedMessages);

          // Mark received messages as read
          mappedMessages.forEach((msg) => {
            if (msg.senderId === participantId && msg.readAt === null) {
              markMessageAsRead(msg.id);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`conversation:${conversationId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          setMessages((prev) => [
            ...prev,
            {
              id: newMsg.id,
              conversationId: newMsg.conversation_id,
              senderId: newMsg.sender_id,
              content: newMsg.content,
              createdAt: newMsg.created_at,
              readAt: newMsg.read_at,
            },
          ]);

          // Mark as read if it's from the other participant
          if (newMsg.sender_id === participantId && newMsg.read_at === null) {
            markMessageAsRead(newMsg.id);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updatedMsg = payload.new as any;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMsg.id
                ? { ...msg, readAt: updatedMsg.read_at }
                : msg
            )
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationId, supabase, participantId, markMessageAsRead]);

  // Auto-scroll to latest message
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
      } else {
        const data = await response.json();
        console.error("Error sending message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-100/50 px-6 py-4">
        <h2 className="font-serif font-bold text-lg text-[#1a1a2e]">
          {participantName}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Conversation en direct</p>
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gradient-to-b from-white via-white to-gray-50/30"
      >
        {initialLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-[#E07A5F] rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Chargement des messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">
                Aucun message pour le moment
              </p>
              <p className="text-xs text-gray-500">
                Commencez la conversation en envoyant un message
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.content}
                isOwn={message.senderId === userId}
                timestamp={message.createdAt}
                senderName={
                  message.senderId !== userId ? participantName : undefined
                }
                isRead={message.readAt !== null}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-100/50 px-6 py-4 bg-white"
      >
        <div className="flex gap-3 items-end">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#E07A5F] focus:outline-none focus:ring-1 focus:ring-[#E07A5F]/20 text-sm bg-white transition-all"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="rounded-2xl bg-[#E07A5F] hover:bg-[#E07A5F]/90 text-white shadow-sm"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
