"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  greeting?: string;
}

export function ChatWindow({
  greeting = "Bonjour ! Comment puis-je t'aider aujourd'hui ?",
}: ChatWindowProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(false);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const synthesis = useSpeechSynthesis();
  const { messages, isSending, send, reset } = useChat({
    page: pathname ?? undefined,
    onAssistantReply: (text) => {
      if (voiceOutput && synthesis.isSupported) synthesis.speak(text);
    },
  });

  const recognition = useSpeechRecognition({
    onResult: (text, isFinal) => {
      setDraft(text);
      if (isFinal && text.trim().length > 0) {
        send(text);
        setDraft("");
      }
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    send(text);
    setDraft("");
  };

  const handleVoiceToggle = () => {
    if (recognition.isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleReset = () => {
    synthesis.cancel();
    reset();
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant IA"}
        className={cn(
          "fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-700 text-white shadow-elevated",
          "flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
          "focus:outline-none focus:ring-4 focus:ring-primary/30",
          isOpen && "scale-90 opacity-80"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <Sparkles className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-secondary animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-6 z-40 w-[min(420px,calc(100vw-3rem))] h-[min(640px,calc(100vh-8rem))]",
            "flex flex-col rounded-3xl border border-gray-100 bg-white shadow-elevated overflow-hidden",
            "animate-slideUp"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-br from-primary to-primary-700 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Assistant</p>
                <p className="text-xs text-white/70">Toujours à ton service</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {synthesis.isSupported && (
                <button
                  type="button"
                  onClick={() => {
                    if (voiceOutput) synthesis.cancel();
                    setVoiceOutput((v) => !v);
                  }}
                  className="rounded-xl p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label={voiceOutput ? "Couper la voix" : "Activer la voix"}
                >
                  {voiceOutput ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </button>
              )}
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Effacer la conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-neutral-cream px-4 py-5 space-y-3"
          >
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center px-6 text-center">
                <div className="space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-base text-neutral-text/80 leading-relaxed">
                    {greeting}
                  </p>
                  <p className="text-xs text-neutral-text/50">
                    Tu peux écrire ou parler.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((m) => <ChatBubble key={m.id} message={m} />)
            )}
            {isSending && (
              <div className="flex items-center gap-2 text-sm text-neutral-text/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                L&apos;assistant réfléchit…
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-gray-100 bg-white px-3 py-3">
            <div className="flex items-end gap-2">
              {recognition.isSupported && (
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 transition-colors",
                    recognition.isListening
                      ? "border-error bg-error/10 text-error animate-pulse"
                      : "border-gray-200 bg-white text-neutral-text hover:border-primary hover:text-primary"
                  )}
                  aria-label={
                    recognition.isListening ? "Arrêter le micro" : "Parler"
                  }
                >
                  {recognition.isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>
              )}
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  recognition.isListening
                    ? "Je t'écoute…"
                    : "Écris ton message…"
                }
                rows={1}
                className="min-h-12 max-h-32 flex-1 resize-none rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-neutral-text placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isSending}
              />
              <Button
                type="button"
                size="icon"
                onClick={handleSend}
                disabled={!draft.trim() || isSending}
                aria-label="Envoyer"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            {!recognition.isSupported && (
              <p className="mt-2 text-[11px] text-neutral-text/50">
                Voix non supportée par ce navigateur (essaie Chrome ou Safari).
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ChatBubble({ message }: { message: { role: "user" | "assistant"; content: string } }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-primary text-white rounded-br-sm shadow-sm"
            : "bg-white text-neutral-text rounded-bl-sm shadow-card border border-gray-100"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
