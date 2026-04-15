"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Send, Paperclip, X, AlertTriangle, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./message-bubble";
import { createClient } from "@/lib/supabase/client";
import { moderateMessage, validateChatFile, formatFileSize } from "@/lib/moderation";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
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
  const [moderationWarnings, setModerationWarnings] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const markMessageAsRead = useCallback(
    async (messageId: string) => {
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("id", messageId)
        .eq("sender_id", participantId)
        .is("read_at", null);
    },
    [supabase, participantId]
  );

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("id, conversation_id, sender_id, content, created_at, read_at, file_url, file_name")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (error) return;

        if (data) {
          const mappedMessages = data.map((msg: Record<string, unknown>) => ({
            id: msg.id as string,
            conversationId: msg.conversation_id as string,
            senderId: msg.sender_id as string,
            content: msg.content as string,
            createdAt: msg.created_at as string,
            readAt: msg.read_at as string | null,
            fileUrl: (msg.file_url as string | null) || null,
            fileName: (msg.file_name as string | null) || null,
          }));
          setMessages(mappedMessages);

          mappedMessages.forEach((msg) => {
            if (msg.senderId === participantId && msg.readAt === null) {
              markMessageAsRead(msg.id);
            }
          });
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`conversation:${conversationId}`, {
        config: { broadcast: { self: true } },
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
          const newMsg = payload.new as Record<string, unknown>;
          setMessages((prev) => [
            ...prev,
            {
              id: newMsg.id as string,
              conversationId: newMsg.conversation_id as string,
              senderId: newMsg.sender_id as string,
              content: newMsg.content as string,
              createdAt: newMsg.created_at as string,
              readAt: newMsg.read_at as string | null,
              fileUrl: (newMsg.file_url as string | null) || null,
              fileName: (newMsg.file_name as string | null) || null,
            },
          ]);
          if ((newMsg.sender_id as string) === participantId && newMsg.read_at === null) {
            markMessageAsRead(newMsg.id as string);
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
          const updatedMsg = payload.new as Record<string, unknown>;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === (updatedMsg.id as string)
                ? { ...msg, readAt: updatedMsg.read_at as string | null }
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

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Run moderation on message input
  const handleMessageChange = (value: string) => {
    setNewMessage(value);
    if (value.trim()) {
      const result = moderateMessage(value);
      if (!result.isClean) {
        setModerationWarnings(result.warnings);
      } else {
        setModerationWarnings([]);
        setShowWarning(false);
      }
    } else {
      setModerationWarnings([]);
      setShowWarning(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateChatFile(file);
    if (!validation.isValid) {
      setFileError(validation.error || "Fichier non valide");
      setPendingFile(null);
    } else {
      setFileError(null);
      setPendingFile(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (file: File): Promise<{ url: string; name: string } | null> => {
    setUploadingFile(true);
    try {
      const ext = file.name.split(".").pop() || "bin";
      const path = `chat/${conversationId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("chat-files")
        .upload(path, file, { contentType: file.type });

      if (error) {
        setFileError("Erreur lors de l'envoi du fichier. Réessayez.");
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("chat-files")
        .getPublicUrl(path);

      return { url: urlData.publicUrl, name: file.name };
    } catch {
      setFileError("Erreur lors de l'envoi du fichier.");
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasContent = newMessage.trim() || pendingFile;
    if (!hasContent) return;

    // Show moderation warning if there are warnings and user hasn't acknowledged
    if (moderationWarnings.length > 0 && !showWarning) {
      setShowWarning(true);
      return;
    }

    setLoading(true);
    try {
      let fileUrl: string | null = null;
      let fileName: string | null = null;

      if (pendingFile) {
        const result = await uploadFile(pendingFile);
        if (result) {
          fileUrl = result.url;
          fileName = result.name;
        } else {
          setLoading(false);
          return;
        }
      }

      const messageContent = newMessage.trim() || (fileName ? `📎 ${fileName}` : "");

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: messageContent,
          fileUrl,
          fileName,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        setPendingFile(null);
        setModerationWarnings([]);
        setShowWarning(false);
        setFileError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const isFileImage = (name: string | null | undefined): boolean => {
    if (!name) return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-100/50 px-6 py-4">
        <h2 className="font-serif font-bold text-lg text-[#4A6670]">
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
              <div className="w-8 h-8 border-3 border-gray-200 border-t-[#F0917B] rounded-full animate-spin mx-auto mb-2" />
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
              <div key={message.id}>
                <MessageBubble
                  message={message.content}
                  isOwn={message.senderId === userId}
                  timestamp={message.createdAt}
                  senderName={
                    message.senderId !== userId ? participantName : undefined
                  }
                  isRead={message.readAt !== null}
                />
                {/* File attachment */}
                {message.fileUrl && (
                  <div className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"} mt-1`}>
                    <a
                      href={message.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700 max-w-xs"
                    >
                      {isFileImage(message.fileName) ? (
                        <ImageIcon className="w-4 h-4 text-[#8FBFAD] flex-shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-[#4A6670] flex-shrink-0" />
                      )}
                      <span className="truncate">{message.fileName || "Fichier"}</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Moderation warning banner */}
      {showWarning && moderationWarnings.length > 0 && (
        <div className="mx-6 mb-2 p-3 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              {moderationWarnings.map((warning, i) => (
                <p key={i} className="text-xs text-amber-700 mb-1 last:mb-0">
                  {warning}
                </p>
              ))}
              <p className="text-xs text-amber-600 font-medium mt-2">
                Appuyez à nouveau sur Envoyer pour confirmer.
              </p>
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="text-amber-400 hover:text-amber-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Pending file preview */}
      {pendingFile && (
        <div className="mx-6 mb-2 p-3 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-3">
            {isFileImage(pendingFile.name) ? (
              <ImageIcon className="w-5 h-5 text-[#8FBFAD] flex-shrink-0" />
            ) : (
              <FileText className="w-5 h-5 text-[#4A6670] flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{pendingFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(pendingFile.size)}</p>
            </div>
            <button
              onClick={() => {
                setPendingFile(null);
                setFileError(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* File error */}
      {fileError && (
        <div className="mx-6 mb-2 p-2 rounded-xl bg-red-50 border border-red-200">
          <p className="text-xs text-red-600">{fileError}</p>
        </div>
      )}

      {/* Input area */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-100/50 px-6 py-4 bg-white"
      >
        <div className="flex gap-3 items-end">
          {/* File upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#4A6670] hover:border-[#4A6670]/30 transition-all"
            disabled={uploadingFile}
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,.doc,.docx"
            onChange={handleFileSelect}
          />

          <input
            type="text"
            value={newMessage}
            onChange={(e) => handleMessageChange(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#F0917B] focus:outline-none focus:ring-1 focus:ring-[#F0917B]/20 text-sm bg-white transition-all"
            disabled={loading || uploadingFile}
          />
          <Button
            type="submit"
            disabled={loading || uploadingFile || (!newMessage.trim() && !pendingFile)}
            className="rounded-2xl bg-[#F0917B] hover:bg-[#F0917B]/90 text-white shadow-sm"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>

      {/* Hidden file input */}
    </div>
  );
}
