"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  X,
} from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useOnboardingStore } from "@/stores/onboarding";
import { cn } from "@/lib/utils";

const STEP_HINTS: Record<number, string> = {
  1: "On commence par découvrir qui vous êtes : retraité, particulier ou entreprise.",
  2: "Parlez-moi de vous : prénom, ville, et si entreprise, votre SIRET.",
  3: "Quels sont vos savoir-faire ou besoins ? Vous pouvez tout dire à voix haute.",
  4: "Dernière ligne droite : disponibilités et tarif horaire si vous proposez vos services.",
};

function getStepFromPath(path: string): number {
  if (path.includes("step-1")) return 1;
  if (path.includes("step-2")) return 2;
  if (path.includes("step-3")) return 3;
  if (path.includes("step-4")) return 4;
  return 1;
}

export function VoiceCoach() {
  const pathname = usePathname();
  const step = getStepFromPath(pathname ?? "");
  const role = useOnboardingStore((s) => s.role);

  const [open, setOpen] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const greeted = useRef(false);

  const synthesis = useSpeechSynthesis();
  const { messages, isSending, send } = useChat({
    page: `/onboarding/step-${step}`,
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
  }, [messages, open]);

  // Greet user on first open
  useEffect(() => {
    if (!open || greeted.current) return;
    greeted.current = true;
    const greeting = `Bonjour ! Je suis votre assistant. ${STEP_HINTS[step] ?? ""} ${
      role ? `Je vois que vous êtes ${roleLabel(role)}.` : ""
    } Vous pouvez parler ou écrire, je vous accompagne.`;
    if (voiceOutput && synthesis.isSupported) synthesis.speak(greeting);
    // We avoid sending to API to save tokens — purely client greeting
  }, [open, step, role, synthesis, voiceOutput]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    send(text);
    setDraft("");
  };

  const handleVoiceToggle = () => {
    if (recognition.isListening) recognition.stop();
    else recognition.start();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant vocal"}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 items-center gap-2 rounded-full px-5 text-sm font-semibold shadow-elevated transition-all",
          open
            ? "bg-white text-neutral-text border border-gray-200 hover:bg-neutral-cream"
            : "bg-gradient-to-br from-primary to-primary-700 text-white hover:-translate-y-0.5"
        )}
      >
        {open ? (
          <>
            <X className="h-5 w-5" />
            Fermer
          </>
        ) : (
          <>
            <span className="relative">
              <Sparkles className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-secondary" />
            </span>
            Aide vocale
          </>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[min(560px,calc(100vh-8rem))] w-[min(400px,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-elevated animate-slideUp">
          <div className="flex items-center justify-between bg-gradient-to-br from-primary to-primary-700 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Coach onboarding</p>
                <p className="text-xs text-white/70">Étape {step} sur 4</p>
              </div>
            </div>
            {synthesis.isSupported && (
              <button
                type="button"
                onClick={() => {
                  if (voiceOutput) synthesis.cancel();
                  setVoiceOutput((v) => !v);
                }}
                className="rounded-xl p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={voiceOutput ? "Couper la voix" : "Activer la voix"}
              >
                {voiceOutput ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-neutral-cream px-4 py-5"
          >
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center px-4 text-center">
                <div className="space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-base leading-relaxed text-neutral-text/80">
                    {STEP_HINTS[step]}
                  </p>
                  <p className="text-xs text-neutral-text/50">
                    Parlez ou écrivez, je vous guide.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-sm bg-primary text-white shadow-sm"
                        : "rounded-bl-sm border border-gray-100 bg-white text-neutral-text shadow-card"
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {isSending && (
              <div className="flex items-center gap-2 text-sm text-neutral-text/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                Je réfléchis…
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 bg-white px-3 py-3">
            <div className="flex items-end gap-2">
              {recognition.isSupported && (
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 transition-colors",
                    recognition.isListening
                      ? "animate-pulse border-error bg-error/10 text-error"
                      : "border-gray-200 bg-white text-neutral-text hover:border-primary hover:text-primary"
                  )}
                  aria-label={recognition.isListening ? "Arrêter le micro" : "Parler"}
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
                    : "Posez une question…"
                }
                rows={1}
                disabled={isSending}
                className="min-h-12 max-h-32 flex-1 resize-none rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-neutral-text placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!draft.trim() || isSending}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Envoyer"
              >
                {isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function roleLabel(role: string): string {
  switch (role) {
    case "retiree":
      return "retraité";
    case "client":
      return "particulier";
    case "company":
      return "entreprise";
    default:
      return role;
  }
}
