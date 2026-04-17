"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface UseChatOptions {
  initialConversationId?: string;
  page?: string;
  onAssistantReply?: (text: string) => void;
}

interface SendResponse {
  conversationId: string;
  reply: string;
  usage?: Record<string, number>;
}

export function useChat(options: UseChatOptions = {}) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(
    options.initialConversationId
  );
  const [isSending, setIsSending] = useState(false);

  const send = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isSending) return;

      const userMessage: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsSending(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            content: trimmed,
            context: options.page ? { page: options.page } : undefined,
          }),
        });

        const json = (await res.json()) as SendResponse | { error: string };

        if (!res.ok || "error" in json) {
          const error = "error" in json ? json.error : `HTTP ${res.status}`;
          toast({
            variant: "error",
            title: "L'assistant ne répond pas",
            description: error,
          });
          return;
        }

        if (!conversationId) setConversationId(json.conversationId);

        const assistantMessage: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: json.reply,
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        options.onAssistantReply?.(json.reply);
      } catch (err) {
        toast({
          variant: "error",
          title: "Erreur réseau",
          description: err instanceof Error ? err.message : "Réessayez.",
        });
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, isSending, options, toast]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setConversationId(undefined);
  }, []);

  return { messages, isSending, send, reset, conversationId };
}
